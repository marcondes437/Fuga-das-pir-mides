import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppProviders } from "./providers";
import "../styles.css";

export const metadata: Metadata = {
  title: {
    default: "Fuga da Pirâmide — Os Segredos da Geometria Espacial",
    template: "%s — Fuga da Pirâmide",
  },
  description:
    "Explore três pirâmides egípcias resolvendo desafios de geometria espacial com modelos 3D.",
  openGraph: {
    title: "Fuga da Pirâmide",
    description: "Escape de três pirâmides usando geometria espacial.",
    type: "website",
    locale: "pt_BR",
  },
  icons: { icon: "/favicon.ico" },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap"
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
