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
                {props.optionLabel ? item[props.optionLabel] : item.nome}
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

    it('deve renderizar mesmo quando tabelaPaa não é informado (usa o valor padrão)', () => {
        render(
            <FiltrosPaa
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

    it('não filtra as unidades por tipo quando tipoUnidadeManual é falso, mesmo com tipo_unidade selecionado', () => {
        const props = {
            ...defaultProps,
            tabelaPaa: {
                ...defaultProps.tabelaPaa,
                unidades: [
                    { uuid: 'u1', unidade_educacional: 'Escola A', tipo_unidade: 'EMEF' },
                    { uuid: 'u2', unidade_educacional: 'Escola B', tipo_unidade: 'EMEI' },
                ],
            },
            filtros: { ...defaultProps.filtros, tipo_unidade: 'EMEF' },
            tipoUnidadeManual: false,
        };

        render(<FiltrosPaa {...props} />);

        const opcoes = screen.getByTestId('unidade').querySelectorAll('option');
        expect(opcoes.length).toBe(3); // default + Escola A + Escola B
    });

    it('não filtra as unidades por tipo quando tipoUnidadeManual é true mas nenhum tipo_unidade foi selecionado', () => {
        const props = {
            ...defaultProps,
            tabelaPaa: {
                ...defaultProps.tabelaPaa,
                unidades: [
                    { uuid: 'u1', unidade_educacional: 'Escola A', tipo_unidade: 'EMEF' },
                    { uuid: 'u2', unidade_educacional: 'Escola B', tipo_unidade: 'EMEI' },
                ],
            },
            filtros: { ...defaultProps.filtros, tipo_unidade: '' },
            tipoUnidadeManual: true,
        };

        render(<FiltrosPaa {...props} />);

        const opcoes = screen.getByTestId('unidade').querySelectorAll('option');
        expect(opcoes.length).toBe(3);
    });

    it('filtra as unidades pelo tipo_unidade selecionado quando tipoUnidadeManual é true', () => {
        const props = {
            ...defaultProps,
            tabelaPaa: {
                ...defaultProps.tabelaPaa,
                unidades: [
                    { uuid: 'u1', unidade_educacional: 'Escola A', tipo_unidade: 'EMEF' },
                    { uuid: 'u2', unidade_educacional: 'Escola B', tipo_unidade: 'EMEI' },
                ],
            },
            filtros: { ...defaultProps.filtros, tipo_unidade: 'EMEF' },
            tipoUnidadeManual: true,
        };

        render(<FiltrosPaa {...props} />);

        expect(screen.getByText('Escola A')).toBeInTheDocument();
        expect(screen.queryByText('Escola B')).not.toBeInTheDocument();
    });

    it('ordena as unidades filtradas por ordem alfabética', () => {
        const props = {
            ...defaultProps,
            tabelaPaa: {
                ...defaultProps.tabelaPaa,
                unidades: [
                    { uuid: 'u1', unidade_educacional: 'Escola Z', tipo_unidade: 'EMEF' },
                    { uuid: 'u2', unidade_educacional: 'Escola A', tipo_unidade: 'EMEF' },
                ],
            },
        };

        render(<FiltrosPaa {...props} />);

        const opcoes = Array.from(screen.getByTestId('unidade').querySelectorAll('option')).map(
            (o) => o.textContent,
        );
        expect(opcoes).toEqual(['default', 'Escola A', 'Escola Z']);
    });

    it('ordena os períodos do mais recente para o mais antigo, por ano e depois por semestre', () => {
        const props = {
            ...defaultProps,
            tabelaPaa: {
                ...defaultProps.tabelaPaa,
                periodos: [
                    { uuid: 'p1', referencia: '2023.1' },
                    { uuid: 'p2', referencia: '2024.2' },
                    { uuid: 'p3', referencia: '2024.1' },
                ],
            },
        };

        render(<FiltrosPaa {...props} />);

        const opcoes = Array.from(screen.getByTestId('periodo').querySelectorAll('option')).map(
            (o) => o.textContent,
        );
        expect(opcoes).toEqual(['default', '2024.2', '2024.1', '2023.1']);
    });

    it('ordena os tipos de unidade e os status por ordem alfabética', () => {
        const props = {
            ...defaultProps,
            tabelaPaa: {
                ...defaultProps.tabelaPaa,
                tipos_unidade: [
                    { id: 'EMEI', nome: 'EMEI' },
                    { id: 'CEI', nome: 'CEI' },
                ],
                status: [
                    { id: 2, nome: 'Finalizado' },
                    { id: 1, nome: 'Ativo' },
                ],
            },
        };

        render(<FiltrosPaa {...props} />);

        const opcoesTipo = Array.from(screen.getByTestId('tipo_unidade').querySelectorAll('option')).map(
            (o) => o.textContent,
        );
        expect(opcoesTipo).toEqual(['default', 'CEI', 'EMEI']);

        const opcoesStatus = Array.from(screen.getByTestId('status').querySelectorAll('option')).map(
            (o) => o.textContent,
        );
        expect(opcoesStatus).toEqual(['default', 'Ativo', 'Finalizado']);
    });
});
