import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PaaCard } from '../PaaCard';

import {
    downloadDocumentoFinalPaa,
    getDownloadAtaPaa,
} from '../../../../../../../services/Paa.service';

import { useDocumentoFinalPaa } from '../../../../../../../hooks/Globais/useDocumentoFinalPaa';

const mockPaaSecaoPlanoEAta = jest.fn();
const mockModalVisualizarPdf = jest.fn();

jest.mock('../PaaSecaoPlanoEAta/PaaSecaoPlanoEAta', () => ({
    PaaSecaoPlanoEAta: (props) => {
        mockPaaSecaoPlanoEAta(props);

        return (
            <div data-testid={`secao-${props.tituloSecao || 'sem-titulo'}`}>
                <h2>{props.tituloSecao || 'Sem título'}</h2>

                <button
                    onClick={() => props.onVisualizarDocumento(props.documento)}
                    aria-label={`visualizar-documento-${props.tituloAta}`}
                >
                    Visualizar documento
                </button>

                <button
                    onClick={() => props.onDownloadDocumento(props.documento)}
                    aria-label={`download-documento-${props.tituloAta}`}
                >
                    Download documento
                </button>

                <button
                    onClick={() => props.onVisualizarAta(props.ata, props.tituloAta)}
                    aria-label={`visualizar-ata-${props.tituloAta}`}
                >
                    Visualizar ata
                </button>

                <button
                    onClick={() => props.onDownloadAta(props.ata)}
                    aria-label={`download-ata-${props.tituloAta}`}
                >
                    Download ata
                </button>
            </div>
        );
    },
}));

jest.mock('../../../../../../Globais/ModalVisualizarPdf', () => ({
    ModalVisualizarPdf: (props) => {
        mockModalVisualizarPdf(props);

        if (!props.show) return null;

        return (
            <div data-testid='modal-pdf'>
                <h3>{props.titulo}</h3>

                <p>{props.url}</p>

                <button onClick={props.onHide}>Fechar modal</button>
            </div>
        );
    },
}));

jest.mock('../../../../../../../services/Paa.service', () => ({
    downloadDocumentoFinalPaa: jest.fn(),
    getDownloadAtaPaa: jest.fn(),
}));

jest.mock('../../../../../../../hooks/Globais/useDocumentoFinalPaa', () => ({
    useDocumentoFinalPaa: jest.fn(),
}));

describe('PaaCard', () => {
    const mockObterUrlDocumentoFinal = jest.fn();
    const mockObterUrlArquivoAtaPaa = jest.fn();
    const mockRevogarUrlDocumento = jest.fn();
    const mockChaveVisualizacaoDocumento = jest.fn();

    const dadosMock = {
        uuid: 'paa-123',

        esta_em_retificacao: true,
        exibe_dados_retificacao: true,

        retificacao: {
            documento: {
                uuid: 'doc-ret',
                status: {
                    retificacao: true,
                    versao_documento: 2,
                },
            },

            ata: {
                uuid: 'ata-ret',
            },
        },

        original: {
            documento: {
                uuid: 'doc-original',
                status: {
                    retificacao: false,
                    versao_documento: 1,
                },
            },

            ata: {
                uuid: 'ata-original',
            },
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockChaveVisualizacaoDocumento.mockReturnValue('doc-key');

        useDocumentoFinalPaa.mockReturnValue({
            obterUrlDocumentoFinal: mockObterUrlDocumentoFinal,

            obterUrlArquivoAtaPaa: mockObterUrlArquivoAtaPaa,

            revogarUrlDocumento: mockRevogarUrlDocumento,

            visualizacaoEmAndamento: null,

            chaveVisualizacaoDocumento: mockChaveVisualizacaoDocumento,
        });
    });

    describe('renderização inicial', () => {
        it('deve renderizar seção de retificação e original quando houver retificação', () => {
            render(<PaaCard dados={dadosMock} />);

            expect(screen.getByText('PAA Retificado #2')).toBeInTheDocument();

            expect(screen.getByText('PAA Original')).toBeInTheDocument();
        });

        it('deve renderizar apenas uma seção quando não houver retificação', () => {
            render(
                <PaaCard
                    dados={{
                        ...dadosMock,
                        esta_em_retificacao: false,
                        exibe_dados_retificacao: false,
                    }}
                />,
            );

            expect(screen.queryByText('PAA Retificado #2')).not.toBeInTheDocument();

            expect(screen.getByText('Sem título')).toBeInTheDocument();
        });

        it('deve renderizar o modal fechado inicialmente', () => {
            render(<PaaCard dados={dadosMock} />);

            expect(screen.queryByTestId('modal-pdf')).not.toBeInTheDocument();

            expect(mockModalVisualizarPdf).toHaveBeenCalledWith(
                expect.objectContaining({
                    show: false,
                    url: null,
                    titulo: 'Documento',
                    iframeTitle: 'Documento PAA',
                }),
            );
        });
    });

    describe('visualização de documentos', () => {
        it('deve abrir modal ao visualizar documento com sucesso', async () => {
            const user = userEvent.setup();

            mockObterUrlDocumentoFinal.mockResolvedValue('blob:url-documento');

            render(<PaaCard dados={dadosMock} />);

            await user.click(
                screen.getAllByRole('button', {
                    name: /visualizar-documento/i,
                })[0],
            );

            await waitFor(() => {
                expect(screen.getByTestId('modal-pdf')).toBeInTheDocument();
            });

            expect(mockObterUrlDocumentoFinal).toHaveBeenCalledWith('paa-123', true);

            expect(screen.getByText('Documento — Plano anual')).toBeInTheDocument();

            expect(screen.getByText('blob:url-documento')).toBeInTheDocument();
        });

        it('não deve abrir modal quando URL do documento for null', async () => {
            const user = userEvent.setup();

            mockObterUrlDocumentoFinal.mockResolvedValue(null);

            render(<PaaCard dados={dadosMock} />);

            await user.click(
                screen.getAllByRole('button', {
                    name: /visualizar-documento/i,
                })[0],
            );

            await waitFor(() => {
                expect(mockObterUrlDocumentoFinal).toHaveBeenCalled();
            });

            expect(screen.queryByTestId('modal-pdf')).not.toBeInTheDocument();
        });

        it('deve revogar URL anterior ao abrir novo PDF', async () => {
            const user = userEvent.setup();

            mockObterUrlDocumentoFinal
                .mockResolvedValueOnce('blob:url-1')
                .mockResolvedValueOnce('blob:url-2');

            render(<PaaCard dados={dadosMock} />);

            const botoes = screen.getAllByRole('button', {
                name: /visualizar-documento/i,
            });

            await user.click(botoes[0]);

            await waitFor(() => {
                expect(screen.getByText('blob:url-1')).toBeInTheDocument();
            });

            await user.click(botoes[1]);

            await waitFor(() => {
                expect(screen.getByText('blob:url-2')).toBeInTheDocument();
            });

            expect(mockRevogarUrlDocumento).toHaveBeenCalledWith('blob:url-1');
        });

        it('deve fechar modal e revogar URL', async () => {
            const user = userEvent.setup();

            mockObterUrlDocumentoFinal.mockResolvedValue('blob:url-documento');

            render(<PaaCard dados={dadosMock} />);

            await user.click(
                screen.getAllByRole('button', {
                    name: /visualizar-documento/i,
                })[0],
            );

            await waitFor(() => {
                expect(screen.getByTestId('modal-pdf')).toBeInTheDocument();
            });

            await user.click(
                screen.getByRole('button', {
                    name: /fechar modal/i,
                }),
            );

            expect(mockRevogarUrlDocumento).toHaveBeenCalledWith('blob:url-documento');

            await waitFor(() => {
                expect(screen.queryByTestId('modal-pdf')).not.toBeInTheDocument();
            });
        });
    });

    describe('download de documentos', () => {
        it('deve realizar download do documento', async () => {
            const user = userEvent.setup();

            downloadDocumentoFinalPaa.mockResolvedValue(undefined);

            render(<PaaCard dados={dadosMock} />);

            await user.click(
                screen.getAllByRole('button', {
                    name: /download-documento/i,
                })[0],
            );

            expect(downloadDocumentoFinalPaa).toHaveBeenCalledWith('paa-123', {
                retificacao: true,
            });
        });
    });

    describe('visualização de atas', () => {
        it('deve abrir modal ao visualizar ata', async () => {
            const user = userEvent.setup();

            mockObterUrlArquivoAtaPaa.mockResolvedValue('blob:url-ata');

            render(<PaaCard dados={dadosMock} />);

            await user.click(
                screen.getAllByRole('button', {
                    name: /visualizar-ata/i,
                })[0],
            );

            await waitFor(() => {
                expect(screen.getByTestId('modal-pdf')).toBeInTheDocument();
            });

            expect(mockObterUrlArquivoAtaPaa).toHaveBeenCalledWith('ata-ret');

            expect(screen.getByText('Documento — Ata de retificação do PAA')).toBeInTheDocument();
        });

        it('não deve buscar URL da ata quando uuid não existir', async () => {
            const user = userEvent.setup();

            render(
                <PaaCard
                    dados={{
                        ...dadosMock,
                        original: {
                            ...dadosMock.original,
                            ata: {},
                        },
                        esta_em_retificacao: false,
                        exibe_dados_retificacao: false,
                    }}
                />,
            );

            await user.click(
                screen.getByRole('button', {
                    name: /visualizar-ata/i,
                }),
            );

            await waitFor(() => {
                expect(mockObterUrlArquivoAtaPaa).not.toHaveBeenCalled();
            });

            expect(screen.queryByTestId('modal-pdf')).not.toBeInTheDocument();
        });
    });

    describe('download de atas', () => {
        it('deve realizar download da ata', async () => {
            const user = userEvent.setup();

            getDownloadAtaPaa.mockResolvedValue(undefined);

            render(<PaaCard dados={dadosMock} />);

            await user.click(
                screen.getAllByRole('button', {
                    name: /download-ata/i,
                })[0],
            );

            expect(getDownloadAtaPaa).toHaveBeenCalledWith('ata-ret');
        });

        it('não deve realizar download quando ata não possuir uuid', async () => {
            const user = userEvent.setup();

            render(
                <PaaCard
                    dados={{
                        ...dadosMock,
                        original: {
                            ...dadosMock.original,
                            ata: {},
                        },
                        esta_em_retificacao: false,
                        exibe_dados_retificacao: false,
                    }}
                />,
            );

            await user.click(
                screen.getByRole('button', {
                    name: /download-ata/i,
                }),
            );

            expect(getDownloadAtaPaa).not.toHaveBeenCalled();
        });
    });

    describe('integração com PaaSecaoPlanoEAta', () => {
        it('deve passar props corretas para seção de retificação', () => {
            render(<PaaCard dados={dadosMock} />);

            const primeiraChamada = mockPaaSecaoPlanoEAta.mock.calls[0][0];

            expect(primeiraChamada).toEqual(
                expect.objectContaining({
                    tituloSecao: 'PAA Retificado #2',

                    documento: dadosMock.retificacao.documento,

                    ata: dadosMock.retificacao.ata,

                    tituloAta: 'Ata de retificação do PAA',

                    paaUuid: 'paa-123',

                    visualizacaoEmAndamento: null,

                    chaveVisualizacaoDocumento: mockChaveVisualizacaoDocumento,

                    onVisualizarDocumento: expect.any(Function),

                    onDownloadDocumento: expect.any(Function),

                    onVisualizarAta: expect.any(Function),

                    onDownloadAta: expect.any(Function),
                }),
            );
        });

        it('deve passar props corretas para seção original', () => {
            render(<PaaCard dados={dadosMock} />);

            const segundaChamada = mockPaaSecaoPlanoEAta.mock.calls[1][0];

            expect(segundaChamada).toEqual(
                expect.objectContaining({
                    tituloSecao: 'PAA Original',

                    documento: dadosMock.original.documento,

                    ata: dadosMock.original.ata,

                    tituloAta: 'Ata de apresentação do PAA',
                }),
            );
        });
    });
});
