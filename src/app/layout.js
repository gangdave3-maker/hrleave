import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css"
import Image from "next/image";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
});

export const metadata = {
  // 🔁 replace with real domain
  metadataBase: new URL("https://musicstation.vercel.app/"),

  title: {
    default:
      "Online Music Player - Graduation Project | Online Music Player by Pichaiyut Sirianantawong",
    template: "%s | Music Station", // Automatically turns "Batman" into "Batman | MovieRent"
  },

  description:
    "Music Station is a Graduation Project developed by Pichaiyut Sirianantawong. A full-stack online music player web application built with Next.js featuring authentication, registration system, and responsive design.",

  keywords: [
    "Graduation Project",
    "Music Station",
    "Next.js Project",
    "Web Application",
    "Full Stack Developer",
    "Pichaiyut Sirianantawong",
  ],

  authors: [{ name: "Pichaiyut Sirianantawong" }],

  // For Google SEO
  // verification: {
  //   google: "REk6xtiXewFp7ne3ODKwuVQPDI2aKzVo5VgPU072zaU",
  // },

//   In Next.js, the openGraph object is used to define Open Graph metadata. This metadata controls how your website appears when someone shares your link on social media platforms such as Facebook, LinkedIn, Discord, or X (Twitter).
// Open Graph is a protocol originally developed by Meta Platforms to make links display nicely when shared.
// In Next.js App Router, you usually define it inside the metadata object.
  openGraph: {
    title:
      "Music Player - Online Music Station | Graduation Project",
    description:
      "A full-stack music player web application built with Next.js as a graduation project.",
    url: "https://musicstation.vercel.app/",
    siteName: "Music Station",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Music Station - Graduation Project",
    description:
      "Full-stack music player built with Next.js.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} antialiased lay`}>
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}