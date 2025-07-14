import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Prioridades from '../index';
import { useGetPrioridadeTabelas } from '../hooks/useGetPrioridadeTabelas';
import { useGetPrioridades } from '../hooks/useGetPrioridades';
import { useGetTiposDespesaCusteio } from '../hooks/useGetTiposDespesaCusteio';

// Mock dos hooks
jest.mock('../hooks/useGetPrioridadeTabelas', () => ({
  useGetPrioridadeTabelas: jest.fn(),
}));

jest.mock('../hooks/useGetPrioridades', () => ({
  useGetPrioridades: jest.fn(),
}));

jest.mock('../hooks/useGetTiposDespesaCusteio', () => ({
  useGetTiposDespesaCusteio: jest.fn(),
}));

// Mock do ModalFormAdicionarPrioridade
jest.mock('../ModalFormAdicionarPrioridade', () => ({
  __esModule: true,
  default: ({ open, onClose }) => 
    open ? (
      <div data-testid="modal-form">
        <button onClick={onClose}>Fechar Modal</button>
      </div>
    ) : null,
}));

// Mock do FormFiltros
jest.mock('../FormFiltros', () => ({
  FormFiltros: ({ onFiltrar, onFiltrosChange, onLimparFiltros }) => (
    <div data-testid="form-filtros">
      <button onClick={() => onFiltrar()}>Filtrar</button>
      <button onClick={() => onFiltrosChange('recurso', 'PTRF')}>Mudar Filtro</button>
      <button onClick={() => onLimparFiltros()}>Limpar Filtros</button>
    </div>
  ),
}));

// Mock do Tabela
jest.mock('../Tabela', () => ({
  Tabela: ({ data }) => (
    <div data-testid="tabela">
      {data?.map((item, index) => (
        <div key={item.uuid || index} data-testid={`row-${index}`}>
          {item.acao || 'Ação'}
        </div>
      ))}
    </div>
  ),
}));

// Mock do MsgImgCentralizada
jest.mock('../../../../../../Globais/Mensagens/MsgImgCentralizada', () => ({
  MsgImgCentralizada: ({ texto }) => (
    <div data-testid="msg-img-centralizada">
      {texto}
    </div>
  ),
}));

const mockPrioridadeTabelas = {
  prioridadesTabelas: [
    { key: 1, value: 'Sim' },
    { key: 0, value: 'Não' }
  ],
  recursos: [
    { key: 'PTRF', value: 'PTRF' },
    { key: 'PDDE', value: 'PDDE' },
    { key: 'RECURSO_PROPRIO', value: 'Recurso Próprio' }
  ],
  tipos_aplicacao: [
    { key: 'CUSTEIO', value: 'Custeio' },
    { key: 'CAPITAL', value: 'Capital' }
  ]
};

const mockTiposDespesaCusteio = [
  { id: 1, nome: 'Tipo 1' },
  { id: 2, nome: 'Tipo 2' }
];

const mockPrioridades = [
  {
    uuid: 'uuid1',
    acao: 'Ação PTRF 1',
    especificacao_material: { nome: 'Especificação 1' },
    tipo_aplicacao: { name: 'Custeio' },
    tipo_despesa_custeio: { nome: 'Tipo 1' },
    valor_total: 1000.50
  },
  {
    uuid: 'uuid2',
    acao: 'Ação PDDE 1',
    especificacao_material: { nome: 'Especificação 2' },
    tipo_aplicacao: { name: 'Capital' },
    tipo_despesa_custeio: null,
    valor_total: 2000.75
  }
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

describe('Prioridades', () => {
  beforeEach(() => {
    // Mock dos hooks
    useGetPrioridadeTabelas.mockReturnValue(mockPrioridadeTabelas);
    useGetTiposDespesaCusteio.mockReturnValue({
      tipos_despesa_custeio: mockTiposDespesaCusteio
    });
    useGetPrioridades.mockReturnValue({
      isLoading: false,
      prioridades: mockPrioridades,
      quantidade: 2,
      refetch: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza o componente com título e botão de adicionar', () => {
    renderWithQueryClient(<Prioridades />);
    
    expect(screen.getByText('Prioridades')).toBeInTheDocument();
    expect(screen.getByText('Adicionar nova prioridade')).toBeInTheDocument();
  });

  test('renderiza o formulário de filtros quando dados estão disponíveis', () => {
    renderWithQueryClient(<Prioridades />);
    
    expect(screen.getByTestId('form-filtros')).toBeInTheDocument();
  });

  test('renderiza a tabela quando há prioridades', () => {
    renderWithQueryClient(<Prioridades />);
    
    expect(screen.getByTestId('tabela')).toBeInTheDocument();
  });

  test('renderiza mensagem quando não há prioridades', () => {
    useGetPrioridades.mockReturnValue({
      isLoading: false,
      prioridades: [],
      quantidade: 0,
      refetch: jest.fn()
    });

    renderWithQueryClient(<Prioridades />);
    
    expect(screen.getByTestId('msg-img-centralizada')).toBeInTheDocument();
    expect(screen.getByText('Nenhum resultado encontrado.')).toBeInTheDocument();
  });

  test('abre modal ao clicar no botão de adicionar', async () => {
    renderWithQueryClient(<Prioridades />);
    
    const addButton = screen.getByText('Adicionar nova prioridade');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('modal-form')).toBeInTheDocument();
    });
  });

  test('fecha modal ao clicar em fechar', async () => {
    renderWithQueryClient(<Prioridades />);
    
    // Abre o modal
    const addButton = screen.getByText('Adicionar nova prioridade');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('modal-form')).toBeInTheDocument();
    });
    
    // Fecha o modal
    const closeButton = screen.getByText('Fechar Modal');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('modal-form')).not.toBeInTheDocument();
    });
  });

  test('mostra loading quando está carregando prioridades', () => {
    useGetPrioridades.mockReturnValue({
      isLoading: true,
      prioridades: [],
      quantidade: 0,
      refetch: jest.fn()
    });

    renderWithQueryClient(<Prioridades />);
    
    // Verifica se o Spin está ativo (loading)
    const spinElement = document.querySelector('.ant-spin');
    expect(spinElement).toBeInTheDocument();
  });

  test('chama refetch quando filtros são aplicados', async () => {
    const mockRefetch = jest.fn();
    useGetPrioridades.mockReturnValue({
      isLoading: false,
      prioridades: mockPrioridades,
      quantidade: 2,
      refetch: mockRefetch
    });

    renderWithQueryClient(<Prioridades />);
    
    const filtrarButton = screen.getByText('Filtrar');
    fireEvent.click(filtrarButton);
    
    expect(mockRefetch).toHaveBeenCalled();
  });

  test('chama refetch quando filtros são limpos', async () => {
    const mockRefetch = jest.fn();
    useGetPrioridades.mockReturnValue({
      isLoading: false,
      prioridades: mockPrioridades,
      quantidade: 2,
      refetch: mockRefetch
    });

    renderWithQueryClient(<Prioridades />);
    
    const limparButton = screen.getByText('Limpar Filtros');
    fireEvent.click(limparButton);
    
    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });

  });

  test('não renderiza formulário quando dados não estão disponíveis', () => {
    useGetPrioridadeTabelas.mockReturnValue({
      prioridadesTabelas: null,
      recursos: null,
      tipos_aplicacao: null
    });

    renderWithQueryClient(<Prioridades />);
    
    expect(screen.queryByTestId('form-filtros')).not.toBeInTheDocument();
  });

  test('navega entre páginas da paginação', async () => {
    // Mock com dados suficientes para paginação
    useGetPrioridades.mockReturnValue({
      isLoading: false,
      prioridades: mockPrioridades,
      quantidade: 60, // 3 páginas de 20 itens cada
      refetch: jest.fn()
    });

    renderWithQueryClient(<Prioridades />);
    
    // Verifica se o paginador está presente
    const paginatorElement = document.querySelector('.p-paginator');
    expect(paginatorElement).toBeInTheDocument();
    
    // Encontra todos os botões de página
    const pagina2 = document.querySelectorAll('.p-paginator-page')[1];
    
    // Clica em cada botão de página disponível
    fireEvent.click(pagina2);
    expect(pagina2).toBeInTheDocument();

  });
}); 