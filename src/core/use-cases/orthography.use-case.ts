import type { OrthographyResponse } from '../../interfaces';

export const orthographyUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/gpt/orthography-check`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!resp.ok) {
      throw new Error('error correcting spelling');
    }

    const data = (await resp.json()) as OrthographyResponse;

    console.log(data);

    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    return {
      ok: false,
      userScore: 0,
      errors: [],
      message: 'error correcting spelling',
    };
  }
};
