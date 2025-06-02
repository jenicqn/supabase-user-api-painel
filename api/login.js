import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS: libera requisições do seu painel (localhost ou domínio real)
  res.setHeader('Access-Control-Allow-Origin', '*'); // TEMPORÁRIO — depois use o domínio real
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Resposta para requisição preflight (CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'Preflight OK' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  const { email, senha } = req.body;

  const { data: usuario, error } = await supabase
    .from('usuarios_painel2')
    .select('*')
    .eq('email', email)
    .eq('senha', senha)
    .single();

  if (error || !usuario) {
    return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }

  return res.status(200).json({ success: true, usuario });
}
