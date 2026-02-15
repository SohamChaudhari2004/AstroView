import type { Metadata } from 'next';
import { Providers } from './providers';
import '@/globals.css';
import Navbar from '@/components/ui/Navbar';

export const metadata: Metadata = {
  title: 'AstroView - Space Intelligence Platform',
  description: 'Real-time space and Earth monitoring with NASA integrations',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Providers>
          <div className="relative min-h-screen bg-[#030308] text-white overflow-x-hidden selection:bg-cyan-500/30">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-900/20 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>
            
            <Navbar />
            
            <main className="relative z-10 pt-20">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
