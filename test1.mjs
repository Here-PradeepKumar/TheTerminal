import OpenAI from "openai";

const openai = new OpenAI({ apiKey: 'sk-proj-tAELotdhKtQ44nu86gFbT3BlbkFJQOUT7Zh2tz0eCe6YBIOX' });

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "give me a code" }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}


main();