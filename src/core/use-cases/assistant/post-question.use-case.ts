import { QuestionResponse } from '../../../interfaces';

export const postQuestionUseCase = async (
  threadId: string,
  question: string
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/sam-assistant/user-question`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId,
          question,
        }),
      }
    );

    const replies = (await response.json()) as QuestionResponse[];

    return replies;
  } catch (error) {
    console.error(error);
    throw new Error('error posting question');
  }
};
