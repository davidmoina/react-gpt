import { useState } from 'react';
import {
  GptMessage,
  GptMessageImage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from '../../components';
import { imageGenerationUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGTP: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

export const ImageGenerationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);

    setMessages((prev) => [...prev, { text, isGTP: false }]);

    const imageInfo = await imageGenerationUseCase(text);
    setIsLoading(false);

    if (!imageInfo) {
      setMessages((prev) => [
        ...prev,
        { text: 'No se pudo generar la imagen', isGTP: true },
      ]);

      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        text: imageInfo.alt,
        isGTP: true,
        info: { alt: imageInfo.alt, imageUrl: imageInfo.url },
      },
    ]);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Welcome message */}
          <GptMessage text="Qué imagen deseas generar" />

          {messages.map(({ isGTP, text, info }, index) =>
            isGTP ? (
              <GptMessageImage
                key={index}
                text={text}
                imageUrl={info!.imageUrl}
                alt={info!.alt}
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
        placeholder="Escribe cualquier pregunta"
        disableCorrections
      />
    </div>
  );
};
