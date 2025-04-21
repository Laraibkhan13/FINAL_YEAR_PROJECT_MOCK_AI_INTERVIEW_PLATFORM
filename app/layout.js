import { Roboto } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ['100', '300', '400', '500', '700', '900'],
});

export const metadata = {
  title: "Mock AI Interview",
  description: "Give a mock AI interview to prepare for your next job interview",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={roboto.className}>
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
