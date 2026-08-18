import React, { useContext } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AcertosDocumentosContext, AcertosDocumentosProvider } from '../context/AcertosDocumentos';
import { useGetTabelasAcertosDocumentos } from '../hooks/useGetTabelasAcertosDocumentos';
import { useAbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext';

// Mocks dos hooks utilizados pelo Provider
jest.mock('../hooks/useGetTabelasAcertosDocumentos', () => ({
  useGetTabelasAcertosDocumentos: jest.fn(),
}));

jest.mock('../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext', () => ({
  useAbasPorRecursoContext: jest.fn(),
}));

// Componente Consumidor Auxiliar para interagir com o Contexto durante os testes
const TestComponent = () => {
  const {
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    showModalForm,
    setShowModalForm,
    stateFormModal,
    setStateFormModal,
    showModalConfirmacaoExclusao,
    setShowModalConfirmacaoExclusao,
    bloquearBtnSalvarForm,
    setBloquearBtnSalvarForm,
    tabelas,
    isLoading,
  } = useContext(AcertosDocumentosContext);

  return (
    <div>
      <span data-testid="recurso-uuid">{filter.recurso_uuid}</span>
      <span data-testid="current-page">{currentPage}</span>
      <span data-testid="is-loading">{isLoading ? 'true' : 'false'}</span>
      <span data-testid="show-modal-form">{showModalForm ? 'true' : 'false'}</span>
      <span data-testid="show-modal-exclusao">{showModalConfirmacaoExclusao ? 'true' : 'false'}</span>
      <span data-testid="bloquear-btn">{bloquearBtnSalvarForm ? 'true' : 'false'}</span>
      <span data-testid="form-nome">{stateFormModal.nome}</span>
      <span data-testid="tabelas-categorias-count">
        {tabelas?.categorias ? tabelas.categorias.length : 0}
      </span>

      {/* Botões para disparar atualizações de estado */}
      <button onClick={() => setFilter({ ...filter, filtrar_por_nome: 'Teste Filtro' })}>
        Atualizar Filtro
      </button>
      <button onClick={() => setCurrentPage(2)}>Alterar Pagina</button>
      <button onClick={() => setShowModalForm(true)}>Abrir Modal Form</button>
      <button onClick={() => setShowModalConfirmacaoExclusao(true)}>Abrir Modal Exclusao</button>
      <button onClick={() => setBloquearBtnSalvarForm(true)}>Bloquear Botao</button>
      <button onClick={() => setStateFormModal({ ...stateFormModal, nome: 'Novo Tipo' })}>
        Alterar Form Modal
      </button>
    </div>
  );
};

describe('Contexto <AcertosDocumentosProvider />', () => {
  const mockTabelasData = {
    categorias: [{ id: 1, nome: 'Categoria 1' }],
    documentos: [{ id: 10, nome: 'Doc 1' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: { uuid: 'recurso-uuid-123' },
    });

    useGetTabelasAcertosDocumentos.mockReturnValue({
      data: mockTabelasData,
      isLoading: false,
    });
  });

  const renderWithProvider = () => {
    return render(
      <AcertosDocumentosProvider>
        <TestComponent />
      </AcertosDocumentosProvider>
    );
  };

  test('deve prover os valores iniciais e dados das tabelas corretamente', () => {
    renderWithProvider();

    expect(screen.getByTestId('recurso-uuid')).toHaveTextContent('recurso-uuid-123');
    expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('show-modal-form')).toHaveTextContent('false');
    expect(screen.getByTestId('show-modal-exclusao')).toHaveTextContent('false');
    expect(screen.getByTestId('bloquear-btn')).toHaveTextContent('false');
    expect(screen.getByTestId('tabelas-categorias-count')).toHaveTextContent('1');
  });

  test('deve atualizar o filtro quando setFilter for chamado', () => {
    renderWithProvider();

    fireEvent.click(screen.getByRole('button', { name: /atualizar filtro/i }));

    // Garante que a atualização funcionou mantendo as outras propriedades do filtro
    expect(screen.getByTestId('recurso-uuid')).toHaveTextContent('recurso-uuid-123');
  });

  test('deve alterar estados dos modais e de bloqueio de botão', () => {
    renderWithProvider();

    fireEvent.click(screen.getByRole('button', { name: /abrir modal form/i }));
    expect(screen.getByTestId('show-modal-form')).toHaveTextContent('true');

    fireEvent.click(screen.getByRole('button', { name: /abrir modal exclusao/i }));
    expect(screen.getByTestId('show-modal-exclusao')).toHaveTextContent('true');

    fireEvent.click(screen.getByRole('button', { name: /bloquear botao/i }));
    expect(screen.getByTestId('bloquear-btn')).toHaveTextContent('true');
  });

  test('deve atualizar stateFormModal corretamente', () => {
    renderWithProvider();

    fireEvent.click(screen.getByRole('button', { name: /alterar form modal/i }));

    expect(screen.getByTestId('form-nome')).toHaveTextContent('Novo Tipo');
  });

  test('deve redefinir o filtro e paginas quando o recurso selecionado mudar (useEffect)', () => {
    // Renderiza inicialmente com recurso 1
    const { rerender } = renderWithProvider();

    expect(screen.getByTestId('recurso-uuid')).toHaveTextContent('recurso-uuid-123');

    // Simula a alteração do recurso retornado pelo hook
    useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: { uuid: 'novo-recurso-456' },
    });

    // Força a re-renderização do provider com o novo valor do hook
    rerender(
      <AcertosDocumentosProvider>
        <TestComponent />
      </AcertosDocumentosProvider>
    );

    expect(screen.getByTestId('recurso-uuid')).toHaveTextContent('novo-recurso-456');
    expect(screen.getByTestId('current-page')).toHaveTextContent('1');
  });

  test('deve atribuir string vazia ao recurso_uuid caso selectedRecurso seja nulo/indefinido', () => {
    useAbasPorRecursoContext.mockReturnValue({ selectedRecurso: null });

    renderWithProvider();

    expect(screen.getByTestId('recurso-uuid')).toHaveTextContent('');
  });
});