import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { Lock, Mail, Loader2, ChefHat, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Başarılı giriş
      navigate("/kitchen");
    } catch (err: any) {
      setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6 relative font-sans overflow-hidden">
      {/* 1. Dynamic Background Layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Layered Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#c9a45c]/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#c9a45c]/5 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#0a0a0a_100%)] opacity-80" />
        
        {/* Floating Gold Dust (Animated) */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0.1
            }}
            animate={{ 
              y: [null, Math.random() * -200],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 5 + Math.random() * 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute w-1 h-1 bg-[#c9a45c] rounded-full blur-[1px]"
          />
        ))}

        {/* Brand Watermark to fill space */}
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-serif text-white/[0.02] select-none tracking-widest whitespace-nowrap">
          LÂL
        </h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[650px] relative z-20 flex flex-col items-center"
      >
        {/* Navigation Indicator */}
        <button 
          onClick={() => navigate("/")}
          className="mb-12 flex items-center gap-4 text-zinc-500 hover:text-[#c9a45c] transition-all group px-8 py-3 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-md"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[11px] uppercase tracking-[0.4em] font-light">Sisteme Dön</span>
        </button>

        <div 
          className="w-full bg-zinc-900/40 backdrop-blur-[60px] border border-white/10 p-16 md:p-24 rounded-[4.5rem] shadow-[0_60px_150px_rgba(0,0,0,0.8)] relative overflow-hidden"
          style={{
            boxShadow: "0 0 1px 1px rgba(255,255,255,0.05) inset, 0 30px 60px rgba(0,0,0,0.6)"
          }}
        >
          {/* Subtle Inner Glow */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#c9a45c]/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col items-center mb-16 relative z-10">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-24 h-24 bg-gradient-to-br from-[#ffe5a5] via-[#c9a45c] to-[#8a6d2c] rounded-[2rem] flex items-center justify-center text-black mb-10 shadow-[0_20px_50px_rgba(201,164,92,0.4)]"
            >
              <ChefHat size={48} />
            </motion.div>
            <h1 className="text-6xl font-serif tracking-[0.3em] text-[#f7e6b8] drop-shadow-2xl">LÂL</h1>
            <p className="text-[#c9a45c] text-[12px] mt-6 uppercase tracking-[0.5em] font-bold opacity-80">MUTFAK YÖNETİM PANELİ</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-10 relative z-10">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/40 text-red-300 p-6 rounded-3xl text-[13px] text-center font-medium uppercase tracking-[0.1em] shadow-inner"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-5">
              <label className="text-[11px] uppercase tracking-[0.35em] text-zinc-500 font-bold ml-6">Yönetici E-Posta</label>
              <div className="relative flex items-center group/input">
                <div className="absolute left-7 flex items-center justify-center text-zinc-600 group-focus-within/input:text-[#c9a45c] transition-colors z-20 pointer-events-none">
                  <Mail size={24} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: '72px' }}
                  className="w-full bg-black/40 border border-white/5 focus:border-[#c9a45c]/40 rounded-[1.75rem] py-7 pr-10 outline-none transition-all placeholder:text-zinc-800 text-lg font-light tracking-wide text-zinc-100 shadow-inner focus:bg-black/60 text-left relative z-10"
                  placeholder="E-posta adresinizi girin"
                />
              </div>
            </div>

            <div className="space-y-5">
              <label className="text-[11px] uppercase tracking-[0.35em] text-zinc-500 font-bold ml-6">Giriş Parolası</label>
              <div className="relative flex items-center group/input">
                <div className="absolute left-7 flex items-center justify-center text-zinc-600 group-focus-within/input:text-[#c9a45c] transition-colors z-20 pointer-events-none">
                  <Lock size={24} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '72px' }}
                  className="w-full bg-black/40 border border-white/5 focus:border-[#c9a45c]/40 rounded-[1.75rem] py-7 pr-10 outline-none transition-all placeholder:text-zinc-800 text-lg font-light tracking-wide text-zinc-100 shadow-inner focus:bg-black/60 text-left relative z-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-7 rounded-[1.75rem] font-bold tracking-[0.3em] text-black text-xl
                        bg-gradient-to-r from-[#ffe5a5] via-[#c9a45c] to-[#8a6d2c]
                        hover:shadow-[0_25px_60px_rgba(201,164,92,0.4)] hover:scale-[1.02] active:scale-[0.98] 
                        transition-all duration-500 flex items-center justify-center gap-6 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={28} />
              ) : (
                "PANELİ BAŞLAT"
              )}
            </button>
          </form>
        </div>

        <div className="mt-16 text-center">
           <p className="text-zinc-700 text-[10px] uppercase tracking-[0.5em] font-light italic">
             Lâl Restaurant & Lounge • Management Station
           </p>
        </div>
      </motion.div>
    </div>
  );
}
