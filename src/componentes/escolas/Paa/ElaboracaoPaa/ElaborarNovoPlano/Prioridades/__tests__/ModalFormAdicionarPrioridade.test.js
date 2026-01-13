import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModalFormAdicionarPrioridade from '../ModalFormAdicionarPrioridade';
import { useGetAcoesAssociacao } from '../../ReceitasPrevistas/hooks/useGetAcoesAssociacao';
import { useGetAcoesPDDE } from '../hooks/useGetAcoesPDDE';
import { useGetEspecificacoes } from '../hooks/useGetEspecificacoes';
import { usePostPrioridade } from '../hooks/usePostPrioridade';
import { usePatchPrioridade } from '../hooks/usePatchPrioridade';

jest.setTimeout(30000);

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

jest.mock('../hooks/usePatchPrioridade', () => ({
  usePatchPrioridade: jest.fn(),
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
        { key: 'RECURSO_PROPRIO', value: 'Recursos Próprios' },
        { key: 'UUID-premio', value: 'Prêmio de Excelência' },
      ],
      tipos_aplicacao: [
        { key: 'CUSTEIO', value: 'Custeio' },
        { key: 'CAPITAL', value: 'Capital' },
      ],
      tipos_despesa_custeio: [
        { id: 1, nome: 'Tipo 1', uuid: 'uuid-1' },
        { id: 2, nome: 'Tipo 2', uuid: 'uuid-2' },
      ],
      outros_recursos: [
        { uuid: 'UUID-premio', nome: 'Prêmio de Excelência'},
      ]
    };

    // Mock do hook de ações da associação
    useGetAcoesAssociacao.mockReturnValue({
      data: [
        {
          uuid: 'acao-uuid-1',
          acao: { nome: 'Ação PTRF 1', exibir_paa: true }
        },
        {
          uuid: 'acao-uuid-2',
          acao: { nome: 'Ação PTRF 2', exibir_paa: true }
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

    // Mock do hook de patch
    usePatchPrioridade.mockReturnValue({
      mutationPatch: {
        mutate: jest.fn(),
        isLoading: false,
      },
    });

    localStorage.setItem("PAA", "paa-uuid");
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      open: true,
      tabelas: mockData,
      onClose: jest.fn(),
      ...props,
    };

    return render(
      <QueryClientProvider client={queryClient}>
        <ModalFormAdicionarPrioridade {...defaultProps} />
      </QueryClientProvider>
    );
  };

  describe('Renderização inicial', () => {
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
    it('deve chamar getAcoesAssociacoes quando recurso PTRF for selecionado', async () => {
      renderComponent();
      let acaoSelect = null;
      let antSelectTrigger = null;

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
        expect(screen.getByLabelText('Ação *')).toBeInTheDocument();
        expect(useGetAcoesAssociacao).toHaveBeenCalled();
      });
    });

    it('deve chamar getAcoesPDDE quando recurso PDDE for selecionado', async () => {
      renderComponent();
      let acaoSelect = null;
      let antSelectTrigger = null;

      const recursoSelect = screen.getByLabelText('Recurso *');
      antSelectTrigger = recursoSelect.closest('.ant-select').querySelector('.ant-select-selector');
      fireEvent.mouseDown(antSelectTrigger);

      await waitFor(() => {
        const allPddeElements = screen.getAllByText('PDDE');
        const pddeOptionElement = allPddeElements.find(el =>
          el.classList.contains('ant-select-item-option-content')
        );
        fireEvent.click(pddeOptionElement);
      });

      await waitFor(() => {
        acaoSelect = screen.getByLabelText('Programa *');
        antSelectTrigger = acaoSelect.closest('.ant-select').querySelector('.ant-select-selector');
        fireEvent.mouseDown(antSelectTrigger);
        const allAcoesElements = screen.getAllByText('Programa 1');
        const acaoOptionElement = allAcoesElements.find(el =>
          el.classList.contains('ant-select-item-option-content')
        );
        fireEvent.click(acaoOptionElement);
      });

      expect(useGetAcoesPDDE).toHaveBeenCalled();

    });

    it('deve criar prioridade PTRF', async () => {
      const mockMutate = jest.fn();
      usePostPrioridade.mockReturnValue({
        mutationPost: {
          mutate: mockMutate,
          isLoading: false,
        },
      });

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

      fireEvent.change(document.getElementById("valor_total"), { target: { value: 1001 } });

      fireEvent.submit(screen.getByRole("form"));

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
      });
    });

    it('deve criar prioridade OUTRO_RECURSO', async () => {
      const mockMutate = jest.fn();
      usePostPrioridade.mockReturnValue({
        mutationPost: {
          mutate: mockMutate,
          isLoading: false,
        },
      });

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
        const allElements = screen.getAllByText('Prêmio de Excelência');
        const ptrfOptionElement = allElements.find(el => 
          el.classList.contains('ant-select-item-option-content')
        );
        fireEvent.click(ptrfOptionElement);
      });

      const tipoAplicacaoSelect = screen.getByLabelText('Tipo de aplicação *');
      antSelectTrigger = tipoAplicacaoSelect.closest('.ant-select').querySelector('.ant-select-selector');
      fireEvent.mouseDown(antSelectTrigger);

      await waitFor(() => {
        const allTiposAplicacaoElements = screen.getAllByText('Capital');
        const tipoAplicacaoOptionElement = allTiposAplicacaoElements.find(el => 
          el.classList.contains('ant-select-item-option-content')
        );
        fireEvent.click(tipoAplicacaoOptionElement);
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

      fireEvent.change(document.getElementById("valor_total"), { target: { value: 1001 } });

      fireEvent.submit(screen.getByRole("form"));

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
      });
    });    

    it('deve chamar patch ao alterar um registro', async () => {
      const mockMutate = jest.fn();
      usePatchPrioridade.mockReturnValue({
        mutationPatch: {
          mutate: mockMutate,
          isLoading: false,
        },
      });

      const formModal = {
        uuid: 'uuid',
      };

      renderComponent({formModal});
      let acaoSelect = null;
      let antSelectTrigger = null;

      const prioridadeSelect = screen.getByLabelText('Prioridade *');
      expect(prioridadeSelect).toBeInTheDocument();

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

      fireEvent.change(document.getElementById("valor_total"), { target: { value: 1001 } });

      fireEvent.submit(screen.getByRole("form"));

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
      });
    });

  });

}); 