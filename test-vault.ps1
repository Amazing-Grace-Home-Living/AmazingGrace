# test-vault.ps1 - PowerShell Handshake for Nexus Vault
# Replace placeholders with actual values before running
$relayUrl = "https://us-central1-amazing-grace-hl.cloudfunctions.net/helloWorld"
$authKey = "YOUR_VAULT_ACCESS_KEY" # e.g., the value of SOVEREIGN_API_KEY

$payload = @{
    action  = "update_matrix"
    feature = "Gemini"
    value   = "powershell_handshake_verified"
    authKey = $authKey
} | ConvertTo-Json

try {
    Write-Host "Initiating handshake with Nexus Relay..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri $relayUrl -Method Post -Body $payload -ContentType "application/json"
    Write-Host "Handshake Result: $response" -ForegroundColor Green
}
catch {
    Write-Error "Connection Failed: $_"
}
