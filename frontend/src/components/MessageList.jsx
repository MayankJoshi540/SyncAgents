import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import MessageBubble from "./MessageBubble";
import { getMessages } from "../features/message.api";
import { setArtifacts, setMessages } from "../redux/message.slice";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";

function GeneratingIndicator() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#2f2f2f] text-sm text-slate-300 w-fit">
      <div className="w-2 h-2 rounded-full bg-[#10a37f] animate-ping" />
      <span>SyncAgents is writing...</span>
    </div>
  );
}

export default function MessageList() {
  const containerRef = useRef(null);
  const dispatch  = useDispatch();

  const { selectedConversation } = useSelector(state => state.conversation);
  const { messages, isLoading }   = useSelector(state => state.message);

  useEffect(() => {
    if (messages.length > 0 && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const get = async () => {
      if (!selectedConversation?._id) return;
      try {
        const data = await getMessages(selectedConversation._id);
        dispatch(setMessages(data));
        const latestArtifactMessage = [...data].reverse().find(m => m.artifacts && m.artifacts.length > 0);
        if (latestArtifactMessage) {
          dispatch(setArtifacts(latestArtifactMessage.artifacts));
        } else {
          dispatch(setArtifacts([]));
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    get();
  }, [selectedConversation?._id, dispatch]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex flex-col">
      <div className="chat-container-max flex-1 flex flex-col justify-start min-h-full py-6">
        
        {messages.length === 0 && !isLoading ? (
          <div className="my-auto flex flex-col items-center justify-center gap-6 text-center max-w-lg mx-auto">
            
            {/* ChatGPT-style Icon */}
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Sparkles size={20} className="text-[#10a37f]" />
            </div>
            
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              How can I help you today?
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-4">
              {[
                { title: "Design a landing page", subtitle: "for a dark-themed coding app" },
                { title: "Explain local storage sync", subtitle: "between microservice modules" },
                { title: "Write a React stopwatch", subtitle: "using framer-motion loops" },
                { title: "Create presentation content", subtitle: "summarizing project features" }
              ].map((s, idx) => (
                <button
                  key={idx}
                  className="text-left p-4 rounded-2xl bg-[#2f2f2f] hover:bg-white/5 border border-white/5 transition-all duration-200 cursor-pointer flex justify-between items-start group"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{s.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{s.subtitle}</p>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-600 group-hover:text-slate-300 transition-colors shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <MessageBubble role={msg.role} content={msg.content} images={msg?.images || []}/>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <GeneratingIndicator />
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}