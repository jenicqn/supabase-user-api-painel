// api/criar-usuario.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kwktdbinfadztnkghuul.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { nome, email, senha, nivel } = req.body;

  if (!nome || !email || !senha || !nivel) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });

    if (error) {
      console.log('ERRO AUTH ADMIN:', error); // ✅ Aqui é o lugar certo
      return res.status(400).json({ error: error.message });
    }

    const userId = data.user.id;

    const { error: insertError } = await supabase
      .from('usuarios_painel')
      .insert([{ id: userId, nome, email, acesso: nivel }])

    if (insertError) {
      return res.status(500).json({ error: 'Usuário criado, mas falha ao salvar dados adicionais.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('ERRO GERAL:', err); // ⛑️ Para logs inesperados
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
  await supabase
  .from('usuarios_painel')
  .insert([{ id: userId, nome, email, acesso: nivel }]);

}
