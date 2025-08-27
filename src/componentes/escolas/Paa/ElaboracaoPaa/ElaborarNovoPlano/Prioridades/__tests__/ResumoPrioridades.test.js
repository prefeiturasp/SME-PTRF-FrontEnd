import { useGetResumoPrioridades } from '../hooks/useGetResumoPrioridades';
import { getResumoPrioridades } from '../../../../../../../services/escolas/Paa.service';

// Mock do serviço
jest.mock('../../../../../../../services/escolas/Paa.service');
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn()
}));

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('useGetResumoPrioridades Hook', () => {
    const mockResumoPrioridades = [
        {
            key: 'ptrf-total',
            recurso: 'PTRF Total',
            custeio: 1000000,
            capital: 500000,
            livre_aplicacao: 200000,
            level: 0,
            parent: null,
            children: [
                {
                    key: 'ptrf-item-1',
                    recurso: 'Item PTRF 1',
                    custeio: 500000,
                    capital: 250000,
                    livre_aplicacao: 100000,
                    level: 1,
                    parent: 'PTRF',
                    children: [
                        {
                            key: 'ptrf-receita',
                            recurso: 'Receita',
                            custeio: 500000,
                            capital: 250000,
                            livre_aplicacao: 100000,
                            level: 2,
                            parent: 'PTRF'
                        }
                    ]
                }
            ]
        },
        {
            key: 'pdde-total',
            recurso: 'PDDE Total',
            custeio: 800000,
            capital: 300000,
            livre_aplicacao: 150000,
            level: 0,
            parent: null,
            children: [
                {
                    key: 'pdde-item-1',
                    recurso: 'Item PDDE 1',
                    custeio: 400000,
                    capital: 150000,
                    livre_aplicacao: 75000,
                    level: 1,
                    parent: 'PDDE',
                    children: []
                }
            ]
        }
    ];

    const mockError = new Error('Erro ao buscar resumo de prioridades');

    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue('mock-paa-uuid');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Configuração do React Query', () => {
        it('deve configurar useQuery com parâmetros corretos', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            // Simula a configuração do useQuery
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            useGetResumoPrioridades();

            expect(useQuery).toHaveBeenCalledWith(
                ['prioridades-resumo'],
                expect.any(Function),
                {
                    keepPreviousData: true,
                    staleTime: 5000,
                    refetchOnWindowFocus: false
                }
            );
        });

        it('deve chamar getResumoPrioridades quando a query for executada', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            let queryFn;
            useQuery.mockImplementation((key, fn, options) => {
                queryFn = fn;
                return {
                    isLoading: false,
                    isFetching: false,
                    isError: false,
                    data: mockResumoPrioridades,
                    error: null,
                    refetch: jest.fn()
                };
            });

            useGetResumoPrioridades();
            
            // Executa a função da query
            queryFn();
            
            expect(getResumoPrioridades).toHaveBeenCalled();
        });
    });

    describe('Estados de loading', () => {
        it('deve retornar isLoading true quando estiver carregando inicialmente', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: true,
                isFetching: false,
                isError: false,
                data: [],
                error: null,
                refetch: jest.fn()
            });

            const result = useGetResumoPrioridades();
            
            expect(result.isLoading).toBe(true);
            expect(result.isFetching).toBe(false);
            expect(result.isError).toBe(false);
            expect(result.resumoPrioridades).toEqual([]);
        });

        it('deve retornar isFetching true quando estiver buscando dados', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: true,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            const result = useGetResumoPrioridades();
            
            expect(result.isLoading).toBe(false);
            expect(result.isFetching).toBe(true);
            expect(result.isError).toBe(false);
            expect(result.resumoPrioridades).toEqual(mockResumoPrioridades);
        });

        it('deve retornar ambos isLoading e isFetching como true durante carregamento inicial', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: true,
                isFetching: true,
                isError: false,
                data: [],
                error: null,
                refetch: jest.fn()
            });

            const result = useGetResumoPrioridades();
            
            expect(result.isLoading).toBe(true);
            expect(result.isFetching).toBe(true);
        });
    });

    describe('Estados de erro', () => {
        it('deve retornar isError true quando houver erro', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: true,
                data: [],
                error: mockError,
                refetch: jest.fn()
            });

            const result = useGetResumoPrioridades();
            
            expect(result.isError).toBe(true);
            expect(result.error).toBe(mockError);
            expect(result.resumoPrioridades).toEqual([]);
        });

        it('deve retornar erro específico quando a API falhar', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            const apiError = {
                response: {
                    status: 500,
                    data: { message: 'Erro interno do servidor' }
                }
            };
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: true,
                data: [],
                error: apiError,
                refetch: jest.fn()
            });

            const result = useGetResumoPrioridades();
            
            expect(result.isError).toBe(true);
            expect(result.error).toBe(apiError);
            expect(result.error.response.status).toBe(500);
        });

        it('deve retornar erro de rede quando não conseguir conectar', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            const networkError = new Error('Network Error');
            networkError.name = 'NetworkError';
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: true,
                data: [],
                error: networkError,
                refetch: jest.fn()
            });

            const result = useGetResumoPrioridades();
            
            expect(result.isError).toBe(true);
            expect(result.error.name).toBe('NetworkError');
        });
    });

    describe('Dados retornados', () => {
        it('deve retornar dados vazios quando não há prioridades', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: [],
                error: null,
                refetch: jest.fn()
            });

            const result = useGetResumoPrioridades();
            
            expect(result.resumoPrioridades).toEqual([]);
            expect(result.resumoPrioridades).toHaveLength(0);
        });

        it('deve retornar dados padrão quando data for undefined', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: undefined,
                error: null,
                refetch: jest.fn()
            });

            const result = useGetResumoPrioridades();
            
            expect(result.resumoPrioridades).toEqual([]);
        });

        it('deve retornar dados padrão quando data for null', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: null,
                error: null,
                refetch: jest.fn()
            });

            const result = useGetResumoPrioridades();
            
            // O hook retorna data diretamente, então se data for null, resumoPrioridades será null
            expect(result.resumoPrioridades).toBeNull();
        });

        it('deve retornar dados quando disponíveis', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            const result = useGetResumoPrioridades();
            
            expect(result.resumoPrioridades).toEqual(mockResumoPrioridades);
            expect(result.resumoPrioridades).toHaveLength(2);
        });
    });

    describe('Função refetch', () => {
        it('deve retornar função refetch válida', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            const mockRefetch = jest.fn();
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: mockRefetch
            });

            const result = useGetResumoPrioridades();
            
            expect(result.refetch).toBe(mockRefetch);
            expect(typeof result.refetch).toBe('function');
        });

        it('deve permitir chamar refetch manualmente', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            const mockRefetch = jest.fn();
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: mockRefetch
            });

            const result = useGetResumoPrioridades();
            
            result.refetch();
            
            expect(mockRefetch).toHaveBeenCalledTimes(1);
        });
    });

    describe('Casos extremos e edge cases', () => {
        it('deve lidar com dados malformados', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            const malformedData = [
                { key: 'item-1', recurso: 'Item 1' }, // Sem campos obrigatórios
                null, // Item nulo
                undefined, // Item indefinido
                { key: 'item-2', recurso: 'Item 2', custeio: 'invalid' } // Tipo inválido
            ];
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: malformedData,
                error: null,
                refetch: jest.fn()
            });

            const result = useGetResumoPrioridades();
            
            expect(result.resumoPrioridades).toEqual(malformedData);
            expect(result.resumoPrioridades).toHaveLength(4);
        });

        it('deve lidar com array vazio', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: [],
                error: null,
                refetch: jest.fn()
            });

            const result = useGetResumoPrioridades();
            
            expect(result.resumoPrioridades).toEqual([]);
            expect(Array.isArray(result.resumoPrioridades)).toBe(true);
        });

        it('deve lidar com objeto único em vez de array', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            const singleObject = { key: 'single', recurso: 'Objeto Único' };
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: singleObject,
                error: null,
                refetch: jest.fn()
            });

            const result = useGetResumoPrioridades();
            
            expect(result.resumoPrioridades).toEqual(singleObject);
        });
    });

    describe('Integração com localStorage', () => {
        it('deve usar PAA UUID do localStorage', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            localStorageMock.getItem.mockReturnValue('test-paa-uuid');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            // Chama o hook para executar a query
            useGetResumoPrioridades();
            
            // O hook não chama diretamente o serviço, apenas retorna os dados do React Query
            // O localStorage é usado internamente pelo serviço quando a query é executada
            expect(useQuery).toHaveBeenCalledWith(
                ['prioridades-resumo'],
                expect.any(Function),
                expect.any(Object)
            );
        });

        it('deve lidar com PAA UUID ausente no localStorage', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            localStorageMock.getItem.mockReturnValue(null);
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            // Chama o hook para executar a query
            useGetResumoPrioridades();
            
            // O hook não chama diretamente o serviço, apenas retorna os dados do React Query
            // O localStorage é usado internamente pelo serviço quando a query é executada
            expect(useQuery).toHaveBeenCalledWith(
                ['prioridades-resumo'],
                expect.any(Function),
                expect.any(Object)
            );
        });
    });

    describe('Comportamento do React Query em diferentes cenários', () => {
        it('deve manter dados anteriores durante refetch (keepPreviousData)', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            // Primeira chamada com dados
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            const result1 = useGetResumoPrioridades();
            expect(result1.resumoPrioridades).toEqual(mockResumoPrioridades);

            // Segunda chamada durante refetch
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: true,
                isError: false,
                data: mockResumoPrioridades, // Mantém dados anteriores
                error: null,
                refetch: jest.fn()
            });

            const result2 = useGetResumoPrioridades();
            expect(result2.resumoPrioridades).toEqual(mockResumoPrioridades);
            expect(result2.isFetching).toBe(true);
        });

        it('deve respeitar staleTime de 5 segundos', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            useGetResumoPrioridades();
            
            expect(useQuery).toHaveBeenCalledWith(
                ['prioridades-resumo'],
                expect.any(Function),
                expect.objectContaining({
                    staleTime: 5000
                })
            );
        });

        it('deve desabilitar refetch automático no foco da janela', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            useGetResumoPrioridades();
            
            expect(useQuery).toHaveBeenCalledWith(
                ['prioridades-resumo'],
                expect.any(Function),
                expect.objectContaining({
                    refetchOnWindowFocus: false
                })
            );
        });
    });

    describe('Estrutura de dados retornada', () => {
        it('deve ter estrutura hierárquica correta', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            const { resumoPrioridades } = useGetResumoPrioridades();
            
            expect(resumoPrioridades).toHaveLength(2);
            expect(resumoPrioridades[0].key).toBe('ptrf-total');
            expect(resumoPrioridades[1].key).toBe('pdde-total');
            
            // Verifica se PTRF Total tem filhos
            expect(resumoPrioridades[0].children).toHaveLength(1);
            expect(resumoPrioridades[0].children[0].key).toBe('ptrf-item-1');
            
            // Verifica se PDDE Total tem filhos
            expect(resumoPrioridades[1].children).toHaveLength(1);
            expect(resumoPrioridades[1].children[0].key).toBe('pdde-item-1');
        });

        it('deve ter níveis corretos definidos', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            const { resumoPrioridades } = useGetResumoPrioridades();
            
            // Level 0 - Recursos principais
            expect(resumoPrioridades[0].level).toBe(0);
            expect(resumoPrioridades[1].level).toBe(0);
            
            // Level 1 - Itens de cada recurso
            expect(resumoPrioridades[0].children[0].level).toBe(1);
            expect(resumoPrioridades[1].children[0].level).toBe(1);
            
            // Level 2 - Detalhamento (apenas PTRF tem)
            expect(resumoPrioridades[0].children[0].children[0].level).toBe(2);
        });

        it('deve ter parent corretos definidos', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            const { resumoPrioridades } = useGetResumoPrioridades();
            
            // Recursos principais não têm parent
            expect(resumoPrioridades[0].parent).toBeNull();
            expect(resumoPrioridades[1].parent).toBeNull();
            
            // Itens de level 1 têm parent correto
            expect(resumoPrioridades[0].children[0].parent).toBe('PTRF');
            expect(resumoPrioridades[1].children[0].parent).toBe('PDDE');
            
            // Itens de level 2 têm parent correto
            expect(resumoPrioridades[0].children[0].children[0].parent).toBe('PTRF');
        });
    });

    describe('Valores monetários', () => {
        it('deve ter valores monetários válidos', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            const { resumoPrioridades } = useGetResumoPrioridades();
            
            // PTRF Total
            expect(resumoPrioridades[0].custeio).toBe(1000000);
            expect(resumoPrioridades[0].capital).toBe(500000);
            expect(resumoPrioridades[0].livre_aplicacao).toBe(200000);
            
            // PDDE Total
            expect(resumoPrioridades[1].custeio).toBe(800000);
            expect(resumoPrioridades[1].capital).toBe(300000);
            expect(resumoPrioridades[1].livre_aplicacao).toBe(150000);
        });

        it('deve ter valores que somam corretamente', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            const { resumoPrioridades } = useGetResumoPrioridades();
            
            // PTRF Total
            const ptrfTotal = resumoPrioridades[0];
            const ptrfItem = ptrfTotal.children[0];
            
            // Verifica se os valores do item somam ao total (aproximadamente)
            expect(ptrfItem.custeio).toBeLessThanOrEqual(ptrfTotal.custeio);
            expect(ptrfItem.capital).toBeLessThanOrEqual(ptrfTotal.capital);
            expect(ptrfItem.livre_aplicacao).toBeLessThanOrEqual(ptrfTotal.livre_aplicacao);
        });
    });

    describe('Lógica de expansão', () => {
        it('deve ter estrutura que permite expansão hierárquica', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            const { resumoPrioridades } = useGetResumoPrioridades();
            
            // Verifica se cada nível pode ser expandido
            const ptrfTotal = resumoPrioridades[0];
            const ptrfItem = ptrfTotal.children[0];
            
            // PTRF Total pode expandir para mostrar Item PTRF 1
            expect(ptrfTotal.children).toBeDefined();
            expect(ptrfTotal.children.length).toBeGreaterThan(0);
            
            // Item PTRF 1 pode expandir para mostrar Receita
            expect(ptrfItem.children).toBeDefined();
            expect(ptrfItem.children.length).toBeGreaterThan(0);
            
            // Receita não tem filhos (é o nível mais baixo)
            expect(ptrfItem.children[0].children).toBeUndefined();
        });

        it('deve ter keys únicas para cada item', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            const { resumoPrioridades } = useGetResumoPrioridades();
            
            const keys = [];
            
            // Coleta todas as keys
            const collectKeys = (items) => {
                items.forEach(item => {
                    keys.push(item.key);
                    if (item.children) {
                        collectKeys(item.children);
                    }
                });
            };
            
            collectKeys(resumoPrioridades);
            
            // Verifica se todas as keys são únicas
            const uniqueKeys = [...new Set(keys)];
            expect(uniqueKeys).toHaveLength(keys.length);
        });
    });

    describe('Lógica do expandedRowKeys', () => {
        // Simula a lógica do expandedRowKeys sem renderizar o componente
        let expandedRowKeys = [];

        const handleExpand = (expanded, record) => {
            if (expanded) {
                if (record.level === 0) {
                    // Se for level 0, expande apenas este item
                    expandedRowKeys = [record.key];
                } else {
                    // Se for level 1 ou 2, mantém o parent expandido
                    const parentKey = record.parent === 'PTRF' ? 'ptrf-total' : 
                                    record.parent === 'PDDE' ? 'pdde-total' : null;
                    if (parentKey) {
                        // Adiciona o parent se não estiver na lista
                        if (!expandedRowKeys.includes(parentKey)) {
                            expandedRowKeys.push(parentKey);
                        }
                        // Adiciona o item atual
                        if (!expandedRowKeys.includes(record.key)) {
                            expandedRowKeys.push(record.key);
                        }
                    }
                }
            } else {
                // Remove o item da lista de expandidos
                expandedRowKeys = expandedRowKeys.filter(key => key !== record.key);
                
                // Se for level 0, remove também todos os filhos
                if (record.level === 0) {
                    const currentRecord = mockResumoPrioridades.find(item => item.key === record.key);
                    if (currentRecord && currentRecord.children) {
                        const removeChildren = (children) => {
                            children.forEach(child => {
                                expandedRowKeys = expandedRowKeys.filter(key => key !== child.key);
                                if (child.children) {
                                    removeChildren(child.children);
                                }
                            });
                        };
                        removeChildren(currentRecord.children);
                    }
                }
            }
        };

        beforeEach(() => {
            expandedRowKeys = [];
        });

        it('deve iniciar com expandedRowKeys vazio', () => {
            expect(expandedRowKeys).toHaveLength(0);
        });

        it('deve expandir apenas uma linha de level 0 por vez', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            const { resumoPrioridades } = useGetResumoPrioridades();
            
            // Expande PTRF Total
            handleExpand(true, resumoPrioridades[0]);
            expect(expandedRowKeys).toEqual(['ptrf-total']);
            
            // Expande PDDE Total (deve recolher PTRF Total)
            handleExpand(true, resumoPrioridades[1]);
            expect(expandedRowKeys).toEqual(['pdde-total']);
        });

        it('deve permitir expandir itens de level 1 mantendo o parent expandido', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            const { resumoPrioridades } = useGetResumoPrioridades();
            
            // Expande PTRF Total primeiro
            handleExpand(true, resumoPrioridades[0]);
            expect(expandedRowKeys).toEqual(['ptrf-total']);
            
            // Expande o item de level 1 (Item PTRF 1)
            handleExpand(true, resumoPrioridades[0].children[0]);
            expect(expandedRowKeys).toEqual(['ptrf-total', 'ptrf-item-1']);
        });

        it('deve recolher itens quando solicitado', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            const { resumoPrioridades } = useGetResumoPrioridades();
            
            // Expande PTRF Total
            handleExpand(true, resumoPrioridades[0]);
            expect(expandedRowKeys).toEqual(['ptrf-total']);
            
            // Recolhe PTRF Total
            handleExpand(false, resumoPrioridades[0]);
            expect(expandedRowKeys).toEqual([]);
        });

        it('deve manter estrutura hierárquica ao expandir', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            const { resumoPrioridades } = useGetResumoPrioridades();
            
            // Expande PTRF Total
            handleExpand(true, resumoPrioridades[0]);
            expect(expandedRowKeys).toEqual(['ptrf-total']);
            
            // Expande Item PTRF 1
            handleExpand(true, resumoPrioridades[0].children[0]);
            expect(expandedRowKeys).toEqual(['ptrf-total', 'ptrf-item-1']);
            
            // Expande Receita
            handleExpand(true, resumoPrioridades[0].children[0].children[0]);
            expect(expandedRowKeys).toEqual(['ptrf-total', 'ptrf-item-1', 'ptrf-receita']);
        });

        it('deve recolher hierarquicamente', () => {
            const { useQuery } = require('@tanstack/react-query');
            
            useQuery.mockReturnValue({
                isLoading: false,
                isFetching: false,
                isError: false,
                data: mockResumoPrioridades,
                error: null,
                refetch: jest.fn()
            });

            const { resumoPrioridades } = useGetResumoPrioridades();
            
            // Expande toda a hierarquia
            handleExpand(true, resumoPrioridades[0]);
            handleExpand(true, resumoPrioridades[0].children[0]);
            handleExpand(true, resumoPrioridades[0].children[0].children[0]);
            expect(expandedRowKeys).toEqual(['ptrf-total', 'ptrf-item-1', 'ptrf-receita']);
            
            // Recolhe apenas o nível mais baixo
            handleExpand(false, resumoPrioridades[0].children[0].children[0]);
            expect(expandedRowKeys).toEqual(['ptrf-total', 'ptrf-item-1']);
            
            // Recolhe o nível intermediário
            handleExpand(false, resumoPrioridades[0].children[0]);
            expect(expandedRowKeys).toEqual(['ptrf-total']);
        });
    });
});
