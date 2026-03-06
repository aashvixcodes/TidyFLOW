import { NextResponse } from 'next/server';

// In a real application, you would save this to a database
export async function POST(req) {
    try {
        const data = await req.json();
        console.log('Received tracking event:', data);

        // Simple response acknowledging the tracking
        return NextResponse.json({ success: true, message: 'Event logged' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Invalid tracking payload' }, { status: 400 });
    }
}
