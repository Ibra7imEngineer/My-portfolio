// Serverless handler: proxies requests to Google's Generative Language (Gemini)
// Expects `process.env.GEMINI_API_KEY` to be set on the server.

const TIMEOUT_MS = 30000;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const rawBody = req.body;
    const body =
      typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody || {};
    const userMessage = body.message;
    const botName = body.botName || "";

    if (!userMessage || typeof userMessage !== "string") {
      return res
        .status(400)
        .json({ error: "Missing `message` in request body" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not set");
      return res
        .status(500)
        .json({ error: "Server misconfiguration: missing GEMINI_API_KEY" });
    }

    const systemPrompt = `أنت مساعد ذكي لمهندس محترف. أجب بشكل مهني، مختصر، وودود.`;

    const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const genRequest = {
      prompt: {
        contents: [
          { parts: [{ text: systemPrompt }] },
          { parts: [{ text: userMessage }] },
        ],
      },
      temperature: 0.25,
      maxOutputTokens: 512,
      candidateCount: 1,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const upstream = await fetch(genUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(genRequest),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!upstream.ok) {
      const txt = await upstream.text().catch(() => "");
      console.error("Gemini upstream error", upstream.status, txt);
      return res
        .status(502)
        .json({
          error: "Upstream error from Gemini",
          status: upstream.status,
          details: txt,
        });
    }

    const result = await upstream.json();
    const reply =
      result?.candidates?.[0]?.content?.[0]?.text ||
      result?.candidates?.[0]?.content?.[0]?.parts?.[0]?.text ||
      result?.candidates?.[0]?.content?.text ||
      result?.output?.[0]?.content?.[0]?.text ||
      "";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Error in /api/chat handler", err);
    if (err.name === "AbortError") {
      return res.status(504).json({ error: "Request to Gemini timed out" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};
