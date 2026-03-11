param(
  [Parameter(Mandatory = $true)]
  [string]$Title
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$todoPath = "TODO.md"
if (-not (Test-Path $todoPath)) {
  Write-Error "TODO.md was not found in the repository root."
}

$stamp = Get-Date -Format "yyyy-MM-dd"
$entry = @(
  "",
  "- [ ] $Title",
  "  - Why:",
  "  - Done when:",
  "  - Verification:",
  "  - Added: $stamp"
) -join "`r`n"

Add-Content -Path $todoPath -Value $entry -Encoding UTF8
Write-Host "Added task stub to TODO.md"
