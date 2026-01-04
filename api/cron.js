
import { createClient } from '@supabase/supabase-js';

export default async function handler(request, response) {
    // Vercel ortamında process.env kullanılır
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return response.status(500).json({ error: 'Environment variables are missing' });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Veritabanına basit bir sorgu atarak onu "uyandırıyoruz"
        const { data, error } = await supabase
            .from('categories')
            .select('id')
            .limit(1);

        if (error) throw error;

        return response.status(200).json({
            success: true,
            message: 'Supabase ping successful (Keep-Alive)',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}
