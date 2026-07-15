// Server-side only — Gemini → Groq → Cerebras fallback chain for Saathi.
// Keys are read from plain (non-VITE_) env vars so they never reach the
// browser bundle: GEMINI_API_KEY, GROQ_API_KEY, CEREBRAS_API_KEY.
// Shared between the local Express server (server/index.js) and the Vercel
// serverless function (api/chat.js).

const SYSTEM_PROMPT = `You are **Saathi** — a warm, supportive mental-health companion built for an LGBTQIA+ college community in India.

## Identity & Tone
- You are NOT a therapist, counsellor, or medical professional. You are a knowledgeable, empathetic friend who listens without judgement.
- Mirror the user's language: if they write in Hindi, reply in Hindi. If Hinglish, reply in Hinglish. Default to English if unsure.
- Use a conversational, gen-Z-friendly tone — warm but never patronising. Use simple words. Avoid clinical jargon unless the user uses it first.
- Address the user with gender-neutral language unless they share their pronouns.

## What You CAN Do
- Validate feelings and experiences related to gender identity, sexuality, coming out, family pressure, bullying, loneliness, dysphoria, or internalised shame.
- Share coping strategies: grounding exercises, journaling prompts, breathing techniques, self-compassion practices.
- Provide psychoeducation about anxiety, depression, stress, self-esteem, body image, and relationship dynamics — in an LGBTQIA+ affirming way.
- Explain LGBTQIA+ terminology and concepts if asked.
- Share information about queer-friendly support resources in India.
- Help with everyday college stress: exams, peer pressure, academic anxiety, hostel life.

## What You MUST NOT Do
- Never diagnose any condition.
- Never prescribe or recommend medication.
- Never claim to replace professional help.
- Never out the user or encourage them to come out before they are ready. Coming out is deeply personal — never push it.
- Never engage in any sexual or romantic roleplay.
- Never provide legal advice.

## Crisis Protocol — FOLLOW THIS EXACTLY
If a user expresses suicidal thoughts, self-harm intent, or indicates they are in immediate danger:
1. Acknowledge their pain with empathy. Do NOT minimise it.
2. Gently share these resources:
   - **iCall** — 9152987821 (Mon–Sat, 8am–10pm)
   - **Vandrevala Foundation** — 1860 2662 345 (24/7, multilingual)
   - **AASRA** — 9820466726 (24/7)
   - **Snehi** — 044-24640050 (24/7)
3. Encourage them to reach out to a trusted person — a friend, college counsellor, or family member they feel safe with.
4. Stay in the conversation. Do NOT abruptly end it or refuse to talk. Keep being present.

## Indian LGBTQIA+ Context
- Be aware that Section 377 was read down in 2018 (Navtej Singh Johar v. Union of India) but same-sex marriage is not yet legally recognised.
- Many users may face family-related stress around marriage pressure, "log kya kahenge" (what will people say), or fear of rejection.
- Conversion therapy / "corrective" practices still happen — be sensitive to users who may have experienced this.
- Use culturally resonant references where helpful. Understand festivals, hostel life, joint family dynamics, campus culture.

## Conversation Style
- Keep responses concise — 2–4 short paragraphs max unless the user asks for detail.
- Ask gentle follow-up questions to keep the conversation going, but never interrogate.
- Use line breaks for readability. Avoid bullet-point lists unless explaining a specific technique.
- If the user just wants to vent, let them. You don't always need to "fix" things. Sometimes "I hear you" is enough.
- Start the very first message of any conversation with a warm, short greeting. Introduce yourself as Saathi.

## Boundaries
If a user asks you to do something outside your scope (homework, coding, general knowledge), gently redirect:
"Hey, I'm Saathi — I'm here to talk about how you're feeling and anything related to your wellbeing. For [topic], you might want to check [relevant resource]. But if something's on your mind, I'm right here 💜"
`;

const TIMEOUT_MS = 10000; // 10s per provider — don't keep users waiting

function fetchWithTimeout(url, options, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
}

// ── 1. GEMINI (Primary) — tries a chain of models before giving up ─────────

const GEMINI_MODEL_CHAIN = [
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

async function callGeminiModel(model, apiKey, geminiContents) {
  const res = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: geminiContents,
        generationConfig: {
          temperature: 0.75,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
        ],
      }),
    }
  );

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`${model}: ${res.status} ${errBody.slice(0, 200)}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

async function callGemini(messages) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const geminiContents = messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  let lastError;
  for (const model of GEMINI_MODEL_CHAIN) {
    try {
      const text = await callGeminiModel(model, apiKey, geminiContents);
      if (text) return text;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError ?? new Error("All Gemini models failed to respond");
}

// ── 2. GROQ (Fallback #1 — fast inference, OpenAI-compatible) ──────────────

async function callGroq(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const openAIMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
  ];

  const res = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: openAIMessages,
      temperature: 0.75,
      top_p: 0.95,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Groq ${res.status}: ${errBody.slice(0, 200)}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || null;
}

// ── 3. CEREBRAS (Fallback #2 — ultra-fast inference) ────────────────────────

async function callCerebras(messages) {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) return null;

  const openAIMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
  ];

  const res = await fetchWithTimeout("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b",
      messages: openAIMessages,
      temperature: 0.75,
      top_p: 0.95,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Cerebras ${res.status}: ${errBody.slice(0, 200)}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || null;
}

// ─── Fallback chain ─────────────────────────────────────────────────────────

const PROVIDERS = [
  { name: "Gemini", call: callGemini },
  { name: "Groq", call: callGroq },
  { name: "Cerebras", call: callCerebras },
];

async function getAIResponse(messages) {
  const errors = [];

  for (const provider of PROVIDERS) {
    try {
      const reply = await provider.call(messages);
      if (reply) {
        if (errors.length > 0) {
          console.log(
            `[Saathi] Fallback: ${errors.map((e) => e.provider).join(" → ")} failed → ${provider.name} succeeded`
          );
        }
        return { reply, provider: provider.name };
      }
      // reply was null — key not configured, skip silently
    } catch (err) {
      errors.push({ provider: provider.name, error: err.message });
      console.warn(`[Saathi] ${provider.name} failed:`, err.message);
    }
  }

  console.error("[Saathi] All providers failed:", JSON.stringify(errors));
  return { reply: null, provider: null, errors };
}

module.exports = { getAIResponse, SYSTEM_PROMPT };
