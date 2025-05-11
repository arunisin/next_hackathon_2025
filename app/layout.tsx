import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import QueryClientWrapper from "../contexts/QueryClinet";
import { AnimTransition } from "../components/transitions/AnimTransition";
import BgImage from "@/components/common/bg-image";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <head>
        <style>
          {`
            ::view-transition-old(root),
            ::view-transition-new(root) {
              animation: none;
              mix-blend-mode: normal;
            }

            ::view-transition-old(page) {
              animation: 0.5s cubic-bezier(0.4, 0, 0.2, 1) both fade-out,
                        0.5s cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
            }

            ::view-transition-new(page) {
              animation: 0.5s cubic-bezier(0.4, 0, 0.2, 1) both fade-in,
                        0.5s cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
            }

            @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }

            @keyframes fade-out {
              from { opacity: 1; }
              to { opacity: 0; }
            }

            @keyframes slide-from-right {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }

            @keyframes slide-to-left {
              from { transform: translateX(0); }
              to { transform: translateX(-100%); }
            }

            @keyframes plane-takeoff {
              0% {
                transform: translateX(0) translateY(0) rotate(0);
                opacity: 1;
              }
              100% {
                transform: translateX(100vw) translateY(-100vh) rotate(45deg);
                opacity: 0;
              }
            }
          `}
        </style>
      </head>
      <body
        className="bg-background text-foreground h-screen"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientWrapper>
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
              <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                  <Link href={"/"}>TravelCulture</Link>
                </div>
                {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
              </div>
            </nav>
            <BgImage />
            <main className=" w-full h-screen-minus-header flex justify-center items-center">
              {/* <AnimTransition> */}
              <div className=" w-fill h-fill px-4 md:px-36">
                {children}
              </div>
              {/* </AnimTransition> */}
              {/* <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                  <p>
                    Powered by{" "}
                    <a
                      href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                      target="_blank"
                      className="font-bold hover:underline"
                      rel="noreferrer"
                    >
                      Supabase
                    </a>
                  </p>
                  <ThemeSwitcher />
                </footer> */}
            </main>
          </QueryClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
