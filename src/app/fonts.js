// app/fonts.js
import localFont from 'next/font/local';

export const elanor = localFont({
  src: [
	{ path: '../public/fonts/Elanor/Elanor-Regular.woff2', weight: '700' },
	{ path: '../public/fonts/Elanor/Elanor-Regular.woff',  weight: '700' },
	{ path: '../public/fonts/Elanor/Elanor-ExtraLight.woff2', weight: '400' },
	{ path: '../public/fonts/Elanor/Elanor-ExtraLight.woff',  weight: '400' },
	…
  ],
  display: 'swap',
  variable: '--font-elanor',
});