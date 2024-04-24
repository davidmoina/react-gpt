import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxSelect,
  GptMessageAudio,
} from '../../components';
import { textToAudioUseCase } from '../../../core/use-cases';

const disclaimer = `## Puedes poner cualquier texto que quieras convertir en un audio
* Todo el audio generado es por AI`;

const voices = [
  { id: 'nova', text: 'Nova' },
  { id: 'alloy', text: 'Alloy' },
  { id: 'echo', text: 'Echo' },
  { id: 'fable', text: 'Fable' },
  { id: 'onyx', text: 'Onyx' },
  { id: 'shimmer', text: 'Shimmer' },
];

interface TextMessage {
  text: string;
  isGTP: boolean;
  type: 'text';
}

interface AudioMessage {
  text: string;
  isGTP: boolean;
  audio: string;
  type: 'audio';
}

type MessageType = TextMessage | AudioMessage;

export const TextToAudioPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);

  const handlePost = async (text: string, selectedVoice: string) => {
    setIsLoading(true);

    setMessages((prev) => [...prev, { text, isGTP: false, type: 'text' }]);

    const { message, audio, ok } = await textToAudioUseCase(
      text,
      selectedVoice
    );

    if (!ok) {
      setMessages((prev) => [
        ...prev,
        { text: message, isGTP: true, type: 'text' },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: `${selectedVoice} - ${message}`,
          isGTP: true,
          type: 'audio',
          audio: audio!,
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
          <GptMessage text={disclaimer} />

          {messages.map((message, index) =>
            message.isGTP ? (
              message.type === 'audio' ? (
                <GptMessageAudio
                  key={index}
                  text={message.text}
                  audio={message.audio}
                />
              ) : (
                <GptMessage key={index} text={message.text} />
              )
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
        placeholder="Escribe lo que desees"
        disableCorrections
        options={voices}
      />
    </div>
  );
};
