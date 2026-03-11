param(
  [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$directories = @(
  ".ai",
  ".github",
  ".vscode",
  "docs",
  "scripts"
)

$files = @{
  ".ai\context.md" = "# Project Context`r`n"
  ".ai\roadmap.md" = "# AI Roadmap`r`n"
  ".ai\changelog.md" = "# Changelog`r`n"
  ".ai\prompts.md" = "# Reusable Prompts`r`n"
  ".ai\session-log.md" = "# Session Log`r`n"
  ".ai\project.json" = "{`r`n  `"type`": `"react-vite`"`r`n}`r`n"
  ".github\copilot-instructions.md" = "# Copilot and Codex Instructions`r`n"
  ".github\pull_request_template.md" = "## Summary`r`n"
  ".vscode\settings.json" = "{}`r`n"
  ".vscode\tasks.json" = "{`r`n  `"version`": `"2.0.0`",`r`n  `"tasks`": []`r`n}`r`n"
  ".vscode\extensions.json" = "{`r`n  `"recommendations`": []`r`n}`r`n"
  "README.md" = "# Graduate Together`r`n"
  "CONTRIBUTING.md" = "# Contributing`r`n"
  "TODO.md" = "# TODO`r`n"
  "DECISIONS.md" = "# Decisions`r`n"
  "ENV.md" = "# Environment`r`n"
  ".env.example" = "# Add environment variables here.`r`n"
  "ROADMAP.md" = "# Roadmap`r`n"
  "CommonMistakes.global.md" = "# Common Mistakes (Global)`r`n"
  "CommonMistakes.project.md" = "# Common Mistakes (Project)`r`n"
  "scripts\git-bootstrap.ps1" = "Write-Host `"Replace with repo-specific script.`"`r`n"
  "scripts\sync-common-mistakes.ps1" = "Write-Host `"Replace with repo-specific script.`"`r`n"
  "scripts\scaffold-starter-pack.ps1" = "Write-Host `"Starter pack scaffold already present.`"`r`n"
  "scripts\new-task.ps1" = "Write-Host `"Replace with repo-specific script.`"`r`n"
}

foreach ($directory in $directories) {
  if (-not (Test-Path $directory)) {
    New-Item -ItemType Directory -Path $directory | Out-Null
    Write-Host "Created directory: $directory"
  }
}

foreach ($path in $files.Keys) {
  if ((Test-Path $path) -and -not $Force) {
    continue
  }

  $parent = Split-Path -Parent $path
  if ($parent -and -not (Test-Path $parent)) {
    New-Item -ItemType Directory -Path $parent | Out-Null
  }

  Set-Content -Path $path -Value $files[$path] -Encoding UTF8
  Write-Host "Ensured file: $path"
}

Write-Host "Starter pack scaffold check complete."
