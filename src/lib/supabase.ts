import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL veya Anon Key eksik! .env dosyanızı kontrol edin. Uygulama demo modunda veya hatalı çalışabilir.");
}

// Client'ın çökmemesi için fallback değerler kullanıyoruz.
// Bu sayede sayfa render olur ancak veri çekemez (bu durumu UI'da yakalayacağız)
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);
