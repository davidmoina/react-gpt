import { useState } from 'react';
import {
  GptMessage,
  GptMessageSelectableImage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from '../../components';
import {
  imageGenerationUseCase,
  imageVariationUseCase,
} from '../../../core/use-cases';

interface Message {
  text: string;
  isGTP: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

export const ImageTunningPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [originalImageAndMask, setOriginalImageAndMask] = useState<{
    original?: string;
    mask?: string;
  }>({
    original: undefined,
    mask: undefined,
  });

  const handleVariation = async () => {
    setIsLoading(true);

    const response = await imageVariationUseCase(
      originalImageAndMask.original!
    );
    setIsLoading(false);

    if (!response) return;

    setMessages((prev) => [
      ...prev,
      {
        text: 'Variación',
        isGTP: true,
        info: {
          imageUrl: response.url,
          alt: response.alt,
        },
      },
    ]);
  };

  const handlePost = async (text: string) => {
    setIsLoading(true);

    setMessages((prev) => [...prev, { text, isGTP: false }]);

    const { mask, original } = originalImageAndMask;

    const imageInfo = await imageGenerationUseCase(text, original, mask);
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
    <>
      {originalImageAndMask.original && (
        <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
          <span>Editando</span>
          <img
            src={originalImageAndMask.mask ?? originalImageAndMask.original}
            alt="original image"
            className="border rounded-xl w-40 h-40 object-contain"
          />
          <button className="btn-primary mt-2 w-48" onClick={handleVariation}>
            Generar variación
          </button>
        </div>
      )}
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
            {/* Welcome message */}
            <GptMessage text="Qué imagen deseas generar" />

            {messages.map(({ isGTP, text, info }, index) =>
              isGTP ? (
                // <GptMessageImage
                info ? (
                  <GptMessageSelectableImage
                    key={index}
                    text={text}
                    imageUrl={info.imageUrl}
                    onImageSelected={(maskUrl) =>
                      setOriginalImageAndMask({
                        original: info.imageUrl,
                        mask: maskUrl,
                      })
                    }
                  />
                ) : (
                  <GptMessage text={text} key={index} />
                )
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
    </>
  );
};
