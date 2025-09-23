import "../styles/globals.css";

export const metadata = {
  title: "YC Directory Data",
  description: "Browse, filter, and export Y Combinator company data",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "YC Directory Data",
    description: "Browse, filter, and export Y Combinator company data",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YC Directory Data - Browse, filter, and export Y Combinator company data",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YC Directory Data",
    description: "Browse, filter, and export Y Combinator company data",
    images: ["/og-image.png"],
  },
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
