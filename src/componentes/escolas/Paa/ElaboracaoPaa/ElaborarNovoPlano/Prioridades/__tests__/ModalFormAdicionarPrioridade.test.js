import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModalFormAdicionarPrioridade from '../ModalFormAdicionarPrioridade';
import { useGetAcoesAssociacao } from '../../ReceitasPrevistas/hooks/useGetAcoesAssociacao';
import { useGetAcoesPDDE } from '../hooks/useGetAcoesPDDE';
import { useGetEspecificacoes } from '../hooks/useGetEspecificacoes';
import { usePostPrioridade } from '../hooks/usePostPrioridade';

// Mock dos hooks que fazem requests HTTP
jest.mock('../../ReceitasPrevistas/hooks/useGetAcoesAssociacao', () => ({
  useGetAcoesAssociacao: jest.fn(),
}));

jest.mock('../hooks/useGetAcoesPDDE', () => ({
  useGetAcoesPDDE: jest.fn(),
}));

jest.mock('../hooks/useGetEspecificacoes', () => ({
  useGetEspecificacoes: jest.fn(),
}));

jest.mock('../hooks/usePostPrioridade', () => ({
  usePostPrioridade: jest.fn(),
}));


// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock das funções de formatação de dinheiro
jest.mock('../../../../../../../utils/money', () => ({
  formatMoneyByCentsBRL: jest.fn((value) => `R$ ${value}`),
  parseMoneyBRL: jest.fn((value) => value),
}));

describe('ModalFormAdicionarPrioridade', () => {
  let queryClient;
  let mockData;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));

    mockData = {
      prioridades: [
        { key: 1, value: 'Sim' },
        { key: 2, value: 'Não' },
      ],
      recursos: [
        { key: 'PTRF', value: 'PTRF' },
        { key: 'PDDE', value: 'PDDE' },
        { key: 'recursos_proprios', value: 'Recursos Próprios' },
      ],
      tipos_aplicacao: [
        { key: 'CUSTEIO', value: 'Custeio' },
        { key: 'CAPITAL', value: 'Capital' },
      ],
      tipos_despesa_custeio: [
        { id: 1, nome: 'Tipo 1', uuid: 'uuid-1' },
        { id: 2, nome: 'Tipo 2', uuid: 'uuid-2' },
      ],
    };

    // Mock do hook de ações da associação
    useGetAcoesAssociacao.mockReturnValue({
      data: [
        {
          uuid: 'acao-uuid-1',
          acao: { nome: 'Ação PTRF 1' }
        },
        {
          uuid: 'acao-uuid-2',
          acao: { nome: 'Ação PTRF 2' }
        }
      ],
      isLoading: false,
      isError: false,
    });

    // Mock do hook de ações PDDE
    useGetAcoesPDDE.mockReturnValue({
      acoesPdde: {
        results: [
          {
            id: 1,
            uuid: 'pdde-uuid-1',
            nome: 'Ação PDDE 1',
            programa_objeto: {
              id: 1,
              uuid: 'prog-uuid-1',
              nome: 'Programa 1',
            },
          },
          {
            id: 2,
            uuid: 'pdde-uuid-2',
            nome: 'Ação PDDE 2',
            programa_objeto: {
              id: 2,
              uuid: 'prog-uuid-2',
              nome: 'Programa 2',
            },
          },
        ],
      },
      isLoading: false,
      isError: false,
    });

    // Mock do hook de especificações
    useGetEspecificacoes.mockReturnValue({
      especificacoes: [
        { uuid: 'esp-uuid-1', descricao: 'Especificação 1' },
        { uuid: 'esp-uuid-2', descricao: 'Especificação 2' },
      ],
      isLoading: false,
      isError: false,
    });

    // Mock do hook de post
    usePostPrioridade.mockReturnValue({
      mutationPost: {
        mutate: jest.fn(),
        isLoading: false,
      },
    });

    localStorageMock.getItem.mockReturnValue('PAA-123');
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      open: true,
      onClose: jest.fn(),
      data: mockData,
      ...props,
    };

    return render(
      <QueryClientProvider client={queryClient}>
        <ModalFormAdicionarPrioridade {...defaultProps} />
      </QueryClientProvider>
    );
  };

  describe.skip('Renderização inicial', () => {
    it('deve renderizar o modal quando open=true', () => {
      renderComponent();
      expect(screen.getByText('Adicionar nova prioridade')).toBeInTheDocument();
    });

    it('deve renderizar todos os campos obrigatórios', () => {
      renderComponent();
      
      expect(screen.getByLabelText('Prioridade *')).toBeInTheDocument();
      expect(screen.getByLabelText('Recurso *')).toBeInTheDocument();
      expect(screen.getByLabelText('Tipo de aplicação *')).toBeInTheDocument();
      expect(screen.getByLabelText('Especificação do Bem, Material ou Serviço *')).toBeInTheDocument();
      expect(screen.getByLabelText('Valor total *')).toBeInTheDocument();
    });
  });

  describe('Requests HTTP mockados', () => {
    it.skip('deve chamar getAcoesAssociacao quando recurso PTRF for selecionado', async () => {
      renderComponent();
      const recursoSelect = screen.getByLabelText('Recurso *');
      fireEvent.change(recursoSelect, { target: { value: 'PTRF' } });
      expect(useGetAcoesAssociacao).toHaveBeenCalledTimes(1);
    });

    it.skip('deve chamar getAcoesPDDE quando recurso PDDE for selecionado', async () => {
      renderComponent();
      const recursoSelect = screen.getByLabelText('Recurso *');
      fireEvent.change(recursoSelect, { target: { value: 'PDDE' } });
      expect(useGetAcoesPDDE).toHaveBeenCalledTimes(1);
    });

    it('deve criar prioridade com recurso PTRF', async () => {
      renderComponent();
      let acaoSelect = null;
      let antSelectTrigger = null;

      const prioridadeSelect = screen.getByLabelText('Prioridade *');
      antSelectTrigger = prioridadeSelect.closest('.ant-select').querySelector('.ant-select-selector');
      fireEvent.mouseDown(antSelectTrigger);

      await waitFor(() => {
        const allPrioridadesElements = screen.getAllByText('Sim');
        const prioridadeOptionElement = allPrioridadesElements.find(el => 
          el.classList.contains('ant-select-item-option-content')
        );
        fireEvent.click(prioridadeOptionElement);
      });

      const recursoSelect = screen.getByLabelText('Recurso *');
      antSelectTrigger = recursoSelect.closest('.ant-select').querySelector('.ant-select-selector');
      fireEvent.mouseDown(antSelectTrigger);

      await waitFor(() => {
        const allPtrfElements = screen.getAllByText('PTRF');
        const ptrfOptionElement = allPtrfElements.find(el => 
          el.classList.contains('ant-select-item-option-content')
        );
        fireEvent.click(ptrfOptionElement);
      });
      
      await waitFor(() => {
        acaoSelect = screen.getByLabelText('Ação *');
        antSelectTrigger = acaoSelect.closest('.ant-select').querySelector('.ant-select-selector');
        fireEvent.mouseDown(antSelectTrigger);
        const allAcoesElements = screen.getAllByText('Ação PTRF 1');
        const acaoOptionElement = allAcoesElements.find(el => 
          el.classList.contains('ant-select-item-option-content')
        );
        fireEvent.click(acaoOptionElement);
      });

      const tipoAplicacaoSelect = screen.getByLabelText('Tipo de aplicação *');
      antSelectTrigger = tipoAplicacaoSelect.closest('.ant-select').querySelector('.ant-select-selector');
      fireEvent.mouseDown(antSelectTrigger);

      await waitFor(() => {
        const allTiposAplicacaoElements = screen.getAllByText('Custeio');
        const tipoAplicacaoOptionElement = allTiposAplicacaoElements.find(el => 
          el.classList.contains('ant-select-item-option-content')
        );
        fireEvent.click(tipoAplicacaoOptionElement);
      });

      const tipoDespesaCusteioSelect = screen.getByLabelText('Tipo de despesa *');
      antSelectTrigger = tipoDespesaCusteioSelect.closest('.ant-select').querySelector('.ant-select-selector');
      fireEvent.mouseDown(antSelectTrigger);

      await waitFor(() => {
        const allTiposDespesaCusteioElements = screen.getAllByText('Tipo 1');
        const tipoDespesaCusteioOptionElement = allTiposDespesaCusteioElements.find(el => 
          el.classList.contains('ant-select-item-option-content')
        );
        fireEvent.click(tipoDespesaCusteioOptionElement);
      });
      
      const especificacaoMaterialInput = screen.getByLabelText('Especificação do Bem, Material ou Serviço *');
      antSelectTrigger = especificacaoMaterialInput.closest('.ant-select').querySelector('.ant-select-selector');
      fireEvent.mouseDown(antSelectTrigger);

      await waitFor(() => {
        const allEspecificacoesElements = screen.getAllByText('Especificação 1');
        const especificacaoOptionElement = allEspecificacoesElements.find(el => 
          el.classList.contains('ant-select-item-option-content')
        );
        fireEvent.click(especificacaoOptionElement);
      });

      const valorTotalInput = screen.getByLabelText('Valor total *');
      // const user = userEvent.setup();
      await userEvent.type(valorTotalInput, '100.00');
      // fireEvent.change(valorTotalInput, { target: { value: '100,11' } });
      console.log('valor_total');
      console.log(document.getElementById("valor_total").value);
      // fireEvent.change(document.getElementById("valor_total"), {
      //   target: { value: 10011 },
      // });
      // fireEvent.change(document.getElementById("valor_total"), {
      //   target: { value: 100 },
      // });
      // fireEvent.change(document.getElementById("valor_total"), {
      //   target: { 'aria-valuenow': "100,11" },
      // });
      // fireEvent.change(document.getElementById("valor_total"), {
      //   target: { value: "100.11" },
      // });
      // await waitFor(() => {
      //   const especificacaoMaterialInput = screen.getByLabelText('Especificação do Bem, Material ou Serviço *');
      //   fireEvent.change(especificacaoMaterialInput, { target: { value: 'esp-uuid-1' } });
      // });

      // const valorTotalInput = screen.getByLabelText('Valor total *');
      // fireEvent.change(valorTotalInput, { target: { value: '10000' } });

      const submitButton = screen.getByText('Salvar');
      console.log(document.getElementById("valor_total").value);
      fireEvent.click(submitButton);
      console.log(screen.getByRole('form').innerHTML);
    });

    it.skip('deve mostrar programas PDDE retornados pelo hook', async () => {
      renderComponent();
      
      // Selecionar PDDE para carregar programas
      const recursoSelect = screen.getByLabelText('Recurso *');
      fireEvent.change(recursoSelect, { target: { value: 'PDDE' } });
      
      // Aguarda carregar e verifica se os programas aparecem
      await waitFor(() => {
        expect(screen.getByText('Programa *')).toBeInTheDocument();
      });
      
      // Abre o select de programa para ver as opções
      const programaSelect = screen.getByText('Selecione o programa').closest('.ant-select');
      fireEvent.mouseDown(programaSelect);
      
      await waitFor(() => {
        expect(screen.getByText('Programa 1')).toBeInTheDocument();
        expect(screen.getByText('Programa 2')).toBeInTheDocument();
      });
    });
  });

  describe.skip('Validação e submit', () => {
    it('deve mostrar erros quando submit com campos vazios', async () => {
      mockCreateValidationSchema.mockReturnValue({
        validate: jest.fn().mockRejectedValue({
          inner: [
            { path: 'prioridade', message: 'Prioridade é obrigatória' },
            { path: 'recurso', message: 'Recurso é obrigatório' },
          ],
        }),
      });

      renderComponent();
      
      const submitButton = screen.getByText('Salvar');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockCreateValidationSchema).toHaveBeenCalled();
      });
    });

    it('deve chamar mutation quando validação passar', async () => {
      const mockMutate = jest.fn();
      mockUsePostPrioridade.mockReturnValue({
        mutationPost: {
          mutate: mockMutate,
          isLoading: false,
        },
      });

      renderComponent();
      
      // Preencher campos obrigatórios
      const prioridadeSelect = screen.getByLabelText('Prioridade *');
      fireEvent.change(prioridadeSelect, { target: { value: '1' } });
      
      const recursoSelect = screen.getByLabelText('Recurso *');
      fireEvent.change(recursoSelect, { target: { value: 'PTRF' } });
      
      const tipoAplicacaoSelect = screen.getByLabelText('Tipo de aplicação *');
      fireEvent.change(tipoAplicacaoSelect, { target: { value: 'CUSTEIO' } });
      
      const submitButton = screen.getByText('Salvar');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
      });
    });
  });

  describe.skip('Interação com campos', () => {
    it('deve limpar campos relacionados quando recurso mudar', async () => {
      renderComponent();
      
      // Selecionar PTRF primeiro
      const recursoSelect = screen.getByLabelText('Recurso *');
      fireEvent.change(recursoSelect, { target: { value: 'PTRF' } });
      
      // Mudar para PDDE
      fireEvent.change(recursoSelect, { target: { value: 'PDDE' } });
      
      await waitFor(() => {
        expect(screen.queryByText('Ação *')).not.toBeInTheDocument();
        expect(screen.getByText('Programa *')).toBeInTheDocument();
      });
    });

    it('deve limpar especificação quando tipo de aplicação mudar', async () => {
      renderComponent();
      
      const tipoAplicacaoSelect = screen.getByLabelText('Tipo de aplicação *');
      fireEvent.change(tipoAplicacaoSelect, { target: { value: 'CUSTEIO' } });
      
      // Mudar para Capital
      fireEvent.change(tipoAplicacaoSelect, { target: { value: 'CAPITAL' } });
      
      await waitFor(() => {
        expect(screen.queryByText('Tipo de despesa *')).not.toBeInTheDocument();
      });
    });
  });

  describe.skip('Formatação de valores', () => {
    it('deve formatar valor_total corretamente no submit', async () => {
      const mockMutate = jest.fn();
      mockUsePostPrioridade.mockReturnValue({
        mutationPost: {
          mutate: mockMutate,
          isLoading: false,
        },
      });

      renderComponent();
      
      // Preencher campos obrigatórios
      const prioridadeSelect = screen.getByLabelText('Prioridade *');
      fireEvent.change(prioridadeSelect, { target: { value: '1' } });
      
      const recursoSelect = screen.getByLabelText('Recurso *');
      fireEvent.change(recursoSelect, { target: { value: 'PTRF' } });
      
      const tipoAplicacaoSelect = screen.getByLabelText('Tipo de aplicação *');
      fireEvent.change(tipoAplicacaoSelect, { target: { value: 'CUSTEIO' } });
      
      // Preencher valor total
      const valorInput = screen.getByPlaceholderText('00,00');
      fireEvent.change(valorInput, { target: { value: '10000' } });
      
      const submitButton = screen.getByText('Salvar');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          payload: expect.objectContaining({
            valor_total: 100, // 10000 / 100
          }),
        });
      });
    });
  });
}); 