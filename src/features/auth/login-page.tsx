"use client";

import Link from "next/link";
import { useSite } from "@/components/layout/site-shell";

export function LoginPage() {
  const { user, signIn, signOut } = useSite();

  if (user) {
    return (
      <div className="login-page">
        <section className="login-card">
          <p className="eyebrow">MY HIDDEN KICE</p>
          <h1>{user.name}님, 반가워요</h1>
          <p className="muted">오늘도 나의 속도로, 한 걸음 더.</p>
          <div className="session-note">
            게스트로 이용 중입니다. 새로고침하면 학습 상태가 초기화됩니다.
          </div>
          <Link className="primary-button" href="/store">
            교재 둘러보기
          </Link>
          <Link className="secondary-button" href="/challenges">
            나의 챌린지
          </Link>
          <button className="text-button" onClick={signOut}>
            로그아웃
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="login-page">
      <section className="login-card">
        <p className="eyebrow">YOUR NEXT STEP</p>
        <h1>나의 다음 성장을 위해</h1>
        <p className="muted">히든카이스와 함께 나만의 학습 루틴을 시작하세요.</p>
        <div className="session-note">
          가입 없이 게스트로 시작할 수 있습니다.
          <br />
          회원 로그인은 준비 중입니다.
        </div>
        <button className="primary-button" onClick={signIn}>
          게스트로 시작하기
        </button>
        <Link className="secondary-button" href="/store">
          교재 먼저 둘러보기
        </Link>
        <p className="dialog-note">게스트 학습 상태는 현재 이용 중인 화면에서 유지됩니다.</p>
        <Link className="text-button" href="/privacy">
          개인정보처리 안내
        </Link>
      </section>
    </div>
  );
}
