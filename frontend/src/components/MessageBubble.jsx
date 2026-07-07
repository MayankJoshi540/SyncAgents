import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiExternalLink, FiX } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Sparkles, User } from "lucide-react";

function MessageBubble({ role, content, images }) {
  const isUser = role === "user";
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode("");
    }, 2000);
  };

  const markdown = (content || "")
    .replace(/```review/gi, "```")
    .replace(/```text/gi, "```")
    .replace(/```[a-zA-Z0-9_-]+\s+id="[^"]*"/g, "```");

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"} py-2`}>
      {/* Icon Avatar column (ChatGPT style) */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 shrink-0 select-none mt-1">
          <Sparkles size={14} className="text-[#10a37f]" />
        </div>
      )}

      <div
        className={`w-fit max-w-[85%] break-words overflow-hidden leading-relaxed transition-all duration-200
        ${
          isUser
            ? "bg-[#2f2f2f] text-slate-100 border border-white/5 px-5 py-3 rounded-2xl"
            : "text-[#ececec] py-1 w-full"
        }`}
      >
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4 mt-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                loading="lazy"
                onClick={() => setLightboxSrc(img)}
                onError={(e) => e.currentTarget.remove()}
                className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
              />
            ))}
          </div>
        )}

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-xl font-semibold mt-4 mb-2 text-white">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg font-semibold mt-3 mb-2 text-white">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-md font-semibold mt-2 mb-1.5 text-white">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="mb-3 whitespace-pre-wrap break-words text-[14.5px] text-slate-100">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 space-y-1 my-2 text-[14px] text-slate-100">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 space-y-1 my-2 text-[14px] text-slate-100">
                {children}
              </ol>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-white/10 text-[13.5px]">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-white/10 bg-white/5 px-3 py-2 text-left text-white font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-white/10 px-3 py-2 text-slate-100">
                {children}
              </td>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-[#10a37f] hover:underline inline-flex items-center gap-1"
              >
                {children}
                <FiExternalLink size={11} />
              </a>
            ),
            img: ({ src }) => {
              if (!src) return null;
              return (
                <img
                  src={src}
                  loading="lazy"
                  onClick={() => setLightboxSrc(src)}
                  onError={(e) => e.currentTarget.remove()}
                  className="w-40 h-28 rounded-xl object-cover cursor-pointer mt-2"
                />
              );
            },
            code({ className, children }) {
              const value = String(children)
                .replace(/^\s*```[^\n]*\n/, "")
                .replace(/\n```\s*$/, "")
                .trim();

              if (!className) {
                return (
                  <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#ef6480] font-mono text-[13px]">
                    {value}
                  </code>
                );
              }

              const language = className.replace("language-", "");

              return (
                <div className="my-4 overflow-hidden rounded-xl border border-white/5 bg-[#171717]">
                  <div className="flex items-center justify-between bg-[#2f2f2f] px-4 py-2 text-xs text-slate-400 font-sans border-b border-white/5 select-none">
                    <span className="uppercase">{language}</span>
                    <button
                      onClick={() => copyCode(value)}
                      className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedCode === value ? (
                        <>
                          <Check size={12} className="text-[#10a37f]" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          Copy code
                        </>
                      )}
                    </button>
                  </div>

                  <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    wrapLongLines
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: "16px",
                      background: "#171717",
                      fontSize: "13px",
                    }}
                  >
                    {value}
                  </SyntaxHighlighter>
                </div>
              );
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>

      {/* User profile avatar on the right */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 shrink-0 select-none mt-1">
          <User size={14} />
        </div>
      )}

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxSrc(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2 cursor-pointer"
          >
            <FiX size={20} />
          </button>
          <img
            src={lightboxSrc}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default MessageBubble;