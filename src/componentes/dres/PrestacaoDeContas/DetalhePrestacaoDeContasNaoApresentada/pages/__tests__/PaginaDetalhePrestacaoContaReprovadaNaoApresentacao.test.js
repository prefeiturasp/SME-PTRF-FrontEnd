import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PaginaDetalhePrestacaoContaReprovadaNaoApresentacao } from '../PaginaDetalhePrestacaoContaReprovadaNaoApresentacao';

jest.mock('../../../../../../paginas/PaginasContainer', () => ({
    PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));

const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => mockUseParams(),
}));

const mockUseGetPrestacaoContaReprovadaNaoApresentacao = jest.fn();
jest.mock('../../hooks/useGetPrestacaoContaReprovadaNaoApresentacao', () => ({
    useGetPrestacaoContaReprovadaNaoApresentacao: (uuid) => mockUseGetPrestacaoContaReprovadaNaoApresentacao(uuid),
}));

let mockCapturedCabecalhoProps = null;
jest.mock('../../../DetalhePrestacaoDeContas/Cabecalho', () => (props) => {
    mockCapturedCabecalhoProps = props;
    return <div data-testid="mock-cabecalho" />;
});

let mockCapturedBotoesProps = null;
jest.mock('../../../DetalhePrestacaoDeContas/BotoesAvancarRetroceder', () => ({
    BotoesAvancarRetroceder: (props) => {
        mockCapturedBotoesProps = props;
        return <div data-testid="mock-botoes" />;
    },
}));

let mockCapturedTrilhaProps = null;
jest.mock('../../../DetalhePrestacaoDeContas/TrilhaDeStatus', () => ({
    TrilhaDeStatus: (props) => {
        mockCapturedTrilhaProps = props;
        return <div data-testid="mock-trilha" />;
    },
}));

let mockCapturedComentariosProps = null;
jest.mock('../../../DetalhePrestacaoDeContas/ComentariosDeAnalise', () => (props) => {
    mockCapturedComentariosProps = props;
    return <div data-testid="mock-comentarios" />;
});

const mockRetornaSeTemPermissao = jest.fn();
jest.mock('../../../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc', () => ({
    RetornaSeTemPermissaoEdicaoAcompanhamentoDePc: () => mockRetornaSeTemPermissao(),
}));

describe('PaginaDetalhePrestacaoContaReprovadaNaoApresentacao', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCapturedCabecalhoProps = null;
        mockCapturedBotoesProps = null;
        mockCapturedTrilhaProps = null;
        mockCapturedComentariosProps = null;
        mockUseParams.mockReturnValue({ prestacao_conta_uuid: 'pc-1' });
        mockRetornaSeTemPermissao.mockReturnValue(true);
    });

    it('exibe o Loading enquanto os dados ainda estão sendo carregados', () => {
        mockUseGetPrestacaoContaReprovadaNaoApresentacao.mockReturnValue({ isLoading: true, data: undefined });

        render(<PaginaDetalhePrestacaoContaReprovadaNaoApresentacao />);

        expect(screen.getByText('Carregando...')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-cabecalho')).not.toBeInTheDocument();
    });

    it('renderiza Cabecalho, BotoesAvancarRetroceder, TrilhaDeStatus e ComentariosDeAnalise após o carregamento', () => {
        const data = {
            uuid: 'pc-reprovada-1',
            status: 'REPROVADA',
            associacao: { uuid: 'assoc-1' },
            periodo: { uuid: 'periodo-1' },
        };
        mockUseGetPrestacaoContaReprovadaNaoApresentacao.mockReturnValue({ isLoading: false, data });

        render(<PaginaDetalhePrestacaoContaReprovadaNaoApresentacao />);

        expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
        expect(screen.getByTestId('mock-cabecalho')).toBeInTheDocument();
        expect(mockCapturedCabecalhoProps.prestacaoDeContas).toEqual(data);

        expect(mockCapturedBotoesProps.prestacaoDeContas).toEqual(data);
        expect(mockCapturedBotoesProps.textoBtnAvancar).toBe('');
        expect(mockCapturedBotoesProps.textoBtnRetroceder).toBe('Retornar para não apresentada');
        expect(mockCapturedBotoesProps.disabledBtnAvancar).toBe(true);
        expect(mockCapturedBotoesProps.disabledBtnRetroceder).toBe(true);
        expect(mockCapturedBotoesProps.esconderBotaoAvancar).toBe(true);

        expect(mockCapturedTrilhaProps.prestacaoDeContas).toEqual(data);

        expect(mockCapturedComentariosProps.associacaoUuid).toBe('assoc-1');
        expect(mockCapturedComentariosProps.periodoUuid).toBe('periodo-1');
        expect(mockCapturedComentariosProps.editavel).toBe(true);
    });

    it('passa editavel=false para ComentariosDeAnalise quando o usuário não possui permissão', () => {
        const data = {
            uuid: 'pc-reprovada-1',
            associacao: { uuid: 'assoc-1' },
            periodo: { uuid: 'periodo-1' },
        };
        mockUseGetPrestacaoContaReprovadaNaoApresentacao.mockReturnValue({ isLoading: false, data });
        mockRetornaSeTemPermissao.mockReturnValue(false);

        render(<PaginaDetalhePrestacaoContaReprovadaNaoApresentacao />);

        expect(mockCapturedComentariosProps.editavel).toBe(false);
    });

    it('busca os dados utilizando o uuid obtido via useParams', () => {
        mockUseParams.mockReturnValue({ prestacao_conta_uuid: 'pc-especifico' });
        mockUseGetPrestacaoContaReprovadaNaoApresentacao.mockReturnValue({ isLoading: true, data: undefined });

        render(<PaginaDetalhePrestacaoContaReprovadaNaoApresentacao />);

        expect(mockUseGetPrestacaoContaReprovadaNaoApresentacao).toHaveBeenCalledWith('pc-especifico');
    });
});
