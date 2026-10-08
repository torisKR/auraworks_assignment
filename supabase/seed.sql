-- Re-runnable seed for the dedicated assignment project.
-- Prices and the 5% badge preserve the supplied screen's display values.
-- The badge is campaign copy, not a percentage computed from the two prices.
insert into public.textbooks (
  id, title, category, subject, description, image_path,
  price, original_price, discount_percent, display_order
)
values
  ('a0000000-0000-4000-8000-000000000001', '2026 Hidden Kice 시즌7', 'single', '국어', '2026 시즌7 국어 실전 대비 단품 교재입니다.', '/images/textbook-single.png', 40000, null, 0, 1),
  ('a0000000-0000-4000-8000-000000000002', '2026 Hidden Kice 시즌7', 'pass', '수학', '난이도별 수학 교재로 구성된 시즌7 패스입니다.', '/images/textbook-pass.png', 64800, 76000, 5, 2),
  ('a0000000-0000-4000-8000-000000000003', '2026 Hidden Kice 시즌7', 'pass', '영어', '단계별 영어 학습을 위한 시즌7 교재 패스입니다.', '/images/textbook-pass.png', 64800, 76000, 5, 3),
  ('a0000000-0000-4000-8000-000000000004', '2026 Hidden Kice 시즌7', 'pass', '국어', '실전 문제와 해설로 구성된 시즌7 국어 패스입니다.', '/images/textbook-single.png', 64800, 76000, 5, 4),
  ('a0000000-0000-4000-8000-000000000005', '2026 Hidden Kice 시즌7', 'pass', '수학 심화', '상위권 실전 대비를 위한 시즌7 수학 심화 패스입니다.', '/images/textbook-single.png', 64800, 76000, 5, 5),
  ('a0000000-0000-4000-8000-000000000006', '2026 Hidden Kice 시즌7', 'pass', '과학탐구', '과학탐구 교재로 구성된 시즌7 학습 패스입니다.', '/images/textbook-pass.png', 64800, 76000, 5, 6),
  ('a0000000-0000-4000-8000-000000000007', '2026 Hidden Kice 시즌7', 'single', '수학', '2026 시즌7 수학 실전 대비 단품 교재입니다.', '/images/textbook-single.png', 40000, null, 0, 7),
  ('a0000000-0000-4000-8000-000000000008', '2026 Hidden Kice 시즌7', 'pass', '사회탐구', '사회탐구 교재로 구성된 시즌7 학습 패스입니다.', '/images/textbook-pass.png', 64800, 76000, 5, 8),
  ('a0000000-0000-4000-8000-000000000009', '2026 Hidden Kice 시즌7', 'single', '영어', '2026 시즌7 영어 실전 대비 단품 교재입니다.', '/images/textbook-single.png', 40000, null, 0, 9),
  ('a0000000-0000-4000-8000-000000000010', '2026 Hidden Kice 시즌7', 'pass', '국어 심화', '심화 문제와 해설로 구성된 시즌7 국어 패스입니다.', '/images/textbook-pass.png', 64800, 76000, 5, 10),
  ('a0000000-0000-4000-8000-000000000011', '2026 Hidden Kice 시즌7', 'pass', '수학 종합', '실전 대비 문제집을 묶은 시즌7 수학 종합 패스입니다.', '/images/textbook-pass.png', 64800, 76000, 5, 11),
  ('a0000000-0000-4000-8000-000000000012', '2026 Hidden Kice 시즌7', 'pass', '영어 심화', '난이도별 실전 문제로 구성된 시즌7 영어 심화 패스입니다.', '/images/textbook-single.png', 64800, 76000, 5, 12)
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  subject = excluded.subject,
  description = excluded.description,
  image_path = excluded.image_path,
  price = excluded.price,
  original_price = excluded.original_price,
  discount_percent = excluded.discount_percent,
  display_order = excluded.display_order;
