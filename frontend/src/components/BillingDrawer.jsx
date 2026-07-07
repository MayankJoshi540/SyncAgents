import { AnimatePresence, motion } from "framer-motion";
import { X, Crown, Zap } from "lucide-react";
import { useSelector } from "react-redux";
import { createOrder } from "../features/billing.api";
import api from "../../utils/axios";

export default function BillingDrawer({ open, onClose }) {
  const { userData } = useSelector(state => state.user);

  const handleUpgrade = async (plan) => {
    try {
      const data = await createOrder(plan);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "SyncAgents",
        description: `${data.plan.name} Plan`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const { data } = await api.post("/api/billing/verify-payment", response);
            console.log(data);
          } catch (error) {
            console.log(error);
          }
        },
        theme: {
          color: "#10a37f"
        }
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25 }}
            className="fixed right-0 top-0 z-50 h-screen w-[380px] bg-brand-sidebar border-l border-white/5 shadow-2xl flex flex-col font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div>
                <h2 className="text-white text-md font-semibold">
                  Billing & Plans
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Manage your subscription and credits
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={16} className="text-slate-400 hover:text-white" />
              </button>
            </div>

            {/* Current Plan */}
            <div className="p-5">
              <div className="rounded-xl bg-[#2f2f2f] border border-white/5 p-4.5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-xs">
                      Current Plan
                    </p>
                    <h3 className="text-white text-lg font-bold mt-0.5">
                     {userData?.plan ?? "Free Plan"}
                    </h3>
                  </div>
                  <Crown className="text-[#10a37f]" size={20} />
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                    <span>Usage Credits</span>
                    <span>{userData?.credits || 0}/{userData?.totalCredits || 100}</span>
                  </div>
                  
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-[#10a37f] transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          ((userData?.credits || 0) / (userData?.totalCredits || 100)) * 100,
                          100
                        )}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Plans List */}
            <div className="px-5 flex-1 overflow-y-auto space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Upgrade Options
              </h4>

              {/* Starter */}
              <div className="rounded-xl bg-[#2f2f2f] border border-white/5 p-4">
                <h3 className="text-white font-semibold text-sm">
                  Starter Pack
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  500 API credits
                </p>
                <div className="text-white text-xl font-bold mt-2">
                  ₹199
                </div>
                <button 
                  className="mt-4 w-full rounded-lg bg-white/10 hover:bg-white/15 py-2 text-xs font-medium text-white cursor-pointer transition-colors" 
                  onClick={() => handleUpgrade("starter")}
                >
                  Buy Starter Pack
                </button>
              </div>

              {/* Pro */}
              <div className="rounded-xl bg-[#2f2f2f] border border-[#10a37f]/30 p-4 relative">
                <span className="absolute right-3 top-3 text-[10px] bg-[#10a37f]/20 text-[#10a37f] px-2.5 py-0.5 rounded-full font-medium">
                  Popular
                </span>

                <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                  Pro Tier
                  <Zap size={14} className="text-yellow-500" />
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  1000 API credits
                </p>
                <div className="text-white text-xl font-bold mt-2">
                  ₹499
                </div>
                <button 
                  className="mt-4 w-full rounded-lg bg-[#10a37f] hover:bg-[#1a7f64] py-2 text-xs font-semibold text-white cursor-pointer transition-colors" 
                  onClick={() => handleUpgrade("pro")}
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-white/5">
              <p className="text-[11px] text-slate-500 leading-normal">
                Credits are consumed on pipeline requests such as image generation, PPT/PDF layouts compile, and playground evaluations.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}