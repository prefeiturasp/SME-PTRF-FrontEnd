import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment/moment';
import { FiltroExpandido } from '../FiltroExpandido';

describe('FiltroExpandido (ConferenciaDespesasPeriodosAnteriores)', () => {
    const defaultProps = {
        stateFiltros: {
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
        btnMaisFiltros: true,
        setBtnMaisFiltros: jest.fn(),
        formatDate: (date) => (date ? moment(date) : ''),
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

    it('renderiza todos os campos de filtro', () => {
        render(<FiltroExpandido {...defaultProps} />);

        expect(screen.getByLabelText('Ação')).toBeInTheDocument();
        expect(screen.getByLabelText('Fornecedor')).toBeInTheDocument();
        expect(screen.getByLabelText('Número de documento')).toBeInTheDocument();
        expect(screen.getByLabelText('Tipo de documento')).toBeInTheDocument();
        expect(screen.getByLabelText('Forma de pagamento')).toBeInTheDocument();
        expect(screen.getByText('Período de pagamento')).toBeInTheDocument();
        expect(screen.getByLabelText('Informações')).toBeInTheDocument();
        expect(screen.getByLabelText('Conferência')).toBeInTheDocument();
    });

    describe('Select: Ação', () => {
        it('renderiza as ações da tabelasDespesa e chama handleChangeFiltros ao selecionar', async () => {
            const user = userEvent.setup();
            const handleChangeFiltros = jest.fn();
            render(<FiltroExpandido {...defaultProps} handleChangeFiltros={handleChangeFiltros} />);

            expect(screen.getByRole('option', { name: 'Ação 1' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'Ação 2' })).toBeInTheDocument();

            await user.selectOptions(screen.getByLabelText('Ação'), 'uuid-1');
            expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_acao', 'uuid-1');
        });

        it('renderiza apenas a opção padrão quando acoes_associacao é vazio ou indefinido', () => {
            const { rerender } = render(<FiltroExpandido {...defaultProps} tabelasDespesa={{ ...defaultProps.tabelasDespesa, acoes_associacao: [] }} />);
            expect(screen.getByLabelText('Ação').querySelectorAll('option').length).toBe(1);

            rerender(<FiltroExpandido {...defaultProps} tabelasDespesa={{ ...defaultProps.tabelasDespesa, acoes_associacao: undefined }} />);
            expect(screen.getByLabelText('Ação').querySelectorAll('option').length).toBe(1);
        });
    });

    describe('Input: Fornecedor', () => {
        it('exibe o placeholder e propaga a digitação', async () => {
            const user = userEvent.setup();
            const handleChangeFiltros = jest.fn();
            render(<FiltroExpandido {...defaultProps} handleChangeFiltros={handleChangeFiltros} />);

            const input = screen.getByLabelText('Fornecedor');
            expect(input).toHaveAttribute('placeholder', 'Escreva a razão social do fornecedor');

            await user.type(input, 'X');
            expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_nome_fornecedor', 'X');
        });
    });

    describe('Input: Número de documento', () => {
        it('exibe o placeholder e propaga a digitação', async () => {
            const user = userEvent.setup();
            const handleChangeFiltros = jest.fn();
            render(<FiltroExpandido {...defaultProps} handleChangeFiltros={handleChangeFiltros} />);

            const input = screen.getByLabelText('Número de documento');
            expect(input).toHaveAttribute('placeholder', 'Digite o número');

            await user.type(input, '9');
            expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_numero_de_documento', '9');
        });
    });

    describe('Select: Tipo de documento', () => {
        it('renderiza os tipos e propaga a seleção', async () => {
            const user = userEvent.setup();
            const handleChangeFiltros = jest.fn();
            render(<FiltroExpandido {...defaultProps} handleChangeFiltros={handleChangeFiltros} />);

            expect(screen.getByRole('option', { name: 'Nota Fiscal' })).toBeInTheDocument();
            await user.selectOptions(screen.getByLabelText('Tipo de documento'), '1');
            expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_tipo_de_documento', '1');
        });

        it('renderiza apenas a opção padrão quando tipos_documento é vazio ou indefinido', () => {
            const { rerender } = render(<FiltroExpandido {...defaultProps} tabelasDespesa={{ ...defaultProps.tabelasDespesa, tipos_documento: [] }} />);
            expect(screen.getByLabelText('Tipo de documento').querySelectorAll('option').length).toBe(1);

            rerender(<FiltroExpandido {...defaultProps} tabelasDespesa={{ ...defaultProps.tabelasDespesa, tipos_documento: undefined }} />);
            expect(screen.getByLabelText('Tipo de documento').querySelectorAll('option').length).toBe(1);
        });
    });

    describe('Select: Forma de pagamento', () => {
        it('renderiza as formas e propaga a seleção', async () => {
            const user = userEvent.setup();
            const handleChangeFiltros = jest.fn();
            render(<FiltroExpandido {...defaultProps} handleChangeFiltros={handleChangeFiltros} />);

            expect(screen.getByRole('option', { name: 'Dinheiro' })).toBeInTheDocument();
            await user.selectOptions(screen.getByLabelText('Forma de pagamento'), '1');
            expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_tipo_de_pagamento', '1');
        });

        it('renderiza apenas a opção padrão quando tipos_transacao é vazio ou indefinido', () => {
            const { rerender } = render(<FiltroExpandido {...defaultProps} tabelasDespesa={{ ...defaultProps.tabelasDespesa, tipos_transacao: [] }} />);
            expect(screen.getByLabelText('Forma de pagamento').querySelectorAll('option').length).toBe(1);

            expect(() => rerender(<FiltroExpandido {...defaultProps} tabelasDespesa={{ ...defaultProps.tabelasDespesa, tipos_transacao: undefined }} />)).not.toThrow();
        });
    });

    describe('DatePicker: Período de pagamento', () => {
        it('renderiza o RangePicker com o id data_range', () => {
            const { container } = render(<FiltroExpandido {...defaultProps} />);
            expect(container.querySelector('#data_range')).toBeInTheDocument();
            expect(container.querySelector('.ant-picker-range')).toBeInTheDocument();
        });

        it('exibe defaultValue formatado quando já existem datas nos filtros', () => {
            expect(() => render(
                <FiltroExpandido
                    {...defaultProps}
                    stateFiltros={{
                        ...defaultProps.stateFiltros,
                        filtrar_por_data_inicio: '2024-01-01',
                        filtrar_por_data_fim: '2024-01-31',
                    }}
                />
            )).not.toThrow();
        });

        it('possui um botão de limpar quando já existem datas selecionadas', () => {
            const { container } = render(
                <FiltroExpandido
                    {...defaultProps}
                    stateFiltros={{
                        ...defaultProps.stateFiltros,
                        filtrar_por_data_inicio: '2024-01-01',
                        filtrar_por_data_fim: '2024-01-31',
                    }}
                />
            );
            expect(container.querySelector('.ant-picker-clear')).toBeInTheDocument();
        });
    });

    describe('Multiselect: Informações e Conferência', () => {
        it('renderiza sem erros com listas vazias ou indefinidas', () => {
            expect(() => render(
                <FiltroExpandido {...defaultProps} listaTagInformacao={[]} listaTagsConferencia={undefined} />
            )).not.toThrow();
        });

        it('renderiza as duas listas quando preenchidas', () => {
            render(<FiltroExpandido {...defaultProps} />);
            expect(screen.getByLabelText('Informações')).toBeInTheDocument();
            expect(screen.getByLabelText('Conferência')).toBeInTheDocument();
        });
    });

    describe('Botoes', () => {
        it('renderiza três botões e propaga os cliques', async () => {
            const user = userEvent.setup();
            const limpaFiltros = jest.fn();
            const handleSubmitFiltros = jest.fn();
            const setBtnMaisFiltros = jest.fn();
            const { container } = render(
                <FiltroExpandido
                    {...defaultProps}
                    limpaFiltros={limpaFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                    setBtnMaisFiltros={setBtnMaisFiltros}
                />
            );

            const buttons = container.querySelectorAll('.d-flex.justify-content-end button');
            expect(buttons.length).toBe(3);

            await user.click(buttons[0]);
            expect(setBtnMaisFiltros).toHaveBeenCalledWith(false);

            await user.click(buttons[1]);
            expect(limpaFiltros).toHaveBeenCalledTimes(1);

            await user.click(buttons[2]);
            expect(handleSubmitFiltros).toHaveBeenCalledTimes(1);
        });
    });
});
