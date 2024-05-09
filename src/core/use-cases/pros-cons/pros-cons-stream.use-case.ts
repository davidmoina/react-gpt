export const prosConsStreamUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/gpt/pros-cons-discusser-stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!resp.ok) {
      throw new Error('error comparison could not be made');
    }

    const reader = resp.body?.getReader();

    if (!reader) {
      throw new Error('error comparison could not be made');
    }

    return reader;
  } catch (error) {
    console.error(error);

    return null;
  }
};
