<#
.SYNOPSIS
    Project Ella: System Health Auditor and Alerter.
.DESCRIPTION
    Monitors storage, verifies services, manages log rotation, and
    securely dispatches Google Workspace alerts using an encrypted key.
#>

[CmdletBinding()]
param (
    [Parameter(Mandatory = $false, ValueFromPipeline = $true)]
    [string]$ReportDir = "C:\Logs",

    [Parameter(Mandatory = $false)]
    [int]$MaxLogAgeDays = 30,

    [Parameter(Mandatory = $false)]
    [string]$AdminEmail = "admin@amazinggracehl.org"
)

if (-not (Test-Path -Path $ReportDir)) {
    try { New-Item -ItemType Directory -Path $ReportDir -Force | Out-Null } 
    catch { Write-Error "Failed to create log directory: $_"; exit 1 }
}

$Timestamp  = Get-Date -Format "yyyyMMdd_HHmmss"
$CsvFile    = Join-Path -Path $ReportDir -ChildPath "EllaHealth_$Timestamp.csv"
$HtmlFile   = Join-Path -Path $ReportDir -ChildPath "EllaHealth_$Timestamp.html"
$KeyFile    = Join-Path -Path $ReportDir -ChildPath "Ella_Secret.key"

$LogCollection = [System.Collections.Generic.List[PSCustomObject]]::new()
$Global:HasAlerts = $false

function Write-Log {
    param (
        [string]$Message,
        [ValidateSet("INFO", "WARNING", "ERROR")] $Level = "INFO"
    )
    $TimeStr = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    if ($Level -ne "INFO") { $Global:HasAlerts = $true }

    switch ($Level) {
        "ERROR"   { Write-Host "[$TimeStr] [$Level] $Message" -ForegroundColor Red }
        "WARNING" { Write-Host "[$TimeStr] [$Level] $Message" -ForegroundColor Yellow }
        "INFO"    { Write-Host "[$TimeStr] [$Level] $Message" -ForegroundColor Green }
    }
    $LogCollection.Add([PSCustomObject]@{Timestamp = $TimeStr; Level = $Level; Message = $Message})
}

Write-Log "Initializing Project Ella: System Health Audit Pipeline..." "INFO"

# --- Step A: Storage Partition Audit ---
Write-Log "Auditing local partition boundaries..." "INFO"
try {
    $Disks = Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DriveType=3"
    foreach ($Disk in $Disks) {
        if ($null -eq $Disk.Size -or $Disk.Size -eq 0) { continue }
        $SizeGB = [math]::Round($Disk.Size / 1GB, 2)
        $FreeGB = [math]::Round($Disk.FreeSpace / 1GB, 2)
        $PercentFree = [math]::Round(($Disk.FreeSpace / $Disk.Size) * 100, 2)
        $DiskMessage = "Drive [$($Disk.DeviceID)] - Total: $SizeGB GB | Free: $FreeGB GB ($PercentFree%)"
        
        if ($PercentFree -lt 15.0) { Write-Log "Low Storage Space: $DiskMessage" "WARNING" } 
        else { Write-Log $DiskMessage "INFO" }
    }
} catch { Write-Log "Storage audit faulted: $_" "ERROR" }

# --- Step B: Service Infrastructure Audit ---
$TargetServices = @("WinRM", "W32Time", "LanmanServer") 
Write-Log "Evaluating state definitions for core services..." "INFO"
foreach ($ServiceName in $TargetServices) {
    try {
        $Service = Get-Service -Name $ServiceName -ErrorAction Stop
        if ($Service.Status -ne 'Running') {
            Write-Log "Service [$ServiceName] is not active! Current State: $($Service.Status)" "WARNING"
        } else {
            Write-Log "Service [$ServiceName] verified healthy [State: Running]." "INFO"
        }
    } catch { Write-Log "Failed to resolve status for service [$ServiceName]: $_" "ERROR" }
}

# --- Step C: Auto-Purge Old Logs ---
Write-Log "Checking for log files older than $MaxLogAgeDays days to purge..." "INFO"
try {
    Get-ChildItem -Path $ReportDir -File | Where-Object {
        $_.LastWriteTime -lt (Get-Date).AddDays(-$MaxLogAgeDays) -and 
        ($_.Extension -match "csv|html|log|key") -and ($_.Name -ne "Ella_Secret.key")
    } | Remove-Item -Force
} catch { Write-Log "Log purging process faulted: $_" "ERROR" }

# --- Step D: Export Reports ---
try {
    $LogCollection | Export-Csv -Path $CsvFile -NoTypeInformation -Encoding utf8
    $HtmlHeader = "<style>body{font-family:Arial;margin:20px;background:#f9f9f9;}table{border-collapse:collapse;width:100%;background:#fff;}th,td{padding:10px;text-align:left;border-bottom:1px solid #ddd;}th{background:#4CAF50;color:#fff;}.INFO{color:green;font-weight:bold;}.WARNING{color:orange;font-weight:bold;}.ERROR{color:red;font-weight:bold;}</style>"
    $HtmlBody = $LogCollection | ConvertTo-Html -Fragment | Out-String
    foreach ($Level in @("INFO", "WARNING", "ERROR")) { $HtmlBody = $HtmlBody -replace "<td>$Level</td>", "<td class='$Level'>$Level</td>" }
    $FinalHtml = ConvertTo-Html -Head $HtmlHeader -Body "<h2>Project Ella: System Health Report</h2> $HtmlBody"
    $FinalHtml | Out-File -FilePath $HtmlFile -Encoding utf8
} catch { Write-Host "Failed to generate report files: $_" -ForegroundColor Red }

# --- Step E: Secure Email Alerts ---
if ($Global:HasAlerts) {
    if (-not (Test-Path -Path $KeyFile)) {
        Write-Host "Alert email aborted: Encrypted key file missing at $KeyFile" -ForegroundColor Red
        exit 1
    }
    try {
        $EncryptedString = Get-Content -Path $KeyFile -Raw
        $SecurePassword  = ConvertTo-SecureString $EncryptedString
        $Credential      = New-Object System.Management.Automation.PSCredential($AdminEmail, $SecurePassword)

        $EmailParams = @{
            To          = $AdminEmail
            From        = $AdminEmail
            Subject     = "Project Ella Alert: Matrix of Conscience Health Warning ($Timestamp)"
            Body        = Get-Content -Path $HtmlFile -Raw
            BodyAsHtml  = $true
            SmtpServer  = "://gmail.com"
            Port        = 587
            UseSsl      = $true
            Credential  = $Credential
            ErrorAction = "Stop"
        }
        Send-MailMessage @EmailParams
        Write-Host "Email alert securely dispatched." -ForegroundColor Green
    } catch { Write-Host "Failed to dispatch email alert: $_" -ForegroundColor Red }
}
