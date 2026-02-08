import autocannon from 'autocannon';

async function runTest() {
    console.log('🚀 Starting Performance Test...');

    const result = await autocannon({
        url: 'http://localhost:3001/api/v1/lessons',
        connections: 100, // Concurrent users
        duration: 5,     // Seconds
        pipelining: 1,
        title: 'OpenKernel EDU - Lesson Load'
    });

    console.log('📊 Result Highlights:');
    console.log('-------------------');
    console.log(`Title: ${result.title}`);
    console.log(`Requests/sec: ${result.requests.average}`);
    console.log(`Latency (avg): ${result.latency.average} ms`);
    console.log(`Latency (p99): ${result.latency.p99} ms`);
    console.log(`Errors: ${result.errors}`);
    console.log(`Timeouts: ${result.timeouts}`);

    if (result.latency.average < 500) {
        console.log('✅ SLA Met: Average latency < 500ms');
    } else {
        console.log('❌ SLA Violated: Average latency > 500ms');
    }

    // Execution performance test
    console.log('\n⚙️ Testing Execution Latency...');
    const execResult = await autocannon({
        url: 'http://localhost:3001/api/v1/lessons/lesson-01/validate-step', // Use valid ID
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            stepNumber: 1,
            userCode: '📥 42\n🖨️\n⏹️'
        }),
        connections: 50,
        duration: 5
    });

    console.log('\n⚙️ Execution Performance:');
    console.log('-------------------');
    console.log(`Latency (avg): ${execResult.latency.average} ms`);

    if (execResult.latency.average < 100) {
        console.log('✅ SLA Met: Fast execution (< 100ms HTTP included)');
    }
}

runTest().catch(console.error);
