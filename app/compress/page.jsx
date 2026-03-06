'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Dropzone from '../components/Dropzone';
import FileList from '../components/FileList';
import { compressImage } from '../../lib/engine/compressor';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { formatBytes } from '../components/Dropzone';

export default function CompressPage() {
    const [files, setFiles] = useState([]);
    const [results, setResults] = useState([]);
    const [quality, setQuality] = useState(75);
    const [stripMetadata, setStripMetadata] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFiles = async (newFiles) => {
        const validFiles = newFiles.filter(f => f.type.startsWith('image/'));
        if (validFiles.length === 0) return;

        const newFilesList = [...files, ...validFiles];
        setFiles(newFilesList);

        // Create an array with nulls for the new files
        const newResultsList = [...results, ...new Array(validFiles.length).fill(null)];
        setResults(newResultsList);

        setIsProcessing(true);
        setProgress(0);

        const updatedResults = [...newResultsList];

        for (let i = files.length; i < newFilesList.length; i++) {
            try {
                const res = await compressImage(newFilesList[i], {
                    quality: quality / 100,
                    stripMetadata
                });
                updatedResults[i] = res;
            } catch (err) {
                updatedResults[i] = {
                    blob: newFilesList[i],
                    name: newFilesList[i].name,
                    size: newFilesList[i].size,
                    saved: 0
                };
            }
            setResults([...updatedResults]);
            setProgress(((i - files.length + 1) / validFiles.length) * 100);
        }

        setTimeout(() => setIsProcessing(false), 800);
    };

    const handleRemove = (index) => {
        const newFiles = [...files];
        const newResults = [...results];
        newFiles.splice(index, 1);
        newResults.splice(index, 1);
        setFiles(newFiles);
        setResults(newResults);
    };

    const handleClear = () => {
        setFiles([]);
        setResults([]);
    };

    const handleDownload = async () => {
        const doneResults = results.filter(Boolean);
        if (doneResults.length === 0) return;

        if (doneResults.length === 1) {
            saveAs(doneResults[0].blob, doneResults[0].name);
        } else {
            const zip = new JSZip();
            doneResults.forEach(r => zip.file(r.name, r.blob));
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, 'compressed-images.zip');
        }
    };

    const doneResults = results.filter(Boolean);
    const totalOriginal = doneResults.reduce((s, _, idx) => s + files[idx].size, 0);
    const totalCompressed = doneResults.reduce((s, r) => s + (r?.size || 0), 0);
    const savedPct = totalOriginal > 0 ? Math.round((1 - totalCompressed / totalOriginal) * 100) : 0;
    const currentOriginalTotal = files.reduce((s, f) => s + f.size, 0);

    return (
        <>
            <Navbar activePage="tools" />

            <section className="tools-hero">
                <div className="container">
                    <span className="badge badge-red" style={{ marginBottom: "16px" }}>Client-Side</span>
                    <h1>Image Compressor</h1>
                    <p style={{ fontSize: "1.1rem", maxWidth: "500px", margin: "12px auto 0" }}>
                        Compress PNG, JPEG, WebP & SVG images up to 80% smaller. Everything runs in your browser.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container" style={{ maxWidth: "800px" }}>

                    <Dropzone accept="image/*" multiple={true} onFiles={handleFiles} />

                    <div style={{ marginTop: '24px' }}>
                        <FileList files={files} results={results} onRemove={handleRemove} />
                    </div>

                    <div className="tool-controls" id="controls" style={{ marginTop: "24px" }}>
                        <div className="control-group">
                            <label>Compression Quality</label>
                            <div className="slider-wrap">
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={quality}
                                    onChange={(e) => setQuality(parseInt(e.target.value))}
                                />
                                <span className="slider-val">{quality}%</span>
                            </div>
                        </div>
                        <div className="control-group">
                            <div className="toggle-row">
                                <label style={{ marginBottom: 0 }}>Strip Metadata (EXIF)</label>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={stripMetadata}
                                        onChange={(e) => setStripMetadata(e.target.checked)}
                                    />
                                    <span className="slider-track"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {files.length > 0 && (
                        <div className="results-bar" style={{ display: "flex", marginTop: "24px" }}>
                            <div className="stats">
                                <div className="stat">
                                    <div className="val">{formatBytes(currentOriginalTotal)}</div>
                                    <div className="label">Original</div>
                                </div>
                                <div className="stat">
                                    <div className="val">{formatBytes(totalCompressed)}</div>
                                    <div className="label">Compressed</div>
                                </div>
                                <div className="stat">
                                    <div className="val">{Math.max(0, savedPct)}%</div>
                                    <div className="label">Saved</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                    className="btn btn-primary"
                                    disabled={isProcessing || doneResults.length === 0}
                                    onClick={handleDownload}
                                >
                                    Download All
                                </button>
                                <button className="btn btn-secondary" onClick={handleClear}>Clear</button>
                            </div>
                        </div>
                    )}

                    {isProcessing && (
                        <div className="progress-bar" style={{ display: "block", marginTop: "16px" }}>
                            <div className="fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    )}

                </div>
            </section >

            <Footer />
        </>
    );
}
