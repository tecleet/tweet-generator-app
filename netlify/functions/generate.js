// The new code for netlify/functions/generate.js

exports.handler = async function (event, context) {
    console.log("Function has started.");

    const { topic } = JSON.parse(event.body);
    console.log("Received topic:", topic);

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
        console.error("FATAL ERROR: The GEMINI_API_KEY is missing from Netlify's environment variables!");
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server configuration error: API Key is missing." }),
        };
    }
    console.log("API Key has been found.");

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
    const prompt = `Generate 3 unique and engaging tweet ideas for the topic: "${topic}". Format them as a numbered list.`;

    try {
        console.log("Attempting to call the Google AI API...");
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        console.log("Received a response from the API. Status:", response.status);

        if (!response.ok) {
            console.error("API response was not OK. Response body:", await response.text());
        }

        const data = await response.json();
        console.log("Full data received from API:", JSON.stringify(data, null, 2));

        const ideas = data.candidates[0].content.parts[0].text;
        console.log("Successfully extracted the ideas from the response.");

        return {
            statusCode: 200,
            body: JSON.stringify({ ideas: ideas }),
        };
    } catch (error) {
        console.error("A critical error occurred in the try-catch block:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'A critical error occurred while processing the request.' }),
        };
    }
};
