export async function compressImage(file, options = {}) {
    const { quality = 0.7, maxWidth = null, maxHeight = null, format = null, stripMetadata = true } = options;

    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width;
                let h = img.height;

                // Resize if needed
                if (maxWidth && w > maxWidth) { h = (maxWidth / w) * h; w = maxWidth; }
                if (maxHeight && h > maxHeight) { w = (maxHeight / h) * w; h = maxHeight; }

                canvas.width = Math.round(w);
                canvas.height = Math.round(h);
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Determine output format
                let mimeType = format || file.type || 'image/jpeg';
                if (mimeType === 'image/png' && !format) mimeType = 'image/png';
                if (mimeType === 'image/svg+xml') mimeType = 'image/png'; // Can't re-encode SVG via canvas

                const q = mimeType === 'image/png' ? undefined : quality;

                canvas.toBlob((blob) => {
                    if (!blob) return reject(new Error('Compression failed'));
                    const saved = Math.round((1 - blob.size / file.size) * 100);
                    resolve({
                        blob,
                        name: changeExtension(file.name, mimeType),
                        originalSize: file.size,
                        compressedSize: blob.size,
                        size: blob.size,
                        saved: Math.max(0, saved),
                        width: canvas.width,
                        height: canvas.height,
                    });
                }, mimeType, q);
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

function changeExtension(name, mimeType) {
    const extMap = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
    const ext = extMap[mimeType] || '.jpg';
    return name.replace(/\.[^.]+$/, ext);
}
