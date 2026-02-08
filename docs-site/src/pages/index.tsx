import React from 'react';
import Layout from '@theme/Layout';

export default function Home(): JSX.Element {
    return (
        <Layout
            title="OpenKernel EDU"
            description="The world's most accessible computer science education platform.">
            <main style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Welcome to OpenKernel EDU Documentation 📚</h1>
                <p>Learn computer science using EmojiASM - zero language barriers.</p>
                <div style={{ marginTop: '2rem' }}>
                    <a href="/docs/intro" style={{
                        background: '#FF6B6B',
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '1.2rem'
                    }}>Getting Started 🚀</a>
                </div>
            </main>
        </Layout>
    );
}
