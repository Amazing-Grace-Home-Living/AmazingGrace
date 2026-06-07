import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  type Timestamp
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, User as UserIcon, Shield } from 'lucide-react';
import { db } from '../firebase-config';
import { useAuthUser, signInWithGoogle } from '../firebase/auth';

interface Message {
  id: string;
  text: string;
  sender: string;
  senderId: string;
  timestamp: Timestamp;
  type: 'user' | 'ai';
}

export const ChatOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { user } = useAuthUser();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'chat_messages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const text = inputValue;
    setInputValue('');

    try {
      await addDoc(collection(db, 'chat_messages'), {
        text,
        sender: user?.displayName || 'Anonymous Operator',
        senderId: user?.uid || 'anon',
        timestamp: serverTimestamp(),
        type: 'user'
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-cyan-500 text-white shadow-lg hover:bg-cyan-400 transition-colors"
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-cyan-400" />
                <h3 className="font-bold text-white uppercase tracking-wider text-sm">Matrix Comms</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.senderId === user?.uid ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase">
                      {msg.sender}
                    </span>
                  </div>
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.senderId === user?.uid 
                        ? 'bg-cyan-600 text-white rounded-tr-none' 
                        : 'bg-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {!user && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
                  <p className="text-xs text-amber-200 mb-3">Sign in to save your comms identity.</p>
                  <button 
                    onClick={() => signInWithGoogle()}
                    className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <UserIcon size={14} /> Sign in with Google
                  </button>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-slate-800/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={user ? "Type a message..." : "Comms locked (Sign in required)"}
                  disabled={!user}
                  className="flex-grow bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={!user || !inputValue.trim()}
                  className="p-2 rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-50 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
