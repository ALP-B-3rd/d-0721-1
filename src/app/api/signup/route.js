import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const { nickname, pw, profile_image, ip } = await req.json();

  if (!pw || pw.length < 8) {
    return NextResponse.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
  }

  // IP 차단 체크
  const { data: banned } = await supabase
    .from("banned_ips")
    .select("id")
    .eq("ip", ip)
    .single();
  if (banned) {
    return NextResponse.json({ error: "이 IP는 차단되었습니다." }, { status: 403 });
  }

  // 닉네임 중복 체크
  const { data: exist } = await supabase
    .from("users")
    .select("id")
    .eq("nickname", nickname)
    .single();
  if (exist) {
    return NextResponse.json({ error: "이미 사용 중인 닉네임입니다." }, { status: 409 });
  }

  // 회원가입
  const { error } = await supabase.from("users").insert([
    { nickname, pw, profile_image, ip }
  ]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 