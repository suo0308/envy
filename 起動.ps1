# AIチャットアプリ起動スクリプト (PowerShell版)
# UTF-8エンコーディングで実行

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AIチャットアプリを起動しています..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# スクリプトのディレクトリに移動
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$appDir = Join-Path $scriptDir "AIチャット\app"

if (-not (Test-Path $appDir)) {
    Write-Host "エラー: アプリフォルダが見つかりません: $appDir" -ForegroundColor Red
    Read-Host "Enterキーを押して終了"
    exit 1
}

Set-Location $appDir

if (-not (Test-Path "package.json")) {
    Write-Host "エラー: package.jsonが見つかりません。" -ForegroundColor Red
    Write-Host "アプリのフォルダ構造を確認してください。" -ForegroundColor Red
    Read-Host "Enterキーを押して終了"
    exit 1
}

Write-Host "アプリフォルダに移動しました: $(Get-Location)" -ForegroundColor Green
Write-Host ""
Write-Host "サーバーを起動しています..." -ForegroundColor Yellow
Write-Host "起動後、ブラウザで http://localhost:3000 を開いてください。" -ForegroundColor Yellow
Write-Host ""
Write-Host "停止するには Ctrl+C を押してください。" -ForegroundColor Yellow
Write-Host ""

# ブラウザを開く（少し遅延を入れてサーバー起動を待つ）
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"

# サーバーを起動
npm run dev
