$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$mainPath = Join-Path $root 'backend\main.py'
if (-not (Test-Path $mainPath)) { throw "Could not find backend\main.py. Extract this upgrade into the project root." }
$content = Get-Content -LiteralPath $mainPath -Raw

$importLine = 'from api.evaluation import router as evaluation_router'
if ($content -notmatch [regex]::Escape($importLine)) {
    $anchor = 'from api.knowledge import router as knowledge_router'
    if (-not $content.Contains($anchor)) { throw 'Could not find the existing knowledge_router import in backend\main.py. No changes were made.' }
    $content = $content.Replace($anchor, $anchor + "`r`n" + $importLine)
}

$routerListPattern = '(?s)(routers\s*=\s*\[.*?\bknowledge_router\b)(,?\s*\])'
$directListPattern = '(?s)(for\s+router\s+in\s*\[.*?\bknowledge_router\b)(,?\s*\])'
if (-not [regex]::IsMatch($content, '(?s)(routers\s*=\s*\[.*?\bevaluation_router\b|for\s+router\s+in\s*\[.*?\bevaluation_router\b)')) {
    if ([regex]::IsMatch($content, $routerListPattern)) {
        $content = [regex]::Replace($content, $routerListPattern, '$1, evaluation_router$2', 1)
    } elseif ([regex]::IsMatch($content, $directListPattern)) {
        $content = [regex]::Replace($content, $directListPattern, '$1, evaluation_router$2', 1)
    } else {
        throw 'Could not find the protected routers list in backend\main.py. Add evaluation_router to that list manually.'
    }
}

$backupPath = "$mainPath.steps7-10.bak"
if (-not (Test-Path $backupPath)) { Copy-Item -LiteralPath $mainPath -Destination $backupPath }
Set-Content -LiteralPath $mainPath -Value $content -Encoding UTF8
Write-Host 'Steps 7–10 router integration added to backend/main.py.' -ForegroundColor Green
Write-Host 'A backup was saved as backend/main.py.steps7-10.bak.'
