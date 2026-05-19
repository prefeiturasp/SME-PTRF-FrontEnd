import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment/moment';
import { FiltroExpandido } from '../FiltroExpandido';

describe('FiltroExpandido Component', () => {
    const defaultProps = {
        stateFiltros: {
            filtrar_por_lancamento: '',
            filtrar_por_acao: '',
            filtrar_por_nome_fornecedor: '',
            filtrar_por_numero_de_documento: '',
            filtrar_por_tipo_de_documento: '',
            filtrar_por_tipo_de_pagamento: '',
            filtrar_por_data_inicio: '',
            filtrar_por_data_fim: '',
            filtrar_por_informacoes: [],
            filtrar_por_conferencia: [],
        },
        tabelasDespesa: {
            acoes_associacao: [
                { uuid: 'uuid-1', nome: 'Ação 1' },
                { uuid: 'uuid-2', nome: 'Ação 2' },
            ],
            tipos_documento: [
                { id: 1, nome: 'Nota Fiscal' },
                { id: 2, nome: 'Recibo' },
            ],
            tipos_transacao: [
                { id: 1, nome: 'Dinheiro' },
                { id: 2, nome: 'Cartão' },
            ],
        },
        handleClearDate: jest.fn(),
        handleChangeFiltros: jest.fn(),
        handleSubmitFiltros: jest.fn(),
        limpaFiltros: jest.fn(),
        handleChangeFiltroInformacoes: jest.fn(),
        handleChangeFiltroConferencia: jest.fn(),
        btnMaisFiltros: false,
        setBtnMaisFiltros: jest.fn(),
        formatDate: (date) => (date ? moment(date).format('DD/MM/YYYY') : ''),
        listaTagInformacao: [
            { id: 1, nome: 'Informação 1' },
            { id: 2, nome: 'Informação 2' },
        ],
        listaTagsConferencia: [
            { id: 1, nome: 'tag-1', descricao: 'Conferência 1' },
            { id: 2, nome: 'tag-2', descricao: 'Conferência 2' },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Renderização Inicial', () => {
        it('deve renderizar o componente sem erros', () => {
            render(<FiltroExpandido {...defaultProps} />);
            expect(screen.getByLabelText('Tipo de lançamento')).toBeInTheDocument();
        });

        it('deve renderizar todos os campos de filtro', () => {
            render(<FiltroExpandido {...defaultProps} />);

            expect(screen.getByLabelText('Tipo de lançamento')).toBeInTheDocument();
            expect(screen.getByLabelText('Ação')).toBeInTheDocument();
            expect(screen.getByLabelText('Fornecedor')).toBeInTheDocument();
            expect(screen.getByLabelText('Número de documento')).toBeInTheDocument();
            expect(screen.getByLabelText('Tipo de documento')).toBeInTheDocument();
            expect(screen.getByLabelText('Forma de pagamento')).toBeInTheDocument();
            expect(screen.getByText('Período de pagamento')).toBeInTheDocument();
        });

        it('deve renderizar os selects Informações e Conferência', () => {
            render(<FiltroExpandido {...defaultProps} />);

            expect(screen.getByLabelText('Informações')).toBeInTheDocument();
            expect(screen.getByLabelText('Conferência')).toBeInTheDocument();
        });

        it('deve renderizar com valores iniciais vazios', () => {
            render(<FiltroExpandido {...defaultProps} />);

            const tipoLancamento = screen.getByLabelText('Tipo de lançamento');
            expect(tipoLancamento).toHaveValue('');
        });

        it('deve renderizar botões ao final do formulário', () => {
            const { container } = render(<FiltroExpandido {...defaultProps} />);
            const buttonsContainer = container.querySelector('.d-flex.justify-content-end');
            expect(buttonsContainer).toBeInTheDocument();
            const buttons = buttonsContainer.querySelectorAll('button');
            expect(buttons.length).toBe(3);
        });
    });

    describe('Select: Tipo de Lançamento', () => {
        it('deve renderizar opções CREDITOS e GASTOS', () => {
            render(<FiltroExpandido {...defaultProps} />);

            const select = screen.getByLabelText('Tipo de lançamento');
            expect(select).toHaveTextContent('Créditos');
            expect(select).toHaveTextContent('Gastos');
        });

        it('deve chamar handleChangeFiltros ao mudar o tipo de lançamento', async () => {
            const user = userEvent.setup();
            const handleChangeFiltros = jest.fn();

            render(<FiltroExpandido {...defaultProps} handleChangeFiltros={handleChangeFiltros} />);

            const select = screen.getByLabelText('Tipo de lançamento');
            await user.selectOptions(select, 'CREDITOS');

            expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_lancamento', 'CREDITOS');
        });

        it('deve exibir o valor selecionado', async () => {
            const user = userEvent.setup();

            const props = {
                ...defaultProps,
                stateFiltros: {
                    ...defaultProps.stateFiltros,
                    filtrar_por_lancamento: 'CREDITOS',
                },
            };

            render(<FiltroExpandido {...props} />);

            const select = screen.getByLabelText('Tipo de lançamento');
            expect(select).toHaveValue('CREDITOS');
        });
    });

    describe('Select: Ação', () => {
        it('deve renderizar as ações da tabelasDespesa', () => {
            render(<FiltroExpandido {...defaultProps} />);

            expect(screen.getByRole('option', { name: 'Ação 1' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'Ação 2' })).toBeInTheDocument();
        });

        it('deve chamar handleChangeFiltros ao selecionar uma ação', async () => {
            const user = userEvent.setup();
            const handleChangeFiltros = jest.fn();

            render(<FiltroExpandido {...defaultProps} handleChangeFiltros={handleChangeFiltros} />);

            const select = screen.getByLabelText('Ação');
            await user.selectOptions(select, 'uuid-1');

            expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_acao', 'uuid-1');
        });

        it('deve renderizar opção vazia inicialmente', () => {
            render(<FiltroExpandido {...defaultProps} />);

            const options = screen.getAllByRole('option', { name: 'Selecione' });
            expect(options.length).toBeGreaterThan(0);
        });

        it('deve manter valor selecionado', () => {
            const props = {
                ...defaultProps,
                stateFiltros: {
                    ...defaultProps.stateFiltros,
                    filtrar_por_acao: 'uuid-1',
                },
            };

            render(<FiltroExpandido {...props} />);

            const select = screen.getByLabelText('Ação');
            expect(select).toHaveValue('uuid-1');
        });

        it('deve lidar com acoes_associacao vazio', () => {
            const props = {
                ...defaultProps,
                tabelasDespesa: {
                    ...defaultProps.tabelasDespesa,
                    acoes_associacao: [],
                },
            };

            render(<FiltroExpandido {...props} />);

            const select = screen.getByLabelText('Ação');
            const options = select.querySelectorAll('option');
            expect(options.length).toBe(1);
        });

        it('deve lidar com acoes_associacao undefined', () => {
            const props = {
                ...defaultProps,
                tabelasDespesa: {
                    ...defaultProps.tabelasDespesa,
                    acoes_associacao: undefined,
                },
            };

            expect(() => {
                render(<FiltroExpandido {...props} />);
            }).not.toThrow();
        });
    });

    describe('Input: Fornecedor', () => {
        it('deve renderizar o campo de entrada do fornecedor', () => {
            render(<FiltroExpandido {...defaultProps} />);

            const input = screen.getByLabelText('Fornecedor');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('type', 'text');
        });

        it('deve ter o placeholder correto', () => {
            render(<FiltroExpandido {...defaultProps} />);

            const input = screen.getByLabelText('Fornecedor');
            expect(input).toHaveAttribute('placeholder', 'Escreva a razão social do fornecedor');
        });

        it('deve chamar handleChangeFiltros ao digitar', async () => {
            const user = userEvent.setup();
            const handleChangeFiltros = jest.fn();

            render(<FiltroExpandido {...defaultProps} handleChangeFiltros={handleChangeFiltros} />);

            const input = screen.getByLabelText('Fornecedor');
            await user.type(input, 'Fornecedor');

            expect(handleChangeFiltros).toHaveBeenCalled();
            expect(handleChangeFiltros.mock.calls[0][0]).toBe('filtrar_por_nome_fornecedor');
        });

        it('deve exibir o valor digitado', () => {
            const props = {
                ...defaultProps,
                stateFiltros: {
                    ...defaultProps.stateFiltros,
                    filtrar_por_nome_fornecedor: 'Fornecedor ABC',
                },
            };

            render(<FiltroExpandido {...props} />);

            const input = screen.getByLabelText('Fornecedor');
            expect(input).toHaveValue('Fornecedor ABC');
        });

        it('deve limpar o campo quando o valor for vazio', async () => {
            const user = userEvent.setup();

            const props = {
                ...defaultProps,
                stateFiltros: {
                    ...defaultProps.stateFiltros,
                    filtrar_por_nome_fornecedor: 'Fornecedor',
                },
            };

            const { rerender } = render(<FiltroExpandido {...props} />);

            const input = screen.getByLabelText('Fornecedor');
            expect(input).toHaveValue('Fornecedor');

            rerender(
                <FiltroExpandido
                    {...props}
                    stateFiltros={{
                        ...props.stateFiltros,
                        filtrar_por_nome_fornecedor: '',
                    }}
                />,
            );

            const inputAfter = screen.getByLabelText('Fornecedor');
            expect(inputAfter).toHaveValue('');
        });
    });

    describe('Input: Número de Documento', () => {
        it('deve renderizar o campo de entrada do número de documento', () => {
            render(<FiltroExpandido {...defaultProps} />);

            const input = screen.getByLabelText('Número de documento');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('type', 'text');
        });

        it('deve ter o placeholder correto', () => {
            render(<FiltroExpandido {...defaultProps} />);

            const input = screen.getByLabelText('Número de documento');
            expect(input).toHaveAttribute('placeholder', 'Digite o número');
        });

        it('deve chamar handleChangeFiltros ao digitar', async () => {
            const user = userEvent.setup();
            const handleChangeFiltros = jest.fn();

            render(<FiltroExpandido {...defaultProps} handleChangeFiltros={handleChangeFiltros} />);

            const input = screen.getByLabelText('Número de documento');
            await user.type(input, '12345');

            expect(handleChangeFiltros).toHaveBeenCalled();
            expect(handleChangeFiltros.mock.calls[0][0]).toBe('filtrar_por_numero_de_documento');
        });

        it('deve manter o valor digitado', () => {
            const props = {
                ...defaultProps,
                stateFiltros: {
                    ...defaultProps.stateFiltros,
                    filtrar_por_numero_de_documento: '987654321',
                },
            };

            render(<FiltroExpandido {...props} />);

            const input = screen.getByLabelText('Número de documento');
            expect(input).toHaveValue('987654321');
        });
    });

    describe('Select: Tipo de Documento', () => {
        it('deve renderizar os tipos de documento', () => {
            render(<FiltroExpandido {...defaultProps} />);

            expect(screen.getByRole('option', { name: 'Nota Fiscal' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'Recibo' })).toBeInTheDocument();
        });

        it('deve chamar handleChangeFiltros ao selecionar um tipo', async () => {
            const user = userEvent.setup();
            const handleChangeFiltros = jest.fn();

            render(<FiltroExpandido {...defaultProps} handleChangeFiltros={handleChangeFiltros} />);

            const select = screen.getByLabelText('Tipo de documento');
            await user.selectOptions(select, '1');

            expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_tipo_de_documento', '1');
        });

        it('deve manter o valor selecionado', () => {
            const props = {
                ...defaultProps,
                stateFiltros: {
                    ...defaultProps.stateFiltros,
                    filtrar_por_tipo_de_documento: '2',
                },
            };

            render(<FiltroExpandido {...props} />);

            const select = screen.getByLabelText('Tipo de documento');
            expect(select).toHaveValue('2');
        });

        it('deve lidar com tipos_documento vazio', () => {
            const props = {
                ...defaultProps,
                tabelasDespesa: {
                    ...defaultProps.tabelasDespesa,
                    tipos_documento: [],
                },
            };

            render(<FiltroExpandido {...props} />);

            const select = screen.getByLabelText('Tipo de documento');
            const options = select.querySelectorAll('option');
            expect(options.length).toBe(1);
        });
    });

    describe('Select: Forma de Pagamento', () => {
        it('deve renderizar as formas de pagamento', () => {
            render(<FiltroExpandido {...defaultProps} />);

            expect(screen.getByRole('option', { name: 'Dinheiro' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'Cartão' })).toBeInTheDocument();
        });

        it('deve chamar handleChangeFiltros ao selecionar uma forma de pagamento', async () => {
            const user = userEvent.setup();
            const handleChangeFiltros = jest.fn();

            render(<FiltroExpandido {...defaultProps} handleChangeFiltros={handleChangeFiltros} />);

            const select = screen.getByLabelText('Forma de pagamento');
            await user.selectOptions(select, '1');

            expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_tipo_de_pagamento', '1');
        });

        it('deve manter o valor selecionado', () => {
            const props = {
                ...defaultProps,
                stateFiltros: {
                    ...defaultProps.stateFiltros,
                    filtrar_por_tipo_de_pagamento: '2',
                },
            };

            render(<FiltroExpandido {...props} />);

            const select = screen.getByLabelText('Forma de pagamento');
            expect(select).toHaveValue('2');
        });

        it('deve lidar com tipos_transacao vazio', () => {
            const props = {
                ...defaultProps,
                tabelasDespesa: {
                    ...defaultProps.tabelasDespesa,
                    tipos_transacao: [],
                },
            };

            render(<FiltroExpandido {...props} />);

            const select = screen.getByLabelText('Forma de pagamento');
            const options = select.querySelectorAll('option');
            expect(options.length).toBe(1);
        });
    });

    describe('DatePicker: Período de Pagamento', () => {
        it('deve renderizar o label do período de pagamento', () => {
            render(<FiltroExpandido {...defaultProps} />);

            expect(screen.getByText('Período de pagamento')).toBeInTheDocument();
        });

        it('deve renderizar o DatePicker.RangePicker', () => {
            const { container } = render(<FiltroExpandido {...defaultProps} />);

            const rangePicker = container.querySelector('.ant-picker-range');
            expect(rangePicker).toBeInTheDocument();
        });

        it('deve ter placeholders corretos', () => {
            const { container } = render(<FiltroExpandido {...defaultProps} />);

            const inputs = container.querySelectorAll(
                'input[placeholder="Data início"], input[placeholder="Data final"]',
            );
            expect(inputs.length).toBeGreaterThan(0);
        });

        it('deve renderizar com classe ant-picker-range', () => {
            const { container } = render(<FiltroExpandido {...defaultProps} />);

            const rangePicker = container.querySelector('.ant-picker-range');
            expect(rangePicker).toHaveClass('ant-picker-outlined');
            expect(rangePicker).toHaveClass('form-control');
        });

        it('deve renderizar sem erros mesmo sem datas iniciais', () => {
            expect(() => {
                render(<FiltroExpandido {...defaultProps} />);
            }).not.toThrow();
        });
    });

    describe('Multiselect: Informações', () => {
        it('deve renderizar o select de informações', () => {
            render(<FiltroExpandido {...defaultProps} />);

            const labelElement = screen.getByLabelText('Informações');
            expect(labelElement).toBeInTheDocument();
        });

        it('deve estar dentro de um elemento com classe multiselect-filtrar-por-status', () => {
            const { container } = render(<FiltroExpandido {...defaultProps} />);

            const multiselectElement = container.querySelector('.multiselect-filtrar-por-status');
            expect(multiselectElement).toBeInTheDocument();
        });

        it('deve chamar handleChangeFiltroInformacoes ao selecionar informações', () => {
            const handleChangeFiltroInformacoes = jest.fn();

            render(
                <FiltroExpandido
                    {...defaultProps}
                    handleChangeFiltroInformacoes={handleChangeFiltroInformacoes}
                />,
            );

            expect(screen.getByLabelText('Informações')).toBeInTheDocument();
        });

        it('deve renderizar as opções de informação', () => {
            render(<FiltroExpandido {...defaultProps} />);

            expect(screen.getByLabelText('Informações')).toBeInTheDocument();
        });

        it('deve permitir múltiplas seleções', () => {
            const props = {
                ...defaultProps,
                stateFiltros: {
                    ...defaultProps.stateFiltros,
                    filtrar_por_informacoes: [1, 2],
                },
            };

            render(<FiltroExpandido {...props} />);

            expect(screen.getByLabelText('Informações')).toBeInTheDocument();
        });

        it('deve lidar com listaTagInformacao vazia', () => {
            const props = {
                ...defaultProps,
                listaTagInformacao: [],
            };

            render(<FiltroExpandido {...props} />);

            expect(screen.getByLabelText('Informações')).toBeInTheDocument();
        });

        it('deve lidar com listaTagInformacao undefined', () => {
            const props = {
                ...defaultProps,
                listaTagInformacao: undefined,
            };

            render(<FiltroExpandido {...props} />);

            expect(screen.getByLabelText('Informações')).toBeInTheDocument();
        });
    });

    describe('Multiselect: Conferência', () => {
        it('deve renderizar o select de conferência', () => {
            render(<FiltroExpandido {...defaultProps} />);

            const labelElement = screen.getByLabelText('Conferência');
            expect(labelElement).toBeInTheDocument();
        });

        it('deve estar dentro de um elemento com classe multiselect-filtrar-por-status', () => {
            const { container } = render(<FiltroExpandido {...defaultProps} />);

            const multiselectElements = container.querySelectorAll(
                '.multiselect-filtrar-por-status',
            );
            expect(multiselectElements.length).toBeGreaterThanOrEqual(2);
        });

        it('deve chamar handleChangeFiltroConferencia ao selecionar conferências', () => {
            const handleChangeFiltroConferencia = jest.fn();

            render(
                <FiltroExpandido
                    {...defaultProps}
                    handleChangeFiltroConferencia={handleChangeFiltroConferencia}
                />,
            );

            expect(screen.getByLabelText('Conferência')).toBeInTheDocument();
        });

        it('deve renderizar as opções de conferência', () => {
            render(<FiltroExpandido {...defaultProps} />);

            expect(screen.getByLabelText('Conferência')).toBeInTheDocument();
        });

        it('deve permitir múltiplas seleções', () => {
            const props = {
                ...defaultProps,
                stateFiltros: {
                    ...defaultProps.stateFiltros,
                    filtrar_por_conferencia: ['tag-1', 'tag-2'],
                },
            };

            render(<FiltroExpandido {...props} />);

            expect(screen.getByLabelText('Conferência')).toBeInTheDocument();
        });

        it('deve lidar com listaTagsConferencia vazia', () => {
            const props = {
                ...defaultProps,
                listaTagsConferencia: [],
            };

            render(<FiltroExpandido {...props} />);

            expect(screen.getByLabelText('Conferência')).toBeInTheDocument();
        });

        it('deve lidar com listaTagsConferencia undefined', () => {
            const props = {
                ...defaultProps,
                listaTagsConferencia: undefined,
            };

            render(<FiltroExpandido {...props} />);

            expect(screen.getByLabelText('Conferência')).toBeInTheDocument();
        });
    });

    describe('Componente Botoes', () => {
        it('deve renderizar o componente Botoes com três botões', () => {
            const { container } = render(<FiltroExpandido {...defaultProps} />);

            const buttonsContainer = container.querySelector('.d-flex.justify-content-end');
            expect(buttonsContainer).toBeInTheDocument();

            const buttons = buttonsContainer.querySelectorAll('button');
            expect(buttons.length).toBe(3);
        });

        it('deve renderizar botões com classes bootstrap corretas', () => {
            const { container } = render(<FiltroExpandido {...defaultProps} />);

            const buttons = container.querySelectorAll('button');

            expect(buttons[0]).toHaveClass('btn', 'btn-outline-success');

            expect(buttons[1]).toHaveClass('btn', 'btn-success');
            expect(buttons[2]).toHaveClass('btn', 'btn-success');
        });

        it('deve renderizar Botoes no final do formulário com classe justify-content-end', () => {
            const { container } = render(<FiltroExpandido {...defaultProps} />);

            const botoeContainer = container.querySelector('.d-flex.justify-content-end');
            expect(botoeContainer).toBeInTheDocument();
            expect(botoeContainer).toHaveClass('d-flex', 'justify-content-end');
        });

        it('deve passar as props corretas para os callbacks dos botões', async () => {
            const user = userEvent.setup();
            const limpaFiltros = jest.fn();

            const { container } = render(
                <FiltroExpandido {...defaultProps} limpaFiltros={limpaFiltros} />,
            );

            const buttons = container.querySelectorAll('button');
            await user.click(buttons[1]);

            expect(limpaFiltros).toHaveBeenCalledTimes(1);
        });
    });

    describe('Estrutura do Formulário', () => {
        it('deve renderizar com estrutura form-row', () => {
            const { container } = render(<FiltroExpandido {...defaultProps} />);

            const formRows = container.querySelectorAll('.form-row');
            expect(formRows.length).toBeGreaterThan(0);
        });

        it('deve ter os campos agrupados corretamente', () => {
            const { container } = render(<FiltroExpandido {...defaultProps} />);

            const formGroups = container.querySelectorAll('.form-group');
            expect(formGroups.length).toBeGreaterThan(5);
        });

        it('deve ter inputs e selects com classe form-control', () => {
            const { container } = render(<FiltroExpandido {...defaultProps} />);

            const controls = container.querySelectorAll('.form-control');
            expect(controls.length).toBeGreaterThan(0);
        });
    });

    describe('Cenários Integrados', () => {
        it('deve permitir preencher múltiplos campos', async () => {
            const user = userEvent.setup();
            const handleChangeFiltros = jest.fn();

            render(<FiltroExpandido {...defaultProps} handleChangeFiltros={handleChangeFiltros} />);

            await user.selectOptions(screen.getByLabelText('Tipo de lançamento'), 'CREDITOS');
            expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_lancamento', 'CREDITOS');

            await user.selectOptions(screen.getByLabelText('Ação'), 'uuid-1');
            expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_acao', 'uuid-1');

            const numeroInput = screen.getByLabelText('Número de documento');
            await user.type(numeroInput, '12345');
            expect(handleChangeFiltros).toHaveBeenCalled();

            expect(handleChangeFiltros).toHaveBeenCalledTimes(7);
        });

        it('deve manter todos os valores sem datas', () => {
            const props = {
                ...defaultProps,
                stateFiltros: {
                    filtrar_por_lancamento: 'CREDITOS',
                    filtrar_por_acao: 'uuid-1',
                    filtrar_por_nome_fornecedor: 'Fornecedor ABC',
                    filtrar_por_numero_de_documento: '123456',
                    filtrar_por_tipo_de_documento: '1',
                    filtrar_por_tipo_de_pagamento: '2',
                    filtrar_por_data_inicio: '',
                    filtrar_por_data_fim: '',
                    filtrar_por_informacoes: [1],
                    filtrar_por_conferencia: ['tag-1'],
                },
            };

            render(<FiltroExpandido {...props} />);

            expect(screen.getByLabelText('Tipo de lançamento')).toHaveValue('CREDITOS');
            expect(screen.getByLabelText('Ação')).toHaveValue('uuid-1');
            expect(screen.getByLabelText('Fornecedor')).toHaveValue('Fornecedor ABC');
            expect(screen.getByLabelText('Número de documento')).toHaveValue('123456');
            expect(screen.getByLabelText('Tipo de documento')).toHaveValue('1');
            expect(screen.getByLabelText('Forma de pagamento')).toHaveValue('2');
        });

        it('deve clicar no botão Limpar via container', async () => {
            const user = userEvent.setup();
            const limpaFiltros = jest.fn();

            const { container } = render(
                <FiltroExpandido {...defaultProps} limpaFiltros={limpaFiltros} />,
            );

            const buttons = container.querySelectorAll('button');
            await user.click(buttons[1]);

            expect(limpaFiltros).toHaveBeenCalledTimes(1);
        });

        it('deve clicar no botão Filtrar via container', async () => {
            const user = userEvent.setup();
            const handleSubmitFiltros = jest.fn();

            const { container } = render(
                <FiltroExpandido {...defaultProps} handleSubmitFiltros={handleSubmitFiltros} />,
            );

            const buttons = container.querySelectorAll('button');
            await user.click(buttons[2]);

            expect(handleSubmitFiltros).toHaveBeenCalledTimes(1);
        });
    });

    describe('Dados Condicionais', () => {
        it('deve renderizar sem dados de acoes_associacao', () => {
            const props = {
                ...defaultProps,
                tabelasDespesa: {
                    ...defaultProps.tabelasDespesa,
                    acoes_associacao: null,
                },
            };

            expect(() => {
                render(<FiltroExpandido {...props} />);
            }).not.toThrow();
        });

        it('deve renderizar sem dados de tipos_documento', () => {
            const props = {
                ...defaultProps,
                tabelasDespesa: {
                    ...defaultProps.tabelasDespesa,
                    tipos_documento: null,
                },
            };

            expect(() => {
                render(<FiltroExpandido {...props} />);
            }).not.toThrow();
        });

        it('deve renderizar sem dados de tipos_transacao', () => {
            const props = {
                ...defaultProps,
                tabelasDespesa: {
                    ...defaultProps.tabelasDespesa,
                    tipos_transacao: null,
                },
            };

            expect(() => {
                render(<FiltroExpandido {...props} />);
            }).not.toThrow();
        });

        it('deve renderizar com tabelasDespesa vazio', () => {
            const props = {
                ...defaultProps,
                tabelasDespesa: {},
            };

            expect(() => {
                render(<FiltroExpandido {...props} />);
            }).not.toThrow();
        });
    });

    describe('Acessibilidade', () => {
        it('todos os campos de entrada devem ter labels associados', () => {
            render(<FiltroExpandido {...defaultProps} />);

            expect(screen.getByLabelText('Tipo de lançamento')).toBeInTheDocument();
            expect(screen.getByLabelText('Ação')).toBeInTheDocument();
            expect(screen.getByLabelText('Fornecedor')).toBeInTheDocument();
            expect(screen.getByLabelText('Número de documento')).toBeInTheDocument();
            expect(screen.getByLabelText('Tipo de documento')).toBeInTheDocument();
            expect(screen.getByLabelText('Forma de pagamento')).toBeInTheDocument();
        });

        it('deve renderizar labels HTML com htmlFor corretos para inputs e selects', () => {
            const { container } = render(<FiltroExpandido {...defaultProps} />);

            const htmlLabels = container.querySelectorAll('label[htmlFor]');
            expect(htmlLabels.length).toBe(0);
        });

        it('deve renderizar inputs e selects com id corretos', () => {
            const { container } = render(<FiltroExpandido {...defaultProps} />);

            expect(container.querySelector('#filtrar_por_lancamento')).toBeInTheDocument();
            expect(container.querySelector('#filtrar_por_acao')).toBeInTheDocument();
            expect(container.querySelector('#filtrar_por_nome_fornecedor')).toBeInTheDocument();
            expect(container.querySelector('#filtrar_por_numero_de_documento')).toBeInTheDocument();
        });

        it('deve ter atributo id="data_range" no DatePicker', () => {
            const { container } = render(<FiltroExpandido {...defaultProps} />);

            const dateRangeInput = container.querySelector('#data_range');
            expect(dateRangeInput).toBeInTheDocument();
        });
    });

    describe('formatDate function', () => {
        it('deve receber e utilizar a função formatDate fornecida', () => {
            const formatDate = jest.fn((date) => {
                if (!date) return '';
                return moment(date).format('DD/MM/YYYY');
            });

            const props = {
                ...defaultProps,
                formatDate,
            };

            render(<FiltroExpandido {...props} />);

            expect(screen.getByText('Período de pagamento')).toBeInTheDocument();
        });
    });
});
