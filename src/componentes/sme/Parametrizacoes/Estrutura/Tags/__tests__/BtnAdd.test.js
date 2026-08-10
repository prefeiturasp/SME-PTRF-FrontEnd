import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BtnAddTags } from '../components/BtnAddTags';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from '../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes';

// Mock do utilitário de verificação de permissão
jest.mock('../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes');

describe('Componente <BtnAddTags />', () => {
  // Mock das props recebidas pelo componente
  const mockSetShowModalForm = jest.fn();
  const mockSetStateFormModal = jest.fn();
  const mockInitialState = { open: false, nome: '' };
  
  // Componente Dummy para simular o FontAwesomeIcon
  const MockFontAwesomeIcon = (props) => <span data-testid="icon-mock" {...props} />;
  const mockFaPlus = { iconName: 'plus' };

  const defaultProps = {
    FontAwesomeIcon: MockFontAwesomeIcon,
    faPlus: mockFaPlus,
    setShowModalForm: mockSetShowModalForm,
    initialStateFormModal: mockInitialState,
    setStateFormModal: mockSetStateFormModal,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o botão habilitado quando o usuário possui permissão', () => {
    // Permissão concedida
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(<BtnAddTags {...defaultProps} />);

    const botao = screen.getByRole('button', { name: /adicionar etiqueta\/tag/i });
    expect(botao).toBeInTheDocument();
    expect(botao).toBeEnabled();
    expect(screen.getByTestId('icon-mock')).toBeInTheDocument();
  });

  it('deve chamar as funções de estado ao clicar no botão habilitado', async () => {
    const user = userEvent.setup();
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(<BtnAddTags {...defaultProps} />);

    const botao = screen.getByRole('button', { name: /adicionar etiqueta\/tag/i });
    await user.click(botao);

    // Valida se o estado foi resetado com o valor inicial
    expect(mockSetStateFormModal).toHaveBeenCalledTimes(1);
    expect(mockSetStateFormModal).toHaveBeenCalledWith(mockInitialState);

    // Valida se o modal foi configurado para abrir (true)
    expect(mockSetShowModalForm).toHaveBeenCalledTimes(1);
    expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
  });

  it('deve renderizar o botão desabilitado quando o usuário NÃO possui permissão', () => {
    // Permissão negada
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(<BtnAddTags {...defaultProps} />);

    const botao = screen.getByRole('button', { name: /adicionar etiqueta\/tag/i });
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  it('não deve acionar as funções de estado ao tentar clicar com o botão desabilitado', async () => {
    const user = userEvent.setup();
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(<BtnAddTags {...defaultProps} />);

    const botao = screen.getByRole('button', { name: /adicionar etiqueta\/tag/i });
    
    // Tenta clicar no botão desabilitado
    await user.click(botao);

    expect(mockSetStateFormModal).not.toHaveBeenCalled();
    expect(mockSetShowModalForm).not.toHaveBeenCalled();
  });
});