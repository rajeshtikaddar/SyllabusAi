import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client with standard User-Agent header
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [], syllabusContext = '' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getAIClient();
    
    let systemInstruction = `You are SyllabusAI, an intelligent, supportive, high-clarity academic assistant and study coach.
You help university and high school students master their coursework, parse syllabi, organize assignments, break down dense concepts, and optimize study schedules.
Keep your explanations precise, academically grounded, motivating, and neatly formatted with bullet points or step-by-step breakdowns where helpful.`;

    if (syllabusContext) {
      systemInstruction += `\n\nActive Course / Syllabus Context:\n${syllabusContext}`;
    }

    const chat = ai.chats.create({
      model: 'gemini-3.7-flash',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const response = await chat.sendMessage({
      message,
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate response from SyllabusAI',
    });
  }
});

// AI Summarize Syllabus / Unit Endpoint
app.post('/api/ai/summarize', async (req, res) => {
  try {
    const { title, course, content, focusArea } = req.body;

    const ai = getAIClient();
    const prompt = `Please provide a high-yield, structured academic summary and study guide for:
Course: ${course || 'Academic Course'}
Topic/Unit: ${title}
${focusArea ? `Specific Focus: ${focusArea}` : ''}
${content ? `Content / Syllabus Excerpt:\n${content}` : ''}

Format the response with:
1. 🎯 **Key Objectives & Core Takeaways** (3-4 bullet points)
2. 🧠 **Essential Concepts & Formulas / Definitions**
3. ⚠️ **Common Pitfalls & Exam Traps**
4. 📝 **High-Yield Practice Questions / Reflection Prompts** (2-3 questions)
5. ⏱️ **Recommended Study Plan (Estimated hours and breakdown)**`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an elite academic tutor creating concise, structured, mastery-level study summaries for university students.',
        temperature: 0.6,
      },
    });

    return res.json({ summary: response.text });
  } catch (error: any) {
    console.error('AI Summarize Error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate syllabus summary' });
  }
});

// AI Subtask Breakdown for Projects / Assignments
app.post('/api/ai/subtasks', async (req, res) => {
  try {
    const { taskTitle, description, course, dueDate } = req.body;

    const ai = getAIClient();
    const prompt = `Break down this academic assignment/project into 4 to 6 actionable, chronological subtasks with estimated time and milestone focus:
Task: ${taskTitle}
Course: ${course || 'General'}
Details: ${description || 'Standard academic deliverable'}
Due Date: ${dueDate || 'Upcoming'}

Return a JSON array of objects with the following format:
[
  { "title": "Subtask title", "estimatedHours": 1.5, "priority": "High" | "Medium" | "Low", "description": "Brief instruction" }
]
Only return valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let subtasks = [];
    try {
      subtasks = JSON.parse(response.text || '[]');
    } catch {
      subtasks = [
        { title: 'Review project requirements & setup workspace', estimatedHours: 1, priority: 'High', description: 'Read prompt carefully' },
        { title: 'Core implementation / drafting phase', estimatedHours: 3, priority: 'High', description: 'Main deliverable work' },
        { title: 'Testing / revision and citation verification', estimatedHours: 1.5, priority: 'Medium', description: 'Polish and refine' },
      ];
    }

    return res.json({ subtasks });
  } catch (error: any) {
    console.error('AI Subtasks Error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to break down task' });
  }
});

// AI Explain Concept Endpoint
app.post('/api/ai/explain', async (req, res) => {
  try {
    const { concept, difficultyLevel = 'undergraduate', course = '' } = req.body;

    const ai = getAIClient();
    const prompt = `Explain the academic concept "${concept}" for a ${difficultyLevel} student${course ? ` in the context of ${course}` : ''}.
Structure your explanation as follows:
- 💡 **Intuitive Analogy (EL5 version)**: A relatable real-world comparison.
- 📐 **Rigorous Technical Definition**: Mathematical or academic formalization.
- 🔍 **Step-by-Step Example / Walkthrough**: Concrete practical illustration.
- ⚡ **Why It Matters**: Application in exam problems or real-world systems.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    return res.json({ explanation: response.text });
  } catch (error: any) {
    console.error('AI Explain Error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to explain concept' });
  }
});

// AI Study Plan Generator
app.post('/api/ai/study-plan', async (req, res) => {
  try {
    const { examName, targetDate, availableHoursPerDay, topics = [] } = req.body;

    const ai = getAIClient();
    const prompt = `Create a structured day-by-day study roadmap for:
Exam / Goal: ${examName}
Target Date: ${targetDate}
Daily Capacity: ${availableHoursPerDay || 2} hours/day
Topics to Cover: ${topics.join(', ') || 'All syllabus modules'}

Format with:
- Daily Breakdown (Day 1, Day 2, etc.)
- Active Recall & Spaced Repetition checkpoints
- Mock exam / Practice problem time
- Night-before review tips`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    return res.json({ studyPlan: response.text });
  } catch (error: any) {
    console.error('AI Study Plan Error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to create study plan' });
  }
});

// AI Practice Flashcards/Quiz Generator
app.post('/api/ai/quiz', async (req, res) => {
  try {
    const { topic, count = 4 } = req.body;

    const ai = getAIClient();
    const prompt = `Generate ${count} multiple-choice academic quiz questions for topic: "${topic}".
Return ONLY a valid JSON array matching this schema:
[
  {
    "id": "q1",
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Why this answer is correct"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let questions = [];
    try {
      questions = JSON.parse(response.text || '[]');
    } catch {
      questions = [];
    }

    return res.json({ questions });
  } catch (error: any) {
    console.error('AI Quiz Error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate quiz questions' });
  }
});

// Serve frontend in production or integrate with Vite in dev
async function startServer() {
  if (process.env.NODE_ENV === 'production' || fs.existsSync(path.join(__dirname, 'dist'))) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In dev mode, let Vite handle frontend routing
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SyllabusAI Server running on port ${PORT}`);
  });
}

startServer();
