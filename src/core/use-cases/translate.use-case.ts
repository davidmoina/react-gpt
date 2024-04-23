import { TranslateResponse } from '../../interfaces';

export const translateTextUseCase = async (text: string, lang: string) => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/gpt/translate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: text, lang }),
      }
    );

    if (!resp.ok) {
      throw new Error('error translating');
    }

    const data = (await resp.json()) as TranslateResponse;

    return {
      ok: true,
      message: data.message,
    };
  } catch (error) {
    console.log(error);

    return {
      ok: false,
      message: 'Error al traducir el texto',
    };
  }
};
