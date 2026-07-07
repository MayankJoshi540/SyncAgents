import { useDispatch, useSelector } from "react-redux";
import { FaGoogle } from "react-icons/fa";
import ArtifactPanel from "../components/ArtifactPanel";
import ChatArea from "../components/ChatArea";
import Sidebar from "../components/Sidebar";
import api from "../../utils/axios";
import { setUserData } from "../redux/user.slice";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";

function Home() {
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();
  
  const login = async (token) => {
    try {
      const { data } = await api.post(`/auth/login`, { token });
      dispatch(setUserData(data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    await login(token);
  };

  const handleDevBypass = () => {
    dispatch(setUserData({
      _id: "dev_mock_user",
      name: "Developer Admin",
      email: "dev@syncagents.io",
      plan: "pro",
      credits: 750,
      totalCredits: 1000,
      avatar: ""
    }));
  };

  return (
    <div className="h-screen flex bg-brand-dark text-[#ececec] overflow-hidden font-sans antialiased">
      <Sidebar />
      <ChatArea />
      <ArtifactPanel />

      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/95 backdrop-blur-sm">
          <div className="w-[380px] bg-brand-dark border border-white/10 rounded-2xl p-8 flex flex-col gap-6 shadow-2xl text-center">
            
            {/* Minimalist Logo Icon */}
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-[#10a37f] flex items-center justify-center text-white text-xl font-bold">
                S
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <h2 className="text-2xl font-semibold text-white tracking-tight">
                Welcome to SyncAgents
              </h2>
              <p className="text-[13px] text-slate-400">
                Log in with your account to get started
              </p>
            </div>
            
            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium text-white bg-[#10a37f] hover:bg-[#1a7f64] transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              >
                <FaGoogle size={14} />
                Continue with Google
              </button>
              
              <button
                onClick={handleDevBypass}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer active:scale-[0.98]"
              >
                Bypass Login (Offline Dev)
              </button>
            </div>
            
            <p className="text-[11px] text-slate-500 mt-2">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
