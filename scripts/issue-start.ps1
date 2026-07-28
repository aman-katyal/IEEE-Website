param (
    [Parameter(Mandatory=$true)]
    [string]$IssueId
)

$ErrorActionPreference = "Stop"

Write-Host "Fetching GitHub Issue #$IssueId..." -ForegroundColor Cyan

# Query issue title using GitHub CLI
$jsonOutput = gh issue view $IssueId --json number,title | ConvertFrom-Json

if (-not $jsonOutput) {
    Write-Error "Failed to fetch Issue #$IssueId. Ensure gh CLI is authenticated."
    exit 1
}

# Slugify title
$cleanTitle = $jsonOutput.title -replace '[^\w\s-]', '' -replace '\s+', '-'
$slug = $cleanTitle.ToLower()
if ($slug.Length -gt 35) {
    $slug = $slug.Substring(0, 35).TrimEnd('-')
}

$branchName = "issue-$IssueId-$slug"

Write-Host "Creating and checking out branch '$branchName'..." -ForegroundColor Green
git checkout master
git pull origin master
git checkout -b $branchName

Write-Host "Successfully checked out branch '$branchName' for Issue #$IssueId!" -ForegroundColor Green
