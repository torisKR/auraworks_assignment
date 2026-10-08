"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { heroSlides } from "@/data/hero-slides";

const SLIDE_DURATION = 6000;
const SLIDE_COUNT = heroSlides.length;
const reduceMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(notify: () => void) {
  const preference = window.matchMedia(reduceMotionQuery);
  preference.addEventListener("change", notify);
  return () => preference.removeEventListener("change", notify);
}
function subscribeToVisibility(notify: () => void) {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
}
function wrapIndex(index: number) {
  return (index + SLIDE_COUNT) % SLIDE_COUNT;
}
function slideOffset(position: number, current: number) {
  const offset = wrapIndex(position - current);
  return offset > SLIDE_COUNT / 2 ? offset - SLIDE_COUNT : offset;
}

type Gesture = {
  pointerId: number;
  x: number;
  y: number;
  startedAt: number;
  distance: number;
  dragging: boolean;
};

export function HeroBanner() {
  const [view, setView] = useState({ index: 0, previous: 0, instant: true });
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const gesture = useRef<Gesture | null>(null);
  const dragLayer = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const elapsed = useRef(0);
  const suppressClick = useRef(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia(reduceMotionQuery).matches,
    () => false,
  );
  const hidden = useSyncExternalStore(
    subscribeToVisibility,
    () => document.hidden,
    () => false,
  );
  const running = playing && !hovered && !focused && !dragging && !hidden && !reducedMotion;

  const selectSlide = useCallback((index: number, instant = false) => {
    elapsed.current = 0;
    if (progress.current) progress.current.style.transform = "scaleX(0)";
    setView((current) => ({ index: wrapIndex(index), previous: current.index, instant }));
  }, []);

  function move(direction: number, instant = false) {
    selectSlide(view.index + direction, instant);
  }

  // Keep elapsed time across hover, focus and hidden-tab pauses; paint without a React render per frame.
  useEffect(() => {
    if (!running) return;
    let frame: number;
    let previousTime: number | null = null;
    function tick(time: number) {
      if (previousTime !== null) elapsed.current += time - previousTime;
      previousTime = time;
      if (elapsed.current >= SLIDE_DURATION) {
        selectSlide(view.index + 1);
        return;
      }
      if (progress.current) {
        progress.current.style.transform = `scaleX(${elapsed.current / SLIDE_DURATION})`;
      }
      frame = window.requestAnimationFrame(tick);
    }
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [running, selectSlide, view.index]);

  function beginGesture(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    suppressClick.current = false;
    if ((event.target as Element).closest("a, button, input, textarea, select")) return;
    gesture.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      startedAt: performance.now(),
      distance: 0,
      dragging: false,
    };
  }

  function dragGesture(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const distance = event.clientX - current.x;
    const verticalDistance = Math.abs(event.clientY - current.y);
    if (!current.dragging) {
      if (verticalDistance > 10 && verticalDistance > Math.abs(distance)) {
        gesture.current = null;
        return;
      }
      if (Math.abs(distance) < 8 || Math.abs(distance) < verticalDistance) return;
      current.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    current.distance = distance;
    if (dragLayer.current && !reducedMotion) {
      dragLayer.current.style.transform = `translateX(${distance * 0.65}px)`;
    }
  }

  function finishGesture(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    gesture.current = null;
    if (!current.dragging) return;
    suppressClick.current = true;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (dragLayer.current) dragLayer.current.style.transform = "translateX(0)";
    const distance = Math.abs(current.distance);
    const velocity = distance / Math.max(performance.now() - current.startedAt, 1);
    const threshold = Math.max(40, event.currentTarget.clientWidth * 0.08);
    if (!cancelled && (distance >= threshold || (distance > 20 && velocity > 0.35))) {
      move(current.distance < 0 ? 1 : -1);
    }
  }

  return (
    <section
      className="hero carousel"
      aria-label="히든카이스 추천 소식"
      aria-roledescription="캐러셀"
      aria-describedby="carousel-instructions"
      data-instant={view.instant || reducedMotion}
      data-dragging={dragging}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1, true);
        }
        if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          selectSlide(event.key === "Home" ? 0 : SLIDE_COUNT - 1, true);
        }
        if (event.key === "Escape") setPlaying(false);
      }}
      tabIndex={0}
    >
      <p className="sr-only" id="carousel-instructions">
        좌우 방향키 또는 좌우로 밀어서 소식을 이동하세요. 재생 버튼으로 자동 재생을 시작하거나 멈출
        수 있습니다. 자동 재생 중 마우스를 올리거나 초점을 이동하면 잠시 멈춥니다.
      </p>
      <div
        className="carousel-viewport"
        onPointerDown={beginGesture}
        onPointerMove={dragGesture}
        onPointerUp={(event) => finishGesture(event)}
        onPointerCancel={(event) => finishGesture(event, true)}
        onLostPointerCapture={(event) => finishGesture(event, true)}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={(event) => {
          if (suppressClick.current && event.detail > 0) {
            event.preventDefault();
            event.stopPropagation();
            suppressClick.current = false;
          }
        }}
      >
        <div className="carousel-drag-layer" ref={dragLayer}>
          {heroSlides.map((slide, position) => {
            const active = view.index === position;
            const offset = slideOffset(position, view.index);
            const Heading = active ? "h1" : "h2";
            return (
              <div
                key={slide.title}
                className={`carousel-slide carousel-${slide.theme}`}
                style={{ "--slide-offset": offset } as CSSProperties}
                data-active={active}
                data-visible={active || view.previous === position}
                aria-hidden={!active}
                inert={!active}
                role="group"
                aria-roledescription="슬라이드"
                aria-label={`${position + 1} / ${SLIDE_COUNT}: ${slide.eyebrow}`}
              >
                {slide.original ? (
                  <>
                    <h1 className="sr-only">{slide.title}</h1>
                    <Image
                      src={slide.image}
                      alt="상위권이 선택한 문제집, 결과로 증명된 실전 대비서. 실전 적중, 난이도별 구성, 검증된 결과."
                      width={1440}
                      height={490}
                      priority
                      sizes="100vw"
                      className="hero-image"
                      draggable={false}
                    />
                    <Link
                      className="hero-link"
                      href={slide.href}
                      aria-label="히든카이스 시리즈 보기"
                    >
                      <span className="sr-only">히든카이스 시리즈 보기</span>
                    </Link>
                  </>
                ) : (
                  <div className="carousel-editorial">
                    <div className="carousel-copy">
                      <p className="eyebrow">{slide.eyebrow}</p>
                      <Heading>{slide.title}</Heading>
                      <p>{slide.description}</p>
                      <Link className="primary-button" href={slide.href}>
                        {slide.action} <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                    <Image
                      src={slide.image}
                      alt="히든카이스 시즌7 교재"
                      width={300}
                      height={384}
                      sizes="(max-width: 600px) 32vw, 300px"
                      draggable={false}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="carousel-controls">
        <button aria-label="이전 슬라이드" onClick={(event) => move(-1, event.detail === 0)}>
          <span aria-hidden="true">←</span>
        </button>
        <span className="carousel-counter" aria-hidden="true">
          {String(view.index + 1).padStart(2, "0")} / {String(SLIDE_COUNT).padStart(2, "0")}
        </span>
        <button aria-label="다음 슬라이드" onClick={(event) => move(1, event.detail === 0)}>
          <span aria-hidden="true">→</span>
        </button>
        <button
          aria-label={
            reducedMotion
              ? "동작 줄이기 설정으로 자동 재생이 꺼져 있습니다"
              : playing
                ? "자동 재생 정지"
                : "자동 재생 시작"
          }
          aria-pressed={playing && !reducedMotion}
          disabled={reducedMotion}
          onClick={() => {
            if (!playing) setFocused(false);
            setPlaying(!playing);
          }}
        >
          <span aria-hidden="true">{playing && !reducedMotion ? "Ⅱ" : "▶"}</span>
        </button>
        <span
          className="carousel-progress"
          aria-hidden="true"
          data-playing={playing && !reducedMotion}
        >
          <span ref={progress} />
        </span>
      </div>
      <div className="carousel-dots" aria-label="슬라이드 선택">
        {heroSlides.map((item, position) => (
          <button
            key={item.title}
            aria-label={`${position + 1}번 슬라이드: ${item.eyebrow}`}
            aria-pressed={view.index === position}
            onClick={(event) => {
              selectSlide(position, event.detail === 0);
              setPlaying(false);
            }}
          />
        ))}
      </div>
      <p className="sr-only" aria-live={playing ? "off" : "polite"} aria-atomic="true">
        {view.index + 1} / {SLIDE_COUNT}. {heroSlides[view.index].title}
      </p>
    </section>
  );
}
