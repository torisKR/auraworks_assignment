import Link from "next/link";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  publishedAt: string;
  href: string;
  actionLabel: string;
  isRead: boolean;
};

type NotificationListProps = {
  items: readonly NotificationItem[];
  onNavigate: () => void;
};

export function NotificationList({ items, onNavigate }: NotificationListProps) {
  if (items.length === 0)
    return <p className="muted">새로운 소식이 도착하면 이곳에서 알려드릴게요.</p>;

  return (
    <ul className="notification-list">
      {items.map((item) => (
        <li key={item.id} className="notification-item" data-read={item.isRead}>
          <div className="notification-meta">
            <time dateTime={item.publishedAt}>{item.publishedAt.replaceAll("-", ".")}</time>
            <span>{item.isRead ? "읽음" : "새 소식"}</span>
          </div>
          <h3>{item.title}</h3>
          <p>{item.message}</p>
          <Link className="text-button" href={item.href} onClick={onNavigate}>
            {item.actionLabel} <span aria-hidden="true">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
