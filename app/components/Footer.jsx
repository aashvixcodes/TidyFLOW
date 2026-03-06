import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div className="footer-brand">
                    <Link href="/" className="navbar-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.2rem' }}>
                        <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                            <rect width="32" height="32" rx="8" fill="url(#flogo)" />
                            <defs>
                                <linearGradient id="flogo" x1="0" y1="0" x2="32" y2="32">
                                    <stop stopColor="#DC2626" />
                                    <stop offset="1" stopColor="#8B1A3A" />
                                </linearGradient>
                            </defs>
                            <path d="M9 10l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M17 16h6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                        <span style={{ color: '#fff' }}>Tidy</span><span style={{ color: 'var(--red-400)' }}>Flow</span>
                    </Link>
                    <p>Compress, convert, resize, rename, or batch files in one go. Runs in the browser — no data sent to any server.</p>
                    <p style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem' }}>✉️</span>
                        <a href="mailto:support@TidyFlow.io" style={{ color: 'var(--dark-300)', fontWeight: 500 }}>support@TidyFlow.io</a>
                    </p>
                </div>
                <div className="footer-col">
                    <h4>Compressors</h4>
                    <Link href="/compress">All Compressors</Link>
                    <Link href="/compress#png">Compress PNG</Link>
                    <Link href="/compress#jpeg">Compress JPEG</Link>
                    <Link href="/compress#webp">Compress WebP</Link>
                    <Link href="/compress#svg">Compress SVG</Link>
                    <Link href="/compress">SVG Magic Optimizer</Link>
                </div>
                <div className="footer-col">
                    <h4>Converters</h4>
                    <Link href="/convert">Universal Converter</Link>
                    <Link href="/convert#webp-to-jpg">WebP to JPG</Link>
                    <Link href="/convert#heic-to-jpg">HEIC to JPG</Link>
                    <Link href="/convert#png-to-svg">PNG to SVG</Link>
                    <Link href="/convert#svg-to-png">SVG to PNG</Link>
                    <Link href="/convert">PDF to Image</Link>
                    <Link href="/tools">Image Watermarker</Link>
                </div>
                <div className="footer-col">
                    <h4>Company</h4>
                    <Link href="/pricing">Pricing</Link>
                    <Link href="#">Help Center</Link>
                    <Link href="#">Automation Docs</Link>
                    <Link href="#">Privacy Policy</Link>
                    <Link href="#">Terms of Service</Link>
                    <Link href="#">Cookie Policy</Link>
                    <Link href="#" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🔒 Security Manifest</Link>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 TidyFlow. All rights reserved.</p>
                <div className="footer-badges">
                    <span className="badge badge-outline">GDPR COMPLIANT</span>
                    <span className="badge badge-outline">CCPA READY</span>
                    <span className="badge badge-outline">100% CLIENT-SIDE</span>
                    <span className="badge badge-red" style={{ cursor: 'pointer' }}>Built with 🔥</span>
                </div>
            </div>
        </footer>
    );
}
