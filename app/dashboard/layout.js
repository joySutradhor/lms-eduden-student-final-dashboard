import { Work_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar/page";

const WorkSans = Work_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Dashboard",
  description: "ednden is a best learning platform || ednden",
};

export default function LoginLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${WorkSans.className} antialiased bg-no-repeat  bg-[#f7f5f5]`}
      >
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
