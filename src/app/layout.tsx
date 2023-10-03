import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Props } from "@/types";
import ToasterProvider from "@/providers/ToasterProvider";
import Navbar from "@/components/navbar/Navbar";
import getCurrentUser from "@/actions/getCurrentUser";
import RentModal from "@/components/modals/RentModal";
import AuthProvider from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Airbnb",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }: Props) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToasterProvider />
          <RentModal />
          <Navbar currentUser={currentUser} />
          <div className="pb-20 pt-28">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
