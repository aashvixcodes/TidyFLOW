export async function convertImage(file, targetFormat = 'image/png', options = {}) {
    const { quality = 0.92, maxWidth = null, maxHeight = null } = options;

    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width;
                let h = img.height;

                if (maxWidth && w > maxWidth) { h = (maxWidth / w) * h; w = maxWidth; }
                if (maxHeight && h > maxHeight) { w = (maxHeight / h) * w; h = maxHeight; }

                canvas.width = Math.round(w);
                canvas.height = Math.round(h);
                const ctx = canvas.getContext('2d');

                // White background for JPEG (no transparency)
                if (targetFormat === 'image/jpeg') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const q = targetFormat === 'image/png' ? undefined : quality;
                canvas.toBlob((blob) => {
                    if (!blob) return reject(new Error('Conversion failed'));
                    resolve({
                        blob,
                        name: changeExtension(file.name, targetFormat),
                        originalSize: file.size,
                        convertedSize: blob.size,
                        size: blob.size,
                        originalFormat: file.type,
                        targetFormat,
                        width: canvas.width,
                        height: canvas.height,
                    });
                }, targetFormat, q);
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

function changeExtension(name, mimeType) {
    const extMap = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' };
    const ext = extMap[mimeType] || '.png';
    return name.replace(/\.[^.]+$/, ext);
}

export const FORMAT_OPTIONS = [
    { value: 'image/png', label: 'PNG' },
    { value: 'image/jpeg', label: 'JPG' },
    { value: 'image/webp', label: 'WebP' },
];
