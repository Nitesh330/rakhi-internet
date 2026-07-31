import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, User, Sparkles, 
  Image as ImageIcon, Trash2, Copy, Check, Zap, Brain, UserCog, 
  Plus, MessageCircle, ChevronLeft, Menu,
  Code, FileText, HelpCircle, GraduationCap, Globe, Cpu, ArrowRight, BookOpen, Lightbulb, Laptop, PenTool, Database,
  Mic, MicOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
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
    
    setSessions(prevSessions => {
      let title = 'New Chat';
      const userMessages = newMessages.filter(m => m.role === 'user');
      if (userMessages.length > 0) {
        title = userMessages[0].text.substring(0, 30);
        if (userMessages[0].text.length > 30) title += '...';
        if (!title.trim() && userMessages[0].image) title = 'Image Analysis';
      }

      let sessionExists = false;
      const updatedSessions = prevSessions.map(s => {
        if (s.id === currentSessionId) {
          sessionExists = true;
          return { ...s, messages: newMessages, title, updatedAt: Date.now() };
        }
        return s;
      });

      let finalSessions = updatedSessions;
      if (!sessionExists && currentSessionId) {
        finalSessions = [{
          id: currentSessionId,
          title,
          messages: newMessages,
          updatedAt: Date.now()
        }, ...prevSessions];
      }

      finalSessions.sort((a, b) => b.updatedAt - a.updatedAt);
      localStorage.setItem('rakhi_chat_sessions', JSON.stringify(finalSessions));
      return finalSessions;
    });
  };

  const clearCurrentChat = () => {
    const clearedMessages = [defaultGreeting];
    setMessages(clearedMessages);
    setAttachedImage(null);
    setAttachedImagePreview(null);
    setInput('');
    setShowClearConfirm(false);

    setSessions(prevSessions => {
      let found = false;
      const updated = prevSessions.map(s => {
        if (s.id === currentSessionId) {
          found = true;
          return {
            ...s,
            messages: clearedMessages,
            title: 'New Chat',
            updatedAt: Date.now()
          };
        }
        return s;
      });

      let final = updated;
      if (!found && currentSessionId) {
        final = [{
          id: currentSessionId || Date.now().toString(),
          title: 'New Chat',
          messages: clearedMessages,
          updatedAt: Date.now()
        }, ...prevSessions];
      }

      localStorage.setItem('rakhi_chat_sessions', JSON.stringify(final));
      return final;
    });
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
            // Add the empty model message placeholder
            setMessages(prev => [...prev, { role: 'model', text: '' }]);
            // Give React a tick to add it before we update it
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
        setTimeout(() => updateCurrentSession(prev), 0);
        return prev;
      });

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => {
        const updated = [...prev];
        if (updated[updated.length - 1].text === '') {
          updated[updated.length - 1].text = 'Sorry, I am having trouble connecting to the server. Please check your network and try again.';
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
            // Add the empty model message placeholder
            setMessages(prev => [...prev, { role: 'model', text: '' }]);
            // Give React a tick to add it before we update it
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
        setTimeout(() => updateCurrentSession(prev), 0);
        return prev;
      });

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => {
        const updated = [...prev];
        if (updated[updated.length - 1].text === '') {
          updated[updated.length - 1].text = 'Sorry, I am having trouble connecting to the server. Please check your network and try again.';
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



          {/* New Chat / Clear Chat Button */}
          {showClearConfirm ? (
            <div className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1.5 rounded-xl border border-red-200">
              <span className="text-[11px] font-bold text-red-700">Clear chat?</span>
              <button
                onClick={clearCurrentChat}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Yes
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-100 rounded-xl transition-all text-xs font-bold cursor-pointer"
              title="Clear Chat"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline">Clear Chat</span>
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar flex flex-col gap-6 scroll-smooth bg-gradient-to-b from-slate-50 via-white to-slate-50 relative" style={{ perspective: '1000px' }}>
          {messages.length <= 1 ? (
            <div className="flex flex-col gap-8 py-8 px-2 max-w-4xl mx-auto w-full relative z-10">
              {/* Grid / Ambient Background Details */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

              {/* Hero Header */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="relative mb-8 flex items-center justify-center w-32 h-32" style={{ transformStyle: 'preserve-3d' }}>
                  {/* 3D Inner Core Glow */}
                  <motion.div 
                    className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl pointer-events-none"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  {/* Outer 3D Gyroscopic Orbit Ring 1 */}
                  <motion.div
                    animate={{ rotateZ: [0, 360], rotateX: [70, 75, 70] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute w-full h-full border-2 border-dashed border-blue-400/60 shadow-[0_0_15px_rgba(59,130,246,0.4)] rounded-full pointer-events-none"
                    style={{ transformStyle: 'preserve-3d' }}
                  />
                  
                  {/* Outer 3D Gyroscopic Orbit Ring 2 */}
                  <motion.div
                    animate={{ rotateZ: [360, 0], rotateY: [70, 75, 70] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute w-full h-full border border-indigo-400/40 rounded-full pointer-events-none"
                    style={{ transformStyle: 'preserve-3d' }}
                  />

                  {/* Central Avatar */}
                  <motion.div 
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-28 h-28 flex items-center justify-center z-10 drop-shadow-2xl"
                  >
                    <img
                      src={aiBotImage}
                      alt="AI Bot"
                      draggable="false"
                      className="w-full h-full object-contain select-none"
                    />
                  </motion.div>

                  {/* Online Status Dot */}
                  <div className="absolute bottom-4 right-4 bg-emerald-500 border-2 border-white w-4 h-4 rounded-full flex items-center justify-center shadow-md z-20">
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
                <div key={i} className={`flex gap-3 max-w-[95%] md:max-w-3xl ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border shadow-sm relative ${
                    msg.role === 'user' 
                      ? 'bg-white border-slate-200 text-indigo-500 shadow-sm' 
                      : 'bg-gradient-to-br from-blue-600 to-cyan-500 border-blue-500 shadow-md p-0 ring-2 ring-white'
                  }`}>
                    {msg.role === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <div className="w-full h-full relative rounded-2xl overflow-hidden">
                        <motion.div
                          animate={{ rotateY: [0, 15, -15, 0], scale: [1, 1.05, 1] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                          className="w-full h-full flex items-center justify-center z-10 relative"
                        >
                          <img src={aiBotImage} alt="AI" className="w-full h-full object-cover scale-[1.2]" />
                        </motion.div>
                        <motion.div 
                          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.6, 0.2] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0 bg-cyan-400 rounded-full blur-sm -z-10 mix-blend-plus-lighter"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <div className={`px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-lg border relative group ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-indigo-500 to-blue-600 border-transparent text-white rounded-tr-none shadow-md shadow-blue-500/20' 
                        : 'bg-white border-transparent text-slate-800 rounded-tl-none shadow-md shadow-slate-200/40 ring-1 ring-slate-100'
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
                      
                      <div className="font-medium text-[15px] tracking-wide leading-relaxed break-words overflow-hidden">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]} 
                          components={{ 
                            a: ({node, ...props}) => <a {...props} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" />,
                            p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0" />,
                            ul: ({node, ...props}) => <ul {...props} className="list-disc pl-5 mb-2" />,
                            ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-5 mb-2" />,
                            li: ({node, ...props}) => <li {...props} className="mb-1" />,
                            h1: ({node, ...props}) => <h1 {...props} className="text-lg font-bold mt-4 mb-2" />,
                            h2: ({node, ...props}) => <h2 {...props} className="text-md font-bold mt-3 mb-2" />,
                            h3: ({node, ...props}) => <h3 {...props} className="text-base font-bold mt-2 mb-1" />,
                            pre: ({node, ...props}) => <pre {...props} className="bg-slate-100 p-3 rounded-xl overflow-x-auto my-3 text-sm" />,
                            code: ({node, ...props}) => <code {...props} className="bg-slate-100 px-1.5 py-0.5 rounded-md text-sm text-pink-600 break-words" />
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
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
                <div className="flex gap-3 max-w-[95%] md:max-w-3xl self-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 border border-blue-500 flex items-center justify-center shadow-md overflow-hidden p-0 animate-pulse relative">
                    <motion.div
                      animate={{ rotateY: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full flex items-center justify-center z-10 relative"
                    >
                      <img src={aiBotImage} alt="AI Loading" className="w-full h-full object-cover scale-[1.2]" />
                    </motion.div>
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-cyan-400 rounded-full blur-md -z-10 mix-blend-plus-lighter"
                    />
                  </div>
                  <div className="px-5 py-4 rounded-3xl bg-white border border-slate-200 rounded-tl-none flex items-center gap-3 h-[52px] shadow-lg" style={{ perspective: '800px' }}>
                    <div className="flex gap-2 relative z-10" style={{ transformStyle: 'preserve-3d' }}>
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            y: [-4, 4, -4],
                            rotateX: [0, 180, 360],
                            rotateY: [0, 180, 360],
                            scale: [0.8, 1.2, 0.8]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            delay: i * 0.3
                          }}
                          className="w-2.5 h-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                          style={{ transformStyle: 'preserve-3d' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white  border-t border-slate-200  p-4 shrink-0 relative z-20" style={{ perspective: '1200px' }}>
          <div className="max-w-4xl mx-auto">
            {attachedImagePreview && (
              <motion.div 
                initial={{ opacity: 0, y: 10, rotateX: -10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-3 bg-slate-50  p-2.5 rounded-2xl border border-slate-200  mb-3 w-fit origin-bottom"
              >
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
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex items-end gap-1.5 md:gap-2 relative w-full min-w-0">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <motion.button
                whileHover={{ scale: 1.05, y: -2, rotateZ: -5, boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 md:p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-indigo-500 rounded-xl md:rounded-2xl transition-colors cursor-pointer border border-slate-200 shrink-0 shadow-sm relative z-10"
                title="Attach an Image"
              >
                <ImageIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </motion.button>

              {/* Voice-to-Text Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2, rotateZ: 5, boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={toggleListening}
                className={`p-1.5 md:p-2.5 rounded-xl md:rounded-2xl transition-all cursor-pointer border shrink-0 flex items-center justify-center relative shadow-sm z-10 ${
                  isListening 
                    ? 'bg-red-500 text-white border-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-indigo-500 border-slate-200'
                }`}
                title={isListening ? "Listening... Click to stop" : "Speak your message"}
              >
                {isListening ? (
                  <>
                    <Mic className="w-3.5 h-3.5 md:w-4 md:h-4 animate-bounce" />
                    <span className="absolute -top-1 -right-1 flex h-2 w-2 md:h-2.5 md:w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-red-600"></span>
                    </span>
                  </>
                ) : (
                  <Mic className="w-3.5 h-3.5 md:w-4 md:h-4" />
                )}
              </motion.button>

              {/* Image Generation Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2, rotateZ: -5, boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setGenerateImageMode(prev => !prev)}
                className={`p-1.5 md:p-2.5 rounded-xl md:rounded-2xl transition-all cursor-pointer border shrink-0 flex items-center justify-center relative shadow-sm z-10 ${
                  generateImageMode 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/20' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-amber-500 border-slate-200'
                }`}
                title={generateImageMode ? "Image Mode Active (Image generation preview) - Click to disable" : "Switch to Image Creator/Editor Mode"}
              >
                <Sparkles className={`w-3.5 h-3.5 md:w-4 md:h-4 ${generateImageMode ? 'animate-pulse text-amber-100' : ''}`} />
                {generateImageMode && (
                  <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5 md:h-2 md:w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-amber-500"></span>
                  </span>
                )}
              </motion.button>

              <motion.div 
                whileHover={{ y: -2, boxShadow: '0px 12px 20px -5px rgba(0,0,0,0.1)' }}
                className="relative flex-1 bg-white border border-slate-200 shadow-sm focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 rounded-3xl transition-all overflow-hidden min-w-0 z-10"
              >
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
                      ? "Describe image..." 
                      : isListening 
                        ? "Hearing you..." 
                        : "Message Rakhi Digital..."
                  }
                  className="w-full bg-transparent border-none focus:ring-0 resize-none py-3.5 pl-4 pr-12 md:pr-14 text-sm text-slate-800 font-medium placeholder:text-slate-400 min-h-[52px] max-h-32 custom-scrollbar outline-none"
                  rows={1}
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.1, rotateZ: 10 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  disabled={(!input.trim() && !attachedImage) || isLoading}
                  className="absolute right-2 bottom-2 p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-30 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-full transition-all cursor-pointer shadow-md flex items-center justify-center"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </motion.button>
              </motion.div>
            </form>
            <div className="text-center mt-2 opacity-80 hover:opacity-100 transition-opacity">
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
