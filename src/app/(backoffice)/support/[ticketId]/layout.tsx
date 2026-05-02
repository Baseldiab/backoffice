export default function TicketLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col min-h-screen bg-background">{children}</div>;
}
