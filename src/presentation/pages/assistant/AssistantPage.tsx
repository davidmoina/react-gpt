import { useEffect, useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from '../../components';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import {
  createThreadUseCase,
  postQuestionUseCase,
} from '../../../core/use-cases';

interface Message {
  text: string;
  isGTP: boolean;
}

export const AssistantPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const { getThreadId, storeThreadId } = useLocalStorage();

  const [threadId, setThreadId] = useState<string>();

  useEffect(() => {
    const id = getThreadId();

    console.log(id);

    if (id) {
      setThreadId(id);
    } else {
      createThreadUseCase().then((threadId) => {
        console.log(threadId);

        setThreadId(threadId);
        storeThreadId(threadId);
      });
    }
  }, []);

  useEffect(() => {
    if (threadId) {
      setMessages((prev) => [
        ...prev,
        { text: `thread id #${threadId}`, isGTP: true },
      ]);
    }
  }, [threadId]);

  const handlePost = async (text: string) => {
    if (!threadId) return;

    setIsLoading(true);

    setMessages((prev) => [...prev, { text, isGTP: false }]);

    const replies = await postQuestionUseCase(threadId, text);
    setMessages([]);
    setIsLoading(false);

    for (const reply of replies) {
      setMessages((prev) => [
        ...prev,
        { isGTP: reply.role === 'assistant', text: reply.content, info: reply },
      ]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Welcome message */}
          <GptMessage text="Soy Sam, tu asistente personal, en que puedo ayudarte?" />

          {messages.map((message, index) =>
            message.isGTP ? (
              <GptMessage key={index} text={message.text} />
            ) : (
              <MyMessage key={index} text={message.text} />
            )
          )}

          {isLoading && (
            <div className="col-start-1 col-end-12">
              <TypingLoader className="fade-in" />
            </div>
          )}
        </div>
      </div>

      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Escribe cualquier pregunta"
        disableCorrections
      />
    </div>
  );
};
