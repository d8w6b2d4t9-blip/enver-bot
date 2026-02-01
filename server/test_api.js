async function testApi() {
    console.log("Testing API endpoint...");
    try {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: '안녕' })
        });
        const data = await response.json();
        console.log("API Response:", data);
    } catch (error) {
        console.error("API Test Failed:", error);
    }
}

testApi();
