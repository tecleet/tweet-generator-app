// The code for our secure serverless function (netlify/functions/generate.js)

exports.handler = async function (event, context) {
    // Get the topic from the user's request
    const { topic } = JSON.parse(event.body);
    
    // IMPORTANT: Your secret API key goes here.
    // We will set this in the Netlify dashboard, not in the code.
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `Generate 3 unique and engaging tweet ideas for the topic: "${topic}". Format them as a numbered list.`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        const data = await response.json();
        // Extract the text from the AI's response
        const ideas = data.candidates[0].content.parts[0].text;

        return {
            statusCode: 200,
            body: JSON.stringify({ ideas: ideas }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch ideas' }) };
    }
};
