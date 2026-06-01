import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { FileUpload } from './FileUpload';
import { Bot, LogOut, Loader2, History } from 'lucide-react';

const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  "https://vibebot-backend.onrender.com";

const sendMessage = async (message: string, fileContext: string = "") => {
  const lower = message.toLowerCase().trim();

  const imageKeywords = [
    "generate image",
    "generate an image",
    "generate image of",
    "create image",
    "create an image",
    "create image of",
    "make image",
    "make an image",
    "make image of",
    "draw",
    "illustrate",
    "show me",
    "image of",
    "picture of",
    "photo of"
  ];

  const isImagePrompt = imageKeywords.some((keyword) => lower.includes(keyword));

  const endpoint = isImagePrompt
    ? `${API_BASE}/generate-image`
    : `${API_BASE}/chat`;

  const res = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ message })
});

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.reply || "Request failed");
  }

  return {
    reply: data?.reply || "No response",
    type: data?.type || "text",
  };
};

interface Message {
  id: string;
  session_id?: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  type?: 'text' | 'image';
}

interface UploadedFile {
  id: string;
  session_id?: string;
  filename: string;
  file_type: string;
  extracted_text: string | null;
}

interface ChatSession {
  id: string;
  created_at: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bootChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const bootChat = async () => {
    await loadSessions();
  };

  const createNewSession = async () => {
    const { data: session, error } = await supabase
      .from('chat_sessions')
      .insert({} as any)
      .select('*')
      .single();

    if (error) {
      console.error("Create session error:", error.message);
      return;
    }

    if (session) {
      setSessionId((session as ChatSession).id);
      setMessages([]);
      setFiles([]);
      await loadSessions();
    }
  };

  const loadSessions = async () => {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Load sessions error:", error.message);
      return;
    }

    if (data && data.length > 0) {
      const sessions = data as ChatSession[];
      setSessions(sessions);

      if (!sessionId) {
        setSessionId(sessions[0].id);
        await loadMessages(sessions[0].id);
        await loadFiles(sessions[0].id);
      }
    } else {
      await createNewSession();
    }
  };

  const switchSession = async (id: string) => {
    setSessionId(id);
    await loadMessages(id);
    await loadFiles(id);
  };

  const loadMessages = async (id: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Load messages error:", error.message);
      return;
    }

    setMessages((data || []) as Message[]);
  };

  const loadFiles = async (id: string) => {
    const { data, error } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('session_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Load files error:", error.message);
      return;
    }

    setFiles((data || []) as UploadedFile[]);
  };

  const handleFileUpload = async (file: File) => {
    if (!sessionId) return;

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop() || '';
      const filePath = `public/${sessionId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/extract`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const { error: insertError } = await supabase.from('uploaded_files').insert([
        {
          session_id: sessionId,
          filename: file.name,
          file_type: fileExt,
          extracted_text: data.text || "",
        },
      ] as any);

      if (insertError) throw insertError;

      await loadFiles(sessionId);
    } catch (error: any) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileRemove = async (fileId: string) => {
    await supabase.from('uploaded_files').delete().eq('id', fileId);
    if (sessionId) await loadFiles(sessionId);
  };

  const handleSendMessage = async (content: string) => {
    if (!sessionId || !content.trim() || loading) return;

    setLoading(true);

    try {
      const { data: userMessage, error: userError } = await supabase
        .from('messages')
        .insert([
          {
            session_id: sessionId,
            role: 'user',
            content,
            type: 'text',
          },
        ] as any)
        .select()
        .single();

      if (userError) throw userError;

      if (userMessage) {
        setMessages((prev) => [...prev, userMessage as Message]);
      }

      const fileContext = files
        .map((f) => f.extracted_text || "")
        .filter(Boolean)
        .join("\n\n");

      const aiResponse = await sendMessage(content, fileContext);

      const { data: assistantMessage, error: assistantError } = await supabase
        .from('messages')
        .insert([
          {
            session_id: sessionId,
            role: 'assistant',
            content: aiResponse.reply,
            type: aiResponse.type,
          },
        ] as any)
        .select()
        .single();

      if (assistantError) throw assistantError;

      if (assistantMessage) {
        setMessages((prev) => [...prev, assistantMessage as Message]);
      }
    } catch (error: any) {
      alert("Send failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-full">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold">VibeBot</h1>
        </div>

        <button onClick={handleSignOut} className="flex gap-2 items-center">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </header>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <div className="hidden md:block md:w-72 border-r bg-white p-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5" />
            <h2 className="font-semibold">Chat History</h2>
          </div>

          <button
            onClick={createNewSession}
            className="w-full mb-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            + New Chat
          </button>

          <div className="space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => switchSession(session.id)}
                className={`w-full text-left p-3 rounded-lg border text-sm ${
                  session.id === sessionId
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                Chat {session.id.slice(0, 8)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                role={m.role}
                content={m.content}
                type={m.type || 'text'}
              />
            ))}

            {loading && (
              <div className="p-4 flex gap-2 items-center text-gray-500">
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <ChatInput onSend={handleSendMessage} disabled={loading || !sessionId} />
        </div>

        <div className="hidden lg:block lg:w-80 border-l p-4 bg-white">
          <h2 className="font-semibold mb-4">Documents</h2>

          {uploading && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </div>
          )}

          <FileUpload
            onFileSelect={handleFileUpload}
            uploadedFiles={files}
            onFileRemove={handleFileRemove}
          />
        </div>
      </div>
    </div>
  );
}