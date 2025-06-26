import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DevolucaoAoTesouroAjuste } from '../index';
import { useLocation, useNavigate, MemoryRouter } from 'react-router-dom';
import { marcarDevolucaoTesouro, desmarcarDevolucaoTesouro, getSalvarDevoulucoesAoTesouro, deleteDevolucaoAoTesouro } from '../../../../services/dres/PrestacaoDeContas.service.js';
import { toastCustom } from "../../ToastCustom";
import moment from 'moment';

// Mock the required modules
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn()
}));

jest.mock('../../../../services/dres/PrestacaoDeContas.service.js');
jest.mock("../../ToastCustom");

describe('DevolucaoAoTesouroAjuste Component', () => {
  const mockHistoryPush = jest.fn();
  const mockState = {
    origem: '/origem',
    uuid_pc: 'uuid-pc-123',
    uuid_despesa: 'uuid-despesa-123',
    tem_permissao_de_edicao: true,
    analise_lancamento: {
      acertos: [{
        devolucao_ao_tesouro: {
          uuid_registro_devolucao: 'uuid-devolucao-123',
          data: '2024-03-20',
          devolucao_total: true,
          motivo: 'Motivo teste',
          valor: '100.00',
          tipo: { uuid: 'tipo-uuid-123' },
          visao_criacao: 'visao-teste',
          despesa: {
            uuid: 'uuid-despesa-123',
            nome_fornecedor: 'Fornecedor Teste',
            cpf_cnpj_fornecedor: '12345678901',
            tipo_documento: { nome: 'Nota Fiscal' },
            numero_documento: '123456',
            data_documento: '2024-03-19'
          }
        }
      }]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useLocation.mockReturnValue({ state: mockState });
    useNavigate.mockReturnValue({ push: mockHistoryPush });
  });

  it('renders component with initial data', () => {
    render(
      <MemoryRouter>
        <DevolucaoAoTesouroAjuste />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Devolução ao tesouro')).toBeInTheDocument();
    expect(screen.getByText('Fornecedor Teste')).toBeInTheDocument();
    expect(screen.getByText('12345678901')).toBeInTheDocument();
    expect(screen.getByText('Nota Fiscal')).toBeInTheDocument();
    expect(screen.getByText('123456')).toBeInTheDocument();
  });

  it('handles date change correctly', async () => {
    render(
      <MemoryRouter>
        <DevolucaoAoTesouroAjuste />
      </MemoryRouter>
    );
    
    const dateInput = screen.getByPlaceholderText('dd/mm/aaaa');
    fireEvent.change(dateInput, { target: { value: '21/03/2024' } });
    
    expect(dateInput.value).toBe('21/03/2024');
  });

  it('handles save button click correctly', async () => {
    getSalvarDevoulucoesAoTesouro.mockResolvedValue({});
    marcarDevolucaoTesouro.mockResolvedValue({});

    render(
      <MemoryRouter>
        <DevolucaoAoTesouroAjuste />
      </MemoryRouter>
    );
    
    const saveButton = screen.getByText('Salvar');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(getSalvarDevoulucoesAoTesouro).toHaveBeenCalled();
      expect(marcarDevolucaoTesouro).toHaveBeenCalled();
      expect(mockHistoryPush).toHaveBeenCalledWith(`${mockState.origem}/${mockState.uuid_pc}`);
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith('Data de devolução ao tesouro alterada com sucesso.');
    });
  });

  it('handles delete devolucao tesouro correctly', async () => {
    deleteDevolucaoAoTesouro.mockResolvedValue({});
    desmarcarDevolucaoTesouro.mockResolvedValue({});

    render(
      <MemoryRouter>
        <DevolucaoAoTesouroAjuste />
      </MemoryRouter>
    );
    
    const deleteButton = screen.getByText('Desfazer dev. tesouro');
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByText('Confirmar');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteDevolucaoAoTesouro).toHaveBeenCalled();
      expect(desmarcarDevolucaoTesouro).toHaveBeenCalled();
      expect(mockHistoryPush).toHaveBeenCalledWith(`${mockState.origem}/${mockState.uuid_pc}`);
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith('Devolução ao tesouro removida com sucesso.');
    });
  });

  it('handles cancel button click correctly', () => {
    render(
      <MemoryRouter>
        <DevolucaoAoTesouroAjuste />
      </MemoryRouter>
    );
    
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockHistoryPush).toHaveBeenCalledWith(`${mockState.origem}/${mockState.uuid_pc}#tabela-acertos-lancamentos`);
  });

  it('disables buttons when user does not have edit permission', () => {
    const mockStateWithoutPermission = {
      ...mockState,
      tem_permissao_de_edicao: false
    };
    useLocation.mockReturnValue({ state: mockStateWithoutPermission });

    render(
      <MemoryRouter>
        <DevolucaoAoTesouroAjuste />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Salvar')).toBeDisabled();
    expect(screen.getByText('Desfazer dev. tesouro')).toBeDisabled();
  });

});