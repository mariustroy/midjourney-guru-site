import localFont from 'next/font/local';

export const elanor = localFont({
  src: [
	// ExtraLight → 300
	{ path: '../../public/fonts/elanor/Elanor-ExtraLight.woff2', weight: '200' },
	{ path: '../../public/fonts/elanor/Elanor-ExtraLight.woff',  weight: '200' },

	// Regular → 400
	{ path: '../../public/fonts/elanor/Elanor-Regular.woff2', weight: '400' },
	{ path: '../../public/fonts/elanor/Elanor-Regular.woff',  weight: '400' },
  ],
  display: 'swap',
  variable: '--font-elanor',
});