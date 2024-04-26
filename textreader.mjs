import { readFileSync, writeFileSync, existsSync, readFile, writeFile } from 'fs';
import OpenAI from 'openai';
import { promisify } from 'util';
const openai = new OpenAI({
    apiKey: 'sk-proj-tAELotdhKtQ44nu86gFbT3BlbkFJQOUT7Zh2tz0eCe6YBIOX'
});
// Promisify readFile and writeFile for use with async/await
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
// Function to read content from a file asynchronously
async function readFromFile(filePath) {
    try {
        const content = await readFileAsync(filePath, 'utf8');
        return content;
    } catch (error) {
        console.error("Error reading file:", error);
        throw new Error('Failed to read file.');
    }
}

// Function to write content to a file asynchronously
async function writeToFile(filePath, content) {
    try {
        await writeFileAsync(filePath, content, 'utf8');
        console.log(`Successfully wrote to ${filePath}`);
    } catch (error) {
        console.error("Error writing to file:", error);
        throw new Error('Failed to write to file.');
    }
}


async function processProblemAndSolution(problemFilePath, solutionFilePath) {
    try {
        // Read the problem from a file
        const problemContent = await readFromFile(problemFilePath);
        // Generate a solution using the OpenAI API
        const solutionContent = await sendMessage(problemContent);
        // Write the solution to a file
        await writeToFile(solutionFilePath, solutionContent);
    } catch (error) {
        console.error("Failed to process the problem and write solution:", error);
    }
}

async function sendMessage(userMessage) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4", // or "gpt-4" as per your access
            messages: [{ role: "user", content: userMessage }]
        });

        const aiMessage = completion.choices[0].message.content;
        console.log("AI:", aiMessage);  // You can still log the message if needed
        return aiMessage;  // Return the response for further use
    } catch (error) {
        console.error("Error calling OpenAI:", error);
        return '';  // Return empty string on error
    }
}
function main() {
    const problemFilePath = 'problem.txt';
    const solutionFilePath = 'solution.txt';

    processProblemAndSolution(problemFilePath, solutionFilePath);
}

main();
