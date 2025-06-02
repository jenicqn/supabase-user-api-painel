import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kwktdbinfadztnkghuul.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { data, error } = await supabase.from('usuarios_painel2').select('*');

    if (error) {
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Erro inesperado' });
  }
}