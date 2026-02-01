# 🚀 Vercelデプロイ手順

このアプリケーションをVercelにデプロイして、インターネット上で公開する手順です。

## 📋 前提条件

- GitHubアカウント（リポジトリがGitHubにプッシュされていること）
- Vercelアカウント（[vercel.com](https://vercel.com)で無料登録可能）

## 🔧 デプロイ手順

### 方法1: Vercel CLIを使用（推奨）

1. **Vercel CLIをインストール**
   ```bash
   npm i -g vercel
   ```

2. **Vercelにログイン**
   ```bash
   vercel login
   ```

3. **プロジェクトディレクトリに移動**
   ```bash
   cd "AIチャット改/AIチャット/app"
   ```

4. **デプロイ実行**
   ```bash
   vercel
   ```
   
   初回は以下の質問に答えます：
   - Set up and deploy? → **Y**
   - Which scope? → アカウントを選択
   - Link to existing project? → **N**（新規プロジェクトの場合）
   - Project name? → プロジェクト名を入力（例: `ai-chat-kai`）
   - Directory? → **./** または **AIチャット/app**
   - Override settings? → **N**

5. **本番環境にデプロイ**
   ```bash
   vercel --prod
   ```

### 方法2: Vercelダッシュボードから（簡単）

1. **Vercelにログイン**
   - [vercel.com](https://vercel.com) にアクセス
   - GitHubアカウントでログイン

2. **新しいプロジェクトを作成**
   - 「Add New...」→「Project」をクリック
   - GitHubリポジトリを選択（`suo0308/envy`）

3. **プロジェクト設定**
   - **Root Directory**: `AIチャット/app` を指定
   - **Framework Preset**: Next.js（自動検出される）
   - **Build Command**: `npm run build`（自動設定）
   - **Output Directory**: `.next`（自動設定）

4. **環境変数を設定**
   - 「Environment Variables」セクションで以下を追加：
     ```
     GEMINI_API_KEY = your_api_key_here
     ```
   - 実際のGemini APIキーに置き換えてください

5. **デプロイ**
   - 「Deploy」ボタンをクリック
   - 数分でデプロイが完了します

## 🔑 環境変数の設定

Vercelダッシュボードで環境変数を設定する方法：

1. プロジェクトの「Settings」→「Environment Variables」に移動
2. 以下の環境変数を追加：

| 名前 | 値 | 環境 |
|------|-----|------|
| `GEMINI_API_KEY` | あなたのGemini APIキー | Production, Preview, Development |

### Gemini APIキーの取得方法

1. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
2. Googleアカウントでログイン
3. 「Create API Key」をクリック
4. 生成されたAPIキーをコピー
5. Vercelの環境変数に貼り付け

## 📱 デプロイ後のアクセス

デプロイが完了すると、以下のようなURLが生成されます：

```
https://your-project-name.vercel.app
```

このURLは：
- ✅ 世界中どこからでもアクセス可能
- ✅ HTTPS対応（セキュア）
- ✅ スマホからもアクセス可能
- ✅ 自動的に更新される（GitHubにプッシュするたび）

## 🔄 自動デプロイの設定

GitHubリポジトリと連携すると、以下の場合に自動的にデプロイされます：

- **mainブランチにプッシュ** → 本番環境にデプロイ
- **他のブランチにプッシュ** → プレビュー環境にデプロイ

## ⚙️ カスタムドメインの設定（オプション）

独自のドメインを使用したい場合：

1. Vercelダッシュボードでプロジェクトを開く
2. 「Settings」→「Domains」に移動
3. ドメイン名を入力
4. DNS設定をVercelの指示に従って設定

## 🐛 トラブルシューティング

### ビルドエラーが発生する場合

1. **ログを確認**
   - Vercelダッシュボードの「Deployments」でログを確認

2. **環境変数が設定されているか確認**
   - 「Settings」→「Environment Variables」で確認

3. **Root Directoryが正しいか確認**
   - `AIチャット/app` が指定されているか確認

### APIが動作しない場合

- 環境変数 `GEMINI_API_KEY` が正しく設定されているか確認
- APIキーが有効か確認
- Vercelのログでエラーメッセージを確認

## 📝 注意事項

- 無料プランでも十分に使用できますが、使用量制限があります
- 環境変数は機密情報なので、GitHubにはコミットしないでください
- 学習データ（`data/learning/*.txt`）はリポジトリに含まれていますが、機密情報が含まれている場合は除外を検討してください

## 🔗 参考リンク

- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [環境変数の設定](https://vercel.com/docs/environment-variables)
