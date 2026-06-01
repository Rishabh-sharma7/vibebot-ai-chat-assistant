import { useState } from 'react';
import { Bot, User, Loader2, Download } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'image';
}

export function ChatMessage({
  role,
  content,
  type = 'text',
}: ChatMessageProps) {
  const isUser = role === 'user';

  const isImage =
    type === 'image' &&
    typeof content === 'string' &&
    (content.startsWith('http://') || content.startsWith('https://'));

  const [imageLoading, setImageLoading] = useState(isImage);
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`flex gap-4 p-4 ${isUser ? 'bg-white' : 'bg-slate-50'}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600' : 'bg-slate-700'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      <div className="flex-1">
        {isImage ? (
          <div className="space-y-3">
            {imageLoading && !imageError && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating image...</span>
              </div>
            )}

            {!imageError ? (
              <div className="space-y-3">
                <img
                  src={content}
                  alt="Generated AI"
                  loading="lazy"
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageLoading(false);
                    setImageError(true);
                  }}
                  className={`max-w-md rounded-2xl border shadow-sm transition-all duration-300 ${
                    imageLoading ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
                  }`}
                />

                {!imageLoading && (
                  <a
                    href={content}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Image
                  </a>
                )}
              </div>
            ) : (
              <div className="text-sm text-red-500 border rounded-xl px-4 py-3 bg-red-50">
                Failed to load generated image.
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 rounded-lg break-words whitespace-pre-wrap">
  {content}
</div>
        )}
      </div>
    </div>
  );
}