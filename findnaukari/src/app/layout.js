import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Resume Analyzer & Job Recommendation",
  description: "AI-powered resume analysis and job matching system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body
        className="font-poppins antialiased min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #FBF3D1 0%, #DEDED1 50%, #C5C7BC 100%)',
          fontFamily: 'var(--font-poppins), Poppins, sans-serif'
        }}
      >
        {children}
      </body>
    </html>
  );
}
