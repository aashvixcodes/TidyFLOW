'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import Link from 'next/link';

const TOOLS = [
    { name: 'Smart Optimizer', desc: 'Auto-detect and optimize any image', icon: '⚡', category: 'compressor', link: '/compress/' },
    { name: 'Compress PNG', desc: 'Reduce PNG file size', icon: '🖼️', category: 'compressor', link: '/compress/#png' },
    { name: 'Compress JPEG', desc: 'Shrink JPEG photos', icon: '📸', category: 'compressor', link: '/compress/#jpeg' },
    { name: 'Compress WebP', desc: 'Optimize WebP images', icon: '🌐', category: 'compressor', link: '/compress/#webp' },
    { name: 'Compress SVG', desc: 'Minify SVG files', icon: '✏️', category: 'compressor', link: '/compress/#svg' },
    { name: 'Compress GIF', desc: 'Reduce GIF file size', icon: '🎞️', category: 'compressor', link: '/compress/' },
    { name: 'Batch Compressor', desc: 'Compress multiple files at once', icon: '📦', category: 'compressor', link: '/compress/' },
    { name: 'Universal Converter', desc: 'Convert between any supported format', icon: '🔄', category: 'converter', link: '/convert/' },
    { name: 'PNG to JPG', desc: 'Convert PNG images to JPG', icon: '🖼️', category: 'converter', link: '/convert/#png-to-jpg' },
    { name: 'JPG to PNG', desc: 'Convert JPG photos to PNG', icon: '📸', category: 'converter', link: '/convert/#jpg-to-png' },
    { name: 'WebP to JPG', desc: 'Convert WebP to JPG format', icon: '🌐', category: 'converter', link: '/convert/#webp-to-jpg' },
    { name: 'WebP to PNG', desc: 'Convert WebP to PNG format', icon: '🌐', category: 'converter', link: '/convert/#webp-to-png' },
    { name: 'JPG to WebP', desc: 'Convert JPG to WebP for the web', icon: '📸', category: 'converter', link: '/convert/#jpg-to-webp' },
    { name: 'PNG to WebP', desc: 'Convert PNG to WebP for the web', icon: '🖼️', category: 'converter', link: '/convert/#png-to-webp' },
    { name: 'HEIC to JPG', desc: 'Convert iPhone HEIC to JPG', icon: '📱', category: 'converter', link: '/convert/#heic-to-jpg' },
    { name: 'HEIC to PNG', desc: 'Convert iPhone HEIC to PNG', icon: '📱', category: 'converter', link: '/convert/#heic-to-png' },
    { name: 'SVG to PNG', desc: 'Rasterize SVG to PNG', icon: '🎨', category: 'converter', link: '/convert/#svg-to-png' },
    { name: 'SVG to JPG', desc: 'Convert SVG to JPG', icon: '🎨', category: 'converter', link: '/convert/#svg-to-jpg' },
    { name: 'PNG to SVG', desc: 'Trace PNG to SVG (beta)', icon: '✏️', category: 'converter', link: '/convert/#png-to-svg' },
    { name: 'GIF to PNG', desc: 'Extract first frame of GIF as PNG', icon: '🎞️', category: 'converter', link: '/convert/' },
    { name: 'GIF to JPG', desc: 'Convert GIF to JPG', icon: '🎞️', category: 'converter', link: '/convert/' },
    { name: 'BMP to PNG', desc: 'Convert BMP to PNG', icon: '🖼️', category: 'converter', link: '/convert/' },
    { name: 'BMP to JPG', desc: 'Convert BMP to JPG', icon: '🖼️', category: 'converter', link: '/convert/' },
    { name: 'TIFF to PNG', desc: 'Convert TIFF to PNG', icon: '🖼️', category: 'converter', link: '/convert/' },
    { name: 'TIFF to JPG', desc: 'Convert TIFF to JPG', icon: '🖼️', category: 'converter', link: '/convert/' },
    { name: 'Image Resizer', desc: 'Resize images by px or %', icon: '📏', category: 'utility', link: '/automation/' },
    { name: 'Batch Renamer', desc: 'Rename multiple files with templates', icon: '📏', category: 'utility', link: '/automation/' },
    { name: 'Metadata Remover', desc: 'Strip EXIF data from photos', icon: '🧹', category: 'utility', link: '/automation/' },
    { name: 'Image Watermarker', desc: 'Add text watermarks (Beta)', icon: '💧', category: 'utility', link: '/automation/' },
    { name: 'Image Cropper', desc: 'Crop images to specific dimensions', icon: '✂️', category: 'utility', link: '/automation/' },
    { name: 'PDF to Image', desc: 'Convert PDF pages to images', icon: '📄', category: 'converter', link: '/convert/' },
];

export default function ToolsPage() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTools = TOOLS.filter(t => {
        const matchesFilter = activeFilter === 'all' || t.category === activeFilter;
        const matchesSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    useEffect(() => {
        import('animejs').then(mod => {
            const anime = mod.animate || mod.default || mod;
            const stagger = mod.stagger || anime.stagger || (() => 0);
            anime({
                targets: '.tool-card',
                opacity: [0, 1],
                translateY: [20, 0],
                delay: stagger(30),
                duration: 500,
                easing: 'easeOutQuad'
            });
        });
    }, [activeFilter, searchQuery]);

    return (
        <>
            <Navbar activePage="tools" />

            <section className="tools-hero">
                <div className="container">
                    <span className="badge badge-red" style={{ marginBottom: "16px" }}>193+ Conversion Pairs</span>
                    <h1>Tools Library</h1>
                    <p style={{ fontSize: "1.1rem", maxWidth: "550px", margin: "12px auto 0" }}>
                        Browse our complete collection of image processing tools. All processing happens 100% in your browser.
                    </p>

                    <div className="tools-search">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search tools... (e.g. PNG to JPG)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="tools-tabs">
                        <button
                            className={activeFilter === 'all' ? 'active' : ''}
                            onClick={() => setActiveFilter('all')}
                        >All Tools</button>
                        <button
                            className={activeFilter === 'compressor' ? 'active' : ''}
                            onClick={() => setActiveFilter('compressor')}
                        >Compressors</button>
                        <button
                            className={activeFilter === 'converter' ? 'active' : ''}
                            onClick={() => setActiveFilter('converter')}
                        >Converters</button>
                        <button
                            className={activeFilter === 'utility' ? 'active' : ''}
                            onClick={() => setActiveFilter('utility')}
                        >Utilities</button>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {filteredTools.length > 0 ? (
                        <div className="grid grid-3" id="tools-grid">
                            {filteredTools.map((tool, idx) => (
                                <Link href={tool.link} className="tool-card" key={idx}>
                                    <div className="tool-icon">{tool.icon}</div>
                                    <div className="tool-info">
                                        <h4>{tool.name}</h4>
                                        <p>{tool.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: "center", color: "var(--dark-500)", padding: "40px 0", fontSize: "1.1rem" }}>
                            No tools match your search.
                        </p>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}
