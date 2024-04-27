import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxFile,
} from '../../components';
import { audioToTextUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGTP: boolean;
}

export const AudioToTextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, audioFile: File) => {
    setIsLoading(true);

    setMessages((prev) => [...prev, { text, isGTP: false }]);

    const data = await audioToTextUseCase(audioFile, text);
    setIsLoading(false);

    if (!data) {
      setMessages((prev) => [
        ...prev,
        { text: 'No pude procesar el audio, intenta de nuevo', isGTP: true },
      ]);
      return;
    }

    const gptMessage = `
## Transcripción:
__Duración:__ ${Math.round(data.duration)}

## Texto:
${data.text}`;

    setMessages((prev) => [...prev, { text: gptMessage, isGTP: true }]);

    for (const segment of data.segments) {
      const segmentMessage = `
__De ${Math.round(segment.start)} a ${Math.round(segment.end)} segundos:__
${segment.text}`;

      setMessages((prev) => [...prev, { text: segmentMessage, isGTP: true }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Welcome message */}
          <GptMessage text="Escoge un audio para generar una transcripción del mismo" />

          {messages.map((message, index) =>
            message.isGTP ? (
              <GptMessage key={index} text={message.text} />
            ) : (
              <MyMessage
                key={index}
                text={
                  message.text === '' ? 'Transcribe este audio' : message.text
                }
              />
            )
          )}

          {isLoading && (
            <div className="col-start-1 col-end-12">
              <TypingLoader className="fade-in" />
            </div>
          )}
        </div>
      </div>

      <TextMessageBoxFile
        onSendMessage={handlePost}
        placeholder="Escribe cualquier pregunta"
        disableCorrections
        accept="audio/*"
      />
    </div>
  );
};
