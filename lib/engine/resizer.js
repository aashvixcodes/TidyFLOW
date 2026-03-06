export async function resizeImage(file, options = {}) {
    const { width = null, height = null, percentage = null, maintainAspectRatio = true } = options;

    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.onload = () => {
                let w, h;

                if (percentage) {
                    w = Math.round(img.width * (percentage / 100));
                    h = Math.round(img.height * (percentage / 100));
                } else if (width && height) {
                    w = width;
                    h = height;
                } else if (width) {
                    w = width;
                    h = maintainAspectRatio ? Math.round(img.height * (width / img.width)) : img.height;
                } else if (height) {
                    h = height;
                    w = maintainAspectRatio ? Math.round(img.width * (height / img.height)) : img.width;
                } else {
                    w = img.width;
                    h = img.height;
                }

                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);

                canvas.toBlob((blob) => {
                    if (!blob) return reject(new Error('Resize failed'));
                    resolve({
                        blob,
                        name: file.name,
                        originalSize: file.size,
                        size: blob.size,
                        originalWidth: img.width,
                        originalHeight: img.height,
                        width: w,
                        height: h,
                    });
                }, file.type || 'image/png');
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}
