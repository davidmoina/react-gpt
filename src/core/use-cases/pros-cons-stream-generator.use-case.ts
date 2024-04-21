export async function* prosConsStreamGeneratorUseCase(
  prompt: string,
  signal: AbortSignal
) {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/gpt/pros-cons-discusser-stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        signal,
      }
    );

    if (!resp.ok) {
      throw new Error('error comparison could not be made');
    }

    const reader = resp.body?.getReader();

    if (!reader) {
      throw new Error('error comparison could not be made');
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
