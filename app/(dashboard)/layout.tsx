// app/(dashboard)/layout.tsx
// Layout for dashboard and jobs pages (no additional wrapper needed)

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
