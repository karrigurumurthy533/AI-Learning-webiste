import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

if (!process.env.OPENROUTER_API_KEY) {
  console.log("FATAL ERROR: OPENROUTER_API_KEY is not set");
  process.exit(1);
}

const ai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// 🔥 Stable model (IMPORTANT)
const MODEL = "openai/gpt-3.5-turbo";

/**
 * FLASHCARDS
 */
export const generateFlashcards = async (text, count = 10) => {
  const prompt = `Generate exactly ${count} educational flashcards. from the following text

Format each flashcard as:
Q: question
A: answer
D: Difficulty level:easy,medium or hard

Separate with each flashcard with "----"

Text:
${text.substring(0, 15000)}`;

  try {
    const response = await ai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You generate flashcards in strict format only.",
        },
        { role: "user", content: prompt },
      ],
    });

    const output = response.choices[0].message.content;

    const cards = output.split("----").filter(Boolean);

    const flashcards = [];

    for (const card of cards) {
      const lines = card.trim().split("\n");

      let question = "";
      let answer = "";
      let difficulty = "medium";

      for (const line of lines) {
        const l = line.trim();

        if (l.startsWith("Q")) {
          question = l.replace("Q:", "").trim();
        } else if (l.startsWith("A")) {
          answer = l.replace("A:", "").trim();
        } else if (l.startsWith("D")) {
          const diff = l.replace("D:", "").trim().toLowerCase();
          if (["easy", "medium", "hard"].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      if (question && answer) {
        flashcards.push({ question, answer, difficulty });
      }
    }

    return flashcards.slice(0, count);
  } catch (error) {
    console.error("OpenRouter Error:", error);
    throw new Error("failed to generate flashcards");
  }
};

/**
 * QUIZ
 */
export const generateQuiz = async (text, numOfQuestions = 5) => {
  const prompt = `Generate exactly ${numOfQuestions} MCQs.

STRICT RULES:
- Follow format EXACTLY
- Do NOT skip C or E
- C must be EXACTLY one of the options text OR O1/O2/O3/O4
- E must NOT be empty

FORMAT:
Q: question
O1: option1
O2: option2
O3: option3
O4: option4
C: correct answer
E: Brief explanation
D: Difficulty level:easy|medium|hard

Separate each question with ----
TEXT:
${text.substring(0, 15000)}
`;


  try {
    const response = await ai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "Return ONLY the specified format. No extra text.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const generatedText =
      response?.choices?.[0]?.message?.content || "";

    const questions = [];

    const blocks = generatedText
      .split("----")
      .map((b) => b.trim())
      .filter(Boolean);

    for (const block of blocks) {
      const lines = block.split("\n").map((l) => l.trim());

      let question = "";
      let options = [];
      let correctAnswer = "";
      let explanation = "";
      let difficulty = "medium";

      for (const line of lines) {
        if (line.startsWith("Q:")) {
          question = line.slice(2).trim();

        } else if (/^O\d:/.test(line)) {
          options.push(line.slice(3).trim());

        } else if (line.startsWith("C:")) {
          const value = line.slice(2).trim();

          // Handle C: O1/O2/O3/O4
          const match = value.match(/^O(\d)$/i);
          if (match) {
            const index = parseInt(match[1]) - 1;
            correctAnswer = options[index] || "";
          } else {
            correctAnswer = value;
          }

        } else if (line.startsWith("E:")) {
          explanation = line
            .slice(2)
            .replace(/^Explanation:/i, "")
            .trim();

        } else if (line.startsWith("D:")) {
          const diff = line.slice(2).trim().toLowerCase();
          if (["easy", "medium", "hard"].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      // ✅ Strong validation
      if (
        question &&
        options.length === 4 &&
        correctAnswer &&
        options.includes(correctAnswer)
      ) {
        questions.push({
          question,
          options,
          correctAnswer,
          explanation: explanation || "No explanation provided",
          difficulty,
        });
      }
    }

    return questions.slice(0, numOfQuestions);
  } catch (error) {
    console.error("AI Quiz Generation Error:", error);
    throw new Error("Failed to generate quiz");
  }
};
/**
 * SUMMARY
 */
export const generateSummary = async (text) => {
  const prompt = `Provide a concise Summary of the following text,highlighting the key concepts and main ideas and Important points keep the summary clear and Structured:

${text.substring(0, 20000)}`;

  try {
    const response = await ai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You summarize clearly in simple structured points.",
        },
        { role: "user", content: prompt },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter Error:", error);
    throw new Error("failed to generate summary");
  }
};

/**
 * CHAT WITH CONTEXT
 */
export const chatWithContext = async (question, chunks) => {
  const context = chunks
    .map((c, i) => `[chunk ${i + 1}]\n${c.content}`)
    .join("\n\n");

const prompt = `
Based on the following context from a document, analyze the content and answer the user's question clearly and accurately.

Instructions:
- Provide a clear and structured answer
- Use bullet points if helpful
- Keep the explanation simple and easy to understand
- If the answer is not available in the context, provide a related and helpful answer based on general knowledge

Context:
${context}

Question:
${question}`;

  try {
    const response = await ai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "Answer only from context. Be strict.",
        },
        { role: "user", content: prompt },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter Error:", error);
    throw new Error("failed to generate response");
  }
};

/**
 * EXPLAIN CONCEPT
 */
export const explainConcept = async (concept, context) => {
  const prompt = `Explain "${concept}" simply.

Context:
${context.substring(0, 10000)}`;

  try {
    const response = await ai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a teacher. Explain step-by-step in simple language.",
        },
        { role: "user", content: prompt },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter Error:", error);
    throw new Error("failed to explain concept");
  }
};