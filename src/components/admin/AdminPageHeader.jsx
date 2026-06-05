export default function AdminPageHeader({ title, subtitle, action }) {
  return (
    <header className="admin-page-header">
      <div className="admin-page-header__text">
        <h1 className="admin-page-title">{title}</h1>
        {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="admin-page-header__action">{action}</div>}
    </header>
  );
}
