import "./globals.css"
import SideDrawer from "@/components/SideDrawer";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="flex">
        <SideDrawer />
        <main className="flex-1 overflow-hidden">{children}</main>
      </body>
    </html>
  );
}