import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FiltrosPaa } from '../index';

jest.mock('../../../../Globais/SelectMultiFiltro', () => (props) => (
    <div data-testid={`container-${props.name}`}>
        <label>{props.label}</label>
        <select
            data-testid={props.name}
            value={props.value}
            onChange={(e) => props.onChange(props.name, e.target.value)}
            disabled={props.disabled}
        >
            <option value=''>default</option>
            {props.data?.map((item) => (
                <option key={item.id} value={item.id}>
                    {item.nome}
                </option>
            ))}
        </select>
    </div>
));

jest.mock('../../../../Globais/SelectFiltro', () => (props) => (
    <select
        data-testid={props.name}
        value={props.value}
        onChange={(e) => props.onChange(props.name, e.target.value)}
        disabled={props.disabled}
    >
        <option value=''>default</option>
        {props.data?.map((item) => (
            <option key={item.id} value={item.id}>
                {item.nome}
            </option>
        ))}
    </select>
));

describe('FiltrosPaa Component', () => {
    const mockAoAlterarFiltro = jest.fn();
    const mockAoSubmeterFiltros = jest.fn((e) => e.preventDefault());
    const mockLimpaFiltros = jest.fn();

    const defaultProps = {
        tabelaPaa: {
            periodos: [{ uuid: 'p1', referencia: '2024' }],
            unidades: [{ uuid: 'u1', nome: 'Escola A', tipo_unidade: 'EMEF' }],
            tipos_unidade: [{ id: 'EMEF', nome: 'EMEF' }],
            status: [{ id: 1, nome: 'Ativo' }],
        },
        filtros: {
            periodo: [],
            unidade: '',
            tipo_unidade: '',
            status: [],
        },
        aoAlterarFiltro: mockAoAlterarFiltro,
        aoSubmeterFiltros: mockAoSubmeterFiltros,
        limpaFiltros: mockLimpaFiltros,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar todos os filtros (periodo, unidade, tipo_unidade e status)', () => {
        render(<FiltrosPaa {...defaultProps} />);

        expect(screen.getByTestId('periodo')).toBeInTheDocument();
        expect(screen.getByTestId('unidade')).toBeInTheDocument();
        expect(screen.getByTestId('tipo_unidade')).toBeInTheDocument();
        expect(screen.getByTestId('status')).toBeInTheDocument();
    });

    it('deve chamar aoAlterarFiltro ao mudar um valor', () => {
        render(<FiltrosPaa {...defaultProps} />);

        const selectUnidade = screen.getByTestId('unidade');
        fireEvent.change(selectUnidade, { target: { value: 'u1' } });

        expect(mockAoAlterarFiltro).toHaveBeenCalledWith('unidade', 'u1');
    });

    it('deve submeter o formulário corretamente', () => {
        render(<FiltrosPaa {...defaultProps} />);
        const form = screen.getByTestId('filtros-form');

        fireEvent.submit(form);
        expect(mockAoSubmeterFiltros).toHaveBeenCalled();
    });

    it('deve chamar limpaFiltros ao clicar no botão limpar', () => {
        render(<FiltrosPaa {...defaultProps} />);
        const buttonLimpar = screen.getByText(/limpar/i);

        fireEvent.click(buttonLimpar);
        expect(mockLimpaFiltros).toHaveBeenCalled();
    });

    it('deve desabilitar tipo_unidade se uma unidade estiver selecionada', () => {
        const propsComUnidade = {
            ...defaultProps,
            filtros: { ...defaultProps.filtros, unidade: 'u1' },
        };
        render(<FiltrosPaa {...propsComUnidade} />);

        const selectTipo = screen.getByTestId('tipo_unidade');
        expect(selectTipo).toBeDisabled();
    });

    it('deve renderizar mesmo com tabelaPaa incompleta (default values)', () => {
        render(
            <FiltrosPaa
                tabelaPaa={{}}
                filtros={{
                    periodo: [],
                    unidade: '',
                    tipo_unidade: '',
                    status: [],
                }}
                aoAlterarFiltro={mockAoAlterarFiltro}
                aoSubmeterFiltros={mockAoSubmeterFiltros}
                limpaFiltros={mockLimpaFiltros}
                tipoUnidadeManual={false}
            />,
        );

        expect(screen.getByTestId('filtros-form')).toBeInTheDocument();
    });
});
