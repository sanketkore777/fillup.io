import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <NextUIProvider>
        <ClerkProvider>
          <body>
            {children}
            <Toaster position="top-center" />
          </body>
        </ClerkProvider>
      </NextUIProvider>
    </html>
  );
}
