import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const { nickname, pw, ip } = await req.json();

  // IP 차단 체크
  const { data: banned } = await supabase
    .from("banned_ips")
    .select("id")
    .eq("ip", ip)
    .single();
  if (banned) {
    return NextResponse.json({ error: "이 IP는 차단되었습니다." }, { status: 403 });
  }

  // 닉네임+비밀번호 확인
  const { data: user } = await supabase
    .from("users")
    .select("id, nickname, profile_image")
    .eq("nickname", nickname)
    .eq("pw", pw)
    .single();
  if (!user) {
    return NextResponse.json({ error: "닉네임 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  return NextResponse.json({ success: true, user });
} 