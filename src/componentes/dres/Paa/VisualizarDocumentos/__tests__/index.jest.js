import { render, screen } from '@testing-library/react';
import { VisualizarDocumentos } from '../index';
import { useParams } from 'react-router-dom';
import { useGetVisualizarDocumentosPaa } from '../../../../../hooks/dres/Paa/useGetVisualizarDocumentosPaa';
import { useRecursoSelecionadoContext } from '../../../../../context/RecursoSelecionado';

const mockHeaderDocumentos = jest.fn();
const mockPaaCardBarraTitulo = jest.fn();
const mockPaaCard = jest.fn();
const mockLoading = jest.fn();
const mockMsgImgCentralizada = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

jest.mock('../../../../../utils/Loading', () => {
    return (props) => {
        mockLoading(props);

        return <div data-testid='loading'>Carregando...</div>;
    };
});

jest.mock('../../../../../hooks/dres/Paa/useGetVisualizarDocumentosPaa', () => ({
    useGetVisualizarDocumentosPaa: jest.fn(),
}));

jest.mock('../../../../../context/RecursoSelecionado', () => ({
    useRecursoSelecionadoContext: jest.fn(),
}));

jest.mock('../../../../Globais/Mensagens/MsgImgCentralizada', () => ({
    MsgImgCentralizada: (props) => {
        mockMsgImgCentralizada(props);

        return (
            <div data-testid='msg-centralizada'>
                <p>{props.texto}</p>
                <img src={props.img} alt='imagem mensagem' />
            </div>
        );
    },
}));

jest.mock('../components/HeaderDocumentos', () => ({
    HeaderDocumentos: (props) => {
        mockHeaderDocumentos(props);

        return <div data-testid='header-documentos'>Header documentos</div>;
    },
}));

jest.mock('../components/PaaCardBarraTitulo/PaaCardBarraTitulo', () => ({
    PaaCardBarraTitulo: (props) => {
        mockPaaCardBarraTitulo(props);

        return <div data-testid='barra-titulo'>{props.titulo}</div>;
    },
}));

jest.mock('../components/PaaCard/PaaCard', () => ({
    PaaCard: (props) => {
        mockPaaCard(props);

        return <div data-testid='paa-card'>PAA Card</div>;
    },
}));

describe('VisualizarDocumentos', () => {
    const vigenteMock = {
        uuid: 'vigente-123',

        referencia: '2024',

        esta_em_retificacao: true,

        unidade: {
            tipo: 'EMEF',
            nome: 'Escola Teste',
            codigo_eol: '123456',
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();

        useParams.mockReturnValue({
            uuid_paa: 'paa-uuid',
        });

        useRecursoSelecionadoContext.mockReturnValue({
            recursoSelecionado: {
                uuid: 'recurso-uuid',
            },
        });
    });

    describe('estado de carregamento', () => {
        it('deve renderizar loading enquanto os dados estão carregando', () => {
            useGetVisualizarDocumentosPaa.mockReturnValue({
                data: undefined,
                isLoading: true,
            });

            render(<VisualizarDocumentos />);

            expect(screen.getByTestId('loading')).toBeInTheDocument();

            expect(mockLoading).toHaveBeenCalledWith(
                expect.objectContaining({
                    corGrafico: 'black',
                    corFonte: 'dark',
                    marginTop: '0',
                    marginBottom: '0',
                }),
            );

            expect(screen.queryByTestId('header-documentos')).not.toBeInTheDocument();
        });
    });

    describe('estado de sucesso', () => {
        beforeEach(() => {
            useGetVisualizarDocumentosPaa.mockReturnValue({
                data: {
                    vigente: vigenteMock,
                },
                isLoading: false,
            });
        });

        it('deve renderizar o header de documentos', () => {
            render(<VisualizarDocumentos />);

            expect(screen.getByTestId('header-documentos')).toBeInTheDocument();
        });

        it('deve passar as props corretas para HeaderDocumentos', () => {
            render(<VisualizarDocumentos />);

            const propsPassadas = mockHeaderDocumentos.mock.calls[0][0];

            expect(propsPassadas).toEqual(
                expect.objectContaining({
                    unidadeTipo: 'EMEF',
                    unidadeNome: 'Escola Teste',
                    codigoEol: '123456',
                    referencia: '2024',
                    estaEmRetificacao: true,
                }),
            );
        });

        it('deve renderizar a barra de título com referência do PAA', () => {
            render(<VisualizarDocumentos />);

            expect(screen.getByTestId('barra-titulo')).toHaveTextContent('PAA 2024');
        });

        it('deve passar as props corretas para PaaCardBarraTitulo', () => {
            render(<VisualizarDocumentos />);

            const propsPassadas = mockPaaCardBarraTitulo.mock.calls[0][0];

            expect(propsPassadas).toEqual(
                expect.objectContaining({
                    titulo: 'PAA 2024',
                }),
            );
        });

        it('deve renderizar o componente PaaCard', () => {
            render(<VisualizarDocumentos />);

            expect(screen.getByTestId('paa-card')).toBeInTheDocument();
        });

        it('deve passar os dados vigentes para PaaCard', () => {
            render(<VisualizarDocumentos />);

            const propsPassadas = mockPaaCard.mock.calls[0][0];

            expect(propsPassadas).toEqual(
                expect.objectContaining({
                    dados: vigenteMock,
                }),
            );
        });

        it('deve chamar o hook com uuid do PAA e uuid do recurso', () => {
            render(<VisualizarDocumentos />);

            expect(useGetVisualizarDocumentosPaa).toHaveBeenCalledWith('paa-uuid', 'recurso-uuid');
        });

        it('deve renderizar corretamente quando unidade estiver parcialmente vazia', () => {
            useGetVisualizarDocumentosPaa.mockReturnValue({
                data: {
                    vigente: {
                        ...vigenteMock,
                        unidade: {},
                    },
                },
                isLoading: false,
            });

            render(<VisualizarDocumentos />);

            const propsPassadas = mockHeaderDocumentos.mock.calls[0][0];

            expect(propsPassadas).toEqual(
                expect.objectContaining({
                    unidadeTipo: undefined,
                    unidadeNome: undefined,
                    codigoEol: undefined,
                }),
            );
        });
    });

    describe('estado vazio', () => {
        it('deve renderizar mensagem quando não houver vigente', () => {
            useGetVisualizarDocumentosPaa.mockReturnValue({
                data: {},
                isLoading: false,
            });

            render(<VisualizarDocumentos />);

            expect(screen.getByTestId('msg-centralizada')).toBeInTheDocument();

            expect(screen.getByText('Nenhum resultado encontrado.')).toBeInTheDocument();
        });

        it('deve passar as props corretas para MsgImgCentralizada', () => {
            useGetVisualizarDocumentosPaa.mockReturnValue({
                data: undefined,
                isLoading: false,
            });

            render(<VisualizarDocumentos />);

            const propsPassadas = mockMsgImgCentralizada.mock.calls[0][0];

            expect(propsPassadas).toEqual(
                expect.objectContaining({
                    texto: 'Nenhum resultado encontrado.',
                    img: expect.any(String),
                }),
            );
        });

        it('não deve renderizar PaaCard quando não houver dados', () => {
            useGetVisualizarDocumentosPaa.mockReturnValue({
                data: undefined,
                isLoading: false,
            });

            render(<VisualizarDocumentos />);

            expect(screen.queryByTestId('paa-card')).not.toBeInTheDocument();
        });
    });

    describe('cenários condicionais', () => {
        it('deve funcionar quando recursoSelecionado for undefined', () => {
            useRecursoSelecionadoContext.mockReturnValue({
                recursoSelecionado: undefined,
            });

            useGetVisualizarDocumentosPaa.mockReturnValue({
                data: {},
                isLoading: false,
            });

            render(<VisualizarDocumentos />);

            expect(useGetVisualizarDocumentosPaa).toHaveBeenCalledWith('paa-uuid', undefined);
        });

        it('deve funcionar quando uuid_paa for undefined', () => {
            useParams.mockReturnValue({
                uuid_paa: undefined,
            });

            useGetVisualizarDocumentosPaa.mockReturnValue({
                data: {},
                isLoading: false,
            });

            render(<VisualizarDocumentos />);

            expect(useGetVisualizarDocumentosPaa).toHaveBeenCalledWith(undefined, 'recurso-uuid');
        });

        it('deve renderizar estado vazio quando data for null', () => {
            useGetVisualizarDocumentosPaa.mockReturnValue({
                data: null,
                isLoading: false,
            });

            render(<VisualizarDocumentos />);

            expect(screen.getByTestId('msg-centralizada')).toBeInTheDocument();
        });

        it('deve renderizar estado vazio quando vigente for undefined', () => {
            useGetVisualizarDocumentosPaa.mockReturnValue({
                data: {
                    vigente: undefined,
                },
                isLoading: false,
            });

            render(<VisualizarDocumentos />);

            expect(screen.getByTestId('msg-centralizada')).toBeInTheDocument();
        });
    });
});
