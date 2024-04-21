import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from '../../components';
import { prosConsUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGTP: boolean;
}

export const ProsConsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);

    setMessages((prev) => [...prev, { text, isGTP: false }]);

    const { ok, message } = await prosConsUseCase(text);

    if (!ok) {
      setMessages((prev) => [...prev, { text: message, isGTP: true }]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: message,
          isGTP: true,
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Welcome message */}
          <GptMessage text="Pues escribir lo que quieras que compare y te de mis puntos de vista." />

          {messages.map(({ isGTP, text }, index) =>
            isGTP ? (
              <GptMessage key={index} text={text} />
            ) : (
              <MyMessage key={index} text={text} />
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
