# AIチャット改

売れっ子ホストのLINE術を学習した、AIによる返信提案システム

## 🚀 クイックスタート

### 起動方法

**Windowsの場合:**

1. `起動.bat` をダブルクリック
2. または PowerShell で `.\起動.ps1` を実行

**手動起動の場合:**

```powershell
cd "AIチャット\app"
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## 📁 プロジェクト構成

```
AIチャット改/
├── 起動.bat              # Windows起動スクリプト
├── 起動.ps1              # PowerShell起動スクリプト
├── README.md             # このファイル
└── AIチャット/
    ├── app/              # Next.jsアプリケーション
    │   ├── src/          # ソースコード
    │   ├── data/         # 学習データ
    │   └── package.json
    ├── docs/             # ドキュメント
    └── hostline/         # LINEトーク履歴データ
```

## ⚙️ セットアップ

1. **環境変数の設定**

```powershell
cd "AIチャット\app"
copy env.example .env.local
```

`.env.local` ファイルを開いて、Gemini APIキーを設定してください：

```
GEMINI_API_KEY=your_api_key_here
```

2. **依存関係のインストール**

```powershell
cd "AIチャット\app"
npm install
```

3. **開発サーバーの起動**

```powershell
npm run dev
```

## 📖 詳細ドキュメント

- [開発仕様書](AIチャット/開発仕様書.md)
- [起動ガイド](AIチャット/docs/起動ガイド.md)
- [使い方ガイド](AIチャット/docs/walkthrough.md)

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 16 + TypeScript
- **スタイリング**: TailwindCSS
- **AIエンジン**: Google Gemini API
- **データ保存**: localStorage

## 📝 ライセンス

このプロジェクトはプライベートプロジェクトです。
