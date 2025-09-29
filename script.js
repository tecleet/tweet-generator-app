// Get the HTML elements we need to work with
const generateBtn = document.getElementById('generateBtn');
const topicInput = document.getElementById('topicInput');
const resultsDiv = document.getElementById('results');

// Listen for a click on the button
generateBtn.addEventListener('click', () => {
    const topic = topicInput.value;
    if (!topic) {
        alert("Please enter a topic!");
        return;
    }

    resultsDiv.innerText = "🤖 Generating ideas...";

    // This is where we'll call our secure Netlify function
    // The function will be located at '/.netlify/functions/generate'
    fetch('/.netlify/functions/generate', {
        method: 'POST',
        body: JSON.stringify({ topic: topic })
    })
    .then(response => response.json())
    .then(data => {
        // Display the result from the AI
        resultsDiv.innerText = data.ideas;
    })
    .catch(error => {
        console.error('Error:', error);
        resultsDiv.innerText = "Sorry, something went wrong. Please try again.";
    });
});
