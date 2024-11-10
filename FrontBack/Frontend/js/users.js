document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('form-autenticacao');
    const registerForm = document.getElementById('form-registro');
    const recoveryForm = document.getElementById('dados');
    const buttonAcessar = document.getElementById('button-acessar');
    const buttonRegistrar = document.getElementById('button-registro');
 
    
    // Evento para o botão de login
    if (buttonAcessar) {
        buttonAcessar.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('senha').value;

            try {
                const response = await fetch(`http://localhost:3000/api/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('sessao', data.token); // Armazena o token JWT
                    alert(data.message);
                    window.location.href = '../index.html'; 
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                alert('Erro ao tentar fazer login.');
            }
        });
    }

    if (buttonRegistrar) {
        buttonRegistrar.addEventListener('click', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('senha').value;
            const confirmPassword = document.getElementById('oksenha').value;

            // Verificação da política de senha (mínimo de 8 caracteres e pelo menos um número)
            const senhaForteRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,255}$/;
            if (!senhaForteRegex.test(password)) {
                alert('A senha deve ter pelo menos 8 caracteres e incluir pelo menos um número.');
                return;
            }

            if (password !== confirmPassword) {
                alert('As senhas não coincidem.');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/users/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const result = await response.json();
                if (response.ok) {
                    alert('Usuário registrado com sucesso!');
                    window.location.href = '../pages/login.html';
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Erro ao registrar usuário:', error);
                alert('Erro ao tentar registrar.');
            }
        });
    }
});
