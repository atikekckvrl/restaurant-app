import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { 
  Clock, 
  ChefHat,
  X,
  LogOut,
  Loader2,
  Calendar,
  User,
  ChevronRight,
  Plus,
  Save,
  Edit,
  Eye,
  Flame,
  Trash2
} from "lucide-react";

type OrderItem = {
  id: string;
  quantity: number;
  menu_item: {
    name: string;
  };
};

type Order = {
  id: string;
  table_no: string;
  status: string;
  total_price: number;
  created_at: string;
  items: OrderItem[];
};

type Reservation = {
  id: string;
  full_name: string;
  email: string;
  res_date: string;
  res_time: string;
  note: string;
  status: string;
  table_no: string;
  created_at: string;
};

type Category = {
  id: string;
  name: string;
  icon_name: string;
  display_order: number;
};

type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  is_popular: boolean;
  is_available: boolean;
};

export default function KitchenPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'menu'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [tableStatuses, setTableStatuses] = useState<Record<string, string>>({});
  const [assigningReservation, setAssigningReservation] = useState<Reservation | null>(null);

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const refreshAllData = async () => {
    setIsSyncing(true);
    await Promise.all([
      fetchOrders(),
      fetchTableStatuses(),
      fetchReservations(),
      fetchMenuData()
    ]);
    setLastSyncTime(new Date().toLocaleTimeString());
    setIsSyncing(false);
  };

  useEffect(() => {
    // İlk yüklemede tüm verileri çek
    refreshAllData();

    // POLLLING: Realtime (WebSocket) bağlantısı kopsa veya engellense bile 
    // her 3 saniyede bir verileri tazele (En güvenli yöntem)
    const pollInterval = setInterval(() => {
      refreshAllData();
    }, 3000);

    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  async function fetchTableStatuses() {
    try {
      const { data: manualData } = await supabase.from('table_status').select('*');
      
      // 2. Aktif veya tamamlanmış ama ödemesi alınmamış tüm siparişleri çek.
      // Date filtresini kaldırıyoruz, çünkü "session" mantığında settled olmayan her şey aktiftir.
      const { data: orderData } = await supabase.from('orders')
        .select('table_no')
        .in('status', ['pending', 'preparing', 'served', 'completed']);
      
      const today = new Date().toISOString().split('T')[0];
      const { data: resData } = await supabase
        .from('reservations')
        .select('table_no, res_time, status')
        .in('status', ['confirmed', 'seated'])
        .eq('res_date', today);

      const statuses: Record<string, string> = {};
      
      // 1. Sipariş verilerini işle (Baz durum)
      orderData?.forEach(o => {
        if (o.table_no) statuses[o.table_no] = 'occupied';
      });

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
               console.error("Time logic error for table", res.table_no, e);
            }
          }
        }
      });

      // 4. SON OLARAK: Manuel Durumlar (Kullanıcının Tıklaması) - YÜKSEK ÖNCELİK
      manualData?.forEach(m => {
        if (m.table_no && m.status !== 'available') { // Sadece boş değilse manuel öncelik ver
           statuses[m.table_no] = m.status;
        }
      });
      
      // 5. KRİTİK SEVİYE: Aktif Sipariş Kontrolü (Siparişi olan masa HER ZAMAN dolu görünmeli)
      if (orderData && orderData.length > 0) {
        orderData.forEach(o => {
          if (o.table_no) statuses[o.table_no] = 'occupied';
        });
      }

      // Sadece veri geldiyse güncelleme yap (Tüm masaların birden yeşile dönmesini engellemek için)
      if (Object.keys(statuses).length > 0 || (manualData && manualData.length > 0) || (resData && resData.length > 0)) {
         setTableStatuses(statuses);
      } else {
         // Eğer gerçekten her yer boşsa, boş set et
         setTableStatuses({});
      }
    } catch (err) {
      console.error("fetchTableStatuses Critical Error:", err);
      // Hata olsa bile boş status set etmemek için önceki durumu koruyabiliriz veya boş geçebiliriz,
      // ama en azından sayfa çökmez.
    }
  }

  async function fetchReservations() {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('res_date', { ascending: true })
        .order('res_time', { ascending: true });
      
      if (error) {
        console.error("fetchReservations Error:", error);
      } else if (data) {
        console.log("Rezervasyonlar güncellendi. Toplam:", data.length);
        setReservations(data);
      }
    } catch (e) {
      console.error("fetchReservations Exception:", e);
    }
  }

  async function fetchMenuData() {
    try {
      const { data: cats } = await supabase.from('categories').select('*').order('display_order');
      const { data: items } = await supabase.from('menu_items').select('*').order('name');
      if (cats) setCategories(cats);
      if (items) setMenuItems(items);
    } catch (error) {
      console.error("Menu data fetch error:", error);
    }
  }

  async function fetchOrders() {
    // settled (arşivlenmiş/ödenmiş) OLMAYAN tüm siparişleri çek
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          id,
          quantity,
          menu_item:menu_items (name)
        )
      `)
      .neq('status', 'settled')
      .order('created_at', { ascending: true });

    if (!error && data) {
       // OTO-TEMİZLİK: Çok eski (örn: 24 saatten eski) ve 'completed' statüsündeki siparişleri
       // otomatik olarak settled yap ki sistem şişmesin.
       const now = new Date();
       const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
       
       const oldCompletedOrders = data.filter(o => 
          o.status === 'completed' && new Date(o.created_at) < oneDayAgo
       );

       if (oldCompletedOrders.length > 0) {
          console.log("Auto-settling old orders:", oldCompletedOrders.length);
          const oldIds = oldCompletedOrders.map(o => o.id);
          await supabase.from('orders').update({ status: 'settled' }).in('id', oldIds);
          // UI güncellenmesi için filtrele
          setOrders(data.filter(o => !oldIds.includes(o.id)));
       } else {
          setOrders(data as Order[]);
       }
    }
    setLoading(false);
  }

  async function handleTableClick(tableNo: string) {
    if (assigningReservation) {
      const resId = assigningReservation.id;
      setAssigningReservation(null);
      
      await Promise.all([
        supabase.from('reservations').update({ table_no: tableNo, status: 'confirmed' }).eq('id', resId),
        supabase.from('table_status').upsert({ table_no: tableNo, status: 'reserved' })
      ]);
      
      fetchTableStatuses();
      fetchReservations();
      return;
    }
    
    setSelectedTable(tableNo);
    setActiveTab('orders');
  }


  async function handleClearTable() {
    if (!selectedTable) return;
    
    if (!confirm(`Masa ${selectedTable} ödemesi alındı olarak işaretlenecek ve seans kapatılacak. Onaylıyor musunuz?`)) return;

    try {
      // 1. Masaya ait tüm non-settled siparişleri 'settled' yap
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'settled' })
        .eq('table_no', selectedTable)
        .in('status', ['pending', 'preparing', 'served', 'completed']);

      if (orderError) throw orderError;

      // 2. Masayı manuel olarak 'available' yap
      const { error: statusError } = await supabase
        .from('table_status')
        .upsert({ table_no: selectedTable, status: 'available' });

      if (statusError) throw statusError;

      // 3. Verileri tazele
      await refreshAllData();
      
      // 4. Seçimi kaldır (isteğe bağlı, ama kullanıcı diğer masaları görmeye devam edebilir)
      // setSelectedTable(null); 
    } catch (err) {
      console.error("Masa boşaltma hatası:", err);
      alert("İşlem sırasında bir hata oluştu.");
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    // Optimistic: Sipariş listesini hemen güncelle
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (!error) {
      fetchOrders();
      fetchTableStatuses();
    }
  }

  async function handleSaveItem() {
    if (!editingItem) return;
    setIsSaving(true);
    try {
      const { id, ...updateData } = editingItem;
      if (id.startsWith('new-')) {
        const { error } = await supabase.from('menu_items').insert(updateData);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('menu_items').update(updateData).eq('id', id);
        if (error) throw error;
      }
      setEditingItem(null);
      fetchMenuData();
    } catch (err) {
      alert("İşlem sırasında hata oluştu!");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteItem(id: string) {
    if (!confirm("Bu yemeği silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (!error) fetchMenuData();
  }

  function handleAddNewItem(categoryId: string) {
    console.log("Adding new item to category:", categoryId);
    setEditingItem({
      id: `new-${Date.now()}`,
      category_id: categoryId || (categories.length > 0 ? categories[0].id : ""),
      name: "",
      description: "",
      price: 0,
      is_popular: false,
      is_available: true
    });
  }

  async function togglePopular(item: MenuItem) {
    const { error } = await supabase.from('menu_items').update({ is_popular: !item.is_popular }).eq('id', item.id);
    if (!error) fetchMenuData();
  }

  async function toggleAvailability(item: MenuItem) {
    const { error } = await supabase.from('menu_items').update({ is_available: !item.is_available }).eq('id', item.id);
    if (!error) fetchMenuData();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'border-orange-500/50 bg-orange-500/10 text-orange-400';
      case 'preparing': return 'border-blue-500/50 bg-blue-500/10 text-blue-400';
      case 'served': return 'border-green-500/50 bg-green-500/10 text-green-400';
      default: return 'border-gray-500/50 bg-gray-500/10 text-gray-400';
    }
  };

  const handleLogout = async () => await supabase.auth.signOut();

  return (
    <div className="flex flex-row h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      {/* --- Sol Panel: Masa Planı (%30) --- */}
      <div className="w-[30%] bg-[#0e0e0e] border-r border-white/5 flex flex-col h-full relative z-20 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
         <div className="p-6 md:p-8 border-b border-white/5 bg-black/20 backdrop-blur-xl shrink-0 flex justify-between items-center">
            <div>
               <h2 className="text-xl md:text-2xl font-serif text-[#f7e6b8] tracking-widest uppercase">Masa Planı</h2>
               <p className="text-zinc-500 text-[10px] mt-2 uppercase tracking-[0.2em] font-bold">
                  {assigningReservation ? `Atama: ${assigningReservation.full_name}` : 'Anlık Durum'}
               </p>
            </div>
            {assigningReservation && (
               <button onClick={() => setAssigningReservation(null)} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center gap-2">
                  <X size={14} /> İptal
               </button>
            )}
         </div>
         
         <div className="flex-1 overflow-hidden p-4 bg-zinc-900 flex flex-col">
            <div className="grid grid-cols-5 gap-2 h-full w-full">
               {Array.from({ length: 40 }, (_, i) => i + 1).map((num) => {
                  const tableNo = num.toString();
                  const status = tableStatuses[tableNo] || 'available';
                  let style = {};
                  if (status === 'occupied') {
                     style = { backgroundColor: '#dc2626', borderColor: '#ef4444', color: '#ffffff' };
                  } else if (status === 'reserved') {
                     style = { backgroundColor: '#eab308', borderColor: '#facc15', color: '#000000' };
                  } else {
                     style = { backgroundColor: '#16a34a', borderColor: '#22c55e', color: '#ffffff' };
                  }

                   const isSelected = selectedTable === tableNo;

                   return (
                   <button 
                      key={tableNo} 
                      onClick={() => handleTableClick(tableNo)} 
                      className={`w-full h-full rounded-xl flex flex-col items-center justify-center border-2 transition-all shadow-sm hover:brightness-110 p-1 ${isSelected ? 'ring-4 ring-[#c9a45c] ring-offset-2 ring-offset-[#0a0a0a] scale-105 z-10' : ''}`}
                      style={style}
                   >
                     <span className="text-xl md:text-2xl font-bold font-mono tracking-tighter leading-none">{num}</span>
                     <span className="text-[9px] font-bold mt-1 uppercase tracking-wider opacity-90 w-full text-center">{status === 'available' ? 'BOŞ' : status === 'occupied' ? 'DOLU' : 'RZV'}</span>
                  </button>
                  );
               })}
            </div>
         </div>
      </div>

      {/* --- Sağ Panel: İçerik --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#0a0a0a]">
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c9a45c]/5 blur-[120px] rounded-full opacity-50" />
         </div>

         <header className="shrink-0 p-6 md:p-8 border-b border-white/5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-black/20 backdrop-blur-md relative z-10">
            <div className="flex items-center gap-6">
               <motion.div whileHover={{ rotate: 360, scale: 1.1 }} className="w-14 h-14 bg-gradient-to-br from-[#ffe5a5] to-[#c9a45c] rounded-xl flex items-center justify-center text-black shadow-lg shadow-[#c9a45c]/20">
                  <ChefHat size={28} />
               </motion.div>
               <div>
                  <h1 className="text-2xl md:text-3xl font-serif tracking-widest text-[#f7e6b8] uppercase">Yönetim</h1>
                  <div className="flex bg-white/5 p-1 rounded-lg mt-2 border border-white/5 self-start">
                  <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-md text-[10px] md:text-xs font-bold tracking-widest transition-all ${activeTab === 'orders' ? 'bg-[#c9a45c] text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>SİPARİŞLER</button>
                  <button onClick={() => setActiveTab('reservations')} className={`px-4 py-2 rounded-md text-[10px] md:text-xs font-bold tracking-widest transition-all ${activeTab === 'reservations' ? 'bg-[#c9a45c] text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>REZERVASYONLAR</button>
                  <button onClick={() => setActiveTab('menu')} className={`px-4 py-2 rounded-md text-[10px] md:text-xs font-bold tracking-widest transition-all ${activeTab === 'menu' ? 'bg-[#c9a45c] text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>MENÜ</button>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-4 w-full xl:w-auto">
               <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-2 rounded-lg border border-white/5 cursor-pointer hover:bg-zinc-800 transition-colors" onClick={refreshAllData}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`} />
                  <span className="text-[10px] font-bold text-zinc-400 font-mono tracking-tighter uppercase">
                     {isSyncing ? 'YENİLENİYOR' : `SENKRONİZE: ${lastSyncTime}`}
                  </span>
               </div>

               <div className="bg-zinc-900/50 backdrop-blur-xl px-6 py-3 rounded-xl border border-white/5 flex flex-col items-center flex-1 xl:flex-none min-w-[120px]">
                  <span className="text-zinc-500 text-[9px] uppercase tracking-[0.2em] font-bold">Aktif Kayıt</span>
                  <span className="text-xl font-mono font-bold text-[#f7e6b8]">
                  {activeTab === 'orders' ? orders.length : activeTab === 'reservations' ? reservations.length : menuItems.length}
                  </span>
               </div>
               <button onClick={handleLogout} className="p-4 rounded-xl bg-white/5 text-zinc-500 hover:text-red-400 border border-white/5 transition-colors hover:bg-red-500/10">
                  <LogOut size={20} />
               </button>
            </div>
         </header>

         <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 relative z-0">
            {loading ? (
               <div className="flex flex-col items-center justify-center py-40">
                  <Loader2 className="w-12 h-12 text-[#c9a45c] animate-spin" />
               </div>
            ) : activeTab === 'orders' ? (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                   <div className="col-span-full mb-6 flex items-center justify-between bg-zinc-900/40 p-4 rounded-xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#c9a45c]/10 flex items-center justify-center text-[#c9a45c]">
                           <Clock size={20} />
                        </div>
                        <div>
                           <h2 className="text-lg font-serif text-white tracking-widest uppercase">
                              {selectedTable ? `MASA ${selectedTable} İŞLEMLERİ` : 'TÜM AKTİF SİPARİŞLER'}
                           </h2>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {selectedTable && orders.some(o => o.table_no === selectedTable) && (
                           <button 
                              onClick={handleClearTable}
                              className="px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border border-red-500/30 flex items-center gap-2"
                           >
                              <Trash2 size={14} /> MASA BOŞALT (ÖDEME AL)
                           </button>
                        )}
                        {selectedTable && (
                           <button 
                              onClick={() => setSelectedTable(null)}
                              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5"
                           >
                              TÜMÜNÜ GÖSTER
                           </button>
                        )}
                      </div>
                   </div>

                   <AnimatePresence mode="popLayout">
                   {orders
                     .filter(order => {
                        if (selectedTable) return order.table_no === selectedTable;
                        return order.status !== 'completed';
                     })
                     .map((order) => (
                     <motion.div key={order.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-zinc-900/30 backdrop-blur-2xl rounded-2xl border border-white/5 flex flex-col overflow-hidden hover:border-[#c9a45c]/30 transition-colors shadow-lg">
                        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div>
                           <span className="text-[9px] uppercase tracking-widest text-[#c9a45c] font-bold">Masa</span>
                           <h2 className="text-2xl font-bold font-mono text-white tracking-tighter">{order.table_no}</h2>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[9px] uppercase font-bold border ${getStatusColor(order.status)} drop-shadow-md`}>{order.status}</div>
                        </div>
                        <div className="flex-1 p-5 space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar">
                        {order.items?.map((item) => (
                           <div key={item.id} className="flex gap-3 items-start group">
                              <span className="text-[#c9a45c] font-bold font-mono bg-[#c9a45c]/10 w-6 h-6 rounded flex items-center justify-center text-[10px] shrink-0">x{item.quantity}</span>
                              <span className="text-gray-300 font-medium text-xs leading-snug group-hover:text-white transition-colors">{item.menu_item?.name}</span>
                           </div>
                        ))}
                        </div>
                        <div className="p-4 bg-black/40 flex flex-col gap-2">
                        {order.status === 'pending' && <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="w-full bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all border border-blue-500/30">HAZIRLA</button>}
                        {order.status === 'preparing' && <button onClick={() => updateOrderStatus(order.id, 'served')} className="w-full bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all border border-orange-500/30">SERVİS ET</button>}
                        {order.status === 'served' && <button onClick={() => updateOrderStatus(order.id, 'completed')} className="w-full bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all border border-green-500/30">TAMAMLA</button>}
                        </div>
                     </motion.div>
                  ))}
                  </AnimatePresence>
                  {orders.length === 0 && <div className="col-span-full py-20 flex flex-col items-center opacity-10"><ChefHat size={80} /><p className="mt-4 font-serif italic text-xl tracking-widest">Sipariş yok.</p></div>}
                  
                   {selectedTable && (
                      <div className="col-span-full mt-6 p-6 bg-black/40 rounded-xl border border-[#c9a45c]/30 backdrop-blur-md sticky bottom-0 shadow-2xl z-20">
                         <div className="flex justify-between items-center mb-4">
                            <span className="text-zinc-400 font-serif tracking-widest uppercase text-sm">TOPLAM Tutar</span>
                            <span className="text-3xl font-mono font-bold text-[#c9a45c] drop-shadow-lg">
                               {orders.filter(o => o.table_no === selectedTable).reduce((sum, o) => sum + (o.total_price || 0), 0)}₺
                            </span>
                         </div>
                         <div className="flex gap-3">
                            <button 
                               onClick={() => setSelectedTable(null)}
                               className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl font-bold uppercase tracking-widest transition-all border border-white/5 text-xs"
                            >
                               Kapat
                            </button>
                            <button 
                               onClick={handleClearTable}
                               className="flex-[2] py-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg text-xs flex items-center justify-center gap-2"
                            >
                               <Trash2 size={16} /> MASA BOŞALT & ÖDE
                            </button>
                         </div>
                      </div>
                   )}
               </div>
            ) : activeTab === 'reservations' ? (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  <AnimatePresence mode="popLayout">
                  {reservations.filter(r => r.status !== 'seated').map((res) => (
                     <motion.div key={res.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/5 p-6 relative group hover:border-[#c9a45c]/20 transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-[#c9a45c]/10 flex items-center justify-center text-[#c9a45c] border border-[#c9a45c]/20">
                              <User size={20} />
                           </div>
                           <div>
                              <h3 className="text-lg font-bold text-white tracking-tight">{res.full_name}</h3>
                              <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-medium italic">{res.email}</p>
                           </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${res.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-orange-500/10 text-orange-400 border-orange-500/30'}`}>{res.status === 'confirmed' ? 'ONAYLI' : 'BEKLEYEN'}</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                           <Calendar size={16} className="text-[#c9a45c]" />
                           <span className="text-xs font-bold text-gray-200">{res.res_date}</span>
                        </div>
                        <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                           <Clock size={16} className="text-[#c9a45c]" />
                           <span className="text-xs font-bold text-gray-200">{res.res_time}</span>
                        </div>
                        </div>

                        <div className="flex gap-3">
                        {res.status === 'pending' ? (
                           <button onClick={() => { setAssigningReservation(res); /* Modal yok, sol panelden secim yapilacak */ }} className="flex-1 bg-gradient-to-r from-[#c9a45c] to-[#a0823c] text-black py-3 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
                              {assigningReservation?.id === res.id ? 'SEÇİM BEKLENİYOR...' : 'MASA ATA'} <ChevronRight size={14} />
                           </button>
                        ) : (
                           <div className="w-full flex items-center gap-3">
                              <div className="flex-[2] bg-zinc-800/40 py-3 rounded-xl text-center text-[10px] font-bold border border-[#c9a45c]/20 text-[#c9a45c] tracking-widest">MASA {res.table_no}</div>
                               <button onClick={async () => { 
                                 await Promise.all([
                                    supabase.from('reservations').update({ status: 'seated' }).eq('id', res.id),
                                    supabase.from('table_status').upsert({ table_no: res.table_no, status: 'occupied' })
                                 ]);
                                 fetchReservations(); 
                                 fetchTableStatuses(); 
                              }} className="flex-1 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border border-green-500/30">OTURDU</button>
                           </div>
                        )}
                        </div>
                     </motion.div>
                  ))}
                  </AnimatePresence>
               </div>
            ) : (
               <div className="space-y-12">
                  <div className="flex justify-between items-center bg-zinc-900/40 p-6 rounded-[2rem] border border-white/5">
                  <div>
                     <h2 className="text-xl font-serif text-[#f7e6b8] tracking-widest uppercase">Menü Envanteri</h2>
                     <p className="text-zinc-500 text-[10px] mt-1 tracking-[0.2em] font-bold uppercase">Yemekleri ve fiyatları yönetin</p>
                  </div>
                  <button 
                     onClick={(e) => { e.preventDefault(); handleAddNewItem(categories[0]?.id || ""); }}
                     className="flex items-center gap-2 bg-[#c9a45c] text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#d8b56a] transition-all shadow-xl active:scale-95"
                  >
                     <Plus size={16} /> YENİ ÜRÜN
                  </button>
                  </div>

                  {categories.map((cat) => (
                  <div key={cat.id} className="space-y-6">
                     <div className="flex items-center gap-4">
                        <span className="text-zinc-700 font-mono text-xs">/ {cat.display_order}</span>
                        <h3 className="text-lg font-serif text-[#f7e6b8] tracking-[0.2em] uppercase">{cat.name}</h3>
                        <div className="h-px flex-1 bg-white/5" />
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {menuItems
                        .filter(item => item.category_id === cat.id)
                        .map(item => (
                           <motion.div 
                              key={item.id} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:border-[#c9a45c]/30 transition-all shadow-xl relative group h-full"
                           >
                              <div className="space-y-3">
                              <div className="flex justify-between items-start gap-4">
                                 <div className="flex-1">
                                    <h4 className="text-base font-bold text-white group-hover:text-[#c9a45c] transition-colors leading-tight">{item.name}</h4>
                                    <p className="text-zinc-500 text-[10px] mt-1 italic leading-relaxed line-clamp-2 h-8">{item.description || "Açıklama girilmedi."}</p>
                                 </div>
                                 <div className="text-lg font-mono font-bold text-[#c9a45c] bg-[#c9a45c]/10 px-3 py-1.5 rounded-xl border border-[#c9a45c]/20">
                                    {item.price}₺
                                 </div>
                              </div>
                              </div>

                              <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                              <div className="flex gap-2">
                                 <button onClick={(e) => { e.stopPropagation(); toggleAvailability(item); }} className={`p-2.5 rounded-xl border transition-all ${item.is_available ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}><Eye size={16} /></button>
                                 <button onClick={(e) => { e.stopPropagation(); togglePopular(item); }} className={`p-2.5 rounded-xl border transition-all ${item.is_popular ? 'bg-yellow-400 border-yellow-300 text-black' : 'bg-zinc-800 border-white/5 text-zinc-500'}`}><Flame size={16} fill={item.is_popular ? "currentColor" : "none"} /></button>
                                 <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }} className="p-2.5 bg-zinc-800 border border-white/5 text-zinc-500 hover:bg-red-600/20 hover:text-red-500 rounded-xl transition-all"><Trash2 size={16} /></button>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); setEditingItem({...item}); }} className="p-3 bg-white/5 hover:bg-[#c9a45c] hover:text-black rounded-xl border border-white/5 transition-all shadow-lg active:scale-95"><Edit size={16} /></button>
                              </div>
                           </motion.div>
                        ))}
                     </div>
                  </div>
                  ))}
               </div>
            )}
         </main>
      </div>

       {/* --- Modals --- */}
       <AnimatePresence>
         {editingItem && (
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }} 
             className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
           >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }} 
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 20 }}
               className="bg-[#111111] border border-white/10 rounded-3xl w-full max-w-[500px] flex flex-col shadow-2xl overflow-hidden"
             >
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
                   <h2 className="text-xl font-serif text-[#f7e6b8] tracking-widest uppercase">Yemek Düzenle</h2>
                   <button onClick={() => setEditingItem(null)} className="p-3 rounded-full bg-white/5 text-zinc-500 hover:text-white transition-all"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
                   <div className="space-y-1">
                      <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest pl-2">Yemek İsmi</label>
                      <input type="text" value={editingItem.name} onChange={e => editingItem && setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#c9a45c]/50 text-sm" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest pl-2">Fiyat (₺)</label>
                         <input type="number" value={editingItem.price} onChange={e => editingItem && setEditingItem({...editingItem, price: Number(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#c9a45c]/50 text-sm" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest pl-2">Kategori</label>
                         <select value={editingItem.category_id} onChange={e => editingItem && setEditingItem({...editingItem, category_id: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#c9a45c]/50 appearance-none text-sm">
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                         </select>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest pl-2">Açıklama</label>
                      <textarea rows={3} value={editingItem.description} onChange={e => editingItem && setEditingItem({...editingItem, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#c9a45c]/50 resize-none text-sm" />
                   </div>
                   <button disabled={isSaving} onClick={handleSaveItem} className="w-full bg-gradient-to-r from-[#c9a45c] to-[#a0823c] text-black py-4 rounded-xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl disabled:opacity-50 mt-2 text-xs">
                      {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> KAYDET</>}
                   </button>
                </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}
