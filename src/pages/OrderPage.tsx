import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Minus, 
  ShoppingBag, 
  Search,
  Loader2,
  Soup, 
  UtensilsCrossed, 
  Leaf, 
  ChefHat, 
  Coffee,
  Flame,
  Utensils,
  IceCream,
  Wine,
  AlertTriangle,
  RefreshCcw
} from "lucide-react";
import { supabase } from "../lib/supabase";

// Lucide ikonlarını isimle eşleştirmek için bir harita
const ICON_MAP: Record<string, any> = {
  baslangiclar: Utensils,
  mezeler: IceCream,
  corbalar: Soup,
  kebaplar: Flame,
  anayemekler: Utensils,
  salatalar: ChefHat,
  tatlilar: Utensils,
  icecekler: Wine,
  Soup,
  UtensilsCrossed,
  Leaf,
  ChefHat,
  Coffee
};

export type Category = {
  id: string;
  name: string;
  icon_name: string;
  display_order: number;
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

export default function OrderPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [tableNo, setTableNo] = useState("");
  const [showTableModal, setShowTableModal] = useState(true);
  const [tableStatuses, setTableStatuses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    fetchTableStatuses();
    
    // POLLLING: Realtime bağlantısı kopsa bile her 3 saniyede bir verileri tazele
    const pollInterval = setInterval(() => {
      fetchTableStatuses();
    }, 3000);

    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  async function fetchTableStatuses() {
    try {
      // 1. Manuel durumları çek
      const { data: manualData } = await supabase.from('table_status').select('*');
      
      // 2. Aktif siparişleri çek (Siparişi olan her zaman 'occupied' görünmeli)
      const { data: orderData } = await supabase.from('orders').select('table_no').in('status', ['pending', 'preparing', 'served']);

      // 3. Rezervasyonları çek (Sadece bugün ve onaylanmış olanlar)
      const today = new Date().toISOString().split('T')[0];
      const { data: resData } = await supabase
        .from('reservations')
        .select('table_no, res_time, status')
        .in('status', ['confirmed', 'seated'])
        .eq('res_date', today);

      const statuses: Record<string, string> = {};
      
      // 2. Zaman Ayarlı Rezervasyon Mantığı
      const now = new Date();
      resData?.forEach(res => {
        if (res.table_no) {
          if (res.status === 'seated') {
            statuses[res.table_no] = 'occupied';
          } else if (res.res_time) {
            try {
               const parts = res.res_time.split(':');
               if (parts.length >= 2) {
                  const hours = parseInt(parts[0], 10);
                  const minutes = parseInt(parts[1], 10);
                  
                  const resDate = new Date();
                  resDate.setHours(hours, minutes, 0, 0);

                  const diffInMinutes = (resDate.getTime() - now.getTime()) / (1000 * 60);

                  if (diffInMinutes <= 60 && diffInMinutes > 0) {
                     if (statuses[res.table_no] !== 'occupied') {
                        statuses[res.table_no] = 'reserved';
                     }
                  } 
                  else if (diffInMinutes <= 0 && diffInMinutes > -120) {
                     statuses[res.table_no] = 'occupied';
                  }
               }
            } catch (e) {
               console.error("Time parse error", e);
            }
          }
        }
      });

      // 3. Siparişi olanları 'occupied' (dolu) olarak işaretle
      orderData?.forEach(order => {
        statuses[order.table_no] = 'occupied';
      });

      // 4. EN YÜKSEK ÖNCELİK: Manuel Durumlar (Kullanıcının tıklaması)
      // Bu, otomatik durumları ezebilmenizi sağlar.
      manualData?.forEach(row => {
        statuses[row.table_no] = row.status;
      });
      
      setTableStatuses(statuses);
    } catch (err) {
      console.error("Masa durumları çekilemedi:", err);
    }
  }

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      // 10 saniyelik zaman aşımı (normale döndü)
      const timeoutMs = 10000;
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.")), timeoutMs);
      });

      await Promise.race([
        (async () => {
          await fetchTableStatuses();

          const { data: cats, error: catsError } = await supabase
            .from('categories')
            .select('*')
            .order('display_order');
          
          if (catsError) throw catsError;
          setCategories(cats || []);

          const { data: items, error: itemsError } = await supabase
            .from('menu_items')
            .select('*')
            .eq('is_available', true);
          
          if (itemsError) throw itemsError;
          setMenuItems(items || []);
          
          if (cats && cats.length > 0) {
            setSelectedCategory((prev) => prev || cats[0].name);
          }
        })(),
        timeoutPromise
      ]);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Beklenmedik bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  const updateCart = (itemId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const filteredItems = useMemo(() => {
    const selectedCat = categories.find(c => c.name === selectedCategory);
    if (!selectedCat) return []; // Return empty array if no category is selected or found
    return menuItems.filter(
      (item) =>
        item.category_id === selectedCat?.id &&
        (item.name.toLowerCase().includes(search.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(search.toLowerCase())))
    );
  }, [selectedCategory, menuItems, categories, search]);

  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = menuItems.find((m) => m.id === id);
      return sum + (item?.price || 0) * qty;
    }, 0);
  }, [cart, menuItems]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleCheckout = async () => {
    if (!tableNo) {
      alert("Lütfen masanızı seçin!");
      setShowTableModal(true);
      return;
    }

    if (Object.keys(cart).length === 0) {
      alert("Sepetiniz boş!");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Ana Siparişi Oluştur
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          table_no: tableNo,
          total_price: cartTotal,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Sipariş Kalemlerini Oluştur
      const orderItemsToInsert = Object.entries(cart).map(([itemId, qty]) => {
        const item = menuItems.find(m => m.id === itemId);
        return {
          order_id: orderData.id,
          menu_item_id: itemId,
          quantity: qty,
          unit_price: item?.price || 0
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) throw itemsError;

      // Başarılı!
      setOrderSuccess(true);
      setCart({});
      
      // 3 saniye sonra başarı mesajını kapat
      setTimeout(() => setOrderSuccess(false), 5000);

    } catch (error) {
      console.error("Sipariş hatası:", error);
      alert("Siparişiniz iletilemedi. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden font-sans relative">
      {/* Sabit Arka Planlar App.tsx'den geliyor, burada tekrar edilmiyor */}

      {/* --- WELCOME / TABLE NUMBER MODAL --- */}
      <AnimatePresence>
        {showTableModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 20 }}
               className="relative z-10 bg-[#0f0f0f]/95 backdrop-blur-2xl border border-[#c9a45c]/30 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-12 shadow-[0_0_80px_rgba(201,164,92,0.2)] flex flex-col items-center max-w-5xl w-full max-h-[90vh] my-auto"
            >
              <h2 className="text-xl md:text-5xl font-serif text-[#c9a45c] mb-1 md:mb-3 tracking-[0.1em] md:tracking-[0.2em] text-center drop-shadow-lg uppercase px-2">
                LÂL Masalar
              </h2>
              <div className="h-0.5 md:h-1 w-24 md:w-32 bg-gradient-to-r from-transparent via-[#c9a45c] to-transparent mb-4 md:mb-6 opacity-50" />
              
              <p className="text-gray-300 text-center mb-6 md:mb-10 uppercase tracking-widest text-[10px] md:text-sm font-light">
                Lütfen Masanızı Seçiniz
              </p>
              
              <div className="w-full flex-1 overflow-y-auto custom-scrollbar p-2 md:p-4 -mx-2 md:-mx-4">
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 md:gap-4">
                  {Array.from({ length: 40 }, (_, i) => i + 1).map((num) => {
                    const status = tableStatuses[num.toString()] || 'available';
                    const isOccupied = status === 'occupied';
                    const isReserved = status === 'reserved';
                    const isSelected = tableNo === num.toString();
                    
                    return (
                      <button
                        key={num}
                        onClick={() => {
                          setTableNo(num.toString());
                          setShowTableModal(false);
                        }}
                        className={`
                          group relative flex flex-col items-center justify-center aspect-square rounded-xl md:rounded-2xl text-base md:text-xl font-serif transition-all duration-300 border
                          ${isSelected
                            ? "bg-[#c9a45c] text-black border-[#ffe5a5] shadow-[0_0_20px_rgba(201,164,92,0.4)] scale-110 z-10"
                            : isOccupied
                              ? "bg-red-500/10 text-red-400 border-red-500/30 font-bold"
                              : isReserved
                                ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
                                : "bg-white/5 text-gray-500 border-white/5"}
                        `}
                      >
                        <span className="relative z-10">{num}</span>
                        {/* Status dots on mobile to save space */}
                        <div className="absolute bottom-1 flex gap-0.5">
                           {isOccupied && <div className="w-1 h-1 rounded-full bg-red-500" />}
                           {isReserved && <div className="w-1 h-1 rounded-full bg-orange-500" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

               <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center md:justify-between w-full gap-4 md:gap-0">
                 <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
                    <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest">
                       <div className="w-2.5 h-2.5 rounded-md bg-white/10 border border-white/5" />
                       <span className="hidden xs:inline">Boş</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-orange-400 uppercase tracking-widest">
                       <div className="w-2.5 h-2.5 rounded-md bg-orange-500/20 border border-orange-500/40" />
                       <span className="hidden xs:inline">Rezerve</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-red-400 uppercase tracking-widest">
                       <div className="w-2.5 h-2.5 rounded-md bg-red-500/20 border border-red-500/40" />
                       <span className="hidden xs:inline">Dolu</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-[#c9a45c] uppercase tracking-widest font-bold">
                       <div className="w-2.5 h-2.5 rounded-md bg-[#c9a45c]" />
                       <span className="hidden xs:inline">Seçili</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2 text-[9px] text-gray-400 font-light tracking-wide uppercase bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#c9a45c] animate-pulse" />
                   <span>Doluluk: %{Math.round((Object.values(tableStatuses).filter(s => s !== 'available').length / 40) * 100)}</span>
                 </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1920px] mx-auto overflow-hidden relative z-10">
        {/* --- LEFT (OR TOP) PANE: MENU --- */}
        <main className={`flex-1 flex flex-col relative overflow-hidden transition-all duration-700 ease-in-out ${showTableModal ? 'blur-md scale-95 opacity-50' : ''}`}>
          
          {/* HEADER */}
          <header className="px-6 md:px-8 py-6 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 relative z-20">
            <div className="flex items-center justify-between md:justify-start md:gap-8">
              <div>
                <h1 className="text-2xl md:text-4xl font-serif tracking-[0.1em] md:tracking-[0.15em] text-[#d6b97a] drop-shadow-md">
                   SİPARİŞ
                </h1>
                <div className="h-[1px] w-12 md:w-20 bg-[#d6b97a] mt-1 md:mt-2 opacity-50" />
              </div>
              
              {/* Active Table Badge */}
              {!showTableModal && tableNo && (
                <button 
                  onClick={() => setShowTableModal(true)}
                  className="hidden md:flex flex-col items-center justify-center w-16 h-16 rounded-full border border-[#c9a45c]/30 bg-black/40 backdrop-blur-sm text-[#c9a45c] hover:bg-[#c9a45c]/10 hover:border-[#c9a45c] transition-all duration-300 cursor-pointer shadow-lg group"
                  title="Masayı Düzenle"
                >
                  <span className="text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Masa</span>
                  <span className="text-xl font-serif font-bold group-hover:scale-110 transition-transform">{tableNo}</span>
                </button>
              )}
            </div>

            <div className="group flex items-center gap-2 border-b border-white/20 focus-within:border-[#c9a45c] transition-colors pb-1 w-full md:w-64">
              <Search className="text-gray-400 group-focus-within:text-[#c9a45c] transition-colors w-5 h-5" />
              <input 
                type="text" 
                placeholder="Menüde lezzet ara..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none text-white focus:ring-0 placeholder-gray-500 w-full outline-none font-light tracking-wide placeholder:italic py-1"
              />
            </div>
          </header>

        <nav className="px-6 md:px-8 py-4 md:py-6 overflow-x-auto no-scrollbar mask-gradient-right">
          <div className="flex items-center justify-start md:justify-center gap-3 md:gap-5 min-w-max">
            {categories.map((cat) => {
               const catLower = cat.name.toLowerCase().replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/\s+/g, '');
               const isActive = selectedCategory === cat.name;
               const Icon = ICON_MAP[catLower] || ICON_MAP[cat.icon_name] || Coffee;
               
               return (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`
                    flex items-center gap-2 md:gap-4 px-8 py-5 md:px-12 md:py-7 rounded-3xl md:rounded-[2.5rem] transition-all duration-300
                    whitespace-nowrap font-serif tracking-widest uppercase shadow-2xl select-none text-[9px] md:text-[11px] border backdrop-blur-xl
                    ${isActive 
                      ? "bg-gradient-to-br from-[#c9a45c] to-[#a67c2e] text-black border-white/20 shadow-[0_15px_40px_rgba(166,124,46,0.3)] font-bold scale-105" 
                      : "bg-white/5 text-zinc-400 border-white/10 hover:border-white/20 hover:bg-white/10"
                    }
                  `}
                >
                  <Icon size={18} className={`md:size-5 ${isActive ? 'text-black/80' : 'text-[#c9a45c]'}`} />
                  {cat.name}
                </motion.button>
               );
            })}
          </div>
        </nav>


        {/* PRODUCTS GRID */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-12 h-12 text-[#c9a45c] animate-spin" />
                <p className="font-serif italic tracking-widest text-[#c9a45c]/80 text-xl">Menü hazırlanıyor...</p>
             </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-6 text-center px-4">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <div>
                  <h3 className="text-2xl font-serif text-red-400 mb-3 tracking-widest uppercase">Bağlantı Hatası</h3>
                  <p className="text-gray-400 max-w-md text-sm leading-relaxed font-light border-l-2 border-red-500/30 pl-4 text-left mx-auto">
                    {error}
                  </p>
                  <p className="text-xs text-gray-600 mt-4 font-mono">
                    Sunucunuz uyku modunda olabilir. Supabase panelinden projenizi "Restore" etmeyi deneyin.
                  </p>
              </div>
              <button 
                  onClick={fetchData} 
                  className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#c9a45c] to-[#a0823c] text-black rounded-xl font-bold hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg mt-4"
              >
                  <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                  <span className="tracking-wider">TEKRAR DENE</span>
              </button>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pb-32">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="group relative rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col justify-between overflow-hidden transition-all duration-500 min-h-[160px] md:min-h-0"
                style={{
                  background: "linear-gradient(180deg, rgba(20,20,20,0.6), rgba(10,10,10,0.4))",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(212,175,55,0.1)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                }}
              >
                {/* Gold Accent Stripe (Left) */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#f7e6b8] to-[#d4af37] opacity-80 group-hover:opacity-100 transition-opacity" />

                {/* Content */}
                <div>
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                     <h3 className="text-xs md:text-base font-medium font-serif tracking-wide text-[#e8e6d3] group-hover:text-[#c9a45c] transition-colors leading-tight">
                        {item.name}
                     </h3>
                     {item.is_popular && (
                      <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest bg-[#c9a45c] text-black px-1 md:px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(201,164,92,0.3)] shrink-0 ml-2">
                        Özel
                      </span>
                    )}
                  </div>
                  
                  {(!selectedCategory.toLowerCase().includes("i̇çecek") && selectedCategory !== "İçecekler" && selectedCategory !== "Drinks") && (
                    <p className="text-gray-400 text-[10px] md:text-xs leading-relaxed mb-6 md:mb-8 font-light italic opacity-80 pl-2 border-l border-white/5 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Footer / Action */}
                <div className="flex items-center justify-between mt-auto pt-3 md:pt-4 border-t border-white/5">
                  <span 
                    className="text-base md:text-lg font-serif font-bold text-[#c9a45c]"
                    style={{ textShadow: "0 0 10px rgba(201,164,92,0.3)" }}
                  >
                    {Math.floor(item.price)}₺
                  </span>
                  
                  {cart[item.id] ? (
                    <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-xl p-1 md:p-1.5 border border-[#c9a45c]/30">
                      <button 
                        onClick={() => updateCart(item.id, -1)}
                        className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-[#2a2a2a] rounded-lg border border-white/5"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="min-w-[1rem] md:min-w-[1.5rem] text-center font-bold text-[#c9a45c] font-mono text-sm md:text-lg">{cart[item.id]}</span>
                      <button 
                         onClick={() => updateCart(item.id, 1)}
                         className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-[#2a2a2a] rounded-lg border border-white/5"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => updateCart(item.id, 1)}
                      className="
                        w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center 
                        text-[#2d1d00] font-bold
                        bg-gradient-to-br from-[#c9a45c] to-[#a0823c]
                        active:scale-95 transition-all duration-300 shadow-lg
                      "
                    >
                      <Plus className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}


            {filteredItems.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                <Search size={64} className="mb-6 opacity-10" />
                <p className="font-light tracking-wide text-lg">Aradığınız lezzet bulunamadı.</p>
              </div>
            )}
          </div>
          )}
        </div>
      </main>

      {/* --- RIGHT PANE: CART --- */}
      {/* --- RIGHT PANE: CART (RECEIPT STYLE) --- */}
      <aside className={`w-full md:w-[400px] max-h-[40vh] md:max-h-full bg-[#0a0a0a]/95 backdrop-blur-xl border-t md:border-t-0 border-l border-white/10 flex flex-col relative z-20 shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all duration-700 ease-out ${showTableModal ? 'translate-y-full md:translate-x-full opacity-50' : 'translate-y-0 md:translate-x-0'}`}>
         {/* Cart Header */}
         <div className="p-4 md:p-8 md:pb-4 bg-black/40">
           <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-[#c9a45c] w-4 h-4 md:w-5 md:h-5" />
                <h2 className="text-base md:text-xl font-serif text-white tracking-[0.1em] md:tracking-[0.2em] font-light">
                  ADİSYON
                </h2>
              </div>
              
              {/* Mobile Table Badge */}
              {tableNo && (
                 <div className="md:hidden flex items-center gap-2 text-[#c9a45c] border border-[#c9a45c]/30 px-2 py-1 rounded bg-[#c9a45c]/10">
                   <span className="text-[8px] uppercase font-bold tracking-wider">Masa</span>
                   <span className="font-serif text-base">{tableNo}</span>
                 </div>
              )}
           </div>
           <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c9a45c]/50 to-transparent" />
         </div>


         {/* Cart Items (Receipt Style) */}
         <div className="flex-1 overflow-y-auto p-6 space-y-1 custom-scrollbar">
            <AnimatePresence>
              {Object.entries(cart).map(([itemId, qty]) => {
                const item = menuItems.find(m => m.id === itemId);
                if (!item) return null;
                return (
                  <motion.div
                    key={itemId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    className="py-3 group"
                  >
                    <div className="flex items-baseline justify-between mb-1">
                       <div className="text-[#c9a45c] font-bold font-mono text-sm w-6">{qty}x</div>
                       <h4 className="flex-1 font-serif text-gray-200 text-sm tracking-wide">{item.name}</h4>
                       <div className="text-gray-400 font-mono text-sm ml-2">{item.price * qty}₺</div>
                    </div>
                    
                    {/* Controls (Hidden by default, show on group hover) */}
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                       <button onClick={() => updateCart(itemId, -1)} className="text-gray-500 hover:text-red-400 text-xs uppercase tracking-wider hover:underline">Azalt</button>
                       <span className="text-gray-700">|</span>
                       <button onClick={() => updateCart(itemId, 1)} className="text-gray-500 hover:text-[#c9a45c] text-xs uppercase tracking-wider hover:underline">Ekle</button>
                    </div>

                    {/* Dotted Leader for Receipt Feel */}
                    <div className="w-full border-b border-white/5 border-dashed opacity-30 mt-2" />
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {Object.keys(cart).length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-600/30">
                <div className="w-16 h-16 border-2 border-dashed border-gray-800 rounded-full flex items-center justify-center mb-4">
                   <ShoppingBag size={24} />
                </div>
                <p className="font-serif italic tracking-wider text-sm">Sipariş bekleniyor...</p>
              </div>
            )}
         </div>

          {/* Footer */}
          <div className="p-4 md:p-8 border-t border-white/10 bg-black/60 backdrop-blur-md">
             <div className="flex justify-between items-center mb-3 md:mb-6">
               <span className="text-gray-400 text-xs md:text-sm uppercase tracking-wider">Toplam</span>
               <span className="text-xl md:text-4xl font-serif text-[#c9a45c] tabular-nums">
                 {cartTotal}₺
               </span>
             </div>
 
             <button
               onClick={handleCheckout}
               disabled={isSubmitting || Object.keys(cart).length === 0}
               className={`
                 w-full py-3.5 md:py-8 rounded-xl md:rounded-2xl font-bold tracking-[0.1em] md:tracking-[0.2em] text-black text-xs md:text-2xl
                 flex items-center justify-center gap-2 md:gap-3 transition-all duration-500
                 disabled:opacity-30
                 ${isSubmitting ? 'bg-zinc-800 text-zinc-500' : 'bg-gradient-to-r from-[#d6b97a] via-[#c9a45c] to-[#a0823c] shadow-lg'}
               `}
             >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 md:w-8 md:h-8" />
                  İLETİLİYOR...
                </>
              ) : (
                <>SİPARİŞİ TAMAMLA</>
              )}
            </button>
         </div>

         {/* Success Notification */}
         <AnimatePresence>
           {orderSuccess && (
             <motion.div
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="fixed inset-x-4 bottom-32 md:inset-x-auto md:right-12 md:bottom-32 z-[100]"
             >
                <div 
                  className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20"
                  style={{ backdropFilter: 'blur(10px)' }}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Afiyet Olsun!</h4>
                    <p className="text-sm opacity-90">Siparişiniz mutfağa iletildi.</p>
                  </div>
                </div>
             </motion.div>
           )}
         </AnimatePresence>
      </aside>
      </div> {/* Closing the max-w-[1920px] container */}
    </div>
  );
}

