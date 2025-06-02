import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kwktdbinfadztnkghuul.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .status(200)
      .end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
      email_confirm: true
    });

    if (error) {
      console.error('Erro Supabase Auth:', error);
      return res.status(400).json({ error: error.message });
    }

    if (!data?.user?.id) {
      console.error('Usuário criado, mas resposta inválida:', data);
      return res.status(500).json({ error: 'ID do usuário não retornado.' });
    }

    const userId = data.user.id;
    const payload = { id: userId, nome, email, nivel };

    console.log('Payload para insert:', payload);

    const { error: insertError } = await supabase
      .from('usuarios_painel')
      .insert([payload]);

    if (insertError) {
      console.error('Erro ao inserir dados adicionais:', insertError);
      return res.status(500).json({ error: insertError.message });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erro interno:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
