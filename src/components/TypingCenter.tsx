import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RefreshCw, Keyboard, Clock, Target, Zap, FileText, Trophy } from 'lucide-react';

interface Score {
  id: string;
  name: string;
  wpm: number;
  accuracy: number;
  date: string;
  language: string;
  mode: string;
}

const ENGLISH_WORDS = ["the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us", "important", "beautiful", "together", "something", "different", "sometimes", "everything", "understanding", "information", "development", "experience", "technology", "community", "knowledge", "environment", "management", "international", "organization", "relationship", "opportunity"];

const HINDI_WORDS = ["के", "है", "में", "की", "और", "से", "हैं", "को", "पर", "एक", "का", "नहीं", "लिए", "यह", "कि", "था", "साथ", "हो", "इस", "भी", "जो", "कर", "तो", "ही", "किया", "गया", "वाले", "रूप", "करने", "कहा", "बाद", "अपने", "तक", "कुछ", "होता", "दिया", "वे", "होने", "जा", "करते", "रहा", "लेकिन", "थे", "गए", "क्या", "रही", "कोई", "जाने", "बात", "उन", "उन्हें", "उनके", "लोग", "समय", "जब", "वह", "या", "सभी", "तरह", "काम", "अब", "पहले", "जाता", "गई", "हुए", "उनका", "बहुत", "करना", "कई", "ऐसे", "दो", "दिन", "नाम", "इन", "किसी", "वाले", "बता", "हुई", "सबसे", "आ", "जाती", "आदि", "महत्वपूर्ण", "जानकारी", "आवश्यकता", "उपयोगकर्ता", "अनुभव", "अंतरराष्ट्रीय", "प्रौद्योगिकी", "व्यवस्था", "सुविधाओं", "उपलब्ध", "कार्यक्रम", "सम्बंधित", "प्रणाली", "समस्याओं", "सामाजिक", "संभावना", "वास्तविक", "स्वतंत्रता"];

const ENGLISH_TEXTS = [
  "The quick brown fox jumps over the lazy dog.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "In the middle of every difficulty lies opportunity.",
  "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Believe you can and you're halfway there.",
  "Happiness is not something ready made. It comes from your own actions.",
  "Do not go where the path may lead, go instead where there is no path and leave a trail.",
  "It is during our darkest moments that we must focus to see the light.",
  "Always remember that you are absolutely unique. Just like everyone else."
];

const HINDI_TEXTS = [
  "सफलता का मुख्य आधार सकारात्मक सोच और निरंतर प्रयास है।",
  "शिक्षा सबसे शक्तिशाली हथियार है जिससे आप दुनिया को बदल सकते हैं।",
  "समय का मूल्य समझना ही जीवन में आगे बढ़ने की पहली सीढ़ी है।",
  "कड़ी मेहनत का कोई विकल्प नहीं होता, सफलता उन्हीं को मिलती है जो कोशिश करते हैं।",
  "हमेशा अपने लक्ष्यों की ओर बढ़ते रहें, एक दिन मंजिल जरूर मिलेगी।",
  "जो लोग अपने सपनों पर विश्वास करते हैं, भविष्य उन्हीं का होता है।",
  "कठिनाइयों के बीच ही अवसर छिपे होते हैं।",
  "आप जो भी करें, उसे पूरे दिल और लगन से करें।",
  "ज्ञान वह निवेश है जिसका मुनाफा जीवन भर मिलता रहता है।",
  "सकारात्मक दृष्टिकोण हर मुश्किल को आसान बना देता है।"
];

const ENGLISH_SUMMARIES = [
  "Typing is the process of writing or inputting text by pressing keys on a typewriter, computer keyboard, cell phone, or calculator. It can be distinguished from other means of text input, such as handwriting and speech recognition. Text can be in the form of letters, numbers and other symbols. The world's first typist was Lillian Sholes from Wisconsin, the daughter of Christopher Sholes, who invented the first practical typewriter.",
  "The internet is a global system of interconnected computer networks that uses the standard Internet protocol suite to serve billions of users worldwide. It is a network of networks that consists of private, public, academic, business, and government networks of local to global scope, linked by a broad array of electronic, wireless, and optical networking technologies. The Internet carries an extensive range of information resources and services.",
  "Artificial intelligence is intelligence demonstrated by machines, unlike the natural intelligence displayed by humans and animals, which involves consciousness and emotionality. The distinction between the former and the latter categories is often revealed by the acronym chosen. Strong AI is usually labelled as artificial general intelligence while attempts to emulate natural intelligence have been called artificial biological intelligence."
];

const HINDI_SUMMARIES = [
  "टाइपिंग एक ऐसा कौशल है जो आज के डिजिटल युग में बहुत आवश्यक हो गया है। कंप्यूटर, लैपटॉप या मोबाइल पर तेज़ी से और सही ढंग से टाइप करने से न केवल समय की बचत होती है बल्कि काम की गुणवत्ता भी बढ़ती है। टाइपिंग में महारत हासिल करने के लिए निरंतर अभ्यास और सही उंगलियों के प्लेसमेंट की आवश्यकता होती है। जो लोग नियमित रूप से टाइपिंग का अभ्यास करते हैं, उनकी उंगलियां कीबोर्ड पर अपने आप सही बटनों पर चली जाती हैं।",
  "इंटरनेट ने दुनिया को एक वैश्विक गांव में बदल दिया है। इसके माध्यम से हम दुनिया के किसी भी कोने में बैठे व्यक्ति से पल भर में संपर्क कर सकते हैं। यह सूचनाओं का एक अथाह सागर है जहाँ हर विषय पर जानकारी उपलब्ध है। शिक्षा, व्यापार, मनोरंजन और संचार के क्षेत्र में इंटरनेट ने क्रांति ला दी है। आज के समय में इंटरनेट के बिना जीवन की कल्पना करना भी मुश्किल लगता है।",
  "प्रदूषण आज के समय की सबसे गंभीर समस्याओं में से एक है। हवा, पानी और मिट्टी में अवांछित तत्वों का मिलना प्रदूषण कहलाता है। इसके कारण पर्यावरण और मानव स्वास्थ्य दोनों को भारी नुकसान पहुँच रहा है। बढ़ती आबादी, औद्योगीकरण और वनों की कटाई प्रदूषण के मुख्य कारण हैं। इसे नियंत्रित करने के लिए हमें अधिक पेड़ लगाने चाहिए और पर्यावरण के अनुकूल विकल्पों को अपनाना चाहिए।"
];

const NUMBERS_TEXTS = [
  "12 45 78 90 23 56 89 34 67 91 24 57 80 13 46 79 02 35 68 19 42 75 08",
  "1994 2023 1856 2000 1987 1776 2010 1999 1800 2050 1945 1914 1865 2020",
  "8,450.50 1,200.75 3,400.00 9,999.99 4,500.25 1,000,000 500.50 2,345.67",
  "10% 20% 50% 100% 75.5% 33.3% 99.9% 0.5% 12.5% 8.5% 3.14% 2.71% 1000%"
];

interface TypingCenterProps {
  onBack: () => void;
}

const TypingCenter: React.FC<TypingCenterProps> = ({ onBack }) => {
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [mode, setMode] = useState<'words' | 'sentences' | 'summaries' | 'numbers'>('sentences');
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [textToType, setTextToType] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds test
  
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [scoreSaved, setScoreSaved] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('typingLeaderboard');
    if (saved) {
      try {
        setLeaderboard(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    resetTest();
  }, [language, mode, level]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isFinished && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        calculateStats();
      }, 1000);
    } else if (timeLeft === 0) {
      setIsFinished(true);
      calculateStats();
    }
    return () => clearInterval(interval);
  }, [startTime, isFinished, timeLeft]);

  const resetTest = () => {
    let textToGenerate = '';
    
    if (mode === 'numbers') {
      const numbersPool = level === 'easy' ? ['12', '45', '78', '90', '23', '56', '89', '34', '67', '91', '02', '35', '68'] 
        : level === 'medium' ? ['1994', '2023', '1856', '2000', '1987', '1776', '2010', '1999', '1800', '2050', '1945'] 
        : ['8,450.50', '10%', '33.3%', '9,999.99', '1,000,000', '75.5%', '2,345.67', '99.9%', '3.14%', '0.5%'];
      const selected = [];
      for (let i = 0; i < (level === 'easy' ? 40 : 25); i++) {
        selected.push(numbersPool[Math.floor(Math.random() * numbersPool.length)]);
      }
      textToGenerate = selected.join(' ');
    } else if (mode === 'summaries') {
      const texts = language === 'english' ? ENGLISH_SUMMARIES : HINDI_SUMMARIES;
      // For summaries, we can just pick one since they are long. If we want new every time, we can concatenate 2 random ones for hard.
      let summary = texts[Math.floor(Math.random() * texts.length)];
      if (level === 'hard') {
        summary += " " + texts[Math.floor(Math.random() * texts.length)];
      } else if (level === 'easy') {
        summary = summary.substring(0, Math.floor(summary.length / 2)) + ".";
      }
      textToGenerate = summary;
    } else if (mode === 'words') {
      const wordsPool = language === 'english' ? ENGLISH_WORDS : HINDI_WORDS;
      let filteredWords = wordsPool;
      if (level === 'easy') {
        filteredWords = wordsPool.filter(w => w.length <= 4);
      } else if (level === 'medium') {
        filteredWords = wordsPool.filter(w => w.length > 4 && w.length <= 7);
      } else if (level === 'hard') {
        filteredWords = wordsPool.filter(w => w.length > 7);
      }
      if (filteredWords.length === 0) filteredWords = wordsPool; // fallback
      
      const selectedWords = [];
      for (let i = 0; i < 40; i++) {
        selectedWords.push(filteredWords[Math.floor(Math.random() * filteredWords.length)]);
      }
      textToGenerate = selectedWords.join(' ');
    } else {
      // sentences
      const texts = language === 'english' ? ENGLISH_TEXTS : HINDI_TEXTS;
      const count = level === 'easy' ? 2 : level === 'medium' ? 4 : 6;
      const selected = [];
      for (let i = 0; i < count; i++) {
        selected.push(texts[Math.floor(Math.random() * texts.length)]);
      }
      textToGenerate = selected.join(' ');
    }

    setTextToType(textToGenerate);
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    setTimeLeft(60);
    setScoreSaved(false);
    setPlayerName('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const saveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || wpm === 0 || scoreSaved) return;
    
    const newScore: Score = {
      id: Date.now().toString(),
      name: playerName.trim(),
      wpm,
      accuracy,
      date: new Date().toLocaleDateString(),
      language,
      mode
    };
    
    const updated = [...leaderboard, newScore]
      .sort((a, b) => b.wpm - a.wpm)
      .slice(0, 10);
      
    setLeaderboard(updated);
    localStorage.setItem('typingLeaderboard', JSON.stringify(updated));
    setScoreSaved(true);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;
    
    if (!startTime) {
      setStartTime(Date.now());
    }
    
    const value = e.target.value;
    setUserInput(value);
    
    if (value.length >= textToType.length) {
      setIsFinished(true);
    }
    
    calculateStats(value);
  };

  const calculateStats = (currentInput = userInput) => {
    if (!startTime) return;
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    if (timeElapsed === 0) return;
    
    const wordsTyped = currentInput.length / 5; // Standard 5 chars = 1 word
    const currentWpm = Math.round(wordsTyped / timeElapsed);
    
    let correctChars = 0;
    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] === textToType[i]) {
        correctChars++;
      }
    }
    const currentAccuracy = currentInput.length > 0 
      ? Math.round((correctChars / currentInput.length) * 100) 
      : 100;

    setWpm(currentWpm);
    setAccuracy(currentAccuracy);
  };

  const renderText = () => {
    return textToType.split('').map((char, index) => {
      let color = 'text-slate-400';
      if (index < userInput.length) {
        color = userInput[index] === char ? 'text-emerald-500 bg-emerald-50/50' : 'text-red-500 bg-red-50';
      } else if (index === userInput.length) {
        color = 'text-slate-800 bg-blue-100 border-b-2 border-blue-500 animate-pulse';
      }
      return (
        <span key={index} className={`transition-colors duration-100 ${color}`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-slate-900 selection:bg-blue-100 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Keyboard className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">Typing Center</h1>
                <p className="text-emerald-50 font-medium text-sm mt-1">Improve your typing speed and accuracy</p>
              </div>
            </div>
            
            <div className="flex bg-white/20 p-1 rounded-xl backdrop-blur-sm self-stretch sm:self-auto">
              <button 
                onClick={() => setLanguage('english')}
                className={`flex-1 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all ${language === 'english' ? 'bg-white text-emerald-600 shadow-sm' : 'text-emerald-50 hover:bg-white/10'}`}
              >
                English
              </button>
              <button 
                onClick={() => setLanguage('hindi')}
                className={`flex-1 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all ${language === 'hindi' ? 'bg-white text-emerald-600 shadow-sm' : 'text-emerald-50 hover:bg-white/10'}`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border-b border-slate-200 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { id: 'words', label: 'Words (शब्द)' },
                  { id: 'sentences', label: 'Sentences (वाक्य)' },
                  { id: 'summaries', label: 'Summary (सारांश)' },
                  { id: 'numbers', label: 'Numbers (संख्या)' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id as any)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${mode === m.id ? 'bg-emerald-100 text-emerald-700 shadow-sm border border-emerald-200' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <div className="flex bg-slate-200/50 p-1 rounded-xl">
                {['easy', 'medium', 'hard'].map(l => (
                  <button
                    key={l}
                    onClick={() => setLevel(l as any)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${level === l ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
                <div className="flex items-center justify-center gap-1.5 text-slate-500 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Time Left</span>
                </div>
                <div className="text-2xl font-black text-slate-800">{timeLeft}s</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 text-center">
                <div className="flex items-center justify-center gap-1.5 text-blue-500 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Speed</span>
                </div>
                <div className="text-2xl font-black text-blue-700">{wpm} <span className="text-sm">WPM</span></div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-center">
                <div className="flex items-center justify-center gap-1.5 text-emerald-500 mb-1">
                  <Target className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Accuracy</span>
                </div>
                <div className="text-2xl font-black text-emerald-700">{accuracy}%</div>
              </div>
            </div>

            <div 
              className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 text-xl sm:text-2xl leading-relaxed tracking-wide font-medium text-slate-400 mb-6 font-mono select-none break-words min-h-[160px]"
              onClick={() => inputRef.current?.focus()}
            >
              {renderText()}
            </div>

            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInput}
              disabled={isFinished}
              className="w-full bg-white border-2 border-slate-200 rounded-2xl p-4 text-lg text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none resize-none font-mono"
              rows={3}
              placeholder={isFinished ? "Test completed!" : "Start typing here..."}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
            />

            <div className="mt-6 flex justify-end">
              <button
                onClick={resetTest}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                {isFinished ? 'Try Again' : 'Reset Test'}
              </button>
            </div>

            {isFinished && wpm > 0 && !scoreSaved && (
              <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <h3 className="text-xl font-bold text-emerald-800 mb-4">Great job! Save your score</h3>
                <form onSubmit={saveScore} className="flex gap-3 w-full max-w-md">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="flex-1 px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    maxLength={20}
                    required
                  />
                  <button type="submit" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm">
                    Save
                  </button>
                </form>
              </div>
            )}

            {isFinished && scoreSaved && (
              <div className="mt-8 p-4 bg-blue-50 text-blue-700 rounded-xl text-center font-bold animate-in fade-in duration-300">
                Score saved successfully!
              </div>
            )}

            {leaderboard.length > 0 && (
              <div className="mt-12 animate-in fade-in duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 shadow-inner">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Top Typists</h2>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                          <th className="p-4 pl-6">Rank</th>
                          <th className="p-4">Name</th>
                          <th className="p-4 text-center">WPM</th>
                          <th className="p-4 text-center">Accuracy</th>
                          <th className="p-4">Mode</th>
                          <th className="p-4 text-right pr-6">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {leaderboard.map((score, idx) => (
                          <tr key={score.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="p-4 pl-6">
                              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                                idx === 0 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400/20' :
                                idx === 1 ? 'bg-slate-200 text-slate-700 ring-2 ring-slate-400/20' :
                                idx === 2 ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-400/20' :
                                'bg-slate-100 text-slate-500'
                              }`}>
                                {idx + 1}
                              </span>
                            </td>
                            <td className="p-4 font-bold text-slate-800">{score.name}</td>
                            <td className="p-4 text-center">
                              <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-black bg-blue-100 text-blue-800 shadow-sm">
                                {score.wpm}
                              </span>
                            </td>
                            <td className="p-4 text-center font-bold text-emerald-600">{score.accuracy}%</td>
                            <td className="p-4 text-sm text-slate-500 capitalize font-medium">
                              {score.mode} <span className="text-slate-300 mx-1">•</span> {score.language}
                            </td>
                            <td className="p-4 text-right text-sm text-slate-400 pr-6 font-medium">{score.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingCenter;
