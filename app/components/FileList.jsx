'use client';
import { formatBytes } from './Dropzone';

export default function FileList({ files, results, onRemove }) {
    if (!files || files.length === 0) return null;

    return (
        <div className="file-list">
            {files.map((file, i) => {
                const thumb = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
                const result = results[i];
                const statusClass = result ? 'done' : 'pending';
                const statusText = result ? `${formatBytes(result.size)} (-${result.saved}%)` : 'Ready';

                return (
                    <div className="file-item" key={i}>
                        {thumb ? (
                            <img className="file-thumb" src={thumb} alt="" onLoad={() => URL.revokeObjectURL(thumb)} />
                        ) : (
                            <div className="file-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>📄</div>
                        )}
                        <div className="file-meta">
                            <div className="name">{file.name}</div>
                            <div className="size">{formatBytes(file.size)}</div>
                        </div>
                        <span className={`file-status ${statusClass}`}>{statusText}</span>
                        <button className="file-remove" onClick={() => onRemove(i)}>×</button>
                    </div>
                );
            })}
        </div>
    );
}
