document.getElementById('formSenha').addEventListener('submit', async function(e) {
  e.preventDefault();

  const id = document.getElementById('senhaId').value;
  const senha = document.getElementById('novaSenha').value;
  const confirmar = document.getElementById('confirmarSenha').value;
  const msg = document.getElementById('alertSenha');
  const btn = this.querySelector('button[type=submit]');

  msg.classList.add('d-none');
  btn.disabled = true;
  btn.textContent = 'Atualizando...';

  if (senha !== confirmar) {
    msg.classList.remove('d-none');
    msg.classList.remove('alert-success');
    msg.classList.add('alert-danger');
    msg.innerText = 'As senhas não coincidem.';
    btn.disabled = false;
    btn.textContent = 'Atualizar';
    return;
  }

  try {
    const res = await fetch('https://supabase-user-api-painel.vercel.app/api/atualizar-senha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, senha })
    });

    const data = await res.json();

    if (res.ok) {
      msg.classList.remove('d-none');
      msg.classList.remove('alert-danger');
      msg.classList.add('alert-success');
      msg.innerText = 'Senha atualizada com sucesso!';
      setTimeout(() => {
        bootstrap.Modal.getInstance(document.getElementById('modalSenha')).hide();
        msg.classList.add('d-none');
      }, 1500);
    } else {
      msg.classList.remove('d-none');
      msg.classList.remove('alert-success');
      msg.classList.add('alert-danger');
      msg.innerText = 'Erro: ' + (data.error || 'Falha ao atualizar senha.');
    }

  } catch (err) {
    msg.classList.remove('d-none');
    msg.classList.remove('alert-success');
    msg.classList.add('alert-danger');
    msg.innerText = 'Erro de rede. Verifique sua conexão.';
  }

  btn.disabled = false;
  btn.textContent = 'Atualizar';
});
