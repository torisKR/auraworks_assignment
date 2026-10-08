const information: Record<string, string> = {
  "히든카이스 소개":
    "상위권이 선택한 문제집, 결과로 증명된 실전 대비서. 히든카이스와 함께 실력을 완성하세요.",
  회사소개:
    "상위권이 선택한 문제집, 결과로 증명된 실전 대비서. 히든카이스와 함께 실력을 완성하세요.",
  알림: "2026 Hidden Kice 시즌7 교재가 업데이트되었습니다.",
};

export function InfoContent({ title }: { title: string }) {
  return (
    <div className="info-content">
      <p>
        {information[title] ??
          "더 나은 학습 경험을 준비하고 있습니다. 새로운 소식은 이곳에서 안내해 드릴게요."}
      </p>
    </div>
  );
}
