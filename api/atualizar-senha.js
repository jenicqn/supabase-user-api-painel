import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kwktdbinfadztnkghuul.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { id, senha } = req.body;

  if (!id || !senha || senha.length < 6) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  try {
    const { error } = await supabase.auth.admin.updateUserById(id, {
      password: senha
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}