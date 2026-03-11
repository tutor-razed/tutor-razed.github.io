Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$source = "C:\Users\razed\Projects\.RazedDeveloper\CommonMistakes.md"
$destination = Join-Path (Get-Location) "CommonMistakes.global.md"

if (-not (Test-Path $source)) {
  Write-Host "Could not find the shared Common Mistakes file:"
  Write-Host "  $source"
  Write-Host "Create the source file or update scripts/sync-common-mistakes.ps1 to the correct location."
  exit 1
}

Copy-Item -Path $source -Destination $destination -Force
Write-Host "Synced CommonMistakes.global.md from:"
Write-Host "  $source"
