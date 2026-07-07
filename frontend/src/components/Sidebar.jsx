import { useEffect, useState } from "react";
import { Plus, MessageSquare, LogOut, User, PenSquare, Menu, X, Coins } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/axios";
import { setUserData } from "../redux/user.slice";
import { createConversation, getConversations } from "../features/conversation.api";
import { addConversation, setConversations, setSelectedConversation } from "../redux/conversation.slice";
import { getMessages } from "../features/message.api";
import { setArtifacts, setMessages } from "../redux/message.slice";
import BillingDrawer from "./BillingDrawer";

function PanelIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [imageError, setImageError] = useState(false);

  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const { conversations, selectedConversation } = useSelector(state => state.conversation);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        dispatch(setConversations(data));
      } catch (err) {
        console.error("Failed to load conversations:", err);
      }
    };
    if (userData) fetchConversations();
  }, [userData, dispatch]);

  const handleSelectConversation = async (chat) => {
    dispatch(setSelectedConversation(chat));
    try {
      const data = await getMessages(chat._id);
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

  const handleCreateConversation = async () => {
    try {
      const newChat = await createConversation();
      dispatch(addConversation(newChat));
      dispatch(setSelectedConversation(newChat));
      dispatch(setMessages([]));
      dispatch(setArtifacts([]));
      setMobileOpen(false);
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  };

  const logout = async () => {
    try {
      await api.post(`/auth/logout`);
      dispatch(setUserData(null));
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  /* ── Collapsed rail (Vite/ChatGPT style thin icon sidebar) ── */
  const CollapsedRail = () => (
    <div className="hidden lg:flex flex-col items-center w-[60px] h-screen bg-brand-sidebar border-r border-white/5 py-4 gap-2 shrink-0">
      <button
        onClick={() => setCollapsed(false)}
        className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer mb-2"
      >
        <PanelIcon />
      </button>

      <button
        onClick={handleCreateConversation}
        className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
      >
        <Plus size={20} />
      </button>

      <div className="flex-1 flex flex-col items-center gap-1.5 overflow-y-auto w-full px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mt-2">
        {conversations.map((chat) => {
          const isActive = selectedConversation?._id === chat._id;
          return (
            <button
              key={chat._id}
              onClick={() => handleSelectConversation(chat)}
              title={chat.title}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all border-none cursor-pointer
                ${isActive 
                  ? "bg-white/10 text-white" 
                  : "bg-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300"}`}
            >
              <MessageSquare size={16} />
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        {userData && (
          <div className="relative cursor-pointer hover:opacity-90 transition-opacity">
            {userData.avatar
              ? <img src={userData.avatar} alt={userData.name} className="w-8 h-8 rounded-full object-cover" />
              : <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><User size={14} className="text-slate-400" /></div>
            }
          </div>
        )}
      </div>
    </div>
  );

  /* ── Full sidebar content ── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-brand-sidebar border-r border-white/5">

      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-3.5">
        <button
          onClick={() => setCollapsed(true)}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <PanelIcon />
        </button>

        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <X size={16} />
        </button>

        <button
          onClick={handleCreateConversation}
          title="New Chat"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <PenSquare size={18} />
        </button>
      </div>

      {/* New Chat Section */}
      <div className="px-3.5 pb-2">
        <button
          onClick={handleCreateConversation}
          className="w-full flex items-center justify-start gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/5 transition-all cursor-pointer"
        >
          <Plus size={16} className="text-slate-400" />
          New Chat
        </button>
      </div>

      {/* Recent chat feed */}
      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {conversations.map((chat) => {
          const isActive = selectedConversation?._id === chat._id;
          const isHov    = hovered === chat._id;
          return (
            <div
              key={chat._id}
              onClick={() => handleSelectConversation(chat)}
              onMouseEnter={() => setHovered(chat._id)}
              onMouseLeave={() => setHovered(null)}
              className={`flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg transition-all group
                ${isActive 
                  ? "bg-white/10 text-white font-medium"
                  : isHov   
                  ? "bg-white/5 text-slate-200"
                  : "bg-transparent text-slate-300 hover:text-white"}`}
            >
              <p className="text-sm truncate flex-1">
                {chat.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer Profile area */}
      <div className="p-3">
        {userData ? (
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5 transition-all duration-150">
            <div className="relative shrink-0">
              {
                !userData?.avatar || imageError ? (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <User size={14} className="text-slate-400" />
                  </div>
                ) : (
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={() => setImageError(true)}
                  />
                )
              }
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{userData.name}</p>
            </div>
            
            <div className="flex gap-0.5 shrink-0">
              <button
                onClick={() => setShowBilling(true)}
                title="Billing"
                className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white cursor-pointer hover:bg-white/5 transition-all"
              >
                <Coins size={14} />
              </button>
              
              <button 
                onClick={logout} 
                title="Log Out"
                className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-red-400 cursor-pointer hover:bg-white/5 transition-all"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="px-1">
            <button className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 bg-white/5 rounded-lg py-2.5 cursor-pointer hover:bg-white/10 transition-all">
              Sign In
            </button>
          </div>
        )}
      </div>

    </div>
  );

  if (collapsed) return <CollapsedRail />;

  return (
    <>
      {/* ── Mobile hamburger ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-[#212121] border border-white/10 text-slate-400 hover:text-white transition-colors duration-150 cursor-pointer"
      >
        <Menu size={16} />
      </button>

      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* ── Sidebar panel ── */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[260px] h-screen shrink-0
        bg-brand-sidebar
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <SidebarContent />
      </div>

      <BillingDrawer
        open={showBilling}
        onClose={() => setShowBilling(false)}
      />
    </>
  );
}