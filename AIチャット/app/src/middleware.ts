import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: ["/:path*"],
};

export function middleware(req: NextRequest) {
    // 環境変数が設定されていない場合は認証をスキップ（開発環境など）
    const basicAuthUser = process.env.BASIC_AUTH_USER;
    const basicAuthPassword = process.env.BASIC_AUTH_PASSWORD;

    if (!basicAuthUser || !basicAuthPassword) {
        return new NextResponse(
            "Configuration Error: BASIC_AUTH_USER and BASIC_AUTH_PASSWORD must be set in Vercel Environment Variables.",
            { status: 500 }
        );
    }

    const basicAuth = req.headers.get("authorization");

    if (basicAuth) {
        const authValue = basicAuth.split(" ")[1];
        const [user, pwd] = atob(authValue).split(":");

        if (user === basicAuthUser && pwd === basicAuthPassword) {
            return NextResponse.next();
        }
    }

    // 認証失敗時、または未入力時は401を返してログインプロンプトを表示
    return new NextResponse("Authentication required", {
        status: 401,
        headers: {
            "WWW-Authenticate": 'Basic realm="Secure Area"',
        },
    });
}
