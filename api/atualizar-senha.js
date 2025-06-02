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
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { id, novaSenha } = req.body;

  if (!id || !novaSenha || novaSenha.length < 6) {
    return res.status(400).json({ error: 'ID e nova senha (mín. 6 caracteres) são obrigatórios' });
  }

  try {
    const { data, error } = await supabase.auth.admin.updateUserById(id, {
      password: novaSenha,
    });

    if (error) {
      console.error('Erro ao atualizar senha:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erro interno:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
