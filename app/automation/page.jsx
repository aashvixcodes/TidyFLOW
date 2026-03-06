'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Dropzone from '../components/Dropzone';
import { STEP_TYPES, executePipeline } from '../../lib/engine/pipeline';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
const anime = require('animejs');

export default function AutomationPage() {
    const [pipelineSteps, setPipelineSteps] = useState([]);
    const [pipelineFiles, setPipelineFiles] = useState([]);
    const [pipelineResults, setPipelineResults] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progressText, setProgressText] = useState('');
    const [progressPct, setProgressPct] = useState(0);

    // Animate steps on add
    useEffect(() => {
        if (pipelineSteps.length > 0) {
            anime({
                targets: '.pipeline-step',
                opacity: [0, 1],
                translateX: [-20, 0],
                delay: anime.stagger(80),
                duration: 400,
                easing: 'easeOutQuad'
            });
        }
    }, [pipelineSteps.length]);

    const handleAddStep = (stepType) => {
        const defaultConfigs = {
            resize: { percentage: 50 },
            compress: { quality: 0.7 },
            convert: { format: 'image/webp' },
            rename: { template: '{name}_{index}' },
            metadata: {},
            watermark: { text: 'Sample Watermark' }
        };

        const config = defaultConfigs[stepType.id] || {};
        const newStep = {
            type: stepType.id,
            name: stepType.name,
            icon: stepType.icon,
            config
        };

        setPipelineSteps([...pipelineSteps, newStep]);
        setIsModalOpen(false);
    };

    const handleRemoveStep = (index) => {
        const newSteps = [...pipelineSteps];
        newSteps.splice(index, 1);
        setPipelineSteps(newSteps);
    };

    const handleFiles = (newFiles) => {
        const validFiles = newFiles.filter(f => f.type.startsWith('image/'));
        setPipelineFiles([...pipelineFiles, ...validFiles]);
    };

    const clearAll = () => {
        setPipelineSteps([]);
        setPipelineFiles([]);
        setPipelineResults([]);
        setProgressText('');
    };

    const runPipeline = async () => {
        if (pipelineSteps.length === 0 || pipelineFiles.length === 0) return;

        setIsProcessing(true);
        setPipelineResults([]);
        setProgressText('Preparing...');
        setProgressPct(0);

        const results = await executePipeline(pipelineFiles, pipelineSteps, (progress) => {
            if (progress.done) {
                setProgressPct(100);
                setProgressText('Done!');
            } else {
                const pct = ((progress.fileIndex * progress.totalSteps + progress.stepIndex) / (progress.total * progress.totalSteps)) * 100;
                setProgressPct(pct);
                setProgressText(`Processing file ${progress.fileIndex + 1}/${progress.total}, step ${progress.stepIndex + 1}/${progress.totalSteps}`);
            }
        });

        setPipelineResults(results);
        setTimeout(() => setIsProcessing(false), 800);
    };

    const downloadResults = async () => {
        if (pipelineResults.length === 1) {
            saveAs(pipelineResults[0].blob, pipelineResults[0].name);
        } else if (pipelineResults.length > 1) {
            const zip = new JSZip();
            pipelineResults.forEach(r => zip.file(r.name, r.blob));
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, 'pipeline-output.zip');
        }
    };

    const savePreset = () => {
        if (pipelineSteps.length === 0) return alert('No steps to save!');
        const name = prompt('Preset name:');
        if (!name) return;

        const presets = JSON.parse(localStorage.getItem('rfPresets') || '{}');
        presets[name] = pipelineSteps;
        localStorage.setItem('rfPresets', JSON.stringify(presets));
        alert(`Preset "${name}" saved!`);
    };

    const loadPreset = () => {
        const presets = JSON.parse(localStorage.getItem('rfPresets') || '{}');
        const keys = Object.keys(presets);
        if (keys.length === 0) return alert('No saved presets.');

        const name = prompt(`Presets:\n${keys.map((k, i) => `${i + 1}. ${k}`).join('\n')}\n\nEnter preset name:`);
        if (!name || !presets[name]) return alert('Preset not found.');

        setPipelineSteps(presets[name]);
    };

    const renderStepConfigStr = (step) => {
        switch (step.type) {
            case 'resize': return `Scale to ${step.config.percentage}%`;
            case 'compress': return `Quality: ${Math.round(step.config.quality * 100)}%`;
            case 'convert': return `To ${step.config.format ? step.config.format.split('/')[1]?.toUpperCase() : 'UNKNOWN'}`;
            case 'rename': return `Template: ${step.config.template}`;
            case 'metadata': return 'Strip all EXIF data';
            case 'watermark': return `Text: "${step.config.text}"`;
            default: return '';
        }
    };

    return (
        <>
            <Navbar activePage="automation" />

            <section className="tools-hero">
                <div className="container">
                    <span className="badge badge-red" style={{ marginBottom: "16px" }}>Automation</span>
                    <h1>Pipeline Builder</h1>
                    <p style={{ fontSize: "1.1rem", maxWidth: "560px", margin: "12px auto 0" }}>
                        Chain multiple processing steps into one pipeline. Drop your files and watch them flow through resize, compress, convert, rename, and more — all in your browser.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container pipeline-builder">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                        <h2 style={{ fontSize: "1.3rem" }}>Pipeline Steps</h2>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button className="btn btn-secondary btn-sm" onClick={savePreset}>💾 Save Preset</button>
                            <button className="btn btn-secondary btn-sm" onClick={loadPreset}>📂 Load Preset</button>
                        </div>
                    </div>

                    <div className="pipeline-steps" id="pipeline-steps">
                        {pipelineSteps.length === 0 ? (
                            <p style={{ textAlign: "center", color: "var(--dark-500)", padding: "24px 0" }}>
                                No steps added yet. Click below to add your first step.
                            </p>
                        ) : (
                            pipelineSteps.map((step, i) => (
                                <div key={i} style={{ display: "contents" }}>
                                    {i > 0 && <div className="pipeline-connector"></div>}
                                    <div className="pipeline-step">
                                        <div className="step-num">{i + 1}</div>
                                        <div style={{ fontSize: "1.3rem" }}>{step.icon}</div>
                                        <div className="step-info">
                                            <h4>{step.name}</h4>
                                            <p>{renderStepConfigStr(step)}</p>
                                        </div>
                                        <button className="step-remove" onClick={() => handleRemoveStep(i)}>✕</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <button className="add-step-btn" onClick={() => setIsModalOpen(true)}>
                        <span style={{ fontSize: "1.2rem" }}>＋</span> Add Step
                    </button>

                    <div style={{ marginTop: "32px" }}>
                        <h3 style={{ fontSize: "1.1rem", marginBottom: "12px" }}>Drop Files to Process</h3>
                        <Dropzone accept="image/*" multiple={true} onFiles={handleFiles} />
                    </div>

                    {pipelineFiles.length > 0 && (
                        <div id="file-count" style={{ marginTop: "12px", fontSize: "0.88rem", color: "var(--dark-400)" }}>
                            {pipelineFiles.length} file(s) ready
                        </div>
                    )}

                    <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                        <button
                            className="btn btn-primary btn-lg"
                            disabled={pipelineSteps.length === 0 || pipelineFiles.length === 0 || isProcessing}
                            style={{ flex: 1 }}
                            onClick={runPipeline}
                        >
                            {isProcessing ? '⏳ Processing...' : '▶ Run Pipeline'}
                        </button>
                        <button className="btn btn-secondary" onClick={clearAll}>Clear All</button>
                    </div>

                    {(isProcessing || progressText) && (
                        <>
                            <div className="progress-bar" style={{ display: "block", marginTop: "16px" }}>
                                <div className="fill" style={{ width: `${progressPct}%` }}></div>
                            </div>
                            <p style={{ textAlign: "center", marginTop: "8px", fontSize: "0.85rem", color: "var(--dark-400)" }}>
                                {progressText}
                            </p>
                        </>
                    )}

                    {!isProcessing && pipelineResults.length > 0 && (
                        <div className="results-bar" style={{ display: "flex", marginTop: "24px" }}>
                            <div className="stats">
                                <div className="stat">
                                    <div className="val">{pipelineResults.length}</div>
                                    <div className="label">Processed</div>
                                </div>
                                <div className="stat">
                                    <div className="val">{pipelineSteps.length}</div>
                                    <div className="label">Steps</div>
                                </div>
                            </div>
                            <button className="btn btn-primary" onClick={downloadResults}>⬇ Download All</button>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="step-modal-overlay active" onClick={(e) => {
                        if (e.target.className.includes('step-modal-overlay')) setIsModalOpen(false);
                    }}>
                        <div className="step-modal">
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                                <h3 style={{ margin: 0 }}>Add Step</h3>
                                <button onClick={() => setIsModalOpen(false)} style={{ fontSize: "1.4rem", color: "var(--dark-400)", cursor: "pointer", background: 'none', border: 'none' }}>✕</button>
                            </div>
                            <div className="step-options">
                                {STEP_TYPES.map((step) => (
                                    <div className="step-option" key={step.id} onClick={() => handleAddStep(step)}>
                                        <div className="so-icon">{step.icon}</div>
                                        <h4>{step.name}</h4>
                                        <p>{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </section >

            <Footer />
        </>
    );
}
