
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/firebase/admin';

export async function POST(request: NextRequest) {
    const authorization = request.headers.get('Authorization');
    if (authorization?.startsWith('Bearer ')) {
        const idToken = authorization.split('Bearer ')[1];
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

        try {
            const decodedToken = await adminAuth.verifyIdToken(idToken);
            
            // **Admin Role Verification**
            const adminDoc = await adminDb.collection('admins').doc(decodedToken.uid).get();

            if (!adminDoc.exists) {
                console.warn(`Unauthorized login attempt: User ${decodedToken.email} (UID: ${decodedToken.uid}) is not an administrator.`);
                return NextResponse.json({ success: false, message: 'Access denied. User is not an administrator.' }, { status: 403 });
            }

            const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

            cookies().set('__session', sessionCookie, {
                maxAge: expiresIn,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'lax',
            });
            
            return NextResponse.json({ success: true });

        } catch (error: any) {
            console.error('Error creating session cookie:', error);
            // Provide a more specific error message in the response
            return NextResponse.json({ success: false, message: `Could not create session. Server error: ${error.message}` }, { status: 401 });
        }
    }

    return NextResponse.json({ success: false, message: 'Unauthorized: No Bearer token provided.' }, { status: 401 });
}
