import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PaaSecaoPlanoEAta } from '../PaaSecaoPlanoEAta';

const mockPaaLinhaDocumento = jest.fn();

jest.mock('../../../PaaLinhaDocumento/PaaLinhaDocumento', () => ({
    PaaLinhaDocumento: (props) => {
        mockPaaLinhaDocumento(props);

        return (
            <div data-testid={`linha-${props.testIdPrefix}`}>
                <h4>{props.titulo}</h4>

                <p>
                    loading:
                    {props.carregandoVisualizar ? 'true' : 'false'}
                </p>

                <button
                    onClick={props.onVisualizar}
                    aria-label={`visualizar-${props.testIdPrefix}`}
                >
                    Visualizar
                </button>

                <button onClick={props.onDownload} aria-label={`download-${props.testIdPrefix}`}>
                    Download
                </button>
            </div>
        );
    },
}));

describe('PaaSecaoPlanoEAta', () => {
    const documentoMock = {
        uuid: 'doc-1',
        status: {
            retificacao: true,
        },
    };

    const ataMock = {
        uuid: 'ata-1',
    };

    const defaultProps = {
        tituloSecao: 'Seção PAA',
        documento: documentoMock,
        ata: ataMock,
        tituloAta: 'Ata da reunião',
        paaUuid: 'paa-123',
        chaveVisualizacaoDocumento: jest.fn(),
        visualizacaoEmAndamento: null,
        onVisualizarDocumento: jest.fn(),
        onDownloadDocumento: jest.fn(),
        onVisualizarAta: jest.fn(),
        onDownloadAta: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();

        defaultProps.chaveVisualizacaoDocumento.mockReturnValue('doc:paa-123');
    });

    describe('renderização inicial', () => {
        it('deve renderizar o título da seção quando informado', () => {
            render(<PaaSecaoPlanoEAta {...defaultProps} />);

            expect(
                screen.getByRole('heading', {
                    level: 3,
                    name: 'Seção PAA',
                }),
            ).toBeInTheDocument();
        });

        it('não deve renderizar o título da seção quando tituloSecao for null', () => {
            render(<PaaSecaoPlanoEAta {...defaultProps} tituloSecao={null} />);

            expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
        });

        it('deve renderizar a linha do plano anual', () => {
            render(<PaaSecaoPlanoEAta {...defaultProps} />);

            expect(screen.getByTestId('linha-plano')).toBeInTheDocument();

            expect(
                screen.getByRole('heading', {
                    level: 4,
                    name: 'Plano anual',
                }),
            ).toBeInTheDocument();
        });

        it('deve renderizar a linha da ata com o título informado', () => {
            render(<PaaSecaoPlanoEAta {...defaultProps} />);

            expect(screen.getByTestId('linha-ata')).toBeInTheDocument();

            expect(
                screen.getByRole('heading', {
                    level: 4,
                    name: 'Ata da reunião',
                }),
            ).toBeInTheDocument();
        });

        it('deve chamar chaveVisualizacaoDocumento com os parâmetros corretos', () => {
            render(<PaaSecaoPlanoEAta {...defaultProps} />);

            expect(defaultProps.chaveVisualizacaoDocumento).toHaveBeenCalledTimes(1);

            expect(defaultProps.chaveVisualizacaoDocumento).toHaveBeenCalledWith('paa-123', true);
        });
    });

    describe('interações do usuário', () => {
        it('deve chamar onVisualizarDocumento ao clicar em visualizar plano', async () => {
            const user = userEvent.setup();

            render(<PaaSecaoPlanoEAta {...defaultProps} />);

            await user.click(
                screen.getByRole('button', {
                    name: 'visualizar-plano',
                }),
            );

            expect(defaultProps.onVisualizarDocumento).toHaveBeenCalledTimes(1);

            expect(defaultProps.onVisualizarDocumento).toHaveBeenCalledWith(documentoMock);
        });

        it('deve chamar onDownloadDocumento ao clicar em download plano', async () => {
            const user = userEvent.setup();

            render(<PaaSecaoPlanoEAta {...defaultProps} />);

            await user.click(
                screen.getByRole('button', {
                    name: 'download-plano',
                }),
            );

            expect(defaultProps.onDownloadDocumento).toHaveBeenCalledTimes(1);

            expect(defaultProps.onDownloadDocumento).toHaveBeenCalledWith(documentoMock);
        });

        it('deve chamar onVisualizarAta com ata e título ao clicar em visualizar ata', async () => {
            const user = userEvent.setup();

            render(<PaaSecaoPlanoEAta {...defaultProps} />);

            await user.click(
                screen.getByRole('button', {
                    name: 'visualizar-ata',
                }),
            );

            expect(defaultProps.onVisualizarAta).toHaveBeenCalledTimes(1);

            expect(defaultProps.onVisualizarAta).toHaveBeenCalledWith(ataMock, 'Ata da reunião');
        });

        it('deve chamar onDownloadAta ao clicar em download ata', async () => {
            const user = userEvent.setup();

            render(<PaaSecaoPlanoEAta {...defaultProps} />);

            await user.click(
                screen.getByRole('button', {
                    name: 'download-ata',
                }),
            );

            expect(defaultProps.onDownloadAta).toHaveBeenCalledTimes(1);

            expect(defaultProps.onDownloadAta).toHaveBeenCalledWith(ataMock);
        });
    });

    describe('estados condicionais', () => {
        it('deve marcar carregamento do documento quando visualizacaoEmAndamento for igual à chave do documento', () => {
            render(<PaaSecaoPlanoEAta {...defaultProps} visualizacaoEmAndamento='doc:paa-123' />);

            const loadingIndicators = screen.getAllByText(/loading:/i);

            expect(loadingIndicators[0]).toHaveTextContent('loading:true');
            expect(loadingIndicators[1]).toHaveTextContent('loading:false');
        });

        it('deve marcar carregamento da ata quando visualizacaoEmAndamento for igual à chave da ata', () => {
            render(<PaaSecaoPlanoEAta {...defaultProps} visualizacaoEmAndamento='ata:ata-1' />);

            const loadingIndicators = screen.getAllByText(/loading:/i);

            expect(loadingIndicators[0]).toHaveTextContent('loading:false');
            expect(loadingIndicators[1]).toHaveTextContent('loading:true');
        });

        it('não deve marcar carregamento quando visualizacaoEmAndamento for diferente', () => {
            render(
                <PaaSecaoPlanoEAta {...defaultProps} visualizacaoEmAndamento='valor-diferente' />,
            );

            const loadingIndicators = screen.getAllByText(/loading:/i);

            expect(loadingIndicators[0]).toHaveTextContent('loading:false');
            expect(loadingIndicators[1]).toHaveTextContent('loading:false');
        });

        it('não deve marcar carregamento da ata quando ata não possuir uuid', () => {
            render(
                <PaaSecaoPlanoEAta
                    {...defaultProps}
                    ata={{}}
                    visualizacaoEmAndamento='ata:ata-1'
                />,
            );

            const loadingIndicators = screen.getAllByText(/loading:/i);

            expect(loadingIndicators[0]).toHaveTextContent('loading:false');
            expect(loadingIndicators[1]).toHaveTextContent('loading:false');
        });

        it('deve funcionar corretamente quando paaUuid for null', () => {
            render(<PaaSecaoPlanoEAta {...defaultProps} paaUuid={null} />);

            expect(defaultProps.chaveVisualizacaoDocumento).toHaveBeenCalledWith(null, true);
        });

        it('deve utilizar o valor de retificacao do documento corretamente', () => {
            render(
                <PaaSecaoPlanoEAta
                    {...defaultProps}
                    documento={{
                        ...documentoMock,
                        status: {
                            retificacao: false,
                        },
                    }}
                />,
            );

            expect(defaultProps.chaveVisualizacaoDocumento).toHaveBeenCalledWith('paa-123', false);
        });
    });

    describe('integração com PaaLinhaDocumento', () => {
        it('deve passar as props corretas para o componente de plano', () => {
            render(<PaaSecaoPlanoEAta {...defaultProps} />);

            const primeiraChamada = mockPaaLinhaDocumento.mock.calls[0][0];

            expect(primeiraChamada).toEqual(
                expect.objectContaining({
                    titulo: 'Plano anual',
                    bloco: documentoMock,
                    testIdPrefix: 'plano',
                    carregandoVisualizar: false,
                    onVisualizar: expect.any(Function),
                    onDownload: expect.any(Function),
                }),
            );
        });

        it('deve passar as props corretas para o componente de ata', () => {
            render(<PaaSecaoPlanoEAta {...defaultProps} />);

            const segundaChamada = mockPaaLinhaDocumento.mock.calls[1][0];

            expect(segundaChamada).toEqual(
                expect.objectContaining({
                    titulo: 'Ata da reunião',
                    bloco: ataMock,
                    testIdPrefix: 'ata',
                    carregandoVisualizar: false,
                    onVisualizar: expect.any(Function),
                    onDownload: expect.any(Function),
                }),
            );
        });
    });
});
