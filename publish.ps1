# Run from your normal PowerShell, where GitHub CLI is already signed in.
# Creates only the approved public repository ayyananwar/portfolio.
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$account = & gh api user --jq .login
if ($LASTEXITCODE -ne 0 -or $account -ne 'ayyananwar') { throw 'Sign in to GitHub CLI as ayyananwar first.' }
if (-not (Test-Path -LiteralPath '.git')) { throw 'The prepared Git repository is missing.' }
$remote = $null
$remoteNames = & git remote
if ($remoteNames -contains 'origin') { $remote = & git remote get-url origin }
if ($remote -and $remote -ne 'https://github.com/ayyananwar/portfolio.git') { throw 'Unexpected origin. Check it before publishing.' }
$repositoryJson = & gh repo list ayyananwar --limit 1000 --json name
if ($LASTEXITCODE -ne 0) { throw 'Could not inspect your repositories.' }
$repositories = ConvertFrom-Json -InputObject ($repositoryJson -join [Environment]::NewLine)
$existing = $repositories | Where-Object { $_.name -eq 'portfolio' }
if (-not $existing) {
  & gh repo create ayyananwar/portfolio --public --description 'Ayyan Anwar — web applications, backend systems, and workflow automation.'
  if ($LASTEXITCODE -ne 0) { throw 'Could not create repository.' }
}
if (-not $remote) {
  & git remote add origin https://github.com/ayyananwar/portfolio.git
  if ($LASTEXITCODE -ne 0) { throw 'Could not configure origin.' }
}
& gh auth setup-git
if ($LASTEXITCODE -ne 0) { throw 'Could not configure Git authentication.' }
& git push -u origin main
if ($LASTEXITCODE -ne 0) { throw 'Push failed. Existing repository history may need review; no force push was attempted.' }
Write-Host 'Published: https://github.com/ayyananwar/portfolio'
