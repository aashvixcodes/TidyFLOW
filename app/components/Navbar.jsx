'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar({ activePage = '' }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    return (
        <nav className={`navbar ${mobileOpen ? 'mobile-open' : ''}`} id="navbar">
            <div className="navbar-inner">
                <Link href="/" className="navbar-logo">
                    <svg viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
                        <defs>
                            <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
                                <stop stopColor="#DC2626" />
                                <stop offset="1" stopColor="#8B1A3A" />
                            </linearGradient>
                        </defs>
                        <path d="M9 10l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17 16h6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    <span>Tidy</span><span className="logo-accent">Flow</span>
                </Link>
                <div className="navbar-links">
                    <Link href="/" className={activePage === 'home' ? 'active' : ''}>Home</Link>
                    <Link href="/tools" className={activePage === 'tools' ? 'active' : ''}>Tools Library</Link>

                    <div className={`nav-dropdown ${activeDropdown === 'tools' ? 'active' : ''}`}>
                        <button className="nav-trigger" onClick={() => toggleDropdown('tools')}>
                            Tools
                            <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" /></svg>
                        </button>
                        <div className="nav-dropdown-panel">
                            <Link href="/compress"><span className="dd-icon">📦</span> Smart Optimizer</Link>
                            <Link href="/compress#png"><span className="dd-icon">🖼️</span> Compress PNG</Link>
                            <Link href="/compress#jpeg"><span className="dd-icon">📸</span> Compress JPEG</Link>
                            <Link href="/compress#webp"><span className="dd-icon">🌐</span> Compress WebP</Link>
                            <Link href="/compress#svg"><span className="dd-icon">✏️</span> Compress SVG</Link>
                            <Link href="/convert"><span className="dd-icon">🔄</span> Universal Converter</Link>
                            <Link href="/convert#heic-to-jpg"><span className="dd-icon">📱</span> HEIC to JPG</Link>
                            <Link href="/convert#webp-to-jpg"><span className="dd-icon">🌐</span> WebP to JPG</Link>
                            <Link href="/convert#png-to-svg"><span className="dd-icon">🎨</span> PNG to SVG</Link>
                            <Link href="/convert#svg-to-png"><span className="dd-icon">🖼️</span> SVG to PNG</Link>
                            <Link href="/tools"><span className="dd-icon">🔗</span> View All 193+ Pairs →</Link>
                        </div>
                    </div>

                    <Link href="/automation" className={activePage === 'automation' ? 'active' : ''}>Automation</Link>
                    <Link href="/pricing" className={activePage === 'pricing' ? 'active' : ''}>Pricing</Link>

                    <div className={`nav-dropdown ${activeDropdown === 'resources' ? 'active' : ''}`}>
                        <button className="nav-trigger" onClick={() => toggleDropdown('resources')}>
                            Resources
                            <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" /></svg>
                        </button>
                        <div className="nav-dropdown-panel" style={{ minWidth: "280px", gridTemplateColumns: "1fr" }}>
                            <Link href="#"><span className="dd-icon">📚</span> Help Center</Link>
                            <Link href="#"><span className="dd-icon">📖</span> Automation Docs</Link>
                            <Link href="#"><span className="dd-icon">🔒</span> Security Manifest</Link>
                            <Link href="#"><span className="dd-icon">📋</span> Privacy Policy</Link>
                            <Link href="#"><span className="dd-icon">📄</span> Terms of Service</Link>
                        </div>
                    </div>
                </div>
                <div className="navbar-actions">
                    <button className="btn-signin">Sign In</button>
                    <Link href="/tools" className="btn-try">Try Tools</Link>
                </div>
                <div className="navbar-hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
                    <span></span><span></span><span></span>
                </div>
            </div>
        </nav>
    );
}
