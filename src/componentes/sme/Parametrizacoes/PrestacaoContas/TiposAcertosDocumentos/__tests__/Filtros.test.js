import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Filtros } from '../components/Filtros';
import { AcertosDocumentosContext } from '../context/AcertosDocumentos';
import { useAbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext';

// Mock do hook customizado useAbasPorRecursoContext
jest.mock('../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext');

describe('Componente <Filtros />', () => {
  const mockSetFilter = jest.fn();

  const mockSelectedRecurso = {
    uuid: 'recurso-123-uuid',
  };

  const mockTabelas = {
    categorias: [
      { id: 1, nome: 'Categoria A' },
      { id: 2, nome: 'Categoria B' },
    ],
    documentos: [
      { id: 10, nome: 'Documento 1' },
      { id: 20, nome: 'Documento 2' },
    ],
  };

  const defaultFilter = {
    filtrar_por_nome: 'Termo inicial',
    filtrar_por_categoria: [1],
    filtrar_por_ativo: 'True',
    filtrar_por_documento_relacionado: [10],
    recurso_uuid: 'recurso-123-uuid',
  };

  // Função utilitária para renderizar o componente envelopado pelo Context Provider
  const renderComponent = (customFilter = defaultFilter, customTabelas = mockTabelas) => {
    return render(
      <AcertosDocumentosContext.Provider
        value={{
          filter: customFilter,
          setFilter: mockSetFilter,
          tabelas: customTabelas,
        }}
      >
        <Filtros />
      </AcertosDocumentosContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: mockSelectedRecurso,
    });
  });

  test('deve renderizar os campos de filtro com os valores limpos pelo useEffect na montagem', () => {
  renderComponent();

  // O useEffect roda no mount e limpa o input de nome
  const inputNome = screen.getByLabelText(/filtrar por nome/i);
  expect(inputNome).toBeInTheDocument();
  expect(inputNome).toHaveValue(''); // O valor esperado atual é vazio

  // Select nativo de status (ativo/inativo)
  const selectStatus = screen.getByLabelText(/filtrar por status/i);
  expect(selectStatus).toBeInTheDocument();
  expect(selectStatus).toHaveValue(''); // Também é limpo no mount

  // Botões
  expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
});

  test('deve atualizar o estado local ao digitar no campo de nome', () => {
    renderComponent();

    const inputNome = screen.getByLabelText(/filtrar por nome/i);
    fireEvent.change(inputNome, { target: { value: 'Novo Termo' } });

    expect(inputNome).toHaveValue('Novo Termo');
  });

  test('deve atualizar o estado local ao alterar o select de status', () => {
    renderComponent();

    const selectStatus = screen.getByLabelText(/filtrar por status/i);
    fireEvent.change(selectStatus, { target: { value: 'False' } });

    expect(selectStatus).toHaveValue('False');
  });

  test('deve chamar setFilter com os novos dados ao clicar em "Filtrar"', () => {
    renderComponent();

    // Altera apenas o campo de nome
    const inputNome = screen.getByLabelText(/filtrar por nome/i);
    fireEvent.change(inputNome, { target: { value: 'Pesquisa Aplicada' } });

    const btnFiltrar = screen.getByRole('button', { name: /filtrar/i });
    fireEvent.click(btnFiltrar);

    expect(mockSetFilter).toHaveBeenCalledTimes(1);
    expect(mockSetFilter).toHaveBeenCalledWith({
      filtrar_por_nome: 'Pesquisa Aplicada',
      filtrar_por_categoria: [],
      filtrar_por_ativo: '',
      filtrar_por_documento_relacionado: [],
      page: 1,
      recurso_uuid: 'recurso-123-uuid',
    });
  });

  test('deve limpar os campos e chamar setFilter com valores zerados ao clicar em "Limpar"', () => {
    renderComponent();

    const btnLimpar = screen.getByRole('button', { name: /limpar/i });
    fireEvent.click(btnLimpar);

    const filtroLimpoEsperado = {
      filtrar_por_nome: '',
      filtrar_por_categoria: [],
      filtrar_por_ativo: '',
      filtrar_por_documento_relacionado: [],
      page: 1,
      recurso_uuid: 'recurso-123-uuid',
    };

    // Verifica chamada da função no contexto
    expect(mockSetFilter).toHaveBeenCalledWith(filtroLimpoEsperado);

    // Verifica se o input na tela foi limpo
    const inputNome = screen.getByLabelText(/filtrar por nome/i);
    expect(inputNome).toHaveValue('');
  });

  test('deve resetar o filtro temporário quando o recurso_uuid do filtro for alterado (useEffect)', () => {
    const { rerender } = renderComponent(defaultFilter);

    // Altera o recurso_uuid no contexto
    const updatedFilter = {
      ...defaultFilter,
      recurso_uuid: 'novo-recurso-456-uuid',
    };

    rerender(
      <AcertosDocumentosContext.Provider
        value={{
          filter: updatedFilter,
          setFilter: mockSetFilter,
          tabelas: mockTabelas,
        }}
      >
        <Filtros />
      </AcertosDocumentosContext.Provider>
    );

    // O useEffect deve resetar o campo nome para string vazia
    const inputNome = screen.getByLabelText(/filtrar por nome/i);
    expect(inputNome).toHaveValue('');
  });

  test('deve renderizar com sucesso mesmo se tabelas vierem indefinidas', () => {
    renderComponent(defaultFilter, null);

    expect(screen.getByLabelText(/filtrar por nome/i)).toBeInTheDocument();
  });
});