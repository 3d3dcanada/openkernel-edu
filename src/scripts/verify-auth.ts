// import fetch from 'node-fetch'; // Using global fetch
// Using global fetch for simplicity as we are running with tsx/node 20+

const BASE_URL = 'http://localhost:3001/api/v1';

async function verifyAuth() {
    console.log('🚀 Starting Auth Verification...');

    // 1. Register a new user
    console.log('\n1. Testing Registration...');
    const uniqueEmail = `test.student.${Date.now()}@example.com`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: uniqueEmail,
            password: 'password123',
            name: 'Test Student'
        })
    });

    if (regRes.status !== 201) {
        console.error('❌ Registration failed:', await regRes.text());
        return;
    }

    const regData = await regRes.json();
    console.log('✅ Registration successful:', regData.user.email);
    const token = regData.token;

    // 2. Login
    console.log('\n2. Testing Login...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: uniqueEmail,
            password: 'password123'
        })
    });

    if (loginRes.status !== 200) {
        console.error('❌ Login failed:', await loginRes.text());
        return;
    }

    const loginData = await loginRes.json();
    console.log('✅ Login successful. Token received.');

    // 3. Get Profile (Protected Route)
    console.log('\n3. Testing /me (Protected Route)...');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (meRes.status !== 200) {
        console.error('❌ Failed to get profile:', await meRes.text());
        return;
    }
    const meData = await meRes.json();
    console.log('✅ Profile retrieved:', meData.name, `(${meData.role})`);

    // 4. Test Mock OAuth (Google)
    console.log('\n4. Testing Mock Google Login...');
    // The mock implementation should return JSON directly for now based on controller code
    const googleRes = await fetch(`${BASE_URL}/auth/oauth/google/callback`);
    if (googleRes.status === 200) {
        const googleData = await googleRes.json();
        console.log('✅ Mock Google Login successful:', googleData.user.email);
    } else {
        console.error('❌ Mock Google Login failed:', await googleRes.text());
    }

    console.log('\n🎉 Verification Complete!');
}

verifyAuth().catch(console.error);
