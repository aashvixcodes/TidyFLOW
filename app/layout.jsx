import './globals.css';

export const metadata = {
    title: 'TidyFlow — Compress, Convert & Automate Images in Your Browser',
    description: '100% client-side image compression, conversion, and automation. No uploads, no servers, no data leaves your browser.',
    icons: {
        icon: "data:image/svg+xml,%3Csvg viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' rx='8' fill='%232D5AFE'/%3E%3Cpath d='M8 12h16M8 16h12M8 20h8' stroke='white' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <div id="app">
                    {children}
                </div>
            </body>
        </html>
    );
}
