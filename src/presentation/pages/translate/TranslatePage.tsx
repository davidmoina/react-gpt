import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxSelect,
} from '../../components';
import { translateTextUseCase } from '../../../core/use-cases';

const languages = [
  { id: 'alemán', text: 'Alemán' },
  { id: 'árabe', text: 'Árabe' },
  { id: 'bengalí', text: 'Bengalí' },
  { id: 'francés', text: 'Francés' },
  { id: 'hindi', text: 'Hindi' },
  { id: 'inglés', text: 'Inglés' },
  { id: 'japonés', text: 'Japonés' },
  { id: 'mandarín', text: 'Mandarín' },
  { id: 'portugués', text: 'Portugués' },
  { id: 'ruso', text: 'Ruso' },
  { id: 'español', text: 'Español' },
];

interface Message {
  text: string;
  isGTP: boolean;
}

export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedOption: string) => {
    setIsLoading(true);

    const newMessage = `Traduce: "${text}" al idioma ${selectedOption}`;

    setMessages((prev) => [...prev, { text: newMessage, isGTP: false }]);

    const { message, ok } = await translateTextUseCase(text, selectedOption);

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
          <GptMessage text="Inserta cualquier texto que quieras traducir" />

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

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder="Escribe cualquier pregunta"
        options={languages}
      />
    </div>
  );
};
