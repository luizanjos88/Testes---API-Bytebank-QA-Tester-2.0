import { ModalContext } from 'common/context/ModalContext';
import { useContext } from 'react';

export const useModalContext = () => {
  const { nome, setNome, email, setEmail, senha, setSenha, erro, setErro } =
    useContext(ModalContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'nome':
        setNome(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'senha':
        setSenha(value);
        break;
      default:
        throw new Error('Campo de texto inválido');
    }
  };

  const onSubmitCadastro = async (
    event,
    api,
    aoFechar,
    validaDadosFormulario
  ) => {
    event.preventDefault();
    const usuario = { nome, email, senha };

    const result = await validaDadosFormulario(usuario);
    if (!result.valid) {
      setErro({ path: result.path, message: result.message });
      return;
    }

    try {
      const verificacao = await api.get('/users', { params: { email } });

      if (verificacao.data && verificacao.data.length > 0) {
        setErro({ path: 'email', message: 'E-mail já cadastrado' });
        return;
      }

      await api.post('/users', usuario);

      setErro({
        path: 'message-sucess',
        message: 'Usuário cadastrado com sucesso!',
      });
      setNome('');
      setEmail('');
      setSenha('');

      setTimeout(() => {
        aoFechar();
        setErro({ path: '', message: '' });
      }, 1000);
    } catch (erro) {
      setErro({ path: 'email', message: 'Erro ao cadastrar usuário' });
    }
  };

  const onSubmitLogin = async (
    event,
    api,
    aoFechar,
    aoEfetuarLogin,
    validaDadosFormulario
  ) => {
    event.preventDefault();
    const usuario = { email, senha };

    const result = await validaDadosFormulario(usuario);
    if (!result.valid) {
      setErro({ path: result.path, message: result.message });
      return;
    }

    try {
      const resposta = await api.get('/users', {
        params: { email },
      });

      if (!resposta.data || resposta.data.length === 0) {
        setErro({ path: 'message-erro', message: 'E-mail ou senha inválidos' });
        return;
      }

      const user = resposta.data[0];

      if (user.senha !== senha) {
        setErro({ path: 'message-erro', message: 'E-mail ou senha inválidos' });
        return;
      }

      const tokenFake = btoa(`${user.id}:${user.email}`);

      sessionStorage.setItem('token', tokenFake);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('nomeUsuario', user.nome);

      setEmail('');
      setSenha('');
      setErro({ path: '', message: '' });
      aoEfetuarLogin();
    } catch (erro) {
      console.error('ERRO LOGIN:', erro);
      alert('Aconteceu um erro inesperado ao efetuar login! Contate o suporte');
      aoFechar();
    }
  };

  const onSubmitUpdateUser = async (
    event,
    navigate,
    api,
    validaDadosFormulario,
    userId
  ) => {
    event.preventDefault();
    const usuario = { nome, email, senha };

    const result = await validaDadosFormulario(usuario);

    if (!result.valid) {
      setErro({ path: result.path, message: result.message });
      return;
    }

    api
      .put(`/users/${userId}`, usuario)
      .then(() => {
        localStorage.setItem('nomeUsuario', nome);
        alert('Alterações salvas com sucesso!');
        setErro({
          path: 'message-sucess',
          message: 'Alterações salvas com sucesso!',
        });
        setNome('');
        setEmail('');
        setSenha('');
        navigate('/home');
        setTimeout(() => {
          setErro({ path: '', message: '' });
        }, 1000);
      })
      .catch((erro) => {
        setErro({
          path: 'email',
          message: erro?.response?.data?.message,
        });
      });
  };

  return {
    nome,
    setNome,
    email,
    setEmail,
    senha,
    setSenha,
    erro,
    setErro,
    handleChange,
    onSubmitCadastro,
    onSubmitLogin,
    onSubmitUpdateUser,
  };
};