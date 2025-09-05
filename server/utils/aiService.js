// services/aiService.js
require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");
const serviceAccount = JSON.parse(process.env.GCP_KEY);

const vertexAI = new VertexAI({
  project: process.env.GCLOUD_PROJECT,
  location: "us-central1",
   googleAuthOptions: {
    credentials: serviceAccount,
  },
});

const model = vertexAI.getGenerativeModel({ model: "gemini-2.5-pro" });

async function analyzeCode(codeSnippet) {
  const prompt = `
  Analyze the following JavaScript code. Provide:
  1. A simple explanation
  2. Possible errors
  3. Complexity level (Low, Medium, High)
  4. Security risks
  5. Optimization suggestions
  6. Best practices

  Code:
  ${codeSnippet}
  `;

  const response = await model.generateContent(prompt);
  const text = response.response.candidates[0].content.parts[0].text;

  return text;
}

module.exports = { analyzeCode };
