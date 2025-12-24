import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Flame, Coffee, IceCream, Utensils, Wine } from "lucide-react";
import { supabase } from "../lib/supabase";

export type Category = {
  id: string;
  name: string;
  icon_name: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  is_popular: boolean;
  is_available: boolean;
};

const ICON_MAP: Record<string, any> = {
  baslangiclar: Utensils,
  mezeler: IceCream,
  corbalar: Coffee,
  kebaplar: Flame,
  anayemekler: Utensils,
  salatalar: Flame,
  tatlilar: Utensils,
  icecekler: Wine,
};

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();

    const menuChannel = supabase
      .channel('menu-page-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(menuChannel);
    };
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: cats, error: catsError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');
      
      if (catsError) throw catsError;
      setCategories(cats || []);
      if (cats && cats.length > 0 && !selectedCategory) setSelectedCategory(cats[0].name);

      const { data: items, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true);
      
      if (itemsError) throw itemsError;
      setMenuItems(items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = useMemo(() => {
    const selectedCat = categories.find(c => c.name === selectedCategory);
    return menuItems.filter(
      (item) =>
        item.category_id === selectedCat?.id &&
        (item.name.toLowerCase().includes(search.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(search.toLowerCase())))
    );
  }, [selectedCategory, menuItems, categories, search]);

  return (
    <div className="w-full min-h-screen bg-transparent text-white font-sans overflow-x-hidden">
      <div className="relative z-10 flex flex-col items-center pt-24 md:pt-32 pb-20 px-4 md:px-8 max-w-[1000px] mx-auto">
        
        {/* Başlık Bölümü */}
        <header className="w-full text-center flex flex-col items-center mb-10 md:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-6xl font-serif text-[#d4af37] tracking-[0.1em] md:tracking-[0.2em] uppercase px-4 mb-2"
          >
            LÂL Mutfak Sanatı
          </motion.h1>
          <div className="w-16 md:w-32 h-[1px] bg-[#c9a45c]/50 mb-8 mx-auto" />

          {/* Arama Barı */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-full w-full max-w-[300px] md:max-w-md"
          >
            <Search className="w-4 h-4 text-[#c9a45c]" />
            <input
              type="text"
              placeholder="Lezzet ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-xs md:text-sm w-full placeholder-gray-500 uppercase tracking-widest"
            />
          </motion.div>
        </header>

        {/* Kategoriler - Professional Scrollable & Centered Layout */}
        <div className="w-full flex md:justify-center mb-12 md:mb-20 px-4 md:px-0">
          <nav className="w-full md:w-auto overflow-x-auto no-scrollbar mask-gradient-right">
            <div className="flex items-center justify-start gap-3 md:gap-6 pb-6 min-w-max">
              {categories.map((cat) => {
                const catLower = cat.name.toLowerCase().replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/\s+/g, '');
                const Icon = ICON_MAP[catLower] || ICON_MAP[cat.icon_name] || Coffee;
                const isActive = selectedCategory === cat.name;
                
                return (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`
                      flex items-center gap-4 md:gap-6 px-10 py-6 md:px-20 md:py-12 rounded-3xl md:rounded-[3rem] transition-all duration-500
                      whitespace-nowrap border shadow-2xl backdrop-blur-xl
                      ${isActive 
                        ? "bg-gradient-to-br from-[#c9a45c] to-[#a67c2e] text-black border-white/20 shadow-[0_20px_50px_rgba(166,124,46,0.4)] font-bold scale-105" 
                        : "bg-white/5 text-zinc-400 border-white/10 hover:border-white/20 hover:bg-white/10"
                      }
                    `}
                  >
                    <Icon size={18} className={`md:size-6 ${isActive ? "text-black/80" : "text-[#c9a45c]"}`} />
                    <span className="text-[10px] md:text-sm font-serif uppercase tracking-[0.05em] leading-none">
                      {cat.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Menü Listesi */}
        <div className="w-full bg-black/30 backdrop-blur-xl rounded-[2rem] p-6 md:p-12 border border-white/5 shadow-2xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-[#c9a45c] animate-spin" />
              <p className="font-serif italic tracking-widest text-[#c9a45c]/60 text-sm">Lezzetler hazırlanıyor...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filteredItems.length > 0 ? (
                <motion.ul 
                  key={selectedCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col gap-8 md:gap-12"
                >
                  {filteredItems.map((item, idx) => {
                    const isDrink = selectedCategory.toLowerCase().includes("i̇çecek") || selectedCategory === "İçecekler" || selectedCategory === "Drinks";
                    return (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group"
                      >
                        <div className="flex items-baseline justify-between gap-4">
                          <h3 className={`font-serif text-[#e6dab8] group-hover:text-[#c9a45c] transition-colors flex-1 ${isDrink ? "text-base md:text-xl" : "text-xs md:text-lg"}`}>
                            {item.name}
                          </h3>
                          <div className={`flex-1 border-b border-dotted border-white/20 relative opacity-20 hidden md:block ${isDrink ? "-top-1.5" : "-top-1"}`} />
                          <span className={`font-serif text-[#c9a45c] tabular-nums ${isDrink ? "text-base md:text-xl" : "text-xs md:text-lg"}`}>
                            {Math.floor(item.price)}₺
                          </span>
                        </div>
                          <div className="mt-1 md:mt-2 max-w-[90%] md:max-w-none">
                            {!isDrink && (
                              <p className="text-zinc-500 text-[11px] md:text-base font-light italic leading-relaxed group-hover:text-zinc-400 transition-colors line-clamp-2 md:line-clamp-none">
                                {item.description}
                              </p>
                            )}
                            {item.is_popular && (
                              <span className="inline-block mt-1 md:mt-2 text-[8px] md:text-[9px] uppercase tracking-widest text-[#c9a45c] border border-[#c9a45c]/30 px-1.5 py-0.5 rounded-sm">
                                Şefin Tavsiyesi
                              </span>
                            )}
                          </div>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <Search size={40} className="mb-4 opacity-10" />
                  <p className="font-serif italic text-sm opacity-50">Aradığınız lezzet bulunamadı.</p>
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
