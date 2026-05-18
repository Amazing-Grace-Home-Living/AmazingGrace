[CmdletBinding()]
param(
  [string]$Owner = 'NicholaiMadias',
  [string]$Repo = 'AmazingGrace',
  [switch]$OpenSettings
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoUrl = "https://github.com/$Owner/$Repo"
$rulesetsUrl = "$repoUrl/settings/rules"
$actionsSettingsUrl = "$repoUrl/settings/actions"

$message = @"
Amazing Grace — GitHub Ruleset Bypass Setup Helper
===================================================

Repository: $Owner/$Repo

1) Open Rulesets:
   $rulesetsUrl

2) In each relevant ruleset, add bypass for required automation actors:
   - GitHub Actions (github-actions[bot]) for deployment and preview workflows
   - Copilot coding agent (if using issue-driven coding agents)

3) Keep bypass scope narrow:
   - Prefer gh-pages and automation branches (copilot/*, devops/*)
   - Keep main branch protections strict

4) Re-run the blocked automation after saving ruleset changes.

Reference document:
   $repoUrl/blob/main/docs/rulesets-and-agents.md
"@

Write-Output $message

if ($OpenSettings.IsPresent) {
  try {
    Start-Process $rulesetsUrl | Out-Null
    Start-Process $actionsSettingsUrl | Out-Null
    Write-Output "Opened GitHub settings in your default browser."
  } catch {
    Write-Warning "Unable to automatically open browser links: $($_.Exception.Message)"
  }
}
