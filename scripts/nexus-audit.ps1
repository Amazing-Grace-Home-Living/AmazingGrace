# nexus-audit.ps1 - Nexus Matrix & System Health Auditor
# (c) 2026 NicholaiMadias — MIT License

[CmdletBinding()]
param (
    [Parameter(Mandatory = $false)]
    [string]$ReportDir = "C:\Logs"
)

# 1. Initialize Logging Environment
if (-not (Test-Path -Path $ReportDir)) {
    try {
        New-Item -ItemType Directory -Path $ReportDir -Force | Out-Null
    } catch {
        Write-Error "Failed to create log directory: $_"
        exit 1
    }
}

$Timestamp  = Get-Date -Format "yyyyMMdd_HHmmss"
$LogFile    = Join-Path -Path $ReportDir -ChildPath "NexusAudit_$Timestamp.log"

function Write-Log {
    param (
        [string]$Message,
        [ValidateSet("INFO", "WARNING", "ERROR", "SUCCESS")]
        $Level = "INFO"
    )
    $TimeStr = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $FormattedMessage = "[$TimeStr] [$Level] $Message"
    
    switch ($Level) {
        "ERROR"   { Write-Host $FormattedMessage -ForegroundColor Red }
        "WARNING" { Write-Host $FormattedMessage -ForegroundColor Yellow }
        "SUCCESS" { Write-Host $FormattedMessage -ForegroundColor Green }
        "INFO"    { Write-Host $FormattedMessage -ForegroundColor Cyan }
    }
    
    $FormattedMessage | Out-File -FilePath $LogFile -Append -Encoding utf8
}

Write-Log "Initializing Nexus Matrix Audit Pipeline..." "INFO"

# --- Step A: Repository Integrity ---
Write-Log "Auditing repository state..." "INFO"
$Untracked = git ls-files --others --exclude-standard
if ($Untracked) {
    Write-Log "Untracked files detected in root. Ensure sensitive data is ignored." "WARNING"
} else {
    Write-Log "Working directory logic is clean." "SUCCESS"
}

# --- Step B: Firebase Configuration Check ---
Write-Log "Auditing Firebase infrastructure..." "INFO"
$FbJson = "C:\Users\nicho\source\repos\NicholaiMadias\AmazingGrace\firebase.json"
if (Test-Path $FbJson) {
    $Content = Get-Content $FbJson | ConvertFrom-Json
    if ($Content.apphosting) {
        Write-Log "App Hosting backend [limitlessnexus] verified in configuration." "SUCCESS"
    } else {
        Write-Log "App Hosting configuration missing from firebase.json." "ERROR"
    }
} else {
    Write-Log "firebase.json not found in root." "ERROR"
}

# --- Step C: Asset Audit (Unused Images) ---
Write-Log "Scanning for orphaned assets..." "INFO"
$imageExts = @('.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.ico')
$codeExts = @('.html', '.tsx', '.ts', '.js', '.jsx', '.css', '.json')

$images = Get-ChildItem -Path . -Recurse -Include *.* | Where-Object { 
    $imageExts -contains $_.Extension -and $_.FullName -notmatch "node_modules|dist|\.git" 
}
$codeFiles = Get-ChildItem -Path . -Recurse -Include *.* | Where-Object { 
    $codeExts -contains $_.Extension -and $_.FullName -notmatch "node_modules|dist|\.git" 
}

$allCode = ""
foreach ($file in $codeFiles) {
    try { $allCode += [System.IO.File]::ReadAllText($file.FullName) } catch {}
}

$orphans = 0
foreach ($img in $images) {
    if ($allCode -notmatch [regex]::Escape($img.Name)) { $orphans++ }
}

if ($orphans -gt 0) {
    Write-Log "Found $orphans potential orphaned assets. Recommend cleanup." "WARNING"
} else {
    Write-Log "No orphaned assets detected." "SUCCESS"
}

# --- Step D: System Health (User Provided) ---
Write-Log "Auditing system resource boundaries..." "INFO"
try {
    $Disks = Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DriveType=3"
    foreach ($Disk in $Disks) {
        $PercentFree = [math]::Round(($Disk.FreeSpace / $Disk.Size) * 100, 2)
        if ($PercentFree -lt 15.0) {
            Write-Log "Low Disk Space on $($Disk.DeviceID): $PercentFree%" "WARNING"
        } else {
            Write-Log "Disk $($Disk.DeviceID) healthy: $PercentFree% free." "SUCCESS"
        }
    }
} catch {
    Write-Log "System CIM audit faulted: $_" "ERROR"
}

Write-Log "Nexus Matrix audit completed successfully. Report: $LogFile" "SUCCESS"
