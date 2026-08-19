"use client";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="social-profile-embed__platform" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M13.32 19.2v-6.36h2.14l.32-2.48h-2.46V8.78c0-.72.2-1.2 1.24-1.2h1.32V5.36c-.23-.03-1.02-.1-1.94-.1-1.92 0-3.24 1.17-3.24 3.32v1.86H8.4v2.48h2.3V19.2h2.62z"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="social-profile-embed__platform" aria-hidden>
      <rect width="24" height="18" x="0" y="3" rx="4" fill="#FF0000" />
      <path fill="#fff" d="M15.4 12 10 8.7v6.6L15.4 12z" />
    </svg>
  );
}

export default function SocialProfileEmbed({
  platform,
  handle,
  displayName,
  stats,
  profileUrl,
  avatarSrc,
  items = [],
  loading = false,
}) {
  const cells = loading ? Array.from({ length: 9 }, (_, i) => ({ key: i })) : items.slice(0, 9);

  return (
    <div className="social-profile-embed">
      <div className="social-profile-embed__head">
        <a href={profileUrl} target="_blank" rel="noopener noreferrer">
          <img src={avatarSrc} alt="" width={50} height={50} className="social-profile-embed__avatar" />
        </a>
        <div className="social-profile-embed__meta">
          <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="social-profile-embed__handle">
            {handle}
          </a>
          <p className="social-profile-embed__name">{displayName}</p>
          {stats ? <p className="social-profile-embed__stats">{stats}</p> : null}
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="social-profile-embed__brand"
          aria-label={platform}
        >
          {platform === "facebook" ? <FacebookIcon /> : <YouTubeIcon />}
        </a>
      </div>

      <div className="social-profile-embed__grid">
        {cells.map((item, index) =>
          loading || !item?.image ? (
            <div key={item.key ?? index} className="social-profile-embed__cell is-skeleton" />
          ) : (
            <a
              key={item.href + index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-profile-embed__cell"
              title={item.title}
            >
              <img src={item.image} alt={item.title || ""} />
              {item.isVideo ? (
                <span className="social-profile-embed__play" aria-hidden>
                  ▶
                </span>
              ) : null}
            </a>
          )
        )}
      </div>
    </div>
  );
}
