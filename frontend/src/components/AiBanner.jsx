import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

export default function AIBanner({ open, title, message, onClose }) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[999] w-[92%] max-w-xl font-sans"
        >
          <div className="rounded-xl border border-white/10 bg-[#2f2f2f] shadow-2xl overflow-hidden">
            <div className="h-1 bg-[#10a37f]" />

            <div className="flex items-start gap-4.5 p-4.5">
              <div className="w-8 h-8 rounded-full bg-[#10a37f]/10 flex items-center justify-center shrink-0">
                <AlertCircle size={16} className="text-[#10a37f]" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm leading-none mt-1">
                  {title}
                </h3>
                <p className="mt-1 text-slate-300 text-xs leading-relaxed">
                  {message}
                </p>
              </div>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}