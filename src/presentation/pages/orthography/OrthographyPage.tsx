import { useState } from 'react';
import {
  GptMessage,
  GptOrthographyMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from '../../components';
import { orthographyUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGTP: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  };
}

export const OrthographyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGTP: false }]);

    const { ok, message, userScore, errors } = await orthographyUseCase(text);

    console.log(errors);

    if (!ok) {
      setMessages((prev) => [
        ...prev,
        { text: 'No se puedo realizar la corrección', isGTP: true },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: message,
          isGTP: true,
          info: {
            errors,
            message,
            userScore,
          },
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
          <GptMessage text="Soy tu asistente personal, puedes preguntarme lo que quieras" />

          {messages.map(({ info, isGTP, text }, index) =>
            isGTP ? (
              <GptOrthographyMessage
                key={index}
                errors={info!.errors}
                message={info!.message}
                userScore={info!.userScore}
              />
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
        placeholder="Escribe un texto comprobar la ortografía"
        disableCorrections
      />
    </div>
  );
};
