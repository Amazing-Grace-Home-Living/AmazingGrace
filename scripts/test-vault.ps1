# test-vault.ps1 - PowerShell Handshake for Nexus Vault
$relayUrl = "YOUR_DEPLOYED_WEB_APP_URL"
$authKey = "YOUR_VAULT_ACCESS_KEY"

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
