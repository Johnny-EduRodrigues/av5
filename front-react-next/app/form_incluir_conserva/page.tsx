'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FormIncluirConserva() {
  const [produto, setProduto] = useState('');
  const [marca, setMarca] = useState('');
  const [validade, setValidade] = useState('');
  const [peso, setPeso] = useState('');
  const [preco, setPreco] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  // endereço do backend
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // verifica se o usuário está autenticado
  useEffect(() => {
    const savedToken = localStorage.getItem('token');

    if (!savedToken) {
      router.replace('/form_login');
      return;
    }

    setToken(savedToken);
  }, [router]);

  // limpa a mensagem de sucesso após 5 segundos
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage('');
    }, 5000);

    return () => clearTimeout(timer);
  }, [message]);

  // limpa a mensagem de erro após 5 segundos
  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError('');
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]);

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);

    try {
      const resposta = await fetch(`${apiUrl}/conserva`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          produto,
          marca,
          validade: validade || null,
          peso: peso || null,
          preco,
        }),
      });

      switch (resposta.status) {
        case 200:
        case 201:
          setMessage('Conserva cadastrada com sucesso!');

          // limpa os campos
          setProduto('');
          setMarca('');
          setValidade('');
          setPeso('');
          setPreco('');
          break;

        case 400:
          setError('Dados inválidos. Verifique os campos obrigatórios.');
          break;

        case 401:
          setError('A sessão expirou. Por favor, faça login novamente.');
          localStorage.removeItem('token');
          router.replace('/form_login');
          break;

        case 403:
          setError('Você não tem permissão para realizar esta ação.');
          break;

        case 500:
          setError('Erro interno no servidor backend.');
          break;

        default:
          setError(`Não foi possível cadastrar a conserva. Código: ${resposta.status}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar conserva:', error);
      setError('Não foi possível conectar-se ao backend.');
    } finally {
      setLoading(false);
    }
  };

  // aguarda a verificação do token
  if (!token) {
    return null;
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          Cadastrar Conserva
        </h1>

        {message && (
          <p className="text-green-600 font-medium mb-4">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-600 font-medium mb-4">
            {error}
          </p>
        )}

        <form className="flex flex-col gap-4 w-full" onSubmit={enviar}>

          <input
            type="text"
            name="produto"
            placeholder="Nome do produto"
            value={produto}
            onChange={(e) => setProduto(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />

          <input
            type="text"
            name="marca"
            placeholder="Marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />

          <label className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
            Data de validade (opcional)
            <input
              type="date"
              name="validade"
              value={validade}
              onChange={(e) => setValidade(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-3 text-base text-black"
            />
          </label>

          <input
            type="text"
            name="peso"
            placeholder="Peso (ex.: 300g)"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <input
            type="number"
            name="preco"
            placeholder="Preço (ex.: 8.50)"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            min="0.01"
            step="0.01"
            className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer bg-blue-600 text-white px-4 py-3 rounded-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar conserva'}
          </button>

        </form>
      </main>
    </div>
  );
}
