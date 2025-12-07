
import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/firebase/admin';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const sessionCookie = cookies().get('__session')?.value;

    if (!sessionCookie) {
        return NextResponse.json({ success: false, message: 'No session cookie found.' }, { status: 401 });
    }

    try {
        const adminAuth = getAdminAuth();
        if (!adminAuth) {
            return NextResponse.json({ success: false, message: 'Server is not configured for authentication.' }, { status: 500 });
        }
        const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
        // You can return whatever user data you need on the client
        return NextResponse.json({ success: true, user: { uid: decodedToken.uid, email: decodedToken.email } });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Invalid session cookie.' }, { status: 401 });
    }
}
