import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://josh.trynexalabs.com';
const SITE_DESC = "Running 17+ services on a $14 server. Scaled production systems to $10M+ daily volume, 10k+ concurrent players, and 1M+ daily actions at 65% lower latency.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Joshua Equere | Senior Software Engineer",
  description: SITE_DESC,
  keywords: [
    "Joshua Equere",
    "Joshua Samuel Equere",
    "Senior Software Engineer",
    "Full Stack Engineer",
    "Go",
    "Golang",
    "React Native",
    "Next.js",
    "Distributed Systems",
    "Cloud Architecture",
    "NexaLabs"
  ],
  authors: [{ name: "Joshua Samuel Equere" }],
  openGraph: {
    title: "Joshua Equere | Senior Software Engineer",
    description: SITE_DESC,
    url: SITE_URL,
    siteName: "Joshua Equere",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        secureUrl: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Joshua Equere | Senior Software Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joshua Equere | Senior Software Engineer",
    description: SITE_DESC,
    images: [`${SITE_URL}/og-image.jpg`],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content={SITE_DESC} />
        <meta property="og:description" content={SITE_DESC} />
        <meta name="twitter:description" content={SITE_DESC} />
        <meta property="og:image" content={`${SITE_URL}/og-image.jpg`} />
        <meta property="og:image:secure_url" content={`${SITE_URL}/og-image.jpg`} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Joshua Equere | Senior Software Engineer" />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.jpg`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alata&family=Anybody:wght@700;800;900&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="paper-grain">
        {children}
      </body>
    </html>
  );
}
