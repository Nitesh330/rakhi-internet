import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, User, Sparkles, 
  Image as ImageIcon, Trash2, Copy, Check, Zap, Brain, UserCog, 
  Plus, MessageCircle, ChevronLeft, Menu,
  Code, FileText, HelpCircle, GraduationCap, Globe, Cpu, ArrowRight, BookOpen, Lightbulb, Laptop, PenTool, Database,
  Mic, MicOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import aiBotImage from '../assets/images/regenerated_image_1783931513099.png';

interface ChatImage {
  data: string;
  mimeType: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  image?: ChatImage;
  generatedImage?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export default function ChatPortal({ onBack }: { onBack: () => void }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generateImageMode, setGenerateImageMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');
  const [attachedImage, setAttachedImage] = useState<ChatImage | null>(null);
  const [attachedImagePreview, setAttachedImagePreview] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-IN'; // Outstanding support for Hinglish, Hindi, and Indian English accents
    
    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        setInput(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + finalTranscript);
      }
    };

    rec.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      if (event.error !== 'no-speech') {
        setIsListening(false);
      }
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!isSpeechSupported) {
      alert("Speech recognition is not fully supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.");
      return;
    }

    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  const defaultGreeting: Message = { 
    role: 'model', 
    text: 'Namaste! I am the Senior Digital Operations Head at Rakhi Internet. 🤝\n\nI am here to provide you with expert assistance for CSC Govt services, University admissions, and global courier solutions. I can also analyze your documents or images and generate professional reports instantly.\n\nHow can I help you achieve your goal today?' 
  };

  useEffect(() => {
    const saved = localStorage.getItem('rakhi_chat_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) {
          loadSession(parsed[0].id, parsed);
        } else {
          createNewSession();
        }
      } catch (e) {
        createNewSession();
      }
    } else {
      createNewSession();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const saveSessionsToLocal = (newSessions: ChatSession[]) => {
    localStorage.setItem('rakhi_chat_sessions', JSON.stringify(newSessions));
    setSessions(newSessions);
  };

  const createNewSession = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: 'New Chat',
      messages: [defaultGreeting],
      updatedAt: Date.now()
    };
    const updatedSessions = [newSession, ...sessions];
    saveSessionsToLocal(updatedSessions);
    setCurrentSessionId(newId);
    setMessages([defaultGreeting]);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const loadSession = (id: string, currentSessions = sessions) => {
    const session = currentSessions.find(s => s.id === id);
    if (session) {
      setCurrentSessionId(id);
      setMessages(session.messages);
    }
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSessions = sessions.filter(s => s.id !== id);
    saveSessionsToLocal(updatedSessions);
    if (currentSessionId === id) {
      if (updatedSessions.length > 0) {
        loadSession(updatedSessions[0].id, updatedSessions);
      } else {
        createNewSession();
      }
    }
  };

  const updateCurrentSession = (newMessages: Message[]) => {
    setMessages(newMessages);
    
    // Auto-generate title based on first user message if title is "New Chat"
    let title = 'New Chat';
    const userMessages = newMessages.filter(m => m.role === 'user');
    if (userMessages.length > 0) {
      title = userMessages[0].text.substring(0, 30);
      if (userMessages[0].text.length > 30) title += '...';
      if (!title.trim() && userMessages[0].image) title = 'Image Analysis';
    }

    const updatedSessions = sessions.map(s => {
      if (s.id === currentSessionId) {
        return { ...s, messages: newMessages, title, updatedAt: Date.now() };
      }
      return s;
    });
    
    // Sort by recently updated
    updatedSessions.sort((a, b) => b.updatedAt - a.updatedAt);
    saveSessionsToLocal(updatedSessions);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setAttachedImage({
        data: base64Data,
        mimeType: file.type
      });
      setAttachedImagePreview(result);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachedImage = () => {
    setAttachedImage(null);
    setAttachedImagePreview(null);
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachedImage) || isLoading) return;

    const userMessage = input.trim();
    const currentAttachedImage = attachedImage;
    const isImageGenActive = generateImageMode;
    
    setInput('');
    setAttachedImage(null);
    setAttachedImagePreview(null);
    setGenerateImageMode(false);

    const newMessages: Message[] = [
      ...messages, 
      { 
        role: 'user', 
        text: userMessage || 'Attached Image', 
        image: currentAttachedImage || undefined 
      }
    ];
    updateCurrentSession(newMessages);
    setIsLoading(true);

    try {
      updateCurrentSession([...newMessages, { role: 'model', text: '' }]);
      
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          history: newMessages,
          model: selectedModel,
          image: currentAttachedImage,
          generateImage: isImageGenActive
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No reader");

      let done = false;
      let isFirstChunk = true;
      let streamedResponse = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          if (isFirstChunk) {
            setIsLoading(false);
            isFirstChunk = false;
          }
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.error) {
                  throw new Error(data.error);
                }
                streamedResponse += data.text;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    text: streamedResponse,
                    generatedImage: data.generatedImage || updated[updated.length - 1].generatedImage
                  };
                  return updated;
                });
              } catch (e) {
                console.error("Error parsing stream chunk", e);
              }
            }
          }
        }
      }
      
      // Update session once fully complete
      setMessages(prev => {
        updateCurrentSession(prev);
        return prev;
      });

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => {
        const updated = [...prev];
        if (updated[updated.length - 1].text === '') {
          updated[updated.length - 1].text = 'Sorry, I am having trouble connecting to the Gemini server. Please check your network and try again.';
        }
        updateCurrentSession(updated);
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerQuickPrompt = async (text: string) => {
    if (isLoading) return;
    setInput('');
    setAttachedImage(null);
    setAttachedImagePreview(null);

    const newMessages: Message[] = [
      ...messages, 
      { role: 'user', text }
    ];
    updateCurrentSession(newMessages);
    setIsLoading(true);

    try {
      updateCurrentSession([...newMessages, { role: 'model', text: '' }]);
      
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          history: newMessages,
          model: selectedModel,
          image: null
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No reader");

      let done = false;
      let isFirstChunk = true;
      let streamedResponse = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          if (isFirstChunk) {
            setIsLoading(false);
            isFirstChunk = false;
          }
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.error) {
                  throw new Error(data.error);
                }
                streamedResponse += data.text;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    text: streamedResponse
                  };
                  return updated;
                });
              } catch (e) {
                console.error("Error parsing stream chunk", e);
              }
            }
          }
        }
      }
      
      setMessages(prev => {
        updateCurrentSession(prev);
        return prev;
      });

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => {
        const updated = [...prev];
        if (updated[updated.length - 1].text === '') {
          updated[updated.length - 1].text = 'Sorry, I am having trouble connecting to the Gemini server. Please check your network and try again.';
        }
        updateCurrentSession(updated);
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: "⚡ CSC Services", text: "Provide a list of online CSC services available at Rakhi Internet and explain how I can apply for a PAN card or Aadhaar correction." },
    { label: "📦 Courier & Pricing", text: "I want to send an international courier. Tell me about Rakhi International Courier services, delivery speed, and how pricing works." },
    { label: "🎓 College Admissions", text: "What university admission services are offered at Rakhi Internet? Guide me through BA/MA/BCom and KUK/MDU options." },
    { label: "💻 Custom Software", text: "I am interested in custom software or a digital database portal for my business/school. Tell me about software collaboration with Nitesh Verma." }
  ];

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col font-sans text-slate-800 h-[100dvh] overflow-hidden">
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 h-full">
        {/* Unified Top Header Bar */}
        <div className="bg-white border-b border-slate-200 p-3 flex items-center justify-between shrink-0 gap-2">
          {/* Back/Home Button */}
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl transition-all text-xs font-bold cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Home
          </button>

          {/* Unified Ultra Power Mode Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl text-indigo-700 font-extrabold text-xs shadow-sm">
            <Zap className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Ultra Power Mode</span>
          </div>

          {/* New Chat / Clear Chat Button */}
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear this conversation?")) {
                setMessages([defaultGreeting]);
                setAttachedImage(null);
                setAttachedImagePreview(null);
                setInput('');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-100 rounded-xl transition-all text-xs font-bold cursor-pointer"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden md:inline">Clear Chat</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar flex flex-col gap-6 scroll-smooth bg-slate-50 relative">
          {messages.length <= 1 ? (
            <div className="flex flex-col gap-8 py-8 px-2 max-w-4xl mx-auto w-full relative z-10">
              {/* Grid / Ambient Background Details */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

              {/* Hero Header */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="relative mb-4 group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-md opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse" />
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border border-indigo-500 bg-white p-1 shadow-lg">
                    <img src={aiBotImage} alt="Rakhi Internet AI" className="w-full h-full object-cover rounded-full scale-[1.1]" />
                  </div>
                  <div className="absolute bottom-0 right-1 bg-emerald-500 border-2 border-white w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  </div>
                </div>
                
                <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-indigo-50 rounded-full text-[10px] font-bold text-indigo-700 border border-indigo-100 mb-3 tracking-wider uppercase">
                  <Sparkles className="w-3 h-3 animate-pulse text-indigo-500" /> Senior Operations AI Partner
                </span>

                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                  How can I help you <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">today?</span>
                </h1>
                <p className="mt-2 text-slate-500 font-semibold text-xs md:text-sm max-w-lg">
                  I am pre-configured to handle academic consultation, CSC government documentation, logistics tracking, or general programming, writing, coding, and logical tasks!
                </p>
              </div>

              {/* Greeting Bubble */}
              <div className="bg-white p-5 rounded-3xl border border-indigo-100/80 shadow-md relative max-w-2xl mx-auto z-10 text-center">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-t border-l border-indigo-100" />
                <p className="text-slate-700 text-xs md:text-[13px] font-medium leading-relaxed whitespace-pre-line">
                  {defaultGreeting.text}
                </p>
              </div>

            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 relative z-10">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-white  border-slate-200  text-slate-500 ' 
                      : 'bg-gradient-to-br from-blue-600 to-cyan-500 border-blue-500 shadow-md p-0 overflow-hidden'
                  }`}>
                    {msg.role === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <img src={aiBotImage} alt="AI" className="w-full h-full object-cover scale-[1.2]" />
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1.5 max-w-[calc(100%-3rem)]">
                    <div className={`px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-lg border relative group ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-500 text-white rounded-tr-none shadow-blue-500/10' 
                        : 'bg-white  border-slate-200/80  text-slate-800  rounded-tl-none'
                    }`}>
                      {msg.image && (
                        <div className="mb-3 rounded-xl overflow-hidden border border-slate-200  max-w-sm">
                          <img 
                            src={`data:${msg.image.mimeType};base64,${msg.image.data}`} 
                            alt="Uploaded attachment" 
                            className="max-h-64 w-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="whitespace-pre-line font-medium text-[14px] tracking-wide leading-relaxed">
                        {msg.text}
                      </div>

                      {msg.generatedImage && (
                        <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200/80 shadow-md max-w-full bg-slate-50 relative group/img">
                          <img 
                            src={msg.generatedImage} 
                            alt="Generated output" 
                            className="max-h-96 w-full object-contain mx-auto"
                            referrerPolicy="no-referrer"
                          />
                          <a 
                            href={msg.generatedImage}
                            download="rakhi_generated_image.png"
                            className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all opacity-100 sm:opacity-0 sm:group-hover/img:opacity-100 flex items-center gap-1.5 border border-slate-200"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Download Image
                          </a>
                        </div>
                      )}

                      {msg.role === 'model' && msg.text && (
                        <button
                          onClick={() => handleCopyText(msg.text, i)}
                          title="Copy response"
                          className="absolute -right-12 bottom-0 opacity-0 group-hover:opacity-100 bg-white hover:bg-slate-100 text-slate-500 p-2 rounded-xl transition-all border border-slate-200 cursor-pointer shadow-sm"
                        >
                          {copiedIndex === i ? (
                            <Check className="w-4 h-4 text-emerald-500 " />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 max-w-3xl self-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 border border-blue-500 flex items-center justify-center shadow-md overflow-hidden p-0 animate-pulse">
                    <img src={aiBotImage} alt="AI Loading" className="w-full h-full object-cover scale-[1.2]" />
                  </div>
                  <div className="px-5 py-4 rounded-3xl bg-white  border border-slate-200  rounded-tl-none flex items-center gap-2 h-[52px] shadow-lg">
                    <div className="w-2 h-2 bg-blue-500  rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500  rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500  rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white  border-t border-slate-200  p-4 shrink-0">
          <div className="max-w-4xl mx-auto">
            {attachedImagePreview && (
              <div className="flex items-center gap-3 bg-slate-50  p-2.5 rounded-2xl border border-slate-200  mb-3 w-fit">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 ">
                  <img src={attachedImagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="pr-4">
                  <p className="text-sm font-bold text-slate-800 ">Image attached</p>
                  <p className="text-xs text-slate-400 ">Ready to analyze</p>
                </div>
                <button 
                  onClick={removeAttachedImage}
                  className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 hover:text-red-500 transition-colors cursor-pointer mr-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-end gap-2 relative">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3.5 bg-slate-50 hover:bg-slate-100  text-slate-500 hover:text-slate-800  rounded-2xl transition-colors cursor-pointer border border-slate-200  shrink-0"
                title="Attach an Image"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              {/* Voice-to-Text Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer border shrink-0 flex items-center justify-center relative ${
                  isListening 
                    ? 'bg-red-500 text-white border-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border-slate-200'
                }`}
                title={isListening ? "Listening... Click to stop" : "Speak your message"}
              >
                {isListening ? (
                  <>
                    <Mic className="w-5 h-5 animate-bounce" />
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600"></span>
                    </span>
                  </>
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              {/* Image Generation Mode Toggle */}
              <button
                type="button"
                onClick={() => setGenerateImageMode(prev => !prev)}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer border shrink-0 flex items-center justify-center relative ${
                  generateImageMode 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/20' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border-slate-200'
                }`}
                title={generateImageMode ? "Image Mode Active (gemini-3.1-flash-image-preview) - Click to disable" : "Switch to Image Creator/Editor Mode"}
              >
                <Sparkles className={`w-5 h-5 ${generateImageMode ? 'animate-pulse text-amber-100' : ''}`} />
                {generateImageMode && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                )}
              </button>

              <div className="relative flex-1 bg-slate-50  border border-slate-200  focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30 rounded-3xl transition-all">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder={
                    generateImageMode 
                      ? "Describe the image you want to create or edit..." 
                      : isListening 
                        ? "Hearing you... speak your request now!" 
                        : "Message Rakhi Digital Center..."
                  }
                  className="w-full bg-transparent border-none focus:ring-0 resize-none py-3.5 pl-4 pr-14 text-sm text-slate-800  font-medium placeholder:text-slate-400 min-h-[52px] max-h-32 custom-scrollbar outline-none"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={(!input.trim() && !attachedImage) || isLoading}
                  className="absolute right-2 bottom-2 p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-30 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-full transition-all cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
            <div className="text-center mt-2">
              <span className="text-[10px] text-slate-500  font-medium tracking-wide">
                Rakhi Internet AI can make mistakes. Please verify important information.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
