import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, Square, Zap, MessageSquare, Code2, Presentation, Image as ImageIcon, Globe, FileText, X, Mic, MicOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setArtifacts, setIsLoading } from "../redux/message.slice";
import { sendPrompt } from "../features/agent.api";
import { createConversation } from "../features/conversation.api";
import { addConversation, setSelectedConversation } from "../redux/conversation.slice";

export default function ChatInput({ setBanner }) {
  const [selectedAgent, setSelectedAgent] = useState("auto");
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const recognitionRef = useRef(null);
  const fileRef = useRef(null);
  const textareaRef = useRef(null);
  
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector(state => state.conversation);
  const { isLoading } = useSelector(state => state.message);

  const placeholders = {
    auto: "Message SyncAgents...",
    chat: "Chat with SyncAgents...",
    coding: "Write some code...",
    pdf: "Generate a PDF summary...",
    ppt: "Create slides about...",
    image: "Describe an image to draw...",
    search: "Search the web for..."
  };

  const agents = [
    { id: "auto", icon: Zap, label: "Auto" },
    { id: "chat", icon: MessageSquare, label: "Chat" },
    { id: "coding", icon: Code2, label: "Coding" },
    { id: "pdf", icon: FileText, label: "PDF" },
    { id: "ppt", icon: Presentation, label: "PPT" },
    { id: "image", icon: ImageIcon, label: "Image" },
    { id: "search", icon: Globe, label: "Search" }
  ];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setValue(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition not supported");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    if (!value.trim() && !isLoading) return;
    if (isLoading) return;

    const prompt = value;
    setValue("");
    dispatch(setIsLoading(true));

    let activeChatId = selectedConversation?._id;
    
    try {
      if (!activeChatId) {
        const newChat = await createConversation();
        dispatch(addConversation(newChat));
        dispatch(setSelectedConversation(newChat));
        activeChatId = newChat._id;
      }

      dispatch(addMessage({ role: "user", content: prompt }));
      const response = await sendPrompt(activeChatId, prompt, selectedAgent, selectedFile);
      
      dispatch(addMessage({
        role: "assistant",
        content: response.answer,
        images: response.images,
        artifacts: response.artifacts
      }));

      if (response.artifacts && response.artifacts.length > 0) {
        dispatch(setArtifacts(response.artifacts));
      }
      
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (error) {
      console.error(error);
      setBanner({
        open: true,
        title: "API Error",
        message: "Failed to compile prompt response. Verify connections."
      });
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className="w-full bg-[#212121] py-4 px-4 border-t-0 select-none">
      <div className="chat-container-max flex flex-col gap-3">
        
        {/* Rounded Input Capsule */}
        <div className="flex flex-col gap-2.5 bg-[#2f2f2f] border border-white/5 rounded-3xl px-5 py-4.5 shadow-md focus-within:border-white/15 transition-all duration-300">
          
          {/* Selected file preview */}
          {selectedFile && (
            <div className="my-1">
              <div className="inline-flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                {selectedFile.type === "application/pdf" ? (
                  <FileText size={16} className="text-red-400" />
                ) : selectedFile?.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                )}
                <div className="flex flex-col min-w-0 max-w-[150px] text-xs">
                  <p className="font-semibold text-slate-200 truncate">{selectedFile.name}</p>
                  <p className="text-slate-500 mt-0.5">{Math.ceil(selectedFile.size / 1024)} KB</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    fileRef.current.value = "";
                  }}
                  className="ml-2 p-1 rounded-full hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <X size={12} className="text-slate-400 hover:text-white" />
                </button>
              </div>
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={placeholders[selectedAgent]}
            rows={1}
            disabled={isLoading}
            className="w-full bg-transparent outline-none resize-none text-[14.5px] text-slate-100 placeholder:text-slate-400 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50 mt-0.5 font-sans"
          />

          {/* Bottom controls row */}
          <div className="flex items-center justify-between pt-1">
            
            {/* Left Controls — file attachments + mic */}
            <div className="flex items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                hidden
                accept=".pdf,image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSelectedFile(file);
                  }
                }}
              />
              
              <button 
                title="Attach file"
                className="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all cursor-pointer"
                onClick={() => fileRef.current.click()}
              >
                <Paperclip size={16} />
              </button>
              
              <button
                onClick={toggleMic}
                title={isListening ? "Stop listening" : "Start voice input"}
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full transition-all cursor-pointer
                  ${isListening
                    ? "bg-red-500/10 text-red-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }
                `}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>

            {/* Right Control — Send / Stop button */}
            <button
              onClick={handleSend}
              disabled={!isLoading && !value.trim()}
              className={`flex items-center justify-center w-8 h-8 rounded-full border-none cursor-pointer transition-all duration-200
                ${isLoading
                  ? "bg-white text-black hover:bg-slate-200"
                  : value.trim()
                  ? "bg-[#10a37f] text-white hover:opacity-90 active:scale-95 shadow-sm"
                  : "bg-white/10 text-slate-500 cursor-not-allowed"
                }`}
            >
              {isLoading ? <Square size={10} fill="currentColor" /> : <Send size={14} />}
            </button>
          </div>
        </div>

        {/* Agent selection row (positioned cleanly below the input box) */}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const isActive = selectedAgent === agent.id;

            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`
                  flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all duration-150 cursor-pointer
                  ${isActive
                    ? "bg-white/10 text-white border-white/10"
                    : "bg-transparent text-slate-500 border-transparent hover:text-slate-300"
                  }
                `}
              >
                <Icon size={11} className={isActive ? "text-[#10a37f]" : ""} />
                {agent.label}
              </button>
            );
          })}
        </div>
        
        <p className="text-center text-[11px] text-slate-500 mt-1">
          SyncAgents can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}