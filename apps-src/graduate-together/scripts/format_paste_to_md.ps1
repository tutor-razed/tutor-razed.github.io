param(
  [string]$InFile = "",
  [string]$OutFile = "00_master/manuscript_v1.md",
  [switch]$Append
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ensure-Dir([string]$path) {
  $dir = Split-Path -Parent $path
  if ($dir -and -not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir | Out-Null
  }
}

function Get-InputText([string]$path) {
  if (-not [string]::IsNullOrWhiteSpace($path)) {
    return Get-Content -Raw -Encoding UTF8 -Path $path
  }

  if (Get-Command -Name Get-Clipboard -ErrorAction SilentlyContinue) {
    $clip = Get-Clipboard -Raw
    if (-not [string]::IsNullOrWhiteSpace($clip)) {
      return $clip
    }
  }

  throw "No input text found. Provide -InFile or copy text to clipboard first."
}

$text = Get-InputText -path $InFile
Ensure-Dir -path $OutFile

if ($Append) {
  Add-Content -Encoding UTF8 -Path $OutFile -Value "`r`n$text"
  Write-Host "Appended to: $OutFile"
} else {
  Set-Content -Encoding UTF8 -Path $OutFile -Value $text
  Write-Host "Wrote: $OutFile"
}
