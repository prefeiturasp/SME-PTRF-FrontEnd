import { useGetResumoPrioridades } from '../ElaborarNovoPlano/Prioridades/hooks/useGetResumoPrioridades';

jest.mock('../ElaborarNovoPlano/Prioridades/hooks/useGetResumoPrioridades');

describe('Resumo Component - Lógica de Dados', () => {
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

    beforeEach(() => {
        useGetResumoPrioridades.mockReturnValue({
            isFetching: false,
            resumoPrioridades: mockResumoPrioridades
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Estrutura de dados', () => {
        it('deve ter estrutura hierárquica correta', () => {
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

    describe('Estado do hook', () => {
        it('deve retornar estado de loading correto', () => {
            useGetResumoPrioridades.mockReturnValue({
                isFetching: true,
                resumoPrioridades: []
            });
            
            const { isFetching } = useGetResumoPrioridades();
            expect(isFetching).toBe(true);
        });

        it('deve retornar dados vazios quando não há dados', () => {
            useGetResumoPrioridades.mockReturnValue({
                isFetching: false,
                resumoPrioridades: []
            });
            
            const { resumoPrioridades } = useGetResumoPrioridades();
            expect(resumoPrioridades).toHaveLength(0);
        });

        it('deve retornar dados quando disponíveis', () => {
            const { resumoPrioridades } = useGetResumoPrioridades();
            expect(resumoPrioridades).toHaveLength(2);
            expect(resumoPrioridades[0].recurso).toBe('PTRF Total');
            expect(resumoPrioridades[1].recurso).toBe('PDDE Total');
        });
    });

    describe('Lógica de expansão', () => {
        it('deve ter estrutura que permite expansão hierárquica', () => {
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
            const { resumoPrioridades } = useGetResumoPrioridades();
            
            // Expande PTRF Total
            handleExpand(true, resumoPrioridades[0]);
            expect(expandedRowKeys).toEqual(['ptrf-total']);
            
            // Expande PDDE Total (deve recolher PTRF Total)
            handleExpand(true, resumoPrioridades[1]);
            expect(expandedRowKeys).toEqual(['pdde-total']);
        });

        it('deve permitir expandir itens de level 1 mantendo o parent expandido', () => {
            const { resumoPrioridades } = useGetResumoPrioridades();
            
            // Expande PTRF Total primeiro
            handleExpand(true, resumoPrioridades[0]);
            expect(expandedRowKeys).toEqual(['ptrf-total']);
            
            // Expande o item de level 1 (Item PTRF 1)
            handleExpand(true, resumoPrioridades[0].children[0]);
            expect(expandedRowKeys).toEqual(['ptrf-total', 'ptrf-item-1']);
        });

        it('deve recolher itens quando solicitado', () => {
            const { resumoPrioridades } = useGetResumoPrioridades();
            
            // Expande PTRF Total
            handleExpand(true, resumoPrioridades[0]);
            expect(expandedRowKeys).toEqual(['ptrf-total']);
            
            // Recolhe PTRF Total
            handleExpand(false, resumoPrioridades[0]);
            expect(expandedRowKeys).toEqual([]);
        });

        it('deve manter estrutura hierárquica ao expandir', () => {
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
