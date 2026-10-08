"use client";

import Link from "next/link";
import { useState } from "react";
import { challenges } from "@/data/challenges";
import { useSite } from "@/components/layout/site-shell";
export function ChallengeBoard() {
  const { user } = useSite();
  const [joined, setJoined] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  return (
    <>
      <p className="demo-notice">
        참여자 수와 챌린지는 예시 데이터입니다. 데모 로그인 후 참여할 수 있으며 새로고침하면 기록이
        초기화됩니다.
      </p>
      <div className="three-column challenge-grid">
        {challenges.map((challenge, index) => {
          const participating = joined.includes(challenge.id);
          return (
            <article className="challenge-card" key={challenge.id}>
              <div className={`challenge-art carousel-${challenge.accent}`}>
                <span>0{index + 1}</span>
                <p>{challenge.category}</p>
              </div>
              <div className="challenge-body">
                <p className="eyebrow">
                  {challenge.duration} · {challenge.members + (participating ? 1 : 0)}명 참여
                </p>
                <h2>{challenge.title}</h2>
                <p>{challenge.description}</p>
                {participating ? (
                  <>
                    <ul className="challenge-tasks">
                      {challenge.tasks.map((task, taskIndex) => {
                        const taskId = `${challenge.id}-${taskIndex}`;
                        return (
                          <li key={taskId}>
                            <label>
                              <input
                                type="checkbox"
                                checked={completed.includes(taskId)}
                                onChange={(event) =>
                                  setCompleted((previous) =>
                                    event.target.checked
                                      ? [...previous, taskId]
                                      : previous.filter((id) => id !== taskId),
                                  )
                                }
                              />
                              {task}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                    <p role="status" className="correct">
                      오늘의 목표{" "}
                      {completed.filter((id) => id.startsWith(`${challenge.id}-`)).length} / 3 완료
                    </p>
                    <button
                      className="text-button"
                      onClick={() => {
                        setJoined((previous) => previous.filter((id) => id !== challenge.id));
                        setCompleted((previous) =>
                          previous.filter((id) => !id.startsWith(`${challenge.id}-`)),
                        );
                      }}
                    >
                      참여 취소
                    </button>
                  </>
                ) : user ? (
                  <button
                    className="primary-button"
                    onClick={() => setJoined((previous) => [...previous, challenge.id])}
                  >
                    챌린지 참여하기
                  </button>
                ) : (
                  <Link className="primary-button" href="/login">
                    로그인하고 참여하기
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
