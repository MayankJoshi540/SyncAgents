import { useState } from "react";
import { useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import { FiCode } from "react-icons/fi";
import { detectLanguage } from "../utils/detectLanguage";
import { Code2, Eye, PanelRightClose, PanelRightOpen, X, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ArtifactPanel() {
  const [tab, setTab]               = useState("code");
  const [activeFile, setActiveFile] = useState(0);
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied]         = useState(false);

  const { artifacts } = useSelector(state => state.message);
  const artifact = artifacts?.[0];

  if (!artifact) return null;

  const file       = artifact?.files?.[activeFile];
  const htmlFile   = artifact?.files?.find(f => f.name === "index.html");
  const cssFile    = artifact?.files?.find(f => f.name === "style.css");
  const jsFile     = artifact?.files?.find(f => f.name === "script.js");
  const canPreview = Boolean(htmlFile);

  const previewDoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<style>${cssFile?.content || ""}</style>
</head>
<body>
${htmlFile?.content || ""}
<script>${jsFile?.content || ""}<\/script>
</body>
</html>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(file?.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  /* ── Shared code panel content ── */
  const PanelContent = ({ onClose }) => (
    <div className="flex flex-col h-full bg-[#212121] border-l border-white/5 font-sans text-sm">

      {/* Header */}
      <div className="h-14 px-5 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose ?? (() => setCollapsed(true))}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer shrink-0"
          >
            {onClose ? <X size={15} /> : <PanelRightClose size={15} />}
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#10a37f]/10 border border-[#10a37f]/20 shrink-0">
              <Code2 className="text-[#10a37f]" size={12} />
            </div>
            <h2 className="text-sm font-semibold text-slate-200 truncate">
              {artifact.title || "Workspace Code"}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Copy button */}
          {tab === "code" && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer bg-transparent"
            >
              {copied ? <Check size={13} className="text-[#10a37f]" /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}

          {canPreview && (
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
              <button
                onClick={() => setTab("code")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer
                  ${tab === "code" ? "bg-[#2f2f2f] text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                <Code2 size={11} /> Code
              </button>
              <button
                onClick={() => setTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer
                  ${tab === "preview" ? "bg-[#2f2f2f] text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                <Eye size={11} /> Preview
              </button>
            </div>
          )}
        </div>
      </div>

      {/* File tabs */}
      <AnimatePresence>
        {tab === "code" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="flex border-b border-white/5 bg-white/2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0"
          >
            {artifact.files?.map((f, index) => (
              <button
                key={f.name}
                onClick={() => setActiveFile(index)}
                className={`px-4.5 py-3 text-xs font-medium whitespace-nowrap transition-all duration-200 border-r border-white/5 relative cursor-pointer bg-transparent
                  ${activeFile === index ? "text-[#ececec]" : "text-slate-500 hover:text-slate-300"}`}
              >
                {f.name}
                {activeFile === index && (
                  <motion.div layoutId="filetab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#10a37f] rounded-t-full" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor / Preview */}
      <div className="flex-1 overflow-hidden bg-[#212121]">
        <AnimatePresence mode="wait">
          {tab === "preview" && canPreview ? (
            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="w-full h-full relative">
              <iframe title="preview" sandbox="allow-scripts" srcDoc={previewDoc} className="w-full h-full bg-[#171717]" />
            </motion.div>
          ) : (
            <motion.div key={`code-${activeFile}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="w-full h-full">
              <Editor
                theme="vs-dark"
                language={detectLanguage(file?.name || "")}
                value={file?.content || ""}
                options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, wordWrap: "on", automaticLayout: true, scrollBeyondLastLine: false, padding: { top: 16 }, lineNumbers: "on", renderLineHighlight: "none" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-24 right-4.5 z-40 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-95 text-white text-[12px] font-bold shadow-lg shadow-indigo-500/20 border-none cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <FiCode size={13} />
        View Code
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div key="mob-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-md" />
            <motion.div key="mob-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.25, ease: "easeInOut" }} className="lg:hidden fixed inset-y-0 right-0 z-50 w-[88vw] max-w-[420px] overflow-hidden">
              <PanelContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {!collapsed ? (
          <motion.div key="open" initial={{ width: 0, opacity: 0 }} animate={{ width: "clamp(340px, 38%, 680px)", opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.22, ease: "easeInOut" }} className="hidden lg:flex h-full flex-col overflow-hidden shrink-0">
            <PanelContent />
          </motion.div>
        ) : (
          <motion.div key="collapsed" initial={{ width: 0, opacity: 0 }} animate={{ width: 48, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.22, ease: "easeInOut" }} className="hidden lg:flex h-full border-l border-white/[0.04] bg-[#07080a] flex-col items-center py-5 gap-4 shrink-0">
            <button onClick={() => setCollapsed(false)} className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] transition-all duration-150 cursor-pointer">
              <PanelRightOpen size={15} />
            </button>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[9.5px] font-bold text-slate-500 tracking-widest uppercase whitespace-nowrap" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                {artifact.title}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}