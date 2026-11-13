import type { Metadata } from 'next';
import 'maplibre-gl/dist/maplibre-gl.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Foresight — Climate intelligence',
  description: 'Explore global climate analogues and evidence-led agricultural adaptation.',
  icons: { icon: '/foresight-icon.png', shortcut: '/foresight-icon.png' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
