export const createThreadUseCase = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/sam-assistant/create-thread`,
      {
        method: 'POST',
      }
    );

    console.log(response);

    const { id } = (await response.json()) as { id: string };

    return id;
  } catch (error) {
    throw new Error('error creating thread');
  }
};
