import { compressImage } from './compressor';
import { convertImage } from './converter';
import { resizeImage } from './resizer';

export const STEP_TYPES = [
    { id: 'resize', name: 'Resize', icon: '📏', desc: 'Change image dimensions' },
    { id: 'compress', name: 'Compress', icon: '📦', desc: 'Reduce file size' },
    { id: 'convert', name: 'Convert', icon: '🔄', desc: 'Change image format' },
    { id: 'rename', name: 'Rename', icon: '📝', desc: 'Batch rename files' },
    { id: 'metadata', name: 'Remove Metadata', icon: '🧹', desc: 'Strip EXIF data' },
    { id: 'watermark', name: 'Watermark', icon: '💧', desc: 'Add text watermark (Beta)' },
];

export async function executePipeline(files, steps, onProgress) {
    const results = [];

    for (let fi = 0; fi < files.length; fi++) {
        let currentBlob = files[fi];
        let currentName = files[fi].name;

        for (let si = 0; si < steps.length; si++) {
            const step = steps[si];
            onProgress?.({ fileIndex: fi, stepIndex: si, total: files.length, totalSteps: steps.length });

            try {
                const fileObj = new File([currentBlob], currentName, { type: currentBlob.type || 'image/png' });

                switch (step.type) {
                    case 'resize': {
                        const res = await resizeImage(fileObj, step.config || { percentage: 50 });
                        currentBlob = res.blob;
                        currentName = res.name;
                        break;
                    }
                    case 'compress': {
                        const res = await compressImage(fileObj, step.config || { quality: 0.7 });
                        currentBlob = res.blob;
                        currentName = res.name;
                        break;
                    }
                    case 'convert': {
                        const res = await convertImage(fileObj, step.config?.format || 'image/webp', step.config);
                        currentBlob = res.blob;
                        currentName = res.name;
                        break;
                    }
                    case 'rename': {
                        const template = step.config?.template || '{name}_{index}';
                        currentName = template
                            .replace('{name}', currentName.replace(/\.[^.]+$/, ''))
                            .replace('{index}', fi + 1)
                            .replace('{date}', new Date().toISOString().slice(0, 10))
                            + (currentName.match(/\.[^.]+$/)?.[0] || '');
                        break;
                    }
                    case 'metadata': {
                        const res = await compressImage(fileObj, { quality: 0.95 });
                        currentBlob = res.blob;
                        currentName = res.name;
                        break;
                    }
                    case 'watermark': {
                        const res = await addWatermark(fileObj, step.config?.text || 'Sample');
                        currentBlob = res.blob;
                        currentName = res.name;
                        break;
                    }
                }
            } catch (err) {
                console.error(`Pipeline error at file ${fi}, step ${si}:`, err);
            }
        }

        results.push({ blob: currentBlob, name: currentName });
    }

    onProgress?.({ done: true });
    return results;
}

async function addWatermark(file, text) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = (e) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const fontSize = Math.max(16, Math.round(img.width / 20));
                ctx.font = `${fontSize}px Inter, sans-serif`;
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.textAlign = 'center';
                ctx.fillText(text, canvas.width / 2, canvas.height - fontSize);

                canvas.toBlob((blob) => {
                    resolve({ blob, name: file.name });
                }, file.type || 'image/png');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}
