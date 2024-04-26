import { readFileSync, writeFileSync, existsSync,appendFile, readFile, writeFile } from 'fs';
import OpenAI from 'openai';
import { promisify } from 'util';
import readline from 'readline';
import { Spinner } from 'cli-spinner';

const openai = new OpenAI({
    apiKey: 'sk-proj-tAELotdhKtQ44nu86gFbT3BlbkFJQOUT7Zh2tz0eCe6YBIOX'
});

const readFileAsync = promisify(readFile);
const appendFileAsync = promisify(appendFile);


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const spinner = new Spinner('Processing... %s');
spinner.setSpinnerString('|/-\\');

// Array to keep track of the entire conversation history
let conversationHistory = [];

async function sendMessage(userMessage) {
    // Add user message to conversation history
    conversationHistory.push({ role: 'user', content: userMessage });
    spinner.start();
    try {

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // or "gpt-4" as per your access
            messages: conversationHistory
        });
        spinner.stop(true);
        const aiMessage = completion.choices[0].message.content;
        console.log("AI:", aiMessage);

        // Add AI message to conversation history
        conversationHistory.push({ role: 'assistant', content: aiMessage });

        return aiMessage;
    } catch (error) {
        spinner.stop(true);
        console.error("Error calling OpenAI:", error);
        return '';
    }
}

async function appendSolutionToFile(filePath, content) {
    try {
        const spacer = '\n'.repeat(7);
        await appendFileAsync(filePath, content +spacer+ "\n", 'utf8');
        console.log(`Successfully appended to ${filePath}`);
    } catch (error) {
        console.error("Error appending to file:", error);
    }
}

async function processInitialProblem(problemFilePath) {
    const problemContent = await readFileAsync(problemFilePath, 'utf8');
    console.log("Processing initial problem from file...");
    const solutionContent = await sendMessage(problemContent);
    await appendSolutionToFile('solution.txt', solutionContent);
}

function askQuestion() {
    rl.question('Enter your question (type "exit" to quit): ', async (input) => {
        if (input.toLowerCase() === 'exit') {
            spinner.stop(true);
            console.log("Exiting...");
            rl.close();
        } else {
            const solutionContent = await sendMessage(input);
            await appendSolutionToFile('solution.txt', solutionContent);
            askQuestion();
        }
    });
}

async function main() {
    await processInitialProblem('problem.txt');
    console.log("Now you can ask further questions.");
    askQuestion();
}

main();
