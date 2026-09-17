import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormFiltros } from '../FormFiltros';

let mockCapturedDatePickerProps = [];
jest.mock('../../../../Globais/DatePickerField', () => ({
    DatePickerField: (props) => {
        mockCapturedDatePickerProps.push(props);
        return <input data-testid={`date-${props.name}`} value={props.value || ''} readOnly />;
    },
}));

describe('FormFiltros (ListaPrestacaoDeContas)', () => {
    const tabelaAssociacoes = {
        tipos_unidade: [
            { id: 'EMEF', nome: 'EMEF' },
            { id: 'ADM', nome: 'Administração' },
            { id: 'DRE', nome: 'Diretoria Regional' },
            { id: 'IFSP', nome: 'IFSP' },
            { id: 'CMCT', nome: 'CMCT' },
            { id: 'CEU', nome: 'CEU' },
        ],
    };
    const tabelaPrestacoes = { status: [{ id: 'RECEBIDA', nome: 'Recebida' }, { id: 'EM_ANALISE', nome: 'Em análise' }] };
    const tecnicosList = [{ uuid: 't1', nome: 'Técnico 1' }, { uuid: 't2', nome: 'Técnico 2' }];

    const defaultProps = {
        selectedStatusPc: [],
        handleChangeSelectStatusPc: jest.fn(),
        tabelaAssociacoes,
        tabelaPrestacoes,
        stateFiltros: { filtrar_por_termo: '', filtrar_por_tipo_de_unidade: '', filtrar_por_tecnico_atribuido: '', filtrar_por_data_inicio: '', filtrar_por_data_fim: '' },
        handleChangeFiltros: jest.fn(),
        handleSubmitFiltros: jest.fn(),
        limpaFiltros: jest.fn(),
        toggleMaisFiltros: false,
        setToggleMaisFiltros: jest.fn(),
        tecnicosList,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockCapturedDatePickerProps = [];
    });

    it('renderiza o campo de filtro por termo e propaga a digitação', () => {
        const handleChangeFiltros = jest.fn();
        render(<FormFiltros {...defaultProps} handleChangeFiltros={handleChangeFiltros} />);

        const input = screen.getByPlaceholderText('Escreva o termo que deseja filtrar');
        fireEvent.change(input, { target: { name: 'filtrar_por_termo', value: 'Escola X' } });
        expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_termo', 'Escola X');
    });

    it('filtra do select de tipo de unidade os tipos ADM, DRE, IFSP e CMCT', () => {
        render(<FormFiltros {...defaultProps} />);
        const select = screen.getByLabelText('Filtrar por tipo de unidade');
        expect(screen.getByRole('option', { name: 'EMEF' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'CEU' })).toBeInTheDocument();
        expect(select).not.toHaveTextContent('Administração');
        expect(select).not.toHaveTextContent('Diretoria Regional');
        expect(select).not.toHaveTextContent('IFSP');
        expect(select).not.toHaveTextContent('CMCT');
    });

    it('lida com tabelaAssociacoes sem tipos_unidade', () => {
        expect(() => render(<FormFiltros {...defaultProps} tabelaAssociacoes={{}} />)).not.toThrow();
    });

    it('propaga a seleção do tipo de unidade', () => {
        const handleChangeFiltros = jest.fn();
        render(<FormFiltros {...defaultProps} handleChangeFiltros={handleChangeFiltros} />);
        fireEvent.change(screen.getByLabelText('Filtrar por tipo de unidade'), { target: { name: 'filtrar_por_tipo_de_unidade', value: 'EMEF' } });
        expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_tipo_de_unidade', 'EMEF');
    });

    it('renderiza o select de status com a opção "Todos" e os status da tabela', () => {
        const { container } = render(<FormFiltros {...defaultProps} />);
        fireEvent.mouseDown(container.querySelector('.multiselect-filtrar-por-status .ant-select-selector'));
        expect(screen.getByText('Todos')).toBeInTheDocument();
        expect(screen.getByText('Recebida')).toBeInTheDocument();
        expect(screen.getByText('Em análise')).toBeInTheDocument();
    });

    it('lida com tabelaPrestacoes sem status', () => {
        expect(() => render(<FormFiltros {...defaultProps} tabelaPrestacoes={{}} />)).not.toThrow();
    });

    it('não exibe a seção de mais filtros quando toggleMaisFiltros é false, e exibe quando true', () => {
        const { container, rerender } = render(<FormFiltros {...defaultProps} toggleMaisFiltros={false} />);
        expect(container.querySelector('.collapse')).not.toHaveClass('show');

        rerender(<FormFiltros {...defaultProps} toggleMaisFiltros={true} />);
        expect(container.querySelector('.collapse')).toHaveClass('show');
    });

    it('renderiza a lista de técnicos e propaga a seleção', () => {
        const handleChangeFiltros = jest.fn();
        render(<FormFiltros {...defaultProps} handleChangeFiltros={handleChangeFiltros} />);
        expect(screen.getByRole('option', { name: 'Técnico 1' })).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText('Filtrar por técnico atribuído'), { target: { name: 'filtrar_por_tecnico_atribuido', value: 't1' } });
        expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_tecnico_atribuido', 't1');
    });

    it('lida com tecnicosList vazia ou indefinida', () => {
        const { rerender } = render(<FormFiltros {...defaultProps} tecnicosList={[]} />);
        expect(screen.getByLabelText('Filtrar por técnico atribuído').querySelectorAll('option').length).toBe(1);

        rerender(<FormFiltros {...defaultProps} tecnicosList={undefined} />);
        expect(screen.getByLabelText('Filtrar por técnico atribuído').querySelectorAll('option').length).toBe(1);
    });

    it('renderiza os dois DatePickerField de período com os valores e onChange corretos', () => {
        render(<FormFiltros {...defaultProps} stateFiltros={{ ...defaultProps.stateFiltros, filtrar_por_data_inicio: '2024-01-01', filtrar_por_data_fim: '2024-01-31' }} />);

        expect(screen.getByTestId('date-filtrar_por_data_inicio')).toHaveValue('2024-01-01');
        expect(screen.getByTestId('date-filtrar_por_data_fim')).toHaveValue('2024-01-31');
        expect(mockCapturedDatePickerProps.every((p) => p.onChange === defaultProps.handleChangeFiltros)).toBe(true);
    });

    it('alterna o texto do botão de mais filtros e chama setToggleMaisFiltros ao clicar', () => {
        const setToggleMaisFiltros = jest.fn();
        const { rerender } = render(<FormFiltros {...defaultProps} setToggleMaisFiltros={setToggleMaisFiltros} />);
        const botao = screen.getByText('Mais Filtros');
        fireEvent.click(botao);
        expect(setToggleMaisFiltros).toHaveBeenCalledWith(true);

        rerender(<FormFiltros {...defaultProps} toggleMaisFiltros={true} setToggleMaisFiltros={setToggleMaisFiltros} />);
        expect(screen.getByText('Menos filtros')).toBeInTheDocument();
    });

    it('chama limpaFiltros e handleSubmitFiltros ao clicar nos respectivos botões', () => {
        const limpaFiltros = jest.fn();
        const handleSubmitFiltros = jest.fn();
        render(<FormFiltros {...defaultProps} limpaFiltros={limpaFiltros} handleSubmitFiltros={handleSubmitFiltros} />);

        fireEvent.click(screen.getByText('Limpar'));
        expect(limpaFiltros).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByText('Filtrar'));
        expect(handleSubmitFiltros).toHaveBeenCalledTimes(1);
    });
});
