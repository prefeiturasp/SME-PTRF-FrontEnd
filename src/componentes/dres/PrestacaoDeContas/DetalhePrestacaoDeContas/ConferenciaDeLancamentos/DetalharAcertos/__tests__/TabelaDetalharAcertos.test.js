import React from 'react';
import { render, screen } from '@testing-library/react';
import { TabelaDetalharAcertos } from '../TabelaDetalharAcertos';

jest.mock(
    '../../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useValorTemplate',
    () => () => (row) => <span>{row.valor_transacao_total}</span>,
);

jest.mock(
    '../../../../../../../hooks/Globais/useDataTemplate',
    () => () => jest.fn((_, __, data) => data || '01/01/2024'),
);

jest.mock(
    '../../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useConferidoTemplate',
    () => () => () => <span>Conferido</span>,
);

jest.mock(
    '../../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useNumeroDocumentoTemplate',
    () => () => (row) => <span>{row.numero_documento}</span>,
);

jest.mock(
    '../../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useRowExpansionDespesaTemplate',
    () => () => (row) => <div data-testid='expansao-despesa'>Expansão despesa {row.uuid}</div>,
);

jest.mock(
    '../../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useRowExpansionReceitaTemplate',
    () => () => (row) => <div data-testid='expansao-receita'>Expansão receita {row.uuid}</div>,
);

jest.mock('primereact/datatable', () => {
    const React = require('react');

    return {
        DataTable: ({ value, children, rowExpansionTemplate }) => (
            <div>
                {value.map((row) => (
                    <div key={row.uuid}>
                        {React.Children.map(children, (child) => {
                            if (!child) return null;

                            const body = child.props.body;
                            const field = child.props.field;
                            const expander = child.props.expander;

                            if (expander && rowExpansionTemplate) {
                                return rowExpansionTemplate(row);
                            }

                            if (body) {
                                return body(row);
                            }

                            return <span>{row[field]}</span>;
                        })}
                    </div>
                ))}
            </div>
        ),
    };
});

jest.mock('primereact/column', () => ({
    Column: (props) => props,
}));

jest.mock('react-tooltip', () => ({
    Tooltip: () => <div />,
}));

const creditoComTooltip = {
    uuid: '1',
    tipo_transacao: 'Crédito',
    valor_transacao_total: '100',
    numero_documento: 'DOC123',
    documento_mestre: {
        rateio_estornado: {
            uuid: 'UUID',
            data_documento: '2024-01-01',
        },
    },
};

const creditoSemTooltip = {
    uuid: '2',
    tipo_transacao: 'Crédito',
    valor_transacao_total: '200',
    numero_documento: 'DOC456',
    documento_mestre: {},
};

const gastoComEstorno = {
    uuid: '3',
    tipo_transacao: 'Gasto',
    valor_transacao_total: '300',
    numero_documento: 'DOC789',
    rateios: [{ estorno: { uuid: 'X' } }],
};

const gastoSemEstorno = {
    uuid: '4',
    tipo_transacao: 'Gasto',
    valor_transacao_total: '400',
    numero_documento: 'DOC999',
    rateios: [],
};

describe('TabelaDetalharAcertos', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar corretamente com lista vazia', () => {
        render(<TabelaDetalharAcertos lancamemtosParaAcertos={[]} prestacaoDeContas={{}} />);

        expect(screen.queryByText(/Crédito|Gasto/i)).not.toBeInTheDocument();
    });

    it('deve renderizar linhas de crédito e gasto', () => {
        render(
            <TabelaDetalharAcertos
                lancamemtosParaAcertos={[creditoComTooltip, gastoComEstorno]}
                prestacaoDeContas={{}}
            />,
        );

        expect(screen.getByText('Crédito')).toBeInTheDocument();
        expect(screen.getByText('Gasto')).toBeInTheDocument();
    });

    it('deve expandir corretamente crédito usando rowExpansionReceitaTemplate', () => {
        render(
            <TabelaDetalharAcertos
                lancamemtosParaAcertos={[creditoComTooltip]}
                prestacaoDeContas={{}}
            />,
        );

        expect(screen.getByTestId('expansao-receita')).toBeInTheDocument();
    });

    it('deve expandir corretamente gasto usando rowExpansionDespesaTemplate', () => {
        render(
            <TabelaDetalharAcertos
                lancamemtosParaAcertos={[gastoComEstorno]}
                prestacaoDeContas={{}}
            />,
        );

        expect(screen.getByTestId('expansao-despesa')).toBeInTheDocument();
    });

    it('deve usar template de Crédito quando tipo_transacao é Crédito', () => {
        render(
            <TabelaDetalharAcertos
                lancamemtosParaAcertos={[creditoSemTooltip]}
                prestacaoDeContas={{}}
            />,
        );

        expect(document.body).toHaveTextContent('Crédito');
    });

    it('deve usar template de Gasto quando tipo_transacao é Gasto', () => {
        render(
            <TabelaDetalharAcertos
                lancamemtosParaAcertos={[gastoSemEstorno]}
                prestacaoDeContas={{}}
            />,
        );

        expect(screen.getByText('Gasto')).toBeInTheDocument();
    });

    it('deve retornar tooltip quando gasto possui rateio com estorno', () => {
        const gastoComEstorno = {
            uuid: '99',
            tipo_transacao: 'Gasto',
            rateios: [{ estorno: { uuid: 'ESTORNO-1' } }],
        };

        render(
            <TabelaDetalharAcertos
                lancamemtosParaAcertos={[gastoComEstorno]}
                prestacaoDeContas={{}}
            />,
        );

        const tooltip = screen.getByText('Gasto').closest('[data-tooltip-html]');

        expect(tooltip).toHaveAttribute('data-tooltip-html', 'Esse gasto possui estornos.');
    });

    it('não deve retornar tooltip quando gasto tem rateios sem estorno', () => {
        const gastoSemEstorno = {
            uuid: '98',
            tipo_transacao: 'Gasto',
            rateios: [{}],
        };

        render(
            <TabelaDetalharAcertos
                lancamemtosParaAcertos={[gastoSemEstorno]}
                prestacaoDeContas={{}}
            />,
        );

        const span = screen.getByText('Gasto');

        expect(span.tagName).toBe('SPAN');
        expect(span.closest('[data-tooltip-id]')).toBeNull();
    });

    it('não deve retornar tooltip quando gasto possui rateios vazio', () => {
        const gastoRateioVazio = {
            uuid: '97',
            tipo_transacao: 'Gasto',
            rateios: [],
        };

        render(
            <TabelaDetalharAcertos
                lancamemtosParaAcertos={[gastoRateioVazio]}
                prestacaoDeContas={{}}
            />,
        );

        const span = screen.getByText('Gasto');

        expect(span.tagName).toBe('SPAN');
        expect(span.closest('[data-tooltip-id]')).toBeNull();
    });

    it('não deve retornar tooltip quando gasto não possui rateios', () => {
        const gastoSemRateios = {
            uuid: '96',
            tipo_transacao: 'Gasto',
        };

        render(
            <TabelaDetalharAcertos
                lancamemtosParaAcertos={[gastoSemRateios]}
                prestacaoDeContas={{}}
            />,
        );

        const span = screen.getByText('Gasto');

        expect(span.tagName).toBe('SPAN');
        expect(span.closest('[data-tooltip-id]')).toBeNull();
    });

    it('deve retornar tooltip quando crédito possui rateio_estornado com uuid', () => {
        const creditoComEstorno = {
            uuid: '10',
            tipo_transacao: 'Crédito',
            documento_mestre: {
                rateio_estornado: {
                    uuid: 'EST-1',
                    data_documento: '2024-01-15',
                },
            },
        };

        render(
            <TabelaDetalharAcertos
                lancamemtosParaAcertos={[creditoComEstorno]}
                prestacaoDeContas={{}}
            />,
        );

        const tooltipWrapper = screen.getByText('Crédito').closest('[data-tooltip-html]');

        expect(tooltipWrapper).toBeInTheDocument();
        expect(tooltipWrapper).toHaveAttribute(
            'data-tooltip-html',
            'Esse estorno está vinculado <br/> à despesa do dia 2024-01-15.',
        );
        expect(tooltipWrapper).toHaveAttribute('data-tooltip-id', 'tooltip-id-10');
    });

    it('não deve retornar tooltip quando crédito não possui rateio_estornado', () => {
        const creditoSemEstorno = {
            uuid: '11',
            tipo_transacao: 'Crédito',
            documento_mestre: {},
        };

        render(
            <TabelaDetalharAcertos
                lancamemtosParaAcertos={[creditoSemEstorno]}
                prestacaoDeContas={{}}
            />,
        );
        expect(document.body).toHaveTextContent('Crédito');
    });
});
