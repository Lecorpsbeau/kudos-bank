import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fonction sécurisée pour calculer le solde
export async function getBalance(userId: string): Promise<number> {
  const { data, error } = await supabase
    .rpc('get_balance', { user_id: userId });
  
  if (error) throw error;
  return data || 0;
}