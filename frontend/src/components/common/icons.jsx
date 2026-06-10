export function StarFilledIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="currentColor"
      />
    </svg>
  )
}

export function EmailSentIcon() {
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <div
        style={{
          width: '5rem',
          height: '5rem',
          borderRadius: '9999px',
          backgroundColor: 'var(--color-gray-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          style={{ width: '2.25rem', height: '2.25rem', color: 'var(--color-primary)' }}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M2 7l10 7 10-7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span
        style={{
          position: 'absolute',
          bottom: 0,
          right: '-2px',
          width: '1.5rem',
          height: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          style={{ width: '1.5rem', height: '1.5rem', display: 'block' }}
        >
          <circle cx="10" cy="10" r="10" style={{ fill: 'var(--color-ok)' }} />
          <path
            d="M5.5 10.5l3 3 6-6"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  )
}
