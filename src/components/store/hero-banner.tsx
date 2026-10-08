"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { heroSlides } from "@/data/hero-slides";

export function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const slide = heroSlides[index];
  function move(direction: number) {
    setIndex((current) => (current + direction + heroSlides.length) % heroSlides.length);
  }

  useEffect(() => {
    if (!playing || interacting) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % heroSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [playing, interacting]);

  return (
    <section
      className="hero carousel"
      aria-label="히든카이스 추천 소식"
      aria-roledescription="캐러셀"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false);
      }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowLeft") move(-1);
        if (event.key === "ArrowRight") move(1);
      }}
      tabIndex={0}
    >
      <div aria-live={playing ? "off" : "polite"} aria-atomic="true">
        <div
          className={`carousel-slide carousel-${slide.theme}`}
          role="group"
          aria-roledescription="슬라이드"
          aria-label={`${index + 1} / ${heroSlides.length}`}
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
              />
              <Link className="hero-link" href={slide.href} aria-label="히든카이스 시리즈 보기">
                <span className="sr-only">히든카이스 시리즈 보기</span>
              </Link>
            </>
          ) : (
            <div className="carousel-editorial">
              <div>
                <p className="eyebrow">{slide.eyebrow}</p>
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <Link className="primary-button" href={slide.href}>
                  {slide.action} →
                </Link>
              </div>
              <Image
                src={slide.image}
                alt="히든카이스 시즌7 교재"
                width={300}
                height={384}
                sizes="(max-width: 600px) 32vw, 300px"
              />
            </div>
          )}
        </div>
      </div>
      <div className="carousel-controls">
        <button aria-label="이전 슬라이드" onClick={() => move(-1)}>
          ←
        </button>
        <span>
          {index + 1} / {heroSlides.length}
        </span>
        <button aria-label="다음 슬라이드" onClick={() => move(1)}>
          →
        </button>
        <button
          aria-label={playing ? "자동 재생 정지" : "자동 재생 시작"}
          onClick={() => setPlaying((value) => !value)}
        >
          {playing ? "Ⅱ" : "▶"}
        </button>
      </div>
      <div className="carousel-dots" aria-label="슬라이드 선택">
        {heroSlides.map((item, position) => (
          <button
            key={item.title}
            aria-label={`${position + 1}번 슬라이드: ${item.eyebrow}`}
            aria-pressed={index === position}
            onClick={() => {
              setIndex(position);
              setPlaying(false);
            }}
          />
        ))}
      </div>
    </section>
  );
}
