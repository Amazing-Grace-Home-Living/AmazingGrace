# test-vault.ps1 - PowerShell Handshake for Nexus Vault
$relayUrl = "https://script.google.com/macros/s/AKfycbxa2QE9MCe5hMuGT6IScHvLV0zDu3wfY7D4HWqRucMkBX3N9b9CYAXjhjf49TBi180/exec"
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
