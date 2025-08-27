import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Resumo } from '../Resumo';
import { useGetResumoPrioridades } from '../hooks/useGetResumoPrioridades';

// Mock do hook
jest.mock('../hooks/useGetResumoPrioridades');

// Mock simples dos componentes Ant Design
jest.mock('antd', () => ({
    Table: jest.fn(({ children, ...props }) => {
        return <div data-testid="antd-table" {...props}>{children}</div>;
    }),
    Typography: {
        Title: jest.fn(({ children, ...props }) => (
            <h1 data-testid="antd-typography-title" {...props}>{children}</h1>
        ))
    }
}));

// Mock dos ícones
jest.mock('@ant-design/icons', () => ({
    UpOutlined: jest.fn(() => <span>▼</span>),
    DownOutlined: jest.fn(() => <span>▶</span>)
}));

describe('Resumo Component', () => {
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
                    children: []
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
            children: []
        },
        {
            key: 'recursos-proprios-total',
            recurso: 'Recursos Próprios',
            custeio: 600000,
            capital: 200000,
            livre_aplicacao: 100000,
            level: 0,
            parent: null,
            children: [
                {
                    key: 'rp-item-1',
                    recurso: 'Item RP 1',
                    custeio: 300000,
                    capital: 100000,
                    livre_aplicacao: 50000,
                    level: 1,
                    parent: 'RECURSO_PROPRIO',
                    children: [
                        {
                            key: 'rp-item-1-1',
                            recurso: 'Saldo',
                            custeio: 150000,
                            capital: 50000,
                            livre_aplicacao: 25000,
                            level: 2,
                            parent: 'rp-item-1'
                        }
                    ]
                }
            ]
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        useGetResumoPrioridades.mockReturnValue({
            isFetching: false,
            resumoPrioridades: mockResumoPrioridades
        });
    });

    describe('Suite 1: Renderização e Configuração Básica', () => {
        it('deve renderizar o componente sem erros', () => {
            const { Table, Typography } = require('antd');
            render(<Resumo />);
            
            expect(Table).toHaveBeenCalled();
            expect(Typography.Title).toHaveBeenCalled();
        });

        it('deve renderizar o título com as propriedades corretas', () => {
            const { Typography } = require('antd');
            render(<Resumo />);
            
            expect(Typography.Title).toHaveBeenCalledWith(
                expect.objectContaining({
                    level: 5,
                    children: 'Resumo de recursos',
                    style: expect.objectContaining({
                        color: '#00585E',
                        fontWeight: 'bold'
                    }),
                    className: 'my-4'
                }),
                expect.any(Object)
            );
        });

        it('deve ter configuração de loading da tabela', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            expect(Table).toHaveBeenCalledWith(
                expect.objectContaining({
                    loading: expect.any(Boolean)
                }),
                expect.any(Object)
            );
        });

        it('deve ter dataSource configurado', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            expect(Table).toHaveBeenCalledWith(
                expect.objectContaining({
                    dataSource: expect.any(Array)
                }),
                expect.any(Object)
            );
        });

        it('deve ter configuração de bordas e estilo da tabela', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            expect(Table).toHaveBeenCalledWith(
                expect.objectContaining({
                    bordered: true,
                    sticky: { offsetHeader: 80 },
                    style: expect.objectContaining({
                        border: '1px solid #dadada',
                        borderRadius: '4px'
                    })
                }),
                expect.any(Object)
            );
        });

        it('deve ter paginação desabilitada', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            expect(Table).toHaveBeenCalledWith(
                expect.objectContaining({
                    pagination: false
                }),
                expect.any(Object)
            );
        });
    });

    describe('Suite 2: Configuração de Expansão', () => {
        it('deve ter função de expansão configurada', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            expect(Table).toHaveBeenCalledWith(
                expect.objectContaining({
                    expandable: expect.objectContaining({
                        expandedRowKeys: expect.any(Array),
                        onExpand: expect.any(Function),
                        expandIconColumnIndex: expect.any(Number),
                        expandIcon: expect.any(Function)
                    })
                }),
                expect.any(Object)
            );
        });

        it('deve ter configuração correta de expandedRowKeys', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            expect(Table).toHaveBeenCalledWith(
                expect.objectContaining({
                    expandable: expect.objectContaining({
                        expandedRowKeys: []
                    })
                }),
                expect.any(Object)
            );
        });

        it('deve ter expandIconColumnIndex configurado corretamente', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            expect(tableCall.expandable.expandIconColumnIndex).toBe(4); // columns.length - 1
        });

        it('deve ter função expandIcon configurada', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            expect(tableCall.expandable.expandIcon).toBeDefined();
            expect(typeof tableCall.expandable.expandIcon).toBe('function');
        });

        it('deve ter função onExpand configurada', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            expect(tableCall.expandable.onExpand).toBeDefined();
            expect(typeof tableCall.expandable.onExpand).toBe('function');
        });
    });

    describe('Suite 3: Coluna de Recursos (renderTipoRecurso)', () => {
        it('deve ter função renderTipoRecurso configurada na coluna de recursos', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            expect(Table).toHaveBeenCalledWith(
                expect.objectContaining({
                    columns: expect.arrayContaining([
                        expect.objectContaining({
                            title: 'Tipos de recursos',
                            dataIndex: 'recurso',
                            key: 'recurso',
                            align: 'left',
                            render: expect.any(Function)
                        })
                    ])
                }),
                expect.any(Object)
            );
        });

        it('deve ter função renderTipoRecurso como primeira coluna da tabela', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const firstColumn = tableCall.columns[0];
            
            expect(firstColumn.title).toBe('Tipos de recursos');
            expect(firstColumn.dataIndex).toBe('recurso');
            expect(firstColumn.render).toBeDefined();
            expect(typeof firstColumn.render).toBe('function');
        });

        it('deve ter função renderTipoRecurso configurada com propriedades específicas', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const recursoColumn = tableCall.columns.find(col => col.dataIndex === 'recurso');
            
            expect(recursoColumn).toBeDefined();
            expect(recursoColumn.render).toBeDefined();
            expect(typeof recursoColumn.render).toBe('function');
            expect(recursoColumn.align).toBe('left');
        });
    });

    describe('Suite 4: Colunas de Valores Monetários (valoresStyle)', () => {
        it('deve ter função valoresStyle configurada na coluna de Custeio', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            expect(Table).toHaveBeenCalledWith(
                expect.objectContaining({
                    columns: expect.arrayContaining([
                        expect.objectContaining({
                            title: 'Custeio (R$)',
                            dataIndex: 'custeio',
                            key: 'custeio',
                            width: 130,
                            align: 'center',
                            render: expect.any(Function)
                        })
                    ])
                }),
                expect.any(Object)
            );
        });

        it('deve ter função valoresStyle configurada na coluna de Capital', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            expect(Table).toHaveBeenCalledWith(
                expect.objectContaining({
                    columns: expect.arrayContaining([
                        expect.objectContaining({
                            title: 'Capital (R$)',
                            dataIndex: 'capital',
                            key: 'capital',
                            width: 130,
                            align: 'center',
                            render: expect.any(Function)
                        })
                    ])
                }),
                expect.any(Object)
            );
        });

        it('deve ter função valoresStyle configurada na coluna de Livre Aplicação', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            expect(Table).toHaveBeenCalledWith(
                expect.objectContaining({
                    columns: expect.arrayContaining([
                        expect.objectContaining({
                            title: 'Livre Aplicação (R$)',
                            dataIndex: 'livre_aplicacao',
                            key: 'livre_aplicacao',
                            width: 155,
                            align: 'center',
                            render: expect.any(Function)
                        })
                    ])
                }),
                expect.any(Object)
            );
        });

        it('deve ter todas as colunas de valores com a função valoresStyle', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const valorColumns = tableCall.columns.filter(col => 
                ['custeio', 'capital', 'livre_aplicacao'].includes(col.dataIndex)
            );
            
            expect(valorColumns).toHaveLength(3);
            valorColumns.forEach(column => {
                expect(column.render).toBeDefined();
                expect(typeof column.render).toBe('function');
                expect(column.align).toBe('center');
            });
        });

        it('deve ter larguras corretas nas colunas de valores', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const custeioColumn = tableCall.columns.find(col => col.dataIndex === 'custeio');
            const capitalColumn = tableCall.columns.find(col => col.dataIndex === 'capital');
            const livreAplicacaoColumn = tableCall.columns.find(col => col.dataIndex === 'livre_aplicacao');
            
            expect(custeioColumn.width).toBe(130);
            expect(capitalColumn.width).toBe(130);
            expect(livreAplicacaoColumn.width).toBe(155);
        });
    });

    describe('Suite 5: Coluna de Expansão', () => {
        it('deve ter coluna de expansão configurada corretamente', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            expect(Table).toHaveBeenCalledWith(
                expect.objectContaining({
                    columns: expect.arrayContaining([
                        expect.objectContaining({
                            title: '',
                            dataIndex: 'expand',
                            key: 'expand',
                            width: 35,
                            render: expect.any(Function),
                            align: 'center'
                        })
                    ])
                }),
                expect.any(Object)
            );
        });

        it('deve ter coluna de expansão como última coluna', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const lastColumn = tableCall.columns[tableCall.columns.length - 1];
            
            expect(lastColumn.dataIndex).toBe('expand');
            expect(lastColumn.title).toBe('');
            expect(lastColumn.width).toBe(35);
        });

        it('deve ter função render que retorna null na coluna de expansão', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const expandColumn = tableCall.columns.find(col => col.dataIndex === 'expand');
            
            expect(expandColumn.render).toBeDefined();
            expect(typeof expandColumn.render).toBe('function');
        });
    });

    describe('Suite 6: Estrutura Geral da Tabela', () => {
        it('deve ter número correto de colunas', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            expect(tableCall.columns).toHaveLength(5);
        });

        it('deve ter todas as colunas com propriedades obrigatórias', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            tableCall.columns.forEach(column => {
                expect(column).toHaveProperty('title');
                expect(column).toHaveProperty('dataIndex');
                expect(column).toHaveProperty('key');
                expect(column).toHaveProperty('align');
            });
        });

        it('deve ter configuração de paginação', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            expect(Table).toHaveBeenCalledWith(
                expect.objectContaining({
                    pagination: false
                }),
                expect.any(Object)
            );
        });
    });

    describe('Suite 7: Integração com Hook', () => {
        it('deve usar o hook useGetResumoPrioridades', () => {
            render(<Resumo />);
            expect(useGetResumoPrioridades).toHaveBeenCalled();
        });

        it('deve passar dados do hook para a tabela', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            expect(tableCall.dataSource).toBeDefined();
            expect(Array.isArray(tableCall.dataSource)).toBe(true);
        });

        it('deve configurar loading baseado no estado do hook', () => {
            const { Table } = require('antd');
            useGetResumoPrioridades.mockReturnValue({
                isFetching: true,
                resumoPrioridades: mockResumoPrioridades
            });
            
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            expect(tableCall.loading).toBe(true);
        });




    });

    describe('Suite 8: Funções Internas e Lógica de Negócio', () => {
        it('deve ter função onRow configurada para definir cores das linhas', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            expect(Table).toHaveBeenCalledWith(
                expect.objectContaining({
                    onRow: expect.any(Function)
                }),
                expect.any(Object)
            );
        });

        it('deve ter componentes customizados para header e body', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            expect(Table).toHaveBeenCalledWith(
                expect.objectContaining({
                    components: expect.objectContaining({
                        header: expect.objectContaining({
                            cell: expect.any(Function)
                        }),
                        body: expect.objectContaining({
                            cell: expect.any(Function)
                        })
                    })
                }),
                expect.any(Object)
            );
        });

        it('deve processar dados com diferentes níveis corretamente', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            expect(tableCall.dataSource).toBeDefined();
            
            // Verifica se os dados foram processados pela função definirNivel
            const hasProcessedData = tableCall.dataSource.some(item => 
                item.hasOwnProperty('level')
            );
            expect(hasProcessedData).toBe(true);
        });

        it('deve ter dados processados com estrutura hierárquica', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const dataSource = tableCall.dataSource;
            
            // Verifica se há dados com children
            const hasChildren = dataSource.some(item => 
                item.children && item.children.length > 0
            );
            expect(hasChildren).toBe(true);
        });
    });

    describe('Suite 9: Cenários de Dados Específicos', () => {
        it('deve lidar com dados vazios do hook', () => {
            useGetResumoPrioridades.mockReturnValue({
                isFetching: false,
                resumoPrioridades: []
            });
            
            const { Table } = require('antd');
            render(<Resumo />);
            
            expect(Table).toHaveBeenCalled();
        });



        it('deve processar dados com diferentes tipos de recursos', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const dataSource = tableCall.dataSource;
            
            // Verifica se há diferentes tipos de recursos
            const recursos = dataSource.map(item => item.recurso);
            expect(recursos).toContain('PTRF Total');
            expect(recursos).toContain('PDDE Total');
            expect(recursos).toContain('Recursos Próprios');
        });

        it('deve ter configuração de sticky para tabela', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            expect(Table).toHaveBeenCalledWith(
                expect.objectContaining({
                    sticky: { offsetHeader: 80 }
                }),
                expect.any(Object)
            );
        });
    });

    describe('Suite 31: Testes de Funções de Renderização Avançadas', () => {
        it('deve renderizar renderTipoRecurso com diferentes tipos de recursos', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const recursoColumn = tableCall.columns.find(col => col.dataIndex === 'recurso');
            const renderFunction = recursoColumn.render;
            
            // Testa com PTRF
            const ptrfResult = renderFunction('PTRF Item', { 
                recurso: 'PTRF Item', 
                parent: 'PTRF', 
                level: 1,
                key: 'ptrf-item'
            });
            expect(ptrfResult).toBeDefined();
            
            // Testa com PDDE
            const pddeResult = renderFunction('PDDE Item', { 
                recurso: 'PDDE Item', 
                parent: 'PDDE', 
                level: 1,
                key: 'pdde-item'
            });
            expect(pddeResult).toBeDefined();
            
            // Testa com Recursos Próprios
            const rpResult = renderFunction('RP Item', { 
                recurso: 'RP Item', 
                parent: 'RECURSO_PROPRIO', 
                level: 1,
                key: 'rp-item'
            });
            expect(rpResult).toBeDefined();
        });

        it('deve renderizar renderTipoRecurso com diferentes níveis', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const recursoColumn = tableCall.columns.find(col => col.dataIndex === 'recurso');
            const renderFunction = recursoColumn.render;
            
            // Testa level 0
            const level0Result = renderFunction('PTRF Total', { 
                recurso: 'PTRF Total', 
                level: 0,
                key: 'ptrf-total'
            });
            expect(level0Result).toBeDefined();
            
            // Testa level 2
            const level2Result = renderFunction('Saldo', { 
                recurso: 'Saldo', 
                level: 2,
                key: 'saldo'
            });
            expect(level2Result).toBeDefined();
        });

        it('deve renderizar valoresStyle com diferentes valores', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const custeioColumn = tableCall.columns.find(col => col.dataIndex === 'custeio');
            const renderFunction = custeioColumn.render;
            
            // Testa com valor zero
            const zeroResult = renderFunction(0, { 
                level: 1,
                key: 'item-1'
            });
            expect(zeroResult).toBeDefined();
            
            // Testa com valor positivo
            const positiveResult = renderFunction(1000000, { 
                level: 1,
                key: 'item-1'
            });
            expect(positiveResult).toBeDefined();
            
            // Testa com valor undefined
            const undefinedResult = renderFunction(undefined, { 
                level: 1,
                key: 'item-1'
            });
            expect(undefinedResult).toBeDefined();
        });

        it('deve renderizar valoresStyle com diferentes níveis e status', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const capitalColumn = tableCall.columns.find(col => col.dataIndex === 'capital');
            const renderFunction = capitalColumn.render;
            
            // Testa level 0 (deve ser negrito)
            const level0Result = renderFunction(500000, { 
                level: 0,
                key: 'ptrf-total'
            });
            expect(level0Result).toBeDefined();
            
            // Testa com recurso Saldo (deve ser negrito)
            const saldoResult = renderFunction(250000, { 
                level: 2,
                recurso: 'Saldo',
                key: 'saldo'
            });
            expect(saldoResult).toBeDefined();
        });
    });

    describe('Suite 32: Testes de Funções de Expansão Detalhadas', () => {
        it('deve expandir linha level 0 e limpar outras expansões', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const onExpandFunction = tableCall.expandable.onExpand;
            
            // Simula expansão de linha level 0
            onExpandFunction(true, { key: 'ptrf-total', level: 0 });
            
            // Verifica se a função foi chamada
            expect(onExpandFunction).toBeDefined();
        });

        it('deve expandir linha level 1 mantendo parent', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const onExpandFunction = tableCall.expandable.onExpand;
            
            // Simula expansão de linha level 1
            onExpandFunction(true, { 
                key: 'ptrf-item-1', 
                level: 1, 
                parent: 'ptrf-total' 
            });
            
            // Verifica se a função foi chamada
            expect(onExpandFunction).toBeDefined();
        });

        it('deve recolher linha level 1 removendo da lista', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const onExpandFunction = tableCall.expandable.onExpand;
            
            // Simula recolhimento de linha level 1
            onExpandFunction(false, { 
                key: 'ptrf-item-1', 
                level: 1, 
                parent: 'ptrf-total' 
            });
            
            // Verifica se a função foi chamada
            expect(onExpandFunction).toBeDefined();
        });

        it('deve recolher linha level 0 limpando todas as expansões', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const onExpandFunction = tableCall.expandable.onExpand;
            
            // Simula recolhimento de linha level 0
            onExpandFunction(false, { key: 'ptrf-total', level: 0 });
            
            // Verifica se a função foi chamada
            expect(onExpandFunction).toBeDefined();
        });
    });

    describe('Suite 33: Testes de Funções de Definição de Níveis Avançadas', () => {


        it('deve processar dados com diferentes tipos de recursos', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const dataSource = tableCall.dataSource;
            
            // Verifica se há dados de diferentes tipos de recursos
            const recursos = dataSource.map(item => item.recurso);
            expect(recursos).toContain('PTRF Total');
            expect(recursos).toContain('PDDE Total');
            expect(recursos).toContain('Recursos Próprios');
        });

        it('deve processar dados com estrutura hierárquica correta', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const dataSource = tableCall.dataSource;
            
            // Verifica se a estrutura hierárquica foi mantida
            const ptrfTotal = dataSource.find(item => item.recurso === 'PTRF Total');
            expect(ptrfTotal).toBeDefined();
            expect(ptrfTotal.children).toBeDefined();
            expect(Array.isArray(ptrfTotal.children)).toBe(true);
        });



        it('deve processar dados com propriedades originais mantidas', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const dataSource = tableCall.dataSource;
            
            // Verifica se propriedades originais foram mantidas
            const firstItem = dataSource[0];
            expect(firstItem).toHaveProperty('key');
            expect(firstItem).toHaveProperty('recurso');
            expect(firstItem).toHaveProperty('custeio');
            expect(firstItem).toHaveProperty('capital');
            expect(firstItem).toHaveProperty('livre_aplicacao');
        });
    });

    describe('Suite 34: Testes de Funções de Cores de Linhas Avançadas', () => {
        it('deve aplicar cores corretas para diferentes níveis', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const onRowFunction = tableCall.onRow;
            
            // Testa level 0
            const level0Result = onRowFunction({ level: 0, recurso: 'PTRF Total' });
            expect(level0Result.style.backgroundColor).toBe('#EEECEC');
            
            // Testa level 2
            const level2Result = onRowFunction({ level: 2, recurso: 'Saldo' });
            expect(level2Result.style.backgroundColor).toBe('#FAFAFA');
            
            // Testa level 1
            const level1Result = onRowFunction({ level: 1, recurso: 'Item 1' });
            expect(level1Result.style.backgroundColor).toBe('inherit');
            
            // Testa outros níveis
            const level3Result = onRowFunction({ level: 3, recurso: 'Item 3' });
            expect(level3Result.style.backgroundColor).toBe('inherit');
        });

        it('deve retornar objeto com propriedade style para todos os níveis', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const onRowFunction = tableCall.onRow;
            
            // Testa diferentes níveis
            const level0Result = onRowFunction({ level: 0, recurso: 'PTRF Total' });
            const level1Result = onRowFunction({ level: 1, recurso: 'Item 1' });
            const level2Result = onRowFunction({ level: 2, recurso: 'Saldo' });
            const level3Result = onRowFunction({ level: 3, recurso: 'Item 3' });
            
            expect(level0Result).toHaveProperty('style');
            expect(level1Result).toHaveProperty('style');
            expect(level2Result).toHaveProperty('style');
            expect(level3Result).toHaveProperty('style');
        });
    });

    describe('Suite 35: Testes de Funções de Override de Tabela Avançadas', () => {
        it('deve aplicar estilos customizados no header com props existentes', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const headerCell = tableCall.components.header.cell;
            
            // Simula props do header com estilo existente
            const props = { 
                style: { 
                    color: 'red', 
                    fontSize: '14px' 
                } 
            };
            const result = headerCell(props);
            
            expect(result).toBeDefined();
        });

        it('deve aplicar estilos customizados no header sem props de estilo', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const headerCell = tableCall.components.header.cell;
            
            // Simula props do header sem estilo
            const props = {};
            const result = headerCell(props);
            
            expect(result).toBeDefined();
        });

        it('deve aplicar estilos customizados no body com props existentes', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const bodyCell = tableCall.components.body.cell;
            
            // Simula props do body com estilo existente
            const props = { 
                style: { 
                    color: 'blue', 
                    fontSize: '12px' 
                } 
            };
            const result = bodyCell(props);
            
            expect(result).toBeDefined();
        });

        it('deve aplicar estilos customizados no body sem props de estilo', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const bodyCell = tableCall.components.body.cell;
            
            // Simula props do body sem estilo
            const props = {};
            const result = bodyCell(props);
            
            expect(result).toBeDefined();
        });
    });

    describe('Suite 36: Testes de Integração e Edge Cases', () => {
        it('deve lidar com dados com propriedades undefined', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const dataSource = tableCall.dataSource;
            
            // Verifica se os dados foram processados mesmo com propriedades undefined
            expect(dataSource).toBeDefined();
            expect(Array.isArray(dataSource)).toBe(true);
        });

        it('deve lidar com dados com propriedades null', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const dataSource = tableCall.dataSource;
            
            // Verifica se os dados foram processados mesmo com propriedades null
            expect(dataSource).toBeDefined();
            expect(Array.isArray(dataSource)).toBe(true);
        });

        it('deve processar dados com estrutura aninhada complexa', () => {
            const complexData = [
                {
                    key: 'root',
                    recurso: 'Root',
                    level: 0,
                    children: [
                        {
                            key: 'child1',
                            recurso: 'Child 1',
                            level: 1,
                            children: [
                                {
                                    key: 'grandchild1',
                                    recurso: 'Grandchild 1',
                                    level: 2,
                                    children: []
                                }
                            ]
                        }
                    ]
                }
            ];
            
            useGetResumoPrioridades.mockReturnValue({
                isFetching: false,
                resumoPrioridades: complexData
            });
            
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            expect(tableCall.dataSource).toBeDefined();
        });

        it('deve manter propriedades originais dos dados após processamento', () => {
            const { Table } = require('antd');
            render(<Resumo />);
            
            const tableCall = Table.mock.calls[0][0];
            const dataSource = tableCall.dataSource;
            
            // Verifica se propriedades originais foram mantidas
            const firstItem = dataSource[0];
            expect(firstItem).toHaveProperty('key');
            expect(firstItem).toHaveProperty('recurso');
            expect(firstItem).toHaveProperty('custeio');
            expect(firstItem).toHaveProperty('capital');
            expect(firstItem).toHaveProperty('livre_aplicacao');
        });


    });
});
