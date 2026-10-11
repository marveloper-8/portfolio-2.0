import "./globals.css";

export const metadata = {
  metadataBase: new URL('https://nexalabs.site'),
  title: "Joshua Samuel Equere | Senior Software Engineer",
  description: "Senior Software Engineer specializing in mobile apps, web platforms, high-concurrency servers (Go, Python), and cloud architecture (AWS). Founder of NexaLabs.",
  keywords: [
    "Joshua Samuel Equere",
    "Senior Software Engineer",
    "Go",
    "Golang",
    "React Native",
    "Next.js",
    "NexaLabs",
    "Distributed Systems",
    "Cloud Architecture"
  ],
  authors: [{ name: "Joshua Samuel Equere" }],
  openGraph: {
    title: "Joshua Samuel Equere | Senior Software Engineer",
    description: "Building complete digital products from start to finish. Mobile apps, web platforms, robust servers, and scalable cloud infrastructure.",
    url: "https://nexalabs.site",
    siteName: "Joshua Samuel Equere",
    images: [
      {
        url: "/nexalabs-long.png",
        width: 1200,
        height: 630,
        alt: "Joshua Samuel Equere Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
