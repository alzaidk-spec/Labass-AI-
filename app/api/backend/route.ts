import { NextRequest, NextResponse } from "next/server";

const SERVICE_ID = "labass_ai_medical_agent_7654e4b9";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { endpoint, ...payload } = body;

  if (!endpoint) {
    return NextResponse.json({ error: "endpoint required" }, { status: 400 });
  }

  const apiKey = process.env.CODEWORDS_API_KEY;
  const runtimeUri = process.env.CODEWORDS_RUNTIME_URI || "https://runtime.codewords.ai";

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const url = `${runtimeUri}/run/${SERVICE_ID}/${endpoint}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("[backend] Non-JSON response:", text.slice(0, 200));
      return NextResponse.json({ error: "Invalid response from backend" }, { status: 502 });
    }

    // Runtime wraps in {output, logs, status, duration_seconds}
    // Check if the runtime-level status indicates an error
    if (data?.status && typeof data.status === "number" && data.status >= 400) {
      const detail = data?.output?.detail || data?.detail || "Backend error";
      return NextResponse.json({ error: detail }, { status: data.status });
    }

    // Extract the service output
    if (data?.output !== undefined && data?.output !== null) {
      return NextResponse.json(data.output);
    }

    // Fallback: return whatever we got
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[backend] Fetch error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

