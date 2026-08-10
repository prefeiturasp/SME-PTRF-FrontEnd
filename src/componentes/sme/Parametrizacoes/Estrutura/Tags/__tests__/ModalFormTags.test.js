import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalFormTags from '../components/ModalFormTags';

// Importação dos hooks para mockar seus retornos
import { useTagsContext } from '../hooks/useTagsContext';
import { useRecursoSelecionadoContext } from '../../../../../../context/RecursoSelecionado';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from '../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes';

// Mocks dos Contextos e Utilitários
jest.mock('../hooks/useTagsContext');
jest.mock('../../../../../../context/RecursoSelecionado', () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));
jest.mock('../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes');

// Mock do ModalBootstrap para renderizar o conteúdo diretamente no DOM do teste
jest.mock('../../../../../Globais/ModalBootstrap', () => ({
  ModalFormBodyText: ({ show, titulo, bodyText }) =>
    show ? (
      <div data-testid="modal-container">
        <h1>{titulo}</h1>
        {bodyText}
      </div>
    ) : null,
}));

describe('Componente <ModalFormTags />', () => {
  // Mocks das funções do contexto
  const mockHandleClose = jest.fn();
  const mockHandleSubmitFormModal = jest.fn();
  const mockSetShowModalConfirmDeleteTag = jest.fn();

  const mockRecursos = [
    { uuid: 'rec-123', nome: 'Recurso 1' },
    { uuid: 'rec-456', nome: 'Recurso 2' },
  ];

  const defaultModalState = {
    open: true,
    uuid: '',
    id: '',
    nome: '',
    status: 'ATIVO',
    operacao: 'create',
    recurso: { uuid: 'rec-123' },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Retornos padrão dos mocks
    useTagsContext.mockReturnValue({
      modalForm: defaultModalState,
      handleClose: mockHandleClose,
      handleSubmitFormModal: mockHandleSubmitFormModal,
      setShowModalConfirmDeleteTag: mockSetShowModalConfirmDeleteTag,
    });

    useRecursoSelecionadoContext.mockReturnValue({
      recursos: mockRecursos,
    });

    // Permissão concedida por padrão
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  it('não deve renderizar o modal quando modalForm.open for false', () => {
    useTagsContext.mockReturnValue({
      ...useTagsContext(),
      modalForm: { ...defaultModalState, open: false },
    });

    render(<ModalFormTags />);

    expect(screen.queryByTestId('modal-container')).not.toBeInTheDocument();
  });

  it('deve renderizar o título correto e as opções do recurso em modo de criação', () => {
    render(<ModalFormTags />);

    expect(screen.getByRole('heading', { level: 1, name: /adicionar etiqueta\/tag/i })).toBeInTheDocument();
    
    // Verifica se as opções do recurso vindas do useAbasPorRecursoContext foram renderizadas
    expect(screen.getByText('Recurso 1')).toBeInTheDocument();
    expect(screen.getByText('Recurso 2')).toBeInTheDocument();
  });

  it('deve renderizar o título correto e o botão excluir em modo de edição', () => {
    useTagsContext.mockReturnValue({
      ...useTagsContext(),
      modalForm: {
        ...defaultModalState,
        uuid: 'tag-123',
        id: '99',
        operacao: 'edit',
        status: 'ATIVO',
        nome: 'Tag Teste',
      },
    });

    render(<ModalFormTags />);

    expect(screen.getByRole('heading', { level: 1, name: /editar etiqueta\/tag/i })).toBeInTheDocument();
    expect(screen.getByText('ID: 99')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /excluir/i })).toBeInTheDocument();
  });

  it('deve desabilitar campos de entrada quando não houver permissão de edição', () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(<ModalFormTags />);

    expect(screen.getByLabelText(/nome \*/i)).toBeDisabled();
    expect(screen.getByLabelText(/status \*/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeDisabled();
  });

  it('deve chamar handleClose ao clicar no botão Cancelar', async () => {
    const user = userEvent.setup();
    render(<ModalFormTags />);

    const btnCancelar = screen.getByRole('button', { name: /cancelar/i });
    await user.click(btnCancelar);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it('deve disparar setShowModalConfirmDeleteTag ao clicar no botão Excluir', async () => {
    const user = userEvent.setup();

    useTagsContext.mockReturnValue({
      ...useTagsContext(),
      modalForm: {
        ...defaultModalState,
        uuid: 'tag-abc-123',
        operacao: 'edit',
      },
    });

    render(<ModalFormTags />);

    const btnExcluir = screen.getByRole('button', { name: /excluir/i });
    await user.click(btnExcluir);

    expect(mockSetShowModalConfirmDeleteTag).toHaveBeenCalledWith({
      open: true,
      tag_uuid: 'tag-abc-123',
    });
  });

  it('deve submeter o formulário chamando handleSubmitFormModal com os dados preenchidos', async () => {
    const user = userEvent.setup();
    render(<ModalFormTags />);

    const inputNome = screen.getByLabelText(/nome \*/i);
    const selectStatus = screen.getByLabelText(/status \*/i);
    const btnSalvar = screen.getByRole('button', { name: /salvar/i });

    // Preenche os campos do formulário
    await user.clear(inputNome);
    await user.type(inputNome, 'Nova Tag Atualizada');
    await user.selectOptions(selectStatus, 'INATIVO');

    // Submete o formulário
    await user.click(btnSalvar);

    // Formik dispara a submissão assincronamente
    await waitFor(() => {
      expect(mockHandleSubmitFormModal).toHaveBeenCalledTimes(1);
    });
  });
});