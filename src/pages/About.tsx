import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Flame, Star, Utensils, Award } from "lucide-react";

/**
 * LÂL - Cinematic Elegance About Page
 * Concept: "The Ruby & The Geometry" - Polished Edition
 * Features: Masked imagery, Parallax, High-End Glassmorphism.
 */
const About: React.FC = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Parallax transforms
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotateDiamond = useTransform(scrollYProgress, [0, 1], [45, 90]);

  // Elegant transitions
  const transition = { duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  const DiamondFeature = ({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, ...transition }}
      className="group relative flex flex-col items-center text-center space-y-4"
    >
      {/* Diamond Container */}
      <div className="relative w-24 h-24 md:w-32 md:h-32">
        <motion.div 
          className="absolute inset-0 bg-[#c9a45c]/5 border border-[#c9a45c]/20 rotate-45 transition-all duration-700 group-hover:bg-[#c9a45c] group-hover:rotate-90 group-hover:scale-110" // Hover effect
        />
        <div className="absolute inset-0 flex items-center justify-center z-10">
           <Icon className="w-8 h-8 text-[#c9a45c] transition-colors duration-700 group-hover:text-black" />
        </div>
      </div>
      
      {/* Text Info */}
      <div className="pt-8">
        <h3 className="text-xl font-serif text-white mb-2">{title}</h3>
        <p className="text-xs text-gray-400 font-sans tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">
          {desc}
        </p>
      </div>
    </motion.div>
  );

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden bg-[#020202] text-white selection:bg-[#c9a45c] selection:text-black font-serif">
      
      {/* === Background Ambience === */}
      <div className="fixed inset-0 pointer-events-none z-0">
         {/* Noise Texture */}
         <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-10"></div>
         
         {/* Deep Gradient */}
         <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-black z-0"></div>

         {/* Cinematic Glows */}
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#c9a45c]/5 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#c9a45c]/5 rounded-full blur-[150px]"></div>
      </div>

      {/* === Scrollable Content Layout === */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {/* Navbar Spacer */}
        <div className="w-full shrink-0 h-[120px] md:h-28" />

        <div className="flex-1 w-full flex flex-col items-center">
            
            {/* === 1. Hero / Title Section === */}
            <div className="w-full max-w-7xl mx-auto pt-10 md:pt-24 pb-32 px-6 relative flex flex-col items-center">
               
               {/* Visual: Masked Image within Diamond */}
               <motion.div 
                 style={{ rotate: rotateDiamond, y: yHero }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-[#c9a45c]/10 opacity-30 select-none pointer-events-none -z-10"
               >
                  <div className="absolute inset-2 border border-[#c9a45c]/5"></div>
               </motion.div>

               {/* Main Title */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={transition}
                 className="relative z-20 text-center"
               >
                 <span className="block text-xs md:text-sm text-[#c9a45c] tracking-[1em] uppercase mb-4 md:mb-8 font-sans">Yemeğin Sanatı</span>
                 <h1 className="text-7xl md:text-[11rem] leading-none font-thin text-white tracking-tighter opacity-90">
                   LÂL
                 </h1>
                 <span className="block text-[10px] md:text-xs text-gray-500 tracking-[0.5em] uppercase mt-4 md:mt-8 font-sans">
                   Est. 1924 • İstanbul
                 </span>
               </motion.div>
            </div>

            {/* === 2. The Story (Split Aesthetic) === */}
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[600px] mb-32">
                
                {/* Visual Side (Image) */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={transition}
                  className="relative h-[400px] md:h-auto overflow-hidden group"
                >
                   <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-1000"></div>
                   <img 
                      src="/hero-bg.png" 
                      alt="Lal Interior" 
                      className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s] ease-out brightness-75 grayscale hover:grayscale-0"
                   />
                   
                   {/* Vertical text on image */}
                   <div className="absolute bottom-8 left-8 z-20">
                     <div className="w-12 h-[1px] bg-[#c9a45c] mb-4"></div>
                     <span className="text-white text-xs tracking-widest uppercase">Atmosfer</span>
                   </div>
                </motion.div>

                {/* Text Side */}
                <motion.div 
                   style={{ y: yText }}
                   className="relative flex flex-col justify-center p-12 md:p-24 bg-[#0a0a0a]"
                >
                   {/* Decorative quote mark */}
                   <span className="text-[10rem] leading-none text-[#c9a45c]/5 font-serif absolute top-10 left-10">“</span>
                   
                   <h2 className="text-3xl md:text-5xl font-light text-white mb-8 leading-tight">
                     Geçmişin ruhu, <br />
                     <span className="text-[#c9a45c] italic">Geleceğin</span> lezzeti.
                   </h2>
                   <p className="text-gray-400 font-sans font-light leading-loose text-sm md:text-base mb-12">
                     LÂL, sadece bir restoran değil; lezzet, sanat ve tarihin kesişim noktasıdır. 
                     Her detayda, Anadolu'nun zengin mirasının modern bir estetikle yeniden yorumlanışına tanıklık edeceksiniz.
                     Burası, zamanın durduğu ve sadece hazzın konuştuğu yerdir.
                   </p>

                   <div className="flex items-center gap-4">
                      <div className="w-16 h-[1px] bg-[#c9a45c]/50"></div>
                      <span className="text-[#c9a45c] text-xs tracking-widest uppercase">Felsefemiz</span>
                   </div>
                </motion.div>
            </div>


            {/* === 3. The Pillars (Diamond Grid) === */}
            <div className="w-full max-w-6xl mx-auto pb-32 px-6">
              <div className="text-center mb-24">
                <span className="text-[#c9a45c] tracking-[0.4em] uppercase text-xs">Mükemmellik</span>
                <h2 className="text-3xl md:text-4xl text-white font-serif mt-4">Değerlerimiz</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                <DiamondFeature 
                  icon={Flame} 
                  title="Tutku" 
                  desc="Ateşin Dansı" 
                  delay={0.1} 
                />
                <DiamondFeature 
                  icon={Utensils} 
                  title="Zanaat" 
                  desc="El Emeği" 
                  delay={0.2} 
                />
                <DiamondFeature 
                  icon={Star} 
                  title="Parıltı" 
                  desc="Saf Ambiyans" 
                  delay={0.3} 
                />
                <DiamondFeature 
                  icon={Award} 
                  title="Miras" 
                  desc="Köklerimiz" 
                  delay={0.4} 
                />
              </div>
            </div>


            {/* Footer Signature */}
            <div className="pb-20 opacity-40 text-center">
              <div className="inline-block border-t border-[#c9a45c] pt-4">
                 <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400">LÂL Restaurant Group • İstanbul</span>
              </div>
            </div>
 
        </div>
      </div>
    </section>
  );
};

export default About;
