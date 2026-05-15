import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const rateLimitMap = new Map<string, { attempts: number, lockUntil: number }>();

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const key = 'global_admin';
    const record = rateLimitMap.get(key) || { attempts: 0, lockUntil: 0 };

    if (Date.now() < record.lockUntil) {
      const remainingSeconds = Math.ceil((record.lockUntil - Date.now()) / 1000);
      return NextResponse.json({ error: `تم حظر الدخول مؤقتاً. يرجى الانتظار ${remainingSeconds} ثانية.` }, { status: 429 });
    }

    if (password === 'phar123@#') {
      record.attempts = 0;
      rateLimitMap.set(key, record);
      
      // Session-only cookie: no maxAge / expires → deleted when browser closes
      cookies().set("admin_auth", "secret_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        // maxAge intentionally omitted → session cookie (browser-close = logout)
      });
      
      return NextResponse.json({ success: true });
    } else {
      record.attempts += 1;
      if (record.attempts >= 5) {
        // Lock for 2 minutes
        record.lockUntil = Date.now() + 2 * 60 * 1000;
      }
      rateLimitMap.set(key, record);
      return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
