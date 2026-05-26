# test-vault.ps1 - Secure PowerShell Handshake for Nexus Vault
# This script pulls the auth key from the environment variable 'VAULT_ACCESS_KEY'
# to avoid exposing secrets in a public repository.

$baseRelayUrl = 'https://script.google.com/macros/s/AKfycbxHvL_3fkX24tTBSvaQCAIoi-eqNFRDI38a8xal2dqbA0f3dTURxMtqZkpCJlv9vrLV/exec'
$authKey = $env:VAULT_ACCESS_KEY

if (-not $authKey) {
    Write-Error "Environment variable 'VAULT_ACCESS_KEY' is not set. Handshake aborted."
    exit 1
}

# Build URL with authKey as a query parameter
$relayUrl = $baseRelayUrl + '?authKey=' + $authKey

$payload = @{
    action  = 'update_matrix'
    feature = 'Gemini'
    value   = 'powershell_handshake_verified'
} | ConvertTo-Json

try {
    Write-Host 'Initiating secure handshake with Nexus Relay...' -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri $relayUrl -Method Post -Body $payload -ContentType 'application/json'
    Write-Host "Handshake Result: $response" -ForegroundColor Green
}
catch {
    Write-Error "Connection Failed: $_"
}
