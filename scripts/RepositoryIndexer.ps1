<#
.SYNOPSIS
    Repository File Indexer and Optimization Suite.
.DESCRIPTION
    Recursively indexes the Amazing Grace repository, filters out development noise, 
    and generates structural data sheets (CSV/JSON) for repository tracking.
.PARAMETER TargetPath
    The directory path to index. Defaults to the current working directory.
.PARAMETER OutputDir
    The folder where the generated matrix files will be stored.
#>

[CmdletBinding()]
param (
    [Parameter(Mandatory = $false, ValueFromPipeline = $true)]
    [string]$TargetPath = ".",
    
    [Parameter(Mandatory = $false)]
    [string]$OutputDir = "C:\Logs\RepositoryMetrics"
)

# Resolve relative paths to absolute paths safely
try {
    $AbsoluteTarget = (Resolve-Path -Path $TargetPath).Path
} catch {
    Write-Host "Failed to resolve path: $TargetPath" -ForegroundColor Red
    exit 1
}

Write-Host "Initializing Repository Indexer for: $AbsoluteTarget" -ForegroundColor Green

# Ensure output directory boundary exists
if (-not (Test-Path -Path $OutputDir)) {
    try {
        New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    } catch {
        Write-Host "Failed to create output directory: $OutputDir" -ForegroundColor Red
        exit 1
    }
}

# Define exclusion arrays to filter out structural noise/git history overhead
$ExcludeFolders = @('.git', '.github', 'node_modules', 'bin', 'obj', '.vshistory', 'tmp', 'dist')
$ExcludeExtensions = @('.exe', '.dll', '.suo', '.user', '.zip', '.tmp', '.log', '.png', '.jpg', '.jpeg', '.gif', '.mp4', '.mov')

Write-Host "Scanning infrastructure layers..." -ForegroundColor Yellow

# Gather recursive child items, piping into an inspection loop
$FileInventory = Get-ChildItem -Path $AbsoluteTarget -Recurse -File -ErrorAction SilentlyContinue | 
    Where-Object {
        # Filter folders dynamically by checking path boundaries
        $InExcludedFolder = $false
        foreach ($Folder in $ExcludeFolders) {
            if ($_.FullName -like "*\$Folder\*") {
                $InExcludedFolder = $true
                break
            }
        }
        -not $InExcludedFolder -and $_.Extension -notin $ExcludeExtensions
    } | 
    ForEach-Object {
        # Calculate file size brackets in Kilobytes for optimization review
        $SizeKB = [math]::Round($_.Length / 1KB, 2)
        
        # Output custom custom tracking objects for the matrix array
        [PSCustomObject]@{
            "FileName"      = $_.Name
            "Extension"     = $_.Extension
            "Size_KB"       = $SizeKB
            "RelativePath"  = $_.FullName.Replace($AbsoluteTarget, "")
            "LastModified"  = $_.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
            "Optimization"  = if ($SizeKB -gt 100) { "Flagged: Review for Optimization" } else { "Optimized" }
        }
    }

# --- State Export Pipeline ---
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$CsvOut    = Join-Path -Path $OutputDir -ChildPath "AmazingGrace_Index_$Timestamp.csv"
$JsonOut   = Join-Path -Path $OutputDir -ChildPath "AmazingGrace_Manifest_$Timestamp.json"

if ($FileInventory) {
    # 1. Export as a Data Matrix (CSV) for easy tracking
    $FileInventory | Export-Csv -Path $CsvOut -NoTypeInformation -Encoding utf8
    Write-Host "Data Matrix Successfully Provisioned: $CsvOut" -ForegroundColor Green
    
    # 2. Export as a structured manifest (JSON) for version control pipeline integration
    $JsonPayload = @{
        "ManifestVersion" = "1.0.0"
        "RootNode"        = $AbsoluteTarget
        "GeneratedAt"     = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        "TotalFileCount"  = $FileInventory.Count
        "Assets"          = $FileInventory
    }
    $JsonPayload | ConvertTo-Json -Depth 5 | Out-File -FilePath $JsonOut -Encoding utf8
    Write-Host "Structural JSON Manifest Completed: $JsonOut" -ForegroundColor Green
    
    # Render brief system optimization table directly to terminal
    Write-Host "`n--- TOP 5 LARGEST TRACKED ASSETS ---" -ForegroundColor Cyan
    $FileInventory | Sort-Object Size_KB -Descending | Select-Object -First 5 | Format-Table -AutoSize
} else {
    Write-Host "No tracked file nodes found matching criteria limits." -ForegroundColor Yellow
}
