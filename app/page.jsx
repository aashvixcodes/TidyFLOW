'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
const anime = require('animejs');
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
    const statsRowRef = useRef(null);
    const featuresGridRef = useRef(null);

    useEffect(() => {
        // 1. Hero particles
        const container = document.getElementById('hero-particles');
        if (container && container.children.length === 0) {
            for (let i = 0; i < 30; i++) {
                const p = document.createElement('div');
                p.className = 'hero-particle';
                const size = Math.random() * 6 + 2;
                p.style.width = size + 'px';
                p.style.height = size + 'px';
                p.style.left = Math.random() * 100 + '%';
                p.style.top = Math.random() * 100 + '%';
                container.appendChild(p);
            }
            anime({
                targets: '.hero-particle',
                opacity: [
                    { value: 0.6, duration: 1500 },
                    { value: 0, duration: 1500 },
                ],
                translateY: { value: () => anime.random(-80, 80), duration: 3000 },
                translateX: { value: () => anime.random(-60, 60), duration: 3000 },
                scale: [0.5, 1.2],
                easing: 'easeInOutQuad',
                duration: () => anime.random(3000, 6000),
                delay: () => anime.random(0, 3000),
                loop: true,
                direction: 'alternate',
            });
        }

        // 2. Hero entrance sequence
        const tl = anime.timeline({ easing: 'easeOutExpo' });
        tl.add({
            targets: '#hero-badge',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
        })
            .add({
                targets: '#hero-title',
                opacity: [0, 1],
                translateY: [40, 0],
                duration: 1000,
            }, '-=500')
            .add({
                targets: '#hero-subtitle',
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 800,
            }, '-=600')
            .add({
                targets: '#hero-actions',
                opacity: [0, 1],
                translateY: [25, 0],
                duration: 800,
            }, '-=500');

        // 3. Counter animation function
        const animateCounters = () => {
            const counters = [
                { target: '#stat-tools', value: 193 },
                { target: '#stat-processed', value: 47 },
                { target: '#stat-savings', value: 72 },
            ];

            counters.forEach(c => {
                const el = document.querySelector(c.target);
                if (!el) return;
                const obj = { val: 0 };
                anime({
                    targets: obj,
                    val: c.value,
                    round: 1,
                    easing: 'easeInOutExpo',
                    duration: 2000,
                    delay: 600,
                    update: () => { el.textContent = Math.round(obj.val); }
                });
            });

            anime({
                targets: '#stat-privacy',
                opacity: [0, 1],
                scale: [0.5, 1],
                duration: 1200,
                delay: 1200,
                easing: 'easeOutElastic(1, .5)',
            });
        };

        // 4. Scroll reveals for .animate-in
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

        // Stats row intersection
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        if (statsRowRef.current) statsObserver.observe(statsRowRef.current);

        // Glow line pulse
        anime({
            targets: '#glow-line',
            opacity: [0.1, 0.5, 0.1],
            easing: 'easeInOutSine',
            duration: 3000,
            loop: true,
        });

        // Feature cards stagger
        const featureObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: '.feature-card',
                        opacity: [0, 1],
                        translateY: [30, 0],
                        delay: anime.stagger(100),
                        duration: 600,
                        easing: 'easeOutQuad',
                    });
                    featureObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        if (featuresGridRef.current) featureObserver.observe(featuresGridRef.current);

        // Scroll to top button logic
        const handleScroll = () => {
            const scrollBtn = document.getElementById('scroll-btn');
            if (scrollBtn) scrollBtn.classList.toggle('visible', window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // FAQ Data
    const faqData = [
        { q: 'Are my files safe?', a: 'Absolutely. All processing happens 100% in your browser. No files are ever uploaded to any server. Your data never leaves your device.' },
        { q: 'How does client-side processing work?', a: 'We use modern browser APIs like Canvas, OffscreenCanvas, and WebAssembly to process images directly in your browser. Zero server involvement, maximum privacy.' },
        { q: 'What is a "credit"?', a: 'Each file operation (compress, convert, resize, etc.) uses 1 credit. Free users get 10 credits per day. Paid plans offer more credits for higher-volume needs.' },
        { q: 'Is there a file size limit?', a: 'Free plan supports files up to 20MB. Standard supports 50MB, and Pro has no practical limit (depends on your device\'s memory).' },
        { q: 'What formats are supported?', a: 'We support PNG, JPEG, WebP, SVG, GIF, HEIC, and more. Our converter handles 193+ format conversion pairs.' },
        { q: 'How does the automation pipeline work?', a: 'Add processing steps (resize, compress, convert, rename, etc.) to a pipeline. Drop your files in, and they\'ll be processed through each step sequentially. Save pipelines as presets to reuse.' },
    ];

    const handleFAQClick = (idx) => {
        const panels = document.querySelectorAll('.faq-content');
        const buttons = document.querySelectorAll('.faq-item');

        // Toggle active state
        const isActivating = !buttons[idx].classList.contains('active');

        // Reset all
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => {
            p.style.maxHeight = null;
        });

        // Open if activating
        if (isActivating) {
            buttons[idx].classList.add('active');
            panels[idx].style.maxHeight = panels[idx].scrollHeight + 'px';
        }
    };

    return (
        <>
            <Navbar activePage="home" />

            {/* HERO SECTION */}
            <section className="hero">
                <div className="grid-bg"></div>
                <div className="hero-particles" id="hero-particles"></div>
                <div className="container" style={{ position: "relative", zIndex: 1 }}>
                    <div className="hero-badge" id="hero-badge" style={{ opacity: 0 }}>
                        <span className="dot"></span>
                        100% Client-Side Processing
                    </div>
                    <h1 id="hero-title" style={{ opacity: 0 }}>
                        Your Files.<br />
                        <span className="gradient-text">Your Rules.</span><br />
                        Zero Uploads.
                    </h1>
                    <p className="hero-subtitle" id="hero-subtitle" style={{ opacity: 0 }}>
                        Compress, convert, resize &amp; automate images in your browser.
                        No servers. No tracking. Just speed.
                    </p>
                    <div className="hero-actions" id="hero-actions" style={{ opacity: 0 }}>
                        <Link href="/tools" className="btn btn-primary btn-lg">🚀 Launch Tools</Link>
                        <Link href="/automation" className="btn btn-secondary btn-lg">⚡ Build Pipeline</Link>
                    </div>
                </div>

                <div className="glow-line" id="glow-line" style={{ position: "relative", zIndex: 1, margin: "60px auto 0", maxWidth: 600 }}></div>

                <div className="stats-row" id="stats-row" ref={statsRowRef} style={{ position: "relative", zIndex: 1 }}>
                    <div className="stat-item">
                        <div className="stat-num"><span className="accent" id="stat-tools">0</span>+</div>
                        <div className="stat-label">Conversion Pairs</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-num"><span className="accent" id="stat-processed">0</span>K+</div>
                        <div className="stat-label">Files Processed</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-num"><span className="accent" id="stat-savings">0</span>%</div>
                        <div className="stat-label">Avg. Compression</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-num" id="stat-privacy" style={{ opacity: 0 }}>∞</div>
                        <div className="stat-label">Data Privacy</div>
                    </div>
                </div>
            </section>

            {/* COMPARISON */}
            <section className="comparison section section-dark">
                <div className="section-header">
                    <h2 className="animate-in">A Better Way to Process Files</h2>
                    <p className="animate-in">Stop doing things the old way. Automate your entire workflow.</p>
                </div>
                <div className="comparison-grid">
                    <div className="comparison-card old animate-in">
                        <h3>🔴 The Old Way</h3>
                        <ul>
                            <li><span className="icon" style={{ color: "var(--red-400)" }}>✕</span> Process one file at a time</li>
                            <li><span className="icon" style={{ color: "var(--red-400)" }}>✕</span> Re-upload for every new task</li>
                            <li><span className="icon" style={{ color: "var(--red-400)" }}>✕</span> Manual repetitive settings</li>
                            <li><span className="icon" style={{ color: "var(--red-400)" }}>✕</span> Files uploaded to unknown servers</li>
                            <li><span className="icon" style={{ color: "var(--red-400)" }}>✕</span> Limited to single operations</li>
                        </ul>
                    </div>
                    <div className="comparison-vs">VS</div>
                    <div className="comparison-card new animate-in">
                        <h3>⚡ The TidyFlow Way</h3>
                        <ul>
                            <li><span className="icon" style={{ color: "var(--green-500)" }}>✓</span> Batch process 100+ files at once</li>
                            <li><span className="icon" style={{ color: "var(--green-500)" }}>✓</span> Chain multiple steps in pipelines</li>
                            <li><span className="icon" style={{ color: "var(--green-500)" }}>✓</span> Save presets, reuse forever</li>
                            <li><span className="icon" style={{ color: "var(--green-500)" }}>✓</span> 100% client-side — nothing leaves your browser</li>
                            <li><span className="icon" style={{ color: "var(--green-500)" }}>✓</span> Automate compress + convert + rename in one go</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* WORKFLOWS */}
            <section className="section section-darker">
                <div className="container">
                    <div className="section-header">
                        <h2 className="animate-in">Two Powerful Workflows</h2>
                        <p className="animate-in">Use individual tools instantly, or build automated pipelines for complex tasks.</p>
                    </div>
                    <div className="grid grid-2" style={{ maxWidth: 800, margin: "0 auto" }}>
                        <div className="card animate-in" style={{ textAlign: "center" }}>
                            <div className="card-icon" style={{ margin: "0 auto 16px" }}>🛠️</div>
                            <h3>Individual Tools</h3>
                            <p style={{ margin: "8px 0 20px" }}>Pick a tool, drop your files, get results instantly. Perfect for quick one-off tasks.</p>
                            <Link href="/tools" className="btn btn-outline btn-sm">Browse Tools</Link>
                        </div>
                        <div className="card animate-in" style={{ textAlign: "center", borderColor: "rgba(139,26,58,0.4)", background: "linear-gradient(135deg,rgba(139,26,58,0.08),rgba(220,38,38,0.04))" }}>
                            <div className="card-icon" style={{ margin: "0 auto 16px", background: "linear-gradient(135deg,rgba(220,38,38,0.2),rgba(139,26,58,0.2))" }}>⚡</div>
                            <h3>Automation Pipelines</h3>
                            <p style={{ margin: "8px 0 20px" }}>Chain operations into a pipeline. Process hundreds of files through multiple steps.</p>
                            <Link href="/automation" className="btn btn-primary btn-sm">Build Pipeline</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="section section-dark">
                <div className="container">
                    <div className="section-header">
                        <h2 className="animate-in">Everything You Need</h2>
                        <p className="animate-in">Powerful tools that run entirely in your browser.</p>
                    </div>
                    <div className="features-grid" ref={featuresGridRef}>
                        <div className="feature-card animate-in" style={{ opacity: 0 }}>
                            <div className="icon-wrap">📦</div>
                            <h4>Smart Compression</h4>
                            <p>Up to 80% smaller files with near-zero quality loss. Supports PNG, JPEG, WebP & SVG.</p>
                        </div>
                        <div className="feature-card animate-in" style={{ opacity: 0 }}>
                            <div className="icon-wrap">🔄</div>
                            <h4>Format Conversion</h4>
                            <p>Convert between 193+ format pairs. HEIC to JPG, WebP to PNG, SVG to PNG, and more.</p>
                        </div>
                        <div className="feature-card animate-in" style={{ opacity: 0 }}>
                            <div className="icon-wrap">📋</div>
                            <h4>Bulk Processing</h4>
                            <p>Drop up to 100 files at once. Batch compress, convert, resize, and rename in seconds.</p>
                        </div>
                        <div className="feature-card animate-in" style={{ opacity: 0 }}>
                            <div className="icon-wrap">🔒</div>
                            <h4>Client-Side Security</h4>
                            <p>Zero uploads. All processing happens locally in your browser. GDPR & CCPA compliant.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section section-darker">
                <div className="container">
                    <div className="section-header">
                        <h2 className="animate-in">Frequently Asked Questions</h2>
                    </div>
                    <div className="faq-grid animate-in">
                        {faqData.map((item, index) => (
                            <div key={index} className="faq-item" onClick={() => handleFAQClick(index)}>
                                <div className="faq-question">
                                    <h3>{item.q}</h3>
                                    <span className="faq-icon">+</span>
                                </div>
                                <div className="faq-content">
                                    <p>{item.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section section-dark">
                <div className="container" style={{ textAlign: "center" }}>
                    <h2 className="animate-in">Ready to Run Your Flow?</h2>
                    <p className="animate-in" style={{ margin: "12px 0 32px", fontSize: "1.1rem" }}>Start processing images for free. No sign-up required.</p>
                    <div className="hero-actions animate-in">
                        <Link href="/compress" className="btn btn-primary btn-lg">🔥 Compress Images</Link>
                        <Link href="/convert" className="btn btn-secondary btn-lg">🔄 Convert Images</Link>
                    </div>
                </div>
            </section>

            <Footer />

            <button id="scroll-btn" className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
        </>
    );
}
