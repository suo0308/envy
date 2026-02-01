import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// ユーティリティ: 配列をシャッフルする関数
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 学習データを読み込む関数（サイズ制限・優先度付き）
function loadLearningData(): string {
    const learningDir = path.join(process.cwd(), "data", "learning");
    let learningContent = "";
    const MAX_SIZE = 150000; // 全体の上限
    const CHUNK_SIZE = 4000; // 1ファイルあたりの読み込みサイズ（約4000文字）

    try {
        if (fs.existsSync(learningDir)) {
            const files = fs.readdirSync(learningDir);
            
            // 1. マニュアルを最優先で探して読み込む
            const manualFileName = "ホストLINE術.txt";
            if (files.includes(manualFileName)) {
                try {
                    const content = fs.readFileSync(
                        path.join(learningDir, manualFileName),
                        "utf-8"
                    );
                    learningContent += `\n--- マニュアル: ${manualFileName} ---\n${content}\n`;
                } catch (e) {
                    console.error("マニュアル読み込みエラー", e);
                }
            }

            // 2. その他のトーク履歴ファイルをリストアップ
            const chatFiles = files.filter(f => f.endsWith(".txt") && f !== manualFileName);
            
            // 3. ランダムにシャッフル（毎回違う会話を学習させるため）
            const shuffledFiles = shuffleArray(chatFiles);

            // 4. 各ファイルから少しずつ読み込む
            for (const file of shuffledFiles) {
                // 容量チェック
                if (learningContent.length >= MAX_SIZE) break;

                try {
                    const filePath = path.join(learningDir, file);
                    const stats = fs.statSync(filePath);
                    const fileSize = stats.size;
                    
                    let content = "";
                    
                    // ファイルが小さい場合は丸ごと、大きい場合は後ろから読み込む
                    if (fileSize <= CHUNK_SIZE) {
                        content = fs.readFileSync(filePath, "utf-8");
                    } else {
                        // ファイルの末尾から読み込むためのバッファ
                        // ※ 文字化け回避のため、少し多めに読んで調整するのが理想ですが、簡易的に実装します
                        const buffer = Buffer.alloc(CHUNK_SIZE);
                        const fd = fs.openSync(filePath, "r");
                        // 末尾から CHUNK_SIZE 分の位置から読む
                        const position = Math.max(0, fileSize - CHUNK_SIZE);
                        fs.readSync(fd, buffer, 0, CHUNK_SIZE, position);
                        fs.closeSync(fd);
                        content = buffer.toString("utf-8");
                    }

                    // 残り容量にあわせてカット
                    const remainingSpace = MAX_SIZE - learningContent.length;
                    if (content.length > remainingSpace) {
                        content = content.slice(0, remainingSpace);
                    }

                    learningContent += `\n--- トーク履歴: ${file} (抜粋) ---\n${content}\n`;

                } catch (e) {
                    console.error(`ファイル読み込みエラー (${file}):`, e);
                }
            }
        }
    } catch (error) {
        console.error("学習データのディレクトリ読み込みに失敗:", error);
    }

    return learningContent;
}

export async function POST(request: NextRequest) {
    try {
        const { message, image, conversationHistory } = await request.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY が設定されていません" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 学習データを読み込む
        const learningData = loadLearningData();

        // 基本のシステムプロンプト
        const basePrompt = `あなたは売れっ子ホストのLINE返信アドバイザーです。
以下の3タイプのホストになりきって、それぞれの特徴を活かした返信候補を提案してください。

参考資料（ホスト分析データ）:
${learningData}

【3タイプのホスト】
1. 癒し系: ポジティブ、顔文字多用、全肯定、「幸です」「えらい」が口癖
2. 管理型: 質問攻め、🥺で甘える、嫉妬深い、関西弁
3. 俺様系: 「俺のもの」「愛してる」、短文、強い言葉

【厳守ルール】
- 返信は1〜2文で超簡潔に
- 解説・分析・コメント禁止
- 返信文のみ出力

【匿名化 - 絶対厳守】
- 学習データ内の女の子の名前は絶対に出力禁止
- 名前を使う場合は「○○ちゃん」のみ
- 実名の引用は厳禁

【出力フォーマット】
【癒し系】
（返信文のみ）

【管理型】
（返信文のみ）

【俺様系】
（返信文のみ）

過去の会話履歴:
${conversationHistory || "なし"}
`;

        let result;

        if (image) {
            // 画像が送信された場合：Gemini Vision APIで解析
            const imagePrompt = `このLINEスクリーンショットを解析し、返信候補を生成してください。

【タスク - 内部処理として実行、出力しない】
1. スクリーンショット内の会話内容を読み取る
2. 最後に女性が送ったメッセージを特定する

【出力 - 返信候補のみ】
解析結果や会話の説明は一切出力しないでください。
返信候補3つのみを出力してください。

${basePrompt}`;

            result = await model.generateContent([
                { text: imagePrompt },
                {
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: image
                    }
                }
            ]);
        } else {
            // テキストメッセージの場合
            result = await model.generateContent([
                { text: basePrompt },
                { text: `女性からのメッセージ: ${message}` },
            ]);
        }

        const response = result.response;
        const text = response.text();

        return NextResponse.json({ suggestions: text });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("API Error:", errorMessage);
        console.error("Full error:", error);
        return NextResponse.json(
            { error: `返信の生成に失敗しました: ${errorMessage}` },
            { status: 500 }
        );
    }
}
