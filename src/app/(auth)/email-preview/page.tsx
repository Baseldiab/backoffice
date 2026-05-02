import Link from 'next/link';

const EMAIL_PREVIEWS = [
  {
    title: 'Team Invitation',
    description: 'Sent when a team member invites a new user to the platform.',
    href: '/email-preview/invite',
    status: 'ready' as const,
    subject: "You've been invited to join Highlit BackOffice",
  },
  {
    title: 'Welcome Email',
    description: 'Sent after a user completes account setup.',
    href: '/email-preview/welcome',
    status: 'placeholder' as const,
    subject: 'Welcome to Highlit BackOffice',
  },
  {
    title: 'Password Reset',
    description: 'Sent when a user requests a password reset.',
    href: '/email-preview/reset',
    status: 'placeholder' as const,
    subject: 'Reset your Highlit BackOffice password',
  },
];

export default function EmailPreviewIndexPage() {
  return (
    <div
      style={{
        fontFamily: "'Inter', Arial, sans-serif",
        backgroundColor: '#050505',
        minHeight: '100vh',
        padding: '40px 24px',
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: '#3ECF8E',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ color: '#000', fontWeight: '700', fontSize: '15px' }}>H</span>
            </div>
            <span style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '16px' }}>Highlit</span>
          </div>
          <h1
            style={{
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              letterSpacing: '-0.4px',
            }}
          >
            Email Previews
          </h1>
          <p style={{ color: '#666666', fontSize: '14px', margin: '0' }}>
            Transactional email templates for Highlit BackOffice.
          </p>
        </div>

        {/* Email list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {EMAIL_PREVIEWS.map((email) => (
            <div
              key={email.href}
              style={{
                backgroundColor: '#0d0d0d',
                border: '1px solid #1a1a1a',
                borderRadius: '10px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: '600' }}>
                    {email.title}
                  </span>
                  <span
                    style={{
                      backgroundColor:
                        email.status === 'ready' ? 'rgba(62, 207, 142, 0.12)' : '#1a1a1a',
                      color: email.status === 'ready' ? '#3ECF8E' : '#555555',
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '2px 8px',
                      borderRadius: '100px',
                      border: `1px solid ${email.status === 'ready' ? 'rgba(62, 207, 142, 0.25)' : '#2a2a2a'}`,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {email.status === 'ready' ? 'Ready' : 'Placeholder'}
                  </span>
                </div>
                <p style={{ color: '#555555', fontSize: '13px', margin: '0 0 6px 0' }}>
                  {email.description}
                </p>
                <p
                  style={{
                    color: '#333333',
                    fontSize: '12px',
                    margin: '0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Subject: {email.subject}
                </p>
              </div>

              {email.status === 'ready' ? (
                <Link
                  href={email.href}
                  style={{
                    backgroundColor: '#1a1a1a',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '500',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    border: '1px solid #2a2a2a',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Preview →
                </Link>
              ) : (
                <span
                  style={{
                    backgroundColor: '#111111',
                    color: '#333333',
                    fontSize: '13px',
                    fontWeight: '500',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #1a1a1a',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    cursor: 'not-allowed',
                  }}
                >
                  Coming Soon
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{ color: '#333333', fontSize: '12px', marginTop: '32px', textAlign: 'center' }}>
          For development use only · Highlit BackOffice
        </p>
      </div>
    </div>
  );
}
