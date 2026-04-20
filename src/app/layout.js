import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css"
//import Image from "next/image";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
});

export const metadata = {
  // 🔁 replace with real domain
  metadataBase: new URL("https://daveleave.vercel.app/"),

  title: {
    default:
      "HR Leaving System - Graduation Project | Online HR Leaving System by Pichaiyut Sirianantawong",
    template: "%s | Leaving System", // Automatically turns "Batman" into "Batman | MovieRent"
  },

  description:
    "HR Leaving System is a Graduation Project developed by Pichaiyut Sirianantawong. A full-stack online leaving system web application built with Next.js featuring authentication, registration system, and responsive design.",

  keywords: [
    "Graduation Project",
    "HR Leaving System",
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
      "Leaving System - Online HR Leaving System | Graduation Project",
    description:
      "A full-stack leaving system web application built with Next.js as a graduation project.",
    url: "https://daveleave.vercel.app/",
    siteName: "HR Leaving System",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "HR Leaving System - Graduation Project",
    description:
      "Full-stack leaving system built with Next.js.",
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