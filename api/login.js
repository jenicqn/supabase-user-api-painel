import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // ⚠️ TEMPORÁRIO
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Método não permitido' });

  try {
    const { email, senha } = req.body;

    // 🔐 Autenticação com Supabase Auth
    const authClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (authError || !authData.user) {
      console.error('❌ Auth Error:', authError?.message || 'Usuário não retornado');
      return res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
    }

    // 🔎 Busca informações extras da tabela usuarios_painel2
    const { data: usuario, error } = await supabase
      .from('usuarios_painel2')
      .select('id, nome, email, nivel')
      .eq('email', email)
      .single();

    if (error) {
      console.warn('⚠️ Usuário encontrado no Auth mas não na tabela:', error.message);
    }

    return res.status(200).json({
      success: true,
      usuario: usuario || { email: authData.user.email, nome: '', nivel: 'user' },
    });

  } catch (err) {
    console.error('💥 Erro inesperado:', err.message);
    return res.status(500).json({ success: false, message: 'Erro interno no servidor' });
  }
}
