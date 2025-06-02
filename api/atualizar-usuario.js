import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, nome, email } = req.body;
    if (!id || !nome || !email) return res.status(400).json({ error: 'Dados obrigatórios' });

    const { error } = await supabase.from('usuarios_painel2').update({ nome, email }).eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }
  res.status(405).end();
}
