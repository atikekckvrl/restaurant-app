import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { 
  Clock, 
  ChefHat,
  Layout,
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
  EyeOff,
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
  const [showTableManager, setShowTableManager] = useState(false);
  const [tableStatuses, setTableStatuses] = useState<Record<string, string>>({});
  const [assigningReservation, setAssigningReservation] = useState<Reservation | null>(null);

  // Menu Management States
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchTableStatuses();
    fetchReservations();
    fetchMenuData();

    const ordersChannel = supabase.channel('orders-update').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
      fetchOrders();
      fetchTableStatuses();
    }).subscribe();

    const tablesChannel = supabase.channel('table-status-update').on('postgres_changes', { event: '*', schema: 'public', table: 'table_status' }, () => fetchTableStatuses()).subscribe();

    const resChannel = supabase.channel('reservations-update').on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => fetchReservations()).subscribe();

    const menuChannel = supabase.channel('menu-update').on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, () => fetchMenuData()).subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(tablesChannel);
      supabase.removeChannel(resChannel);
      supabase.removeChannel(menuChannel);
    };
  }, []);

  async function fetchTableStatuses() {
    try {
      const { data: manualData } = await supabase.from('table_status').select('*');
      const { data: orderData } = await supabase.from('orders').select('table_no').in('status', ['pending', 'preparing', 'served']);
      
      const today = new Date().toISOString().split('T')[0];
      const { data: resData } = await supabase
        .from('reservations')
        .select('table_no, res_time')
        .eq('status', 'confirmed')
        .eq('res_date', today);

      const statuses: Record<string, string> = {};
      manualData?.forEach(m => {
        if (m.table_no) statuses[m.table_no] = m.status;
      });
      orderData?.forEach(o => {
        if (o.table_no) statuses[o.table_no] = 'occupied';
      });

      const now = new Date();
      resData?.forEach(res => {
        if (res.table_no && res.res_time) {
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
      });

      setTableStatuses(statuses);
    } catch (err) {
      console.error("fetchTableStatuses Critical Error:", err);
      // Hata olsa bile boş status set etmemek için önceki durumu koruyabiliriz veya boş geçebiliriz,
      // ama en azından sayfa çökmez.
    }
  }

  async function fetchReservations() {
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .order('res_date', { ascending: true })
      .order('res_time', { ascending: true });
    
    if (data) setReservations(data);
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
      .neq('status', 'completed')
      .order('created_at', { ascending: true });

    if (!error) setOrders(data as Order[] || []);
    setLoading(false);
  }

  async function updateTableStatus(tableNo: string, newStatus: string) {
    if (assigningReservation) {
      await supabase.from('reservations').update({ table_no: tableNo, status: 'confirmed' }).eq('id', assigningReservation.id);
      setAssigningReservation(null);
      setShowTableManager(false);
      fetchReservations();
      fetchTableStatuses();
      return;
    }

    await supabase.from('table_status').upsert({ table_no: tableNo, status: newStatus });
    fetchTableStatuses();
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
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
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 md:px-12 py-8 font-sans relative overflow-x-hidden">
      {/* --- Modals at the top level for guaranteed visibility --- */}
      <AnimatePresence>
        {editingItem && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-3xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111111] border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-[600px] max-h-[75vh] flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden"
            >
               <div className="p-6 md:p-10 border-b border-white/5 flex items-center justify-between bg-black/40 shrink-0">
                  <h2 className="text-xl md:text-2xl font-serif text-[#f7e6b8] tracking-widest uppercase">Yemek Düzenle</h2>
                  <button onClick={() => setEditingItem(null)} className="p-3 md:p-4 rounded-full bg-white/5 text-zinc-500 hover:text-white transition-all"><X size={20} /></button>
               </div>
               <div className="flex-1 p-6 md:p-10 pb-20 space-y-6 overflow-y-auto custom-scrollbar">
                  <div className="space-y-2">
                     <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-2">Yemek İsmi</label>
                     <input type="text" value={editingItem.name} onChange={e => editingItem && setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#c9a45c]/50" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-2">Fiyat (₺)</label>
                        <input type="number" value={editingItem.price} onChange={e => editingItem && setEditingItem({...editingItem, price: Number(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#c9a45c]/50" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-2">Kategori</label>
                        <select value={editingItem.category_id} onChange={e => editingItem && setEditingItem({...editingItem, category_id: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#c9a45c]/50 appearance-none">
                           {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-2">Açıklama</label>
                     <textarea rows={3} value={editingItem.description} onChange={e => editingItem && setEditingItem({...editingItem, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#c9a45c]/50 resize-none" />
                  </div>
                  <button disabled={isSaving} onClick={handleSaveItem} className="w-full bg-gradient-to-r from-[#c9a45c] to-[#a0823c] text-black py-4 md:py-5 rounded-2xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-2xl disabled:opacity-50 mt-4">
                     {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> KAYDET</>}
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#c9a45c]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-[1700px] mx-auto relative z-10">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 border-b border-white/5 pb-10 gap-8">
          <div className="flex items-center gap-6">
            <motion.div whileHover={{ rotate: 360, scale: 1.1 }} className="w-16 h-16 bg-gradient-to-br from-[#ffe5a5] to-[#c9a45c] rounded-2xl flex items-center justify-center text-black shadow-[0_10px_30px_rgba(201,164,92,0.2)]">
              <ChefHat size={32} />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif tracking-widest text-[#f7e6b8] uppercase">Yönetim</h1>
              <div className="flex bg-white/5 p-1 rounded-xl mt-3 border border-white/5 self-start">
                <button onClick={() => setActiveTab('orders')} className={`px-4 md:px-6 py-2 rounded-lg text-xs font-bold tracking-widest transition-all ${activeTab === 'orders' ? 'bg-[#c9a45c] text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>SİPARİŞLER</button>
                <button onClick={() => setActiveTab('reservations')} className={`px-4 md:px-6 py-2 rounded-lg text-xs font-bold tracking-widest transition-all ${activeTab === 'reservations' ? 'bg-[#c9a45c] text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>REZERVASYONLAR</button>
                <button onClick={() => setActiveTab('menu')} className={`px-4 md:px-6 py-2 rounded-lg text-xs font-bold tracking-widest transition-all ${activeTab === 'menu' ? 'bg-[#c9a45c] text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>MENÜ</button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <button onClick={() => setShowTableManager(true)} className="px-6 py-4 rounded-2xl border border-[#c9a45c]/30 bg-[#c9a45c]/5 text-[#c9a45c] font-bold text-xs uppercase tracking-widest flex items-center gap-3 transition-all hover:bg-[#c9a45c]/10 flex-1 md:flex-none justify-center">
              <Layout size={18} /> MASA PLANI
            </button>
            <div className="bg-zinc-900/50 backdrop-blur-xl px-8 py-3 rounded-2xl border border-white/5 flex flex-col items-center flex-1 md:flex-none">
              <span className="text-zinc-500 text-[9px] uppercase tracking-[0.2em] font-bold">Kayıtlı</span>
              <span className="text-2xl font-mono font-bold text-[#f7e6b8]">
                {activeTab === 'orders' ? orders.length : activeTab === 'reservations' ? reservations.length : menuItems.length}
              </span>
            </div>
            <button onClick={handleLogout} className="p-4 rounded-2xl bg-white/5 text-zinc-500 hover:text-red-400 border border-white/5 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
             <Loader2 className="w-12 h-12 text-[#c9a45c] animate-spin" />
          </div>
        ) : activeTab === 'orders' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            <AnimatePresence mode="popLayout">
              {orders.map((order) => (
                <motion.div key={order.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-zinc-900/30 backdrop-blur-2xl rounded-3xl border border-white/5 flex flex-col overflow-hidden hover:border-[#c9a45c]/30 transition-colors shadow-2xl">
                  <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#c9a45c] font-bold">Masa</span>
                      <h2 className="text-3xl font-bold font-mono text-white tracking-tighter">{order.table_no}</h2>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[9px] uppercase font-bold border ${getStatusColor(order.status)} drop-shadow-md`}>{order.status}</div>
                  </div>
                  <div className="flex-1 p-6 space-y-4 max-h-[250px] overflow-y-auto custom-scrollbar">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex gap-4 items-start group">
                        <span className="text-[#c9a45c] font-bold font-mono bg-[#c9a45c]/10 w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0">x{item.quantity}</span>
                        <span className="text-gray-300 font-medium text-sm leading-tight group-hover:text-white transition-colors">{item.menu_item?.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-black/40 flex flex-col gap-2">
                    {order.status === 'pending' && <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="w-full bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-blue-500/30">HAZIRLA</button>}
                    {order.status === 'preparing' && <button onClick={() => updateOrderStatus(order.id, 'served')} className="w-full bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-orange-500/30">SERVİS ET</button>}
                    {order.status === 'served' && <button onClick={() => updateOrderStatus(order.id, 'completed')} className="w-full bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-green-500/30">TAMAMLA</button>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {orders.length === 0 && <div className="col-span-full py-40 flex flex-col items-center opacity-10"><ChefHat size={100} /><p className="mt-6 font-serif italic text-2xl tracking-widest">Sipariş yok.</p></div>}
          </div>
        ) : activeTab === 'reservations' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <AnimatePresence mode="popLayout">
               {reservations.filter(r => r.status !== 'seated').map((res) => (
                 <motion.div key={res.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-zinc-900/30 backdrop-blur-2xl rounded-3xl border border-white/5 p-8 relative group hover:border-[#c9a45c]/20 transition-all shadow-2xl">
                   <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-[#c9a45c]/10 flex items-center justify-center text-[#c9a45c] border border-[#c9a45c]/20 shadow-inner">
                          <User size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white tracking-tight">{res.full_name}</h3>
                          <p className="text-zinc-500 text-[10px] mt-1 uppercase tracking-widest font-medium italic">{res.email}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border shadow-inner ${res.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-orange-500/10 text-orange-400 border-orange-500/30'}`}>{res.status === 'confirmed' ? 'ONAYLI' : 'BEKLEYEN'}</div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                        <Calendar size={18} className="text-[#c9a45c]" />
                        <span className="text-sm font-bold text-gray-200">{res.res_date}</span>
                      </div>
                      <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                        <Clock size={18} className="text-[#c9a45c]" />
                        <span className="text-sm font-bold text-gray-200">{res.res_time}</span>
                      </div>
                   </div>

                   <div className="flex gap-4">
                      {res.status === 'pending' ? (
                        <button onClick={() => { setAssigningReservation(res); setShowTableManager(true); }} className="flex-1 bg-gradient-to-r from-[#c9a45c] to-[#a0823c] text-black py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl">MASA ATA & ONAYLA <ChevronRight size={16} /></button>
                      ) : (
                        <div className="w-full flex items-center gap-4">
                           <div className="flex-[2] bg-zinc-800/40 py-4 rounded-2xl text-center text-xs font-bold border border-[#c9a45c]/20 text-[#c9a45c] tracking-widest">MASA {res.table_no}</div>
                           <button onClick={async () => { await supabase.from('reservations').update({ status: 'seated' }).eq('id', res.id); fetchReservations(); }} className="flex-1 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border border-green-500/30">OTURDU</button>
                        </div>
                      )}
                   </div>
                 </motion.div>
               ))}
             </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-16">
            <div className="flex justify-between items-center bg-zinc-900/40 p-8 rounded-[2rem] border border-white/5">
              <div>
                <h2 className="text-2xl font-serif text-[#f7e6b8] tracking-widest uppercase">Menü Envanteri</h2>
                <p className="text-zinc-500 text-[10px] mt-2 tracking-[0.2em] font-bold uppercase">Tüm yemekleri ve fiyatları buradan yönetin</p>
              </div>
              <button 
                onClick={(e) => { e.preventDefault(); handleAddNewItem(categories[0]?.id || ""); }}
                className="flex items-center gap-3 bg-[#c9a45c] text-black px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#d8b56a] transition-all shadow-xl active:scale-95 z-20"
              >
                <Plus size={18} /> YENİ ÜRÜN EKLE
              </button>
            </div>

            {categories.map((cat) => (
              <div key={cat.id} className="space-y-8">
                <div className="flex items-center gap-6">
                  <span className="text-zinc-700 font-mono text-sm">/ {cat.display_order}</span>
                  <h3 className="text-xl font-serif text-[#f7e6b8] tracking-[0.2em] uppercase">{cat.name}</h3>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {menuItems
                    .filter(item => item.category_id === cat.id)
                    .map(item => (
                      <motion.div 
                        key={item.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-7 flex flex-col justify-between hover:border-[#c9a45c]/30 transition-all shadow-2xl relative group h-full"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-white group-hover:text-[#c9a45c] transition-colors leading-tight">{item.name}</h4>
                              <p className="text-zinc-500 text-[11px] mt-2 italic leading-relaxed line-clamp-2 h-8">{item.description || "Açıklama girilmedi."}</p>
                            </div>
                            <div className="text-xl font-mono font-bold text-[#c9a45c] bg-[#c9a45c]/10 px-4 py-2 rounded-2xl border border-[#c9a45c]/20">
                              {item.price}₺
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
                          <div className="flex gap-2.5">
                            <button 
                              title="Stok Durumu"
                              onClick={(e) => { e.stopPropagation(); toggleAvailability(item); }} 
                              className={`p-3 rounded-2xl border transition-all ${item.is_available ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' : 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'}`}
                            >
                              {item.is_available ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                            <button 
                              title="Popüler/Tavsiye"
                              onClick={(e) => { e.stopPropagation(); togglePopular(item); }} 
                              className={`p-3 rounded-2xl border transition-all ${item.is_popular ? 'bg-yellow-400 border-yellow-300 text-black shadow-[0_0_25px_rgba(250,204,21,0.5)]' : 'bg-zinc-800 border-white/5 text-zinc-500 hover:bg-zinc-700'}`}
                            >
                              <Flame size={18} fill={item.is_popular ? "currentColor" : "none"} />
                            </button>
                            <button 
                              title="Sil"
                              onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }}
                              className="p-3 bg-zinc-800 border border-white/5 text-zinc-500 hover:bg-red-600/20 hover:text-red-500 hover:border-red-500/30 rounded-2xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          
                          <button 
                            onClick={(e) => { 
                              e.preventDefault();
                              e.stopPropagation();
                              setEditingItem({...item}); 
                            }} 
                            className="p-4 bg-white/5 hover:bg-[#c9a45c] hover:text-black rounded-2xl border border-white/5 transition-all shadow-lg active:scale-95 group/edit"
                          >
                            <Edit size={20} className="group-hover/edit:scale-110 transition-transform" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}





        <AnimatePresence>
          {showTableManager && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-3xl overflow-hidden"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                className="bg-[#111111] border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-[1200px] max-h-[75vh] flex flex-col relative shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden"
              >
                <div className="p-6 md:p-10 border-b border-white/5 flex items-center justify-between bg-black/40 shrink-0">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-serif text-[#f7e6b8] tracking-tight">{assigningReservation ? `Masa Atama: ${assigningReservation.full_name}` : 'Masa Kontrol Paneli'}</h2>
                    <p className="text-zinc-500 text-[10px] md:text-xs mt-2 uppercase tracking-[0.3em] font-light">{assigningReservation ? 'Rezervasyon için masa seçin' : 'Masa durumlarını yönetin'}</p>
                  </div>
                  <button onClick={() => { setShowTableManager(false); setAssigningReservation(null); }} className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 Transition-all shrink-0"><X size={24} /></button>
                </div>
                <div className="flex-1 p-6 md:p-12 pb-24 overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#111111_100%)]">
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4 md:gap-6">
                    {Array.from({ length: 40 }, (_, i) => i + 1).map((num) => {
                      const tableNo = num.toString();
                      const status = tableStatuses[tableNo] || 'available';
                      return (
                        <button key={tableNo} onClick={() => updateTableStatus(tableNo, status === 'available' ? 'reserved' : status === 'reserved' ? 'occupied' : 'available')} className={`aspect-square rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center transition-all border duration-300 relative group overflow-hidden ${status === 'occupied' ? "bg-red-500/10 border-red-500/40 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : status === 'reserved' ? "bg-orange-500/10 border-orange-500/40 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.1)]" : "bg-zinc-800/20 border-white/5 text-zinc-500 hover:border-[#c9a45c]/50 hover:bg-[#c9a45c]/5"}`}>
                          <span className="text-lg md:text-2xl font-bold font-mono tracking-tighter">{num}</span>
                          <span className="text-[7px] md:text-[9px] font-bold mt-1 uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">{status === 'available' ? 'BOŞ' : status === 'occupied' ? 'DOLU' : 'REZE'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
