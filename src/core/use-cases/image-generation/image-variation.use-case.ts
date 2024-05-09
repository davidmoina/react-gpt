type GeneratedImage = Image | null;

interface Image {
  url: string;
  alt: string;
}

export const imageVariationUseCase = async (
  originalImage?: string
): Promise<GeneratedImage> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/gpt/image-variation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ baseImage: originalImage }),
      }
    );

    if (!response.ok) throw new Error('Error generating variation');

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
