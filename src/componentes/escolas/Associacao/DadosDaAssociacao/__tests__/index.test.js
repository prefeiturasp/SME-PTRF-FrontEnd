import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import DadosDaAsssociacao from '../index';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  getAssociacao, 
  alterarAssociacao, 
  getStatusCadastroAssociacao 
} from '../../../../../services/escolas/Associacao.service';
import { visoesService } from '../../../../../services/visoes.service';
import { toastCustom } from '../../../../Globais/ToastCustom';

// Mock all external dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('../../../../../services/escolas/Associacao.service', () => ({
  getAssociacao: jest.fn(),
  alterarAssociacao: jest.fn(),
  getStatusCadastroAssociacao: jest.fn(),
}));

jest.mock('../../../../Globais/MenuInterno', () => () => <div>MenuInterno</div>);
jest.mock('../../ExportaDadosAssociacao', () => () => <div>ExportaDados</div>);
jest.mock('../../../../../utils/Modais', () => ({
  CancelarModalAssociacao: ({ show, handleClose, onCancelarTrue }) => 
    show ? <div>
      <button onClick={handleClose}>Fechar Modal</button>
      <button onClick={onCancelarTrue}>Confirmar Cancelamento</button>
    </div> : null
}));

jest.mock('../../../../../services/visoes.service', () => ({
  visoesService: {
    getPermissoes: jest.fn(),
  },
}));

jest.mock('../../../../Globais/ToastCustom', () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
  },
}));

describe('DadosDaAsssociacao', () => {
  const mockDispatch = jest.fn();
  const mockAssociacao = {
    nome: 'Test Association',
    codigo_eol: '123456',
    cnpj: '11.111.111/0001-11',
    presidente_associacao_nome: 'Test President',
    presidente_associacao_rf: '1234567',
    presidente_conselho_fiscal_nome: 'Test Fiscal',
    presidente_conselho_fiscal_rf: '7654321',
    ccm: '1.234.567-8',
    email: 'test@example.com',
    unidade: {
      codigo_eol: '123456',
      dre: {
        nome: 'Test DRE'
      },
      email: 'unidade@test.com'
    },
    data_de_encerramento: {
      pode_editar_dados_associacao_encerrada: true
    }
  };

  beforeEach(() => {
    useLocation.mockReturnValue({ pathname: '/dados-da-associacao' });
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation(selector => 
      selector({
        DadosAssociacao: {
          pendencia_cadastro: false,
          pendencia_membros: false,
          pendencia_contas: false
        }
      })
    );
    getAssociacao.mockResolvedValue(mockAssociacao);
    getStatusCadastroAssociacao.mockResolvedValue({
      pendencia_cadastro: false,
      pendencia_membros: false,
      pendencia_contas: false
    });
    visoesService.getPermissoes.mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', async () => {
    render(<DadosDaAsssociacao />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() => expect(getAssociacao).toHaveBeenCalled());
  });

  test('renders association data after loading', async () => {
    await act(async () => {
      render(<DadosDaAsssociacao />);
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Association')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123456')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test DRE')).toBeInTheDocument();
      expect(screen.getByDisplayValue('11.111.111/0001-11')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1.234.567-8')).toBeInTheDocument();
      expect(screen.getByDisplayValue('unidade@test.com')).toBeInTheDocument();
    });
  });

  test('renders MenuInterno and ExportaDados components', async () => {
    await act(async () => {
      render(<DadosDaAsssociacao />);
    });

    expect(screen.getByText('MenuInterno')).toBeInTheDocument();
    expect(screen.getByText('ExportaDados')).toBeInTheDocument();
  });

  test('validates form fields', async () => {
    await act(async () => {
      render(<DadosDaAsssociacao />);
    });

    const nomeInput = await screen.findByDisplayValue('Test Association');
    fireEvent.change(nomeInput, { target: { value: '' } });
    fireEvent.blur(nomeInput);

    const submitButton = screen.getByText('Salvar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    });
  });

  test('submits form successfully', async () => {
    alterarAssociacao.mockResolvedValue({ status: 200 });

    await act(async () => {
      render(<DadosDaAsssociacao />);
    });

    const submitButton = screen.getByText('Salvar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(alterarAssociacao).toHaveBeenCalledWith({
        nome: 'Test Association',
        presidente_associacao_nome: 'Test President',
        presidente_associacao_rf: '',
        presidente_conselho_fiscal_nome: 'Test Fiscal',
        presidente_conselho_fiscal_rf: '',
        ccm: '1.234.567-8',
        email: 'test@example.com'
      });
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
        'Edição salva',
        'A edição foi salva com sucesso!'
      );
    });
  });

  test('handles cancel modal', async () => {
    await act(async () => {
      render(<DadosDaAsssociacao />);
    });

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(screen.getByText('Fechar Modal')).toBeInTheDocument();
    
    const closeButton = screen.getByText('Fechar Modal');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Fechar Modal')).not.toBeInTheDocument();
    });
  });

  test('does not show action buttons without edit permission', async () => {
    visoesService.getPermissoes.mockReturnValue(false);

    await act(async () => {
      render(<DadosDaAsssociacao />);
    });

    expect(screen.queryByText('Cancelar')).not.toBeInTheDocument();
    expect(screen.queryByText('Salvar')).not.toBeInTheDocument();
  });

  test('handles API errors', async () => {
    alterarAssociacao.mockRejectedValue(new Error('API Error'));

    await act(async () => {
      render(<DadosDaAsssociacao />);
    });

    const submitButton = screen.getByText('Salvar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(alterarAssociacao).toHaveBeenCalled();
    });
  });
});