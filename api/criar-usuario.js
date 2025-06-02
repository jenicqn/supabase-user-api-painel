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

  const { nome, email, senha, nivel } = req.body;
  if (!nome || !email || !senha || !nivel) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: false // <- corrigido
    });

    if (error?.message?.includes('User already registered')) {
      return res.status(409).json({ error: 'Este email já está em uso.' });
    }
    if (error) return res.status(400).json({ error: error.message });
    if (!data?.user?.id) return res.status(500).json({ error: 'ID do usuário não retornado.' });

    const { error: insertError } = await supabase
      .from('usuarios_painel2')
      .insert([{ id: data.user.id, nome, email, nivel }]);

    if (insertError) return res.status(500).json({ error: insertError.message });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erro interno:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
