# Run from your normal PowerShell, where GitHub CLI is already signed in.
# Creates only the approved public repository ayyananwar/portfolio.
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$account = & gh api user --jq .login
if ($LASTEXITCODE -ne 0 -or $account -ne 'ayyananwar') { throw 'Sign in to GitHub CLI as ayyananwar first.' }
if (-not (Test-Path -LiteralPath '.git')) { throw 'The prepared Git repository is missing.' }
$remote = & git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0 -and $remote -ne 'https://github.com/ayyananwar/portfolio.git') { throw 'Unexpected origin. Check it before publishing.' }
$existing = & gh repo view ayyananwar/portfolio --json url --jq .url 2>$null
if ($LASTEXITCODE -ne 0) {
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
