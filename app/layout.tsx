import "../styles/globals.css";

export const metadata = {
  title: "YC Directory Data",
  description: "Explore YC directory data with preview and export options.",
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
