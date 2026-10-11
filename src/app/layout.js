import "./globals.css";

export const metadata = {
  metadataBase: new URL('https://nexalabs.site'),
  title: "Joshua Equere | Senior Software Engineer",
  description: "i build scalable systems, ship clean apps, and let the code do the talking. senior software engineer & founder of nexalabs.",
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
    description: "i build scalable systems, ship clean apps, and let the code do the talking. senior software engineer & founder of nexalabs.",
    url: "https://nexalabs.site",
    siteName: "Joshua Equere",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Joshua Equere | Senior Software Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joshua Equere | Senior Software Engineer",
    description: "i build scalable systems, ship clean apps, and let the code do the talking. senior software engineer & founder of nexalabs.",
    images: ["/og-image.jpg"],
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
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:image:secure_url" content="/og-image.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Joshua Equere | Senior Software Engineer" />
        <meta name="twitter:image" content="/og-image.jpg" />
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
