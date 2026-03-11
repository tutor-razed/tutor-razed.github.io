param(
  [string]$DefaultBranch = "main",
  [switch]$NoCommit
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Test-Command {
  param([Parameter(Mandatory = $true)][string]$Name)
  return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

if (-not (Test-Command -Name "git")) {
  Write-Error "Git is not installed or not available on PATH."
}

git rev-parse --is-inside-work-tree *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Error "This folder is not a git repository. Initialize the repo before running this script."
}

$branch = (git branch --show-current).Trim()
if ([string]::IsNullOrWhiteSpace($branch)) {
  Write-Host "Repository has no current branch yet."
} elseif ($branch -ne $DefaultBranch) {
  Write-Warning "Current branch is '$branch'. Expected '$DefaultBranch'."
} else {
  Write-Host "Current branch is '$branch'."
}

$userName = (git config user.name)
$userEmail = (git config user.email)
if ([string]::IsNullOrWhiteSpace($userName) -or [string]::IsNullOrWhiteSpace($userEmail)) {
  Write-Host "Git identity is missing. Configure it before pushing:"
  Write-Host '  git config --global user.name "Your Name"'
  Write-Host '  git config --global user.email "you@example.com"'
}

$hasCommits = $true
git rev-parse --verify HEAD *> $null
if ($LASTEXITCODE -ne 0) {
  $hasCommits = $false
}

if (-not $hasCommits) {
  if ($NoCommit) {
    Write-Host "Repository has no commits yet. Skipping initial commit because -NoCommit was provided."
  } else {
    Write-Host "Repository has no commits yet. Creating initial commit."
    git add .
    git commit -m "Initial commit"
  }
} else {
  Write-Host "Repository already has at least one commit."
}

Write-Host ""
Write-Host "Next steps:"
Write-Host "  git status"
Write-Host "  git remote -v"
Write-Host "  git branch --show-current"
Write-Host "  git push -u origin $DefaultBranch"
