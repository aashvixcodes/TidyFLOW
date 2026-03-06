'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Dropzone from '../components/Dropzone';
import FileList from '../components/FileList';
import { convertImage, FORMAT_OPTIONS } from '../../lib/engine/converter';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function ConvertPage() {
    const [files, setFiles] = useState([]);
    const [results, setResults] = useState([]);
    const [targetFormat, setTargetFormat] = useState('image/png');
    const [quality, setQuality] = useState(92);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFiles = async (newFiles) => {
        const validFiles = newFiles.filter(f => f.type.startsWith('image/'));
        if (validFiles.length === 0) return;

        const newFilesList = [...files, ...validFiles];
        setFiles(newFilesList);

        const newResultsList = [...results, ...new Array(validFiles.length).fill(null)];
        setResults(newResultsList);

        setIsProcessing(true);
        setProgress(0);

        const updatedResults = [...newResultsList];

        for (let i = files.length; i < newFilesList.length; i++) {
            try {
                const res = await convertImage(newFilesList[i], targetFormat, { quality: quality / 100 });
                updatedResults[i] = { ...res, saved: 0 };
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
            saveAs(content, 'converted-images.zip');
        }
    };

    const doneResults = results.filter(Boolean);
    const displayFormatLabel = FORMAT_OPTIONS.find(f => f.value === targetFormat)?.label || '?';

    return (
        <>
            <Navbar activePage="tools" />

            <section className="tools-hero">
                <div className="container">
                    <span className="badge badge-red" style={{ marginBottom: "16px" }}>193+ Pairs</span>
                    <h1>Image Converter</h1>
                    <p style={{ fontSize: "1.1rem", maxWidth: "500px", margin: "12px auto 0" }}>
                        Convert between PNG, JPG, and WebP. Auto-detects source format. 100% in your browser.
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
                            <label>Target Format</label>
                            <select
                                value={targetFormat}
                                onChange={(e) => setTargetFormat(e.target.value)}
                            >
                                {FORMAT_OPTIONS.map(f => (
                                    <option key={f.value} value={f.value}>{f.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="control-group">
                            <label>Quality (for JPG/WebP)</label>
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
                    </div>

                    {files.length > 0 && (
                        <div className="results-bar" style={{ display: "flex", marginTop: "24px" }}>
                            <div className="stats">
                                <div className="stat">
                                    <div className="val">{doneResults.length}</div>
                                    <div className="label">Converted</div>
                                </div>
                                <div className="stat">
                                    <div className="val">{displayFormatLabel}</div>
                                    <div className="label">Format</div>
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
