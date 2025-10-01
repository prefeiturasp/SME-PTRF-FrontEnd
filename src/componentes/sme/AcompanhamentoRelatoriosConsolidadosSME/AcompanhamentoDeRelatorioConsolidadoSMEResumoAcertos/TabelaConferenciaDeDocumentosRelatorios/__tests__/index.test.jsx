import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TabelaConferenciaDeDocumentosRelatorios } from '../index';

jest.mock('primereact/datatable', () => ({
    DataTable: ({ value = [], children, onRowToggle, rowExpansionTemplate }) => {
        return (
            <div data-testid="datatable">
                <div data-testid="datatable-rows">
                    {value.map((row, idx) => (
                        <div key={row.id ?? idx} data-testid={`row-${idx}`}>
                            {children}
                            <button
                                data-testid={`expander-${idx}`}
                                onClick={() => {
                                    onRowToggle?.({ data: { [idx]: true } });
                                }}
                            >
                                expand
                            </button>
                            <div data-testid={`expansion-${idx}`}>
                                {rowExpansionTemplate ? rowExpansionTemplate(row) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    },
}));

jest.mock('primereact/column', () => ({
    Column: ({ header, field }) => (
        <div data-testid={`column-${field || 'expander'}`}>{header}</div>
    ),
}));

jest.mock('../../../../../../services/sme/AcompanhamentoSME.service', () => ({
    detalhamentoConferenciaDocumentos: jest.fn(),
}));

import { detalhamentoConferenciaDocumentos } from '../../../../../../services/sme/AcompanhamentoSME.service';

const makeDoc = (over = {}) => ({
    id: over.id ?? '1',
    nome: over.nome ?? 'Documento X',
    analise_documento_consolidado_dre: {
        resultado: over.resultado ?? 'AJUSTE',
        detalhamento: over.detalhamento ?? 'Detalhe do ajuste',
    },
});

describe('TabelaConferenciaDeDocumentosRelatorios', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('não renderiza tabela quando não há dados', () => {
        const setLista = jest.fn();
        render(
            <TabelaConferenciaDeDocumentosRelatorios
                relatorioConsolidado={null}
                listaDocumentoHistorico={[]}
                listaDeDocumentosRelatorio={[]}
                setListaDeDocumentosRelatorio={setLista}
                tabAtual="relatorio"
            />
        );
        expect(screen.queryByText(/Acertos nos documentos/i)).not.toBeInTheDocument();
        expect(screen.queryByTestId('datatable')).not.toBeInTheDocument();
    });

    test('chama o serviço quando analise_atual existe e filtra por resultado "AJUSTE"', async () => {
        const setLista = jest.fn();

        const responseMock = {
            data: {
                lista_documentos: {
                    a: makeDoc({ id: 'a', resultado: 'AJUSTE', nome: 'Doc Ajuste 1' }),
                    b: makeDoc({ id: 'b', resultado: 'OK', nome: 'Doc OK' }),
                    c: makeDoc({ id: 'c', resultado: 'AJUSTE', nome: 'Doc Ajuste 2' }),
                },
            },
        };

        detalhamentoConferenciaDocumentos.mockResolvedValueOnce(responseMock);

        const relatorioConsolidado = {
            analise_atual: {
                consolidado_dre: 'dre-uuid',
                uuid: 'analise-uuid',
            },
        };

        render(
            <TabelaConferenciaDeDocumentosRelatorios
                relatorioConsolidado={relatorioConsolidado}
                listaDocumentoHistorico={[]}
                listaDeDocumentosRelatorio={[/* começa vazio, será setado via serviço */]}
                setListaDeDocumentosRelatorio={setLista}
                tabAtual="relatorio"
            />
        );

        await waitFor(() => {
            expect(detalhamentoConferenciaDocumentos).toHaveBeenCalledWith(
                'dre-uuid',
                'analise-uuid'
            );
        });

        await waitFor(() => {
            expect(setLista).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({ id: 'a', nome: 'Doc Ajuste 1' }),
                    expect.objectContaining({ id: 'c', nome: 'Doc Ajuste 2' }),
                ])
            );
            const arg = setLista.mock.calls[0][0];
            expect(arg.find(d => d.id === 'b')).toBeUndefined();
        });
    });

    test('não chama o serviço quando relatorioConsolidado.analise_atual é undefined', async () => {
        const setLista = jest.fn();
        render(
            <TabelaConferenciaDeDocumentosRelatorios
                relatorioConsolidado={{}}
                listaDocumentoHistorico={[]}
                listaDeDocumentosRelatorio={[]}
                setListaDeDocumentosRelatorio={setLista}
                tabAtual="relatorio"
            />
        );

        await new Promise(r => setTimeout(r, 20));
        expect(detalhamentoConferenciaDocumentos).not.toHaveBeenCalled();
    });

    test('renderiza lista de histórico quando tabAtual === "historico"', () => {
        const setLista = jest.fn();
        const historico = [
            makeDoc({ id: 'h1', nome: 'Histórico 1' }),
            makeDoc({ id: 'h2', nome: 'Histórico 2' }),
        ];
        const listaRelatorio = [
            makeDoc({ id: 'r1', nome: 'Relatório 1' }),
        ];

        render(
            <TabelaConferenciaDeDocumentosRelatorios
                relatorioConsolidado={{}}
                listaDocumentoHistorico={historico}
                listaDeDocumentosRelatorio={listaRelatorio}
                setListaDeDocumentosRelatorio={setLista}
                tabAtual="historico"
            />
        );

        expect(screen.getByText(/Acertos nos documentos/i)).toBeInTheDocument();
        expect(screen.getByTestId('datatable')).toBeInTheDocument();

        const rowsWrapper = screen.getByTestId('datatable-rows');
        const rows = within(rowsWrapper).getAllByTestId(/row-/);
        expect(rows.length).toBe(historico.length);
    });

    test('renderiza lista de relatório quando tabAtual !== "historico"', () => {
        const setLista = jest.fn();
        const historico = [
            makeDoc({ id: 'h1', nome: 'Histórico 1' }),
        ];
        const listaRelatorio = [
            makeDoc({ id: 'r1', nome: 'Relatório 1' }),
            makeDoc({ id: 'r2', nome: 'Relatório 2' }),
        ];

        render(
            <TabelaConferenciaDeDocumentosRelatorios
                relatorioConsolidado={{}}
                listaDocumentoHistorico={historico}
                listaDeDocumentosRelatorio={listaRelatorio}
                setListaDeDocumentosRelatorio={setLista}
                tabAtual="relatorio"
            />
        );

        expect(screen.getByText(/Acertos nos documentos/i)).toBeInTheDocument();
        const rowsWrapper = screen.getByTestId('datatable-rows');
        const rows = within(rowsWrapper).getAllByTestId(/row-/);
        expect(rows.length).toBe(listaRelatorio.length);
    });

    test('expansão de linha exibe o detalhamento', () => {
        const setLista = jest.fn();
        const listaRelatorio = [
            makeDoc({
                id: 'r1',
                nome: 'Relatório 1',
                detalhamento: 'Detalhamento visível ao expandir',
            }),
        ];

        render(
            <TabelaConferenciaDeDocumentosRelatorios
                relatorioConsolidado={{}}
                listaDocumentoHistorico={[]}
                listaDeDocumentosRelatorio={listaRelatorio}
                setListaDeDocumentosRelatorio={setLista}
                tabAtual="relatorio"
            />
        );

        const expander = screen.getByTestId('expander-0');
        fireEvent.click(expander);

        expect(
            screen.getByText(/Detalhamento para acertos/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText('Detalhamento visível ao expandir')
        ).toBeInTheDocument();
    });
});