'use client';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FAQ from '../components/FAQ';


const checkSvg = (
    <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const FAQ_ITEMS = [
    { q: 'Can I cancel anytime?', a: 'Yes! Cancel anytime. You\'ll retain access until the end of your billing period.' },
    { q: 'What payment methods?', a: 'All major credit cards, PayPal, and Google Pay via Stripe.' },
    { q: 'Do unused credits roll over?', a: 'Monthly credits do not roll over. Free daily credits reset every 24 hours.' },
    { q: 'Is there a free trial?', a: 'The Free plan is a perpetual trial with 10 credits per day. No credit card required.' },
];

export default function PricingPage() {

    useEffect(() => {
        import('animejs').then(mod => {
            const anime = mod.animate || mod.default || mod;
            const stagger = mod.stagger || anime.stagger || (() => 0);
            anime({
                targets: '.pricing-card',
                opacity: [0, 1],
                translateY: [40, 0],
                delay: stagger(150),
                duration: 800,
                easing: 'easeOutQuad',
            });
        });
    }, []);

    return (
        <>
            <Navbar activePage="pricing" />

            <section className="hero" style={{ paddingBottom: '40px' }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <span className="badge badge-red" style={{ marginBottom: '16px' }}>Simple Pricing</span>
                    <h1>Plans for every need</h1>
                    <p className="hero-subtitle">Start free, upgrade when you need more. All plans include 100% client-side processing.</p>
                </div>
            </section>

            <section className="section" style={{ paddingTop: '0' }}>
                <div className="container">
                    <div className="pricing-cards">

                        <div className="pricing-card">
                            <div className="plan-name">Free</div>
                            <div className="plan-price">$0 <span>/forever</span></div>
                            <p className="plan-desc">Perfect for occasional use and quick tasks.</p>
                            <ul>
                                <li>{checkSvg} 10 credits / day</li>
                                <li>{checkSvg} 5 files per batch</li>
                                <li>{checkSvg} 2 pipeline steps</li>
                                <li>{checkSvg} 20MB file limit</li>
                                <li>{checkSvg} All compressors & converters</li>
                                <li>{checkSvg} Client-side processing</li>
                            </ul>
                            <a href="/tools" className="btn btn-secondary">Get Started</a>
                        </div>

                        <div className="pricing-card popular">
                            <div className="plan-name">Standard</div>
                            <div className="plan-price">$7 <span>/month</span></div>
                            <p className="plan-desc">For professionals who need more power.</p>
                            <ul>
                                <li>{checkSvg} 600 credits / month</li>
                                <li>{checkSvg} 20 files per batch</li>
                                <li>{checkSvg} 4 pipeline steps</li>
                                <li>{checkSvg} 50MB file limit</li>
                                <li>{checkSvg} Save pipeline presets</li>
                                <li>{checkSvg} Priority support</li>
                            </ul>
                            <a href="#" className="btn btn-primary">Upgrade to Standard</a>
                        </div>

                        <div className="pricing-card">
                            <div className="plan-name">Pro</div>
                            <div className="plan-price">$12 <span>/month</span></div>
                            <p className="plan-desc">Unlimited power for teams and agencies.</p>
                            <ul>
                                <li>{checkSvg} 1,800 credits / month</li>
                                <li>{checkSvg} 100 files per batch</li>
                                <li>{checkSvg} Unlimited pipeline steps</li>
                                <li>{checkSvg} No file size limit</li>
                                <li>{checkSvg} Unlimited pipeline presets</li>
                                <li>{checkSvg} No daily run limit</li>
                            </ul>
                            <a href="#" className="btn btn-secondary">Upgrade to Pro</a>
                        </div>

                    </div>
                </div>
            </section>

            <section className="section section-dark">
                <div className="container">
                    <div className="section-header"><h2>Compare Plans</h2></div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--dark-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feature</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--dark-500)', textTransform: 'uppercase' }}>Free</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--red-400)', fontWeight: 700, textTransform: 'uppercase' }}>Standard</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--dark-500)', textTransform: 'uppercase' }}>Pro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['Credits', '10/day', '600/mo', '1,800/mo'],
                                    ['Batch Size', '5 files', '20 files', '100 files'],
                                    ['Pipeline Steps', '2', '4', 'Unlimited'],
                                    ['File Size Limit', '20MB', '50MB', 'Unlimited'],
                                    ['Pipeline Presets', '—', '5', 'Unlimited'],
                                    ['Client-Side Processing', '✅', '✅', '✅'],
                                    ['Priority Support', '—', '✅', '✅'],
                                    ['API Access', '—', '—', 'Coming Soon'],
                                ].map((r, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <td style={{ padding: '14px 20px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--dark-200)' }}>{r[0]}</td>
                                        <td style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.88rem', color: 'var(--dark-400)' }}>{r[1]}</td>
                                        <td style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.88rem', color: 'var(--dark-300)', background: 'rgba(139,26,58,0.04)' }}>{r[2]}</td>
                                        <td style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.88rem', color: 'var(--dark-400)' }}>{r[3]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-header"><h2>Pricing FAQ</h2></div>
                    <FAQ items={FAQ_ITEMS} />
                </div>
            </section>

            <Footer />
        </>
    );
}
