// projects/messenger-clone-ui/src/services/aiService.ts

export async function getAiPort(): Promise<number | null> {
  try {
    // Fetch the ai-port.txt file from the public directory
    const response = await fetch('/ai-port.txt');
    if (!response.ok) {
      console.error('Failed to fetch AI port:', response.statusText);
      return null;
    }
    const portString = await response.text();
    const port = parseInt(portString.trim(), 10);
    if (isNaN(port)) {
      console.error('Invalid AI port number in ai-port.txt:', portString);
      return null;
    }
    return port;
  } catch (error) {
    console.error('Error getting AI port:', error);
    return null;
  }
}

interface AIMessage {
  role: 'user' | 'model';
  content?: string;
}

export async function getAiChatResponse(
  prompt: string,
  aiPort: number,
  onChunk: (chunk: string) => void,
  onFinish: () => void,
  messagesForAI: AIMessage[], // Added to send previous messages as context
  model?: string // Added for model selection
): Promise<void> {
  if (!aiPort) {
    onChunk("Error: AI server port not available.");
    onFinish();
    return;
  }

  const url = `http://localhost:${aiPort}/chat`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream', // Indicate that we expect an SSE stream
      },
      body: JSON.stringify({ prompt, stream: true, messages: messagesForAI, model }), // Include messages and model
    });

    if (!response.ok || !response.body) {
      const errorText = response.statusText || 'Unknown error';
      console.error('Failed to fetch AI chat stream:', errorText);
      onChunk(`Error communicating with AI: ${errorText}`);
      onFinish();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      accumulatedContent += chunk;

      // Process chunks which may contain multiple 'data:' lines or partial lines
      const lines = accumulatedContent.split('\n');
      accumulatedContent = lines.pop() || ''; // Keep the last (potentially incomplete) line

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6);
          try {
            const json = JSON.parse(data);
            if (json.content) {
              onChunk(json.content);
            } else if (json.error) {
              onChunk(`Error from AI: ${json.error}`);
            }
          } catch (e) {
            console.warn('Could not parse JSON from SSE data:', data, e);
            // If it's not JSON, it might be raw text from the stream_llama_response.
            // In llama.cpp server, 'data:' prefix might be followed by raw text for simplicity.
            onChunk(data);
          }
        }
      }
    }
    onFinish();
  } catch (error) {
    console.error('Error fetching AI chat response (stream):', error);
    onChunk(`Error communicating with AI: ${error instanceof Error ? error.message : String(error)}`);
    onFinish();
  }
}
