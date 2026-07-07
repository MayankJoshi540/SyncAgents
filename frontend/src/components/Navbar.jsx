import { Share2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { selectedConversation } = useSelector(state => state.conversation);
  const { messages, isLoading } = useSelector(state => state.message);
  
  return (
    <div className="h-14 flex items-center justify-between px-5 border-b border-white/5 bg-[#212121] font-sans select-none">

      {/* Left — Thread title */}
      <div className="flex items-center gap-2 pl-10 lg:pl-0">
        <h2 className="text-sm font-semibold text-slate-200 tracking-tight truncate max-w-[200px] sm:max-w-none">
          {selectedConversation?.title || "New Chat"}
        </h2>
        <span className="text-[10px] text-slate-500 font-medium bg-white/5 border border-white/10 px-2 py-0.5 rounded-full shrink-0">
          {messages.length} messages
        </span>
      </div>

      {/* Center — Model Name */}
      <div className="hidden sm:block text-xs font-medium text-slate-400">
        SyncAgents <span className="text-slate-600 font-normal">v4.0</span>
      </div>

      {/* Right — Share actions */}
      <div className="flex items-center gap-2">
        {isLoading && (
          <span className="text-[10px] text-[#10a37f] font-medium bg-[#10a37f]/10 px-2 py-0.5 rounded-full animate-pulse">
            Thinking...
          </span>
        )}
        
        <button 
          title="Share Thread"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
        >
          <Share2 size={13} className="text-slate-400 group-hover:text-white" />
          Share
        </button>
      </div>

    </div>
  );
}