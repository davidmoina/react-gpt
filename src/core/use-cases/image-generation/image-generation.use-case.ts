type GeneratedImage = Image | null;

interface Image {
  url: string;
  alt: string;
}

export const imageGenerationUseCase = async (
  prompt: string,
  originalImage?: string,
  maskImage?: string
): Promise<GeneratedImage> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/gpt/image-generation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, originalImage, maskImage }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const { url, revised_prompt } = await response.json();

    return {
      url,
      alt: revised_prompt,
    };
  } catch (error) {
    console.error(error);

    return null;
  }
};
