export const metadata = {
  title: "Pastebin Lite",
  description: "Simple Pastebin-like app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
