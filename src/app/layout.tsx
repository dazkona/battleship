import type { Metadata } from "next";
import { Nunito_Sans, Work_Sans, Special_Elite } from "next/font/google";
import "./globals.css";
import "animate.css";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

const specialElite = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-special-elite",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Specify required weights
  style: ["normal", "italic"], // Optional
  variable: "--font-work-sans", // Optional: for CSS variables
});

export const metadata: Metadata = {
  title: "Battleships",
  description: "Battleships",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${specialElite.variable} ${workSans.variable}`}>
      <body
        className={`${nunito.className} antialiased flex flex-col items-center justify-center relative min-h-screen`}
        style={{ minHeight: "100vh" }}>
        <div
          aria-hidden="true"
          className="fixed inset-0 w-full h-full -z-10 bg-center bg-cover"
          style={{
            backgroundImage: "url('/5Qo2SvZeqSCKWx4MLdPYv.jpg')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        {children}
      </body>
    </html>
  );
}
