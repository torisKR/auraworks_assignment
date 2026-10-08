"use client";

import { useState } from "react";
const questions = [
  { number: 1, correct: 3, topic: "핵심 개념의 이해" },
  { number: 2, correct: 1, topic: "자료 해석" },
  { number: 3, correct: 4, topic: "조건 분석" },
  { number: 4, correct: 2, topic: "문제 적용" },
  { number: 5, correct: 5, topic: "실전 종합" },
] as const;
export function OmrWorkspace() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [graded, setGraded] = useState(false);
  const correctCount = questions.filter(
    (question) => answers[question.number] === question.correct,
  ).length;
  const complete = questions.every((question) => answers[question.number] !== undefined);
  return (
    <div className="omr-layout">
      <section className="surface-card">
        <div className="section-heading">
          <h2>시즌7 답안 입력</h2>
          <span className="pill">국어 · 5문항 예시</span>
        </div>
        <p className="muted">각 문항의 답을 선택하고 결과를 확인해 보세요.</p>
        <div className="answer-sheet">
          {questions.map((question) => (
            <fieldset key={question.number}>
              <legend>{question.number}번</legend>
              {[1, 2, 3, 4, 5].map((option) => (
                <label
                  key={option}
                  className={
                    answers[question.number] === option ? "answer-option selected" : "answer-option"
                  }
                >
                  <input
                    type="radio"
                    name={`question-${question.number}`}
                    value={option}
                    checked={answers[question.number] === option}
                    onChange={() => {
                      setAnswers((previous) => ({ ...previous, [question.number]: option }));
                      setGraded(false);
                    }}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </fieldset>
          ))}
        </div>
        <div className="button-row">
          <button className="primary-button" disabled={!complete} onClick={() => setGraded(true)}>
            답안 채점하기
          </button>
          <button
            className="secondary-button"
            onClick={() => {
              setAnswers({});
              setGraded(false);
            }}
          >
            초기화
          </button>
        </div>
        <p className="dialog-note">
          실제 AI 분석이나 파일 업로드를 사용하지 않는 답안 채점 데모입니다.
        </p>
      </section>
      <section className="surface-card omr-result" aria-live="polite">
        <p className="eyebrow">YOUR LEARNING REPORT</p>
        <h2>오늘의 학습 리포트</h2>
        {graded ? (
          <>
            <strong className="score">
              {correctCount * 20}
              <small> / 100</small>
            </strong>
            <p>
              {questions.length}문항 중 {correctCount}문항 정답
            </p>
            <ul className="result-list">
              {questions.map((question) => (
                <li key={question.number}>
                  <span>
                    {question.number}번 · {question.topic}
                  </span>
                  <strong
                    className={
                      answers[question.number] === question.correct ? "correct" : "incorrect"
                    }
                  >
                    {answers[question.number] === question.correct
                      ? "정답"
                      : `오답 · 정답 ${question.correct}`}
                  </strong>
                </li>
              ))}
            </ul>
            <p className="demo-notice">틀린 문항을 다시 풀며 나만의 복습 루틴을 만들어 보세요.</p>
          </>
        ) : (
          <>
            <div className="empty-report">◎</div>
            <p className="muted">
              5문항의 답안을 입력하면
              <br />
              채점 결과가 여기에 표시됩니다.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
