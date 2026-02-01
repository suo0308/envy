@echo off
chcp 65001 >nul
echo ========================================
echo   AIチャットアプリを起動しています...
echo ========================================
echo.

cd /d "%~dp0AIチャット\app"

if not exist "package.json" (
    echo エラー: package.jsonが見つかりません。
    echo アプリのフォルダ構造を確認してください。
    pause
    exit /b 1
)

echo アプリフォルダに移動しました: %CD%
echo.
echo サーバーを起動しています...
echo 起動後、ブラウザで http://localhost:3000 を開いてください。
echo.
echo 停止するには Ctrl+C を押してください。
echo.

start http://localhost:3000
npm run dev

pause
