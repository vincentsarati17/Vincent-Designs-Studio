
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        cookies().delete('__session');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Logout failed:', error);
        return NextResponse.json({ success: false, message: 'Logout failed.' }, { status: 500 });
    }
}
