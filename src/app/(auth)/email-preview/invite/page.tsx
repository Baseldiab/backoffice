import Link from 'next/link';

const TEST_DATA = {
  inviterName: 'Sarah Al-Mutairi',
  inviterEmail: 'sarah@highlit.io',
  inviteeName: 'Omar Al-Rashidi',
  role: 'Support Agent',
  company: 'Highlit',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function InviteEmailTemplate({
  inviterName,
  inviterEmail,
  inviteeName,
  role,
  company,
}: typeof TEST_DATA) {
  const initials = getInitials(inviteeName);

  return (
    <div
      style={{
        fontFamily: "'Inter', Arial, sans-serif",
        backgroundColor: '#050505',
        padding: '40px 20px',
        minHeight: '100vh',
      }}
    >
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      {/* Email container */}
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#0A0A0A',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            backgroundColor: '#0A0A0A',
            padding: '32px',
            borderBottom: '1px solid #1a1a1a',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* H mark */}
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#3ECF8E',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: '#000000',
                  fontWeight: '700',
                  fontSize: '18px',
                  lineHeight: '1',
                }}
              >
                H
              </span>
            </div>
            {/* Brand name */}
            <span
              style={{
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: '18px',
                letterSpacing: '-0.3px',
              }}
            >
              Highlit
            </span>
          </div>
          <p
            style={{
              color: '#888888',
              fontSize: '13px',
              margin: '6px 0 0 0',
              paddingLeft: '42px',
            }}
          >
            BackOffice Platform
          </p>
        </div>

        {/* HERO SECTION */}
        <div
          style={{
            backgroundColor: '#111111',
            padding: '40px 32px',
            textAlign: 'center',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#1a1a1a',
              border: '2px solid #3ECF8E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
            }}
          >
            <span
              style={{
                color: '#3ECF8E',
                fontWeight: '600',
                fontSize: '20px',
                letterSpacing: '0.5px',
              }}
            >
              {initials}
            </span>
          </div>

          {/* Heading */}
          <h1
            style={{
              color: '#FFFFFF',
              fontSize: '22px',
              fontWeight: '700',
              margin: '0 0 16px 0',
              lineHeight: '1.3',
              letterSpacing: '-0.3px',
            }}
          >
            {inviterName} invited you to join Highlit BackOffice
          </h1>

          {/* Subtext */}
          <p
            style={{
              color: '#888888',
              fontSize: '15px',
              lineHeight: '1.6',
              margin: '0',
              maxWidth: '440px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            You&apos;ve been invited to join the{' '}
            <strong style={{ color: '#aaaaaa' }}>{company}</strong> team as a{' '}
            <strong style={{ color: '#aaaaaa' }}>{role}</strong>. Click the button below to accept
            your invitation and complete your account setup.
          </p>
        </div>

        {/* DETAILS CARD */}
        <div
          style={{
            backgroundColor: '#111111',
            padding: '0 32px',
          }}
        >
          <div
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            {/* Row 1: Invited by */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '16px',
                borderBottom: '1px solid #2a2a2a',
                marginBottom: '16px',
              }}
            >
              <span style={{ color: '#666666', fontSize: '13px', fontWeight: '500' }}>
                Invited by
              </span>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'block',
                  }}
                >
                  {inviterName}
                </span>
                <span style={{ color: '#888888', fontSize: '12px' }}>{inviterEmail}</span>
              </div>
            </div>

            {/* Row 2: Role */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '16px',
                borderBottom: '1px solid #2a2a2a',
                marginBottom: '16px',
              }}
            >
              <span style={{ color: '#666666', fontSize: '13px', fontWeight: '500' }}>
                Your Role
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(62, 207, 142, 0.12)',
                  color: '#3ECF8E',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  border: '1px solid rgba(62, 207, 142, 0.25)',
                }}
              >
                {role}
              </span>
            </div>

            {/* Row 3: Platform */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: '#666666', fontSize: '13px', fontWeight: '500' }}>
                Platform
              </span>
              <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '500' }}>
                Highlit BackOffice
              </span>
            </div>
          </div>
        </div>

        {/* CTA BUTTON */}
        <div style={{ padding: '24px 32px 0 32px' }}>
          <a
            href="#"
            style={{
              display: 'block',
              backgroundColor: '#3ECF8E',
              color: '#000000',
              textAlign: 'center',
              textDecoration: 'none',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              letterSpacing: '-0.2px',
            }}
          >
            Accept Invitation →
          </a>
        </div>

        {/* EXPIRY WARNING */}
        <div style={{ padding: '16px 32px 32px 32px' }}>
          <div
            style={{
              backgroundColor: '#1a1a1a',
              borderLeft: '3px solid #f59e0b',
              borderRadius: '0 6px 6px 0',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '14px', flexShrink: 0 }}>⚠</span>
            <span style={{ color: '#f59e0b', fontSize: '13px', lineHeight: '1.4' }}>
              This invitation expires in <strong>48 hours</strong>.
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            backgroundColor: '#0A0A0A',
            padding: '24px 32px',
            borderTop: '1px solid #1a1a1a',
          }}
        >
          <p
            style={{
              color: '#555555',
              fontSize: '13px',
              margin: '0 0 8px 0',
              lineHeight: '1.5',
            }}
          >
            If you didn&apos;t expect this invitation, you can safely ignore this email.
          </p>
          <p
            style={{
              color: '#444444',
              fontSize: '12px',
              margin: '0 0 16px 0',
            }}
          >
            © 2026 Highlit Platform · Internal Use Only
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{ color: '#3ECF8E', fontSize: '12px', textDecoration: 'none' }}>
              Privacy Policy
            </a>
            <span style={{ color: '#333333', fontSize: '12px' }}>·</span>
            <a href="#" style={{ color: '#3ECF8E', fontSize: '12px', textDecoration: 'none' }}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InviteEmailPreviewPage() {
  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh' }}>
      {/* Preview toolbar */}
      <div
        style={{
          backgroundColor: '#0d0d0d',
          borderBottom: '1px solid #1a1a1a',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/email-preview"
            style={{ color: '#888888', fontSize: '13px', textDecoration: 'none' }}
          >
            ← Email Previews
          </Link>
          <span style={{ color: '#333333' }}>·</span>
          <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '500' }}>
            Team Invitation
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              backgroundColor: '#1a1a1a',
              color: '#888888',
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: '100px',
              border: '1px solid #2a2a2a',
            }}
          >
            Subject: You&apos;ve been invited to join Highlit BackOffice
          </span>
        </div>
      </div>

      {/* Email preview */}
      <InviteEmailTemplate {...TEST_DATA} />
    </div>
  );
}
