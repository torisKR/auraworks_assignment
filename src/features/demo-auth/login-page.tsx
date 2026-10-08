"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useSite } from "@/components/layout/site-shell";

export function LoginPage() {
  const { user, signIn, signOut } = useSite();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim().toLowerCase() !== "demo@hiddenkice.test" || password !== "hiddenkice2026") {
      setError("아래에 안내된 데모 계정으로 로그인해 주세요.");
      return;
    }
    setPassword("");
    setError("");
    signIn();
  }
  if (user)
    return (
      <div className="login-page">
        <section className="login-card">
          <p className="eyebrow">MY HIDDEN KICE</p>
          <h1>{user.name}님, 반가워요</h1>
          <p>{user.email}</p>
          <div className="demo-notice">데모 로그인 상태입니다. 새로고침하면 로그아웃됩니다.</div>
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
  return (
    <div className="login-page">
      <section className="login-card">
        <p className="eyebrow">WELCOME BACK</p>
        <h1>나의 다음 성장을 위해</h1>
        <p className="muted">히든카이스와 함께 학습을 시작하세요.</p>
        <div className="demo-notice">
          과제용 더미 로그인입니다. 실제 계정과 비밀번호를 입력하지 마세요.
          <br />
          <strong>demo@hiddenkice.test / hiddenkice2026</strong>
        </div>
        <form onSubmit={submit}>
          <label htmlFor="login-email">이메일</label>
          <input
            id="login-email"
            type="email"
            autoComplete="off"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="demo@hiddenkice.test"
          />
          <label htmlFor="login-password">데모 비밀번호</label>
          <input
            id="login-password"
            type="password"
            autoComplete="off"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="hiddenkice2026"
          />
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="primary-button" type="submit">
            데모 계정으로 로그인
          </button>
        </form>
        <button
          className="secondary-button"
          onClick={() => {
            setPassword("");
            setError("");
            signIn();
          }}
        >
          입력 없이 데모 체험하기
        </button>
        <p className="dialog-note">입력값을 서버에 보내거나 저장하지 않습니다.</p>
        <Link className="text-button" href="/privacy">
          개인정보처리 안내
        </Link>
      </section>
    </div>
  );
}
