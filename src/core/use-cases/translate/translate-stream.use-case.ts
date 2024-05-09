export async function* translateTextStreamUseCase(
  prompt: string,
  lang: string,
  signal: AbortSignal
) {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/gpt/translate-stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, lang }),
        signal,
      }
    );

    if (!resp.ok) {
      throw new Error('Error translating text');
    }

    const reader = resp.body?.getReader();

    if (!reader) {
      throw new Error('Error translating text');
    }

    const decoder = new TextDecoder();

    let text = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const decodedChunk = decoder.decode(value, { stream: true });

      text += decodedChunk;

      yield text;
    }
  } catch (error) {
    console.error(error);

    return null;
  }
}
