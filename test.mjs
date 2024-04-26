import OpenAI from 'openai';
//import { Configuration, OpenAIApi } from 'openai';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import readline from 'readline';

const openai = new OpenAI({
    apiKey: 'sk-proj-tAELotdhKtQ44nu86gFbT3BlbkFJQOUT7Zh2tz0eCe6YBIOX'
});
// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,  // Ensure your API key is correctly set in environment variables
// });
// const openai = new OpenAIApi(configuration);



function loadHistory() {
    try {
        if (existsSync('history.json')) {
            const data = readFileSync('history.json', 'utf8');
            return JSON.parse(data); // Attempt to parse JSON
        }
    } catch (error) {
        console.error("Failed to load or parse history file:", error);
    }
    return []; // Return an empty array if the file doesn't exist or error occurs
}

function saveHistory(history) {
    writeFileSync('history.json', JSON.stringify(history, null, 2), 'utf8');
}

let conversationHistory = loadHistory();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function sendMessage(userMessage) {
    conversationHistory.push({ role: 'user', content: userMessage });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // or "gpt-4" as per your access
            messages: conversationHistory
        });

        const aiMessage = completion.choices[0].message.content;
        conversationHistory.push({ role: 'assistant', content: aiMessage });
        console.log("AI:", aiMessage);

        saveHistory(conversationHistory);

        askQuestion();  // Continue the conversation
    } catch (error) {
        console.error("Error calling OpenAI:", error);
    }
}


function askQuestion() {
    rl.question('You: ', (input) => {
        if (input.toLowerCase() === 'exit') {  // Type 'exit' to end the conversation
            rl.close();
        } else {
            sendMessage(input);
        }
    });
}

function main() {
    console.log("Chatbot initialized. Type 'exit' to end the conversation.");
    askQuestion();
}

main();
