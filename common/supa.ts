import { createClient } from "@supabase/supabase-js";

export function getSupabase() {
    const supabaseUrl = 'https://gwdxmeglfljvunqahbxp.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_API_KEY;
    return createClient(supabaseUrl, supabaseKey!);
}