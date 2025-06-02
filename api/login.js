import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // ⚠️ TEMPORÁRIO apenas para testes locais
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  const { email, senha } = req.body;

  // 🔐 1. Tenta autenticar pelo Auth do Supabase
  const authClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY // Use a chave pública aqui
  );

  const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (authError || !authData.user) {
    return res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
  }

  // 🔎 2. Busca dados extras do painel (nome, nível)
  const { data: usuario, error } = await supabase
    .from('usuarios_painel2')
    .select('id, nome, email, nivel')
    .eq('email', email)
    .single();

  if (error || !usuario) {
    return res.status(200).json({ success: true, usuario: { email } }); // fallback mínimo
  }

  return res.status(200).json({ success: true, usuario });
}
