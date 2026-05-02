export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
          <h1>404 — Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <a href="/">Return home</a>
        </div>
      </body>
    </html>
  );
}
