// app/(root)/layout.tsx
// Layout for public-facing pages (homepage, etc.)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
