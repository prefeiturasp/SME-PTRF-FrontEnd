import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FormFiltros } from '../FormFiltros';
import { useGetAcoesAssociacao } from '../../ReceitasPrevistas/hooks/useGetAcoesAssociacao';
import { useGetAcoesPDDE } from '../hooks/useGetAcoesPDDE';
import { useGetEspecificacoes } from '../hooks/useGetEspecificacoes';
import { useGetPrioridades } from '../hooks/useGetPrioridades';

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

jest.mock('../hooks/useGetPrioridades', () => ({
  useGetPrioridades: jest.fn(),
}));

const mockProps = {
  recursos: [
    { key: 'PTRF', value: 'PTRF' },
    { key: 'PDDE', value: 'PDDE' },
    { key: 'RECURSO_PROPRIO', value: 'Recurso Próprio' }
  ],
  prioridadesTabelas: [
    { key: 1, value: 'Sim' },
    { key: 0, value: 'Não' }
  ],
  tipos_aplicacao: [
    { key: 'CUSTEIO', value: 'Custeio' },
    { key: 'CAPITAL', value: 'Capital' }
  ],
  tipos_despesa_custeio: [
    { id: 1, nome: 'Tipo 1' },
    { id: 2, nome: 'Tipo 2' }
  ],
  onFiltrar: jest.fn(),
  onFiltrosChange: jest.fn(),
  onLimparFiltros: jest.fn(),
};

const mockAcoesAssociacao = [
  { uuid: 'uuid1', acao: { nome: 'Ação PTRF 1' } },
  { uuid: 'uuid2', acao: { nome: 'Ação PTRF 2' } }
];

const mockAcoesPDDE = {
  results: [
    { uuid: 'uuid3', nome: 'Ação PDDE 1', programa_objeto: { uuid: 'prog1', nome: 'Programa 1' } },
    { uuid: 'uuid4', nome: 'Ação PDDE 2', programa_objeto: { uuid: 'prog2', nome: 'Programa 2' } }
  ]
};

const mockEspecificacoes = [
  { uuid: 'esp1', descricao: 'Especificação 1' },
  { uuid: 'esp2', descricao: 'Especificação 2' }
];

const mockPrioridades = [
  { uuid: 'pri1', descricao: 'Prioridade 1' },
  { uuid: 'pri2', descricao: 'Prioridade 2' }
];

const renderWithQueryClient = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('FormFiltros', () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));
    
    // Configurar onFiltrar com console.log
    mockProps.onFiltrar.mockImplementation((filtros) => {
      console.log('onFiltrar chamado com filtros:', filtros);
    });
    
    // Mock dos hooks
    useGetAcoesAssociacao.mockReturnValue({
      data: mockAcoesAssociacao,
      isLoading: false,
      isError: false,
    });

    useGetAcoesPDDE.mockReturnValue({
      acoesPdde: mockAcoesPDDE,
      isLoading: false,
      isError: false,
    });

    useGetEspecificacoes.mockReturnValue({
      especificacoes: mockEspecificacoes,
      isLoading: false,
      isError: false,
    });

    useGetPrioridades.mockReturnValue({
      prioridades: mockPrioridades,
      isLoading: false,
      isError: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o formulário com campo de recurso visível', () => {
    renderWithQueryClient(<FormFiltros {...mockProps} />);
    
    expect(screen.getByLabelText('Filtrar por recurso')).toBeInTheDocument();
    expect(screen.getByText('Mais Filtros')).toBeInTheDocument();
  });

  it('expande o formulário ao clicar em "Mais Filtros"', async () => {
    renderWithQueryClient(<FormFiltros {...mockProps} />);
    
    const maisFiltrosButton = screen.getByText('Mais Filtros');
    fireEvent.click(maisFiltrosButton);
    
    await waitFor(() => {
      expect(screen.getByText('Menos Filtros')).toBeInTheDocument();
      expect(screen.getByText('Limpar Filtros')).toBeInTheDocument();
      expect(screen.getByText('Filtrar')).toBeInTheDocument();
    });
  });

  it('seleciona tipo de aplicação CUSTEIO e habilita tipo de despesa', async () => {
    renderWithQueryClient(<FormFiltros {...mockProps} />);
    
    fireEvent.click(screen.getByText('Mais Filtros'));
    
    const tipoAplicacaoSelect = screen.getByLabelText('Filtrar por tipo de aplicação');
    fireEvent.mouseDown(tipoAplicacaoSelect);
    fireEvent.click(screen.getByText('Custeio'));
    
    await waitFor(() => {
      const tipoDespesaSelect = screen.getByLabelText('Filtrar por tipo de despesa');
      expect(tipoDespesaSelect).not.toBeDisabled();
    });
  });

  it('chama onFiltrosChange ao selecionar valores', async () => {
    renderWithQueryClient(<FormFiltros {...mockProps} />);
    
    fireEvent.click(screen.getByText('Mais Filtros'));
    
    const prioridadeSelect = screen.getByLabelText('Filtrar por prioridade');
    fireEvent.mouseDown(prioridadeSelect);
    fireEvent.click(screen.getByText('Sim'));
    
    expect(mockProps.onFiltrosChange).toHaveBeenCalledWith('prioridade', 1);
  });

  it('limpa filtros ao clicar em "Limpar Filtros"', async () => {
    renderWithQueryClient(<FormFiltros {...mockProps} />);
    
    // Expande o formulário
    fireEvent.click(screen.getByText('Mais Filtros'));
    
    // Clica em limpar filtros
    const limparButton = screen.getByText('Limpar Filtros');
    fireEvent.click(limparButton);
    
    expect(mockProps.onLimparFiltros).toHaveBeenCalled();
  });

  it('chama onFiltrar ao submeter o formulário', async () => {
    renderWithQueryClient(<FormFiltros {...mockProps} />);
  
    const filtrarButton = screen.getByText('Filtrar');
    fireEvent.click(filtrarButton);
    
    await waitFor(() => {
      expect(mockProps.onFiltrar).toHaveBeenCalled();
    });
  });

  it('mostra loading nos campos quando hooks estão carregando', async () => {
    useGetAcoesAssociacao.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    });

    renderWithQueryClient(<FormFiltros {...mockProps} />);
    
    // Expande o formulário
    fireEvent.click(screen.getByText('Mais Filtros'));
    
    // Seleciona PTRF para mostrar campo de ação
    const recursoSelect = screen.getByLabelText('Filtrar por recurso');
    fireEvent.mouseDown(recursoSelect);
    await waitFor(() => {
        const allPtrfElements = screen.getAllByText('PTRF');
        const ptrfOptionElement = allPtrfElements.find(el => 
            el.classList.contains('ant-select-item-option-content')
        );
        fireEvent.click(ptrfOptionElement);
    });
    
    // Verifica se o campo de ação está em loading
    const programaSelect = screen.getByLabelText('Filtrar por programa');
    expect(programaSelect).toBeDisabled();
  });

  it('filtra ações PDDE por programa selecionado', async () => {
    renderWithQueryClient(<FormFiltros {...mockProps} />);
    
    // Expande o formulário
    fireEvent.click(screen.getByText('Mais Filtros'));
    
    // Seleciona PDDE
    const recursoSelect = screen.getByLabelText('Filtrar por recurso');
    fireEvent.mouseDown(recursoSelect);
    await waitFor(() => {
        const allPddeElements = screen.getAllByText('PDDE');
        const pddeOptionElement = allPddeElements.find(el => 
            el.classList.contains('ant-select-item-option-content')
        );
        fireEvent.click(pddeOptionElement);
    });
    
    const programaSelect = screen.getByLabelText('Filtrar por programa');
    fireEvent.mouseDown(programaSelect);
    await waitFor(() => {
        const allProgramaElements = screen.getAllByText('Programa 1');
        const programaOptionElement = allProgramaElements.find(el => 
            el.classList.contains('ant-select-item-option-content')
        );
        fireEvent.click(programaOptionElement);
    });

    const acaoPddeSelect = screen.getByLabelText('Filtrar por ação');
    fireEvent.mouseDown(acaoPddeSelect);
    await waitFor(() => {
        const allAcaoPddeElements = screen.getAllByText('Ação PDDE 1');
        const acaoPddeOptionElement = allAcaoPddeElements.find(el => 
            el.classList.contains('ant-select-item-option-content')
        );
        fireEvent.click(acaoPddeOptionElement);
    });

    const tipoAplicacaoSelect = screen.getByLabelText('Filtrar por tipo de aplicação');
    fireEvent.mouseDown(tipoAplicacaoSelect);
    await waitFor(() => {
        const allTipoAplicacaoElements = screen.getAllByText('Custeio');
        const tipoAplicacaoOptionElement = allTipoAplicacaoElements.find(el => 
            el.classList.contains('ant-select-item-option-content')
        );
        fireEvent.click(tipoAplicacaoOptionElement);
    });

    const tipoDespesaSelect = screen.getByLabelText('Filtrar por tipo de despesa');
    fireEvent.mouseDown(tipoDespesaSelect);
    await waitFor(() => {
        const allTipoDespesaElements = screen.getAllByText('Tipo 1');
        const tipoDespesaOptionElement = allTipoDespesaElements.find(el => 
            el.classList.contains('ant-select-item-option-content')
        );
        fireEvent.click(tipoDespesaOptionElement);
    });
  });
}); 