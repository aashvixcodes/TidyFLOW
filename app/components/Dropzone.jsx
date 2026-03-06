'use client';
import { useState, useRef } from 'react';

export function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function Dropzone({ accept = 'image/*', multiple = true, onFiles }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files.length) {
            onFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleChange = (e) => {
        if (e.target.files.length) {
            onFiles(Array.from(e.target.files));
        }
        // reset input
        e.target.value = '';
    };

    return (
        <div
            className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="dz-icon">📂</div>
            <h3>Drag & drop files here</h3>
            <p>or <strong style={{ color: 'var(--blue-500)', cursor: 'pointer' }}>browse files</strong> • Supports PNG, JPG, WebP, SVG, HEIC</p>
            <input
                type="file"
                accept={accept}
                multiple={multiple}
                ref={fileInputRef}
                onChange={handleChange}
                style={{ display: 'none' }}
            />
        </div>
    );
}
