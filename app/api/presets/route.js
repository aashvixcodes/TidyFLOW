import { NextResponse } from 'next/server';

export async function GET() {
    // Mock data for preset pipelines
    const presets = {
        "Web Optimizer": [
            { type: "resize", name: "Resize", icon: "📏", config: { width: 1920, maintainAspectRatio: true } },
            { type: "convert", name: "Convert", icon: "🔄", config: { format: "image/webp" } },
            { type: "compress", name: "Compress", icon: "📦", config: { quality: 0.8 } }
        ],
        "Thumbnail Generator": [
            { type: "resize", name: "Resize", icon: "📏", config: { width: 400, height: 400, maintainAspectRatio: false } },
            { type: "compress", name: "Compress", icon: "📦", config: { quality: 0.85 } },
            { type: "rename", name: "Rename", icon: "📝", config: { template: "thumb_{name}" } }
        ]
    };

    return NextResponse.json(presets, { status: 200 });
}
