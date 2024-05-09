import type { AudioToTextResponse } from '../../../interfaces';

export const audioToTextUseCase = async (audioFile: File, prompt?: string) => {
  try {
    const formData = new FormData();
    formData.append('file', audioFile);

    if (prompt) {
      formData.append('prompt', prompt);
    }

    const resp = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/gpt/audio-to-text`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!resp.ok) {
      throw new Error('error correcting spelling');
    }

    const data = (await resp.json()) as AudioToTextResponse;

    return data;
  } catch (error) {
    console.error(error);

    return null;
  }
};
