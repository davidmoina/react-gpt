import type { DiscusserResponse } from '../../interfaces';

export const prosConsUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/gpt/pros-cons-discusser`,
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

    const data = (await resp.json()) as DiscusserResponse;

    return {
      ok: true,
      message: data.content,
    };
  } catch (error) {
    return {
      ok: false,
      message: 'Error: no se puedo hacer la comparación',
    };
  }
};
