import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DetalhePrestacaoDeContasNaoApresentada } from '../index';
import { getTabelasPrestacoesDeContas } from '../../../../../services/dres/PrestacaoDeContas.service';

jest.mock('../../../../../services/dres/PrestacaoDeContas.service', () => ({
    getTabelasPrestacoesDeContas: jest.fn(),
}));

jest.mock('../../../../../paginas/PaginasContainer', () => ({
    PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));

let mockCapturedCabecalhoProps = null;
jest.mock('../../DetalhePrestacaoDeContas/Cabecalho', () => (props) => {
    mockCapturedCabecalhoProps = props;
    return <div data-testid="mock-cabecalho" />;
});

let mockCapturedBotoesProps = null;
jest.mock('../../DetalhePrestacaoDeContas/BotoesAvancarRetroceder', () => ({
    BotoesAvancarRetroceder: (props) => {
        mockCapturedBotoesProps = props;
        return (
            <div data-testid="mock-botoes">
                <button data-testid="btn-abrir-modal" onClick={() => props.setShowModalConcluirPcNaoApresentada(true)}>
                    abrir modal
                </button>
            </div>
        );
    },
}));

let mockCapturedTrilhaProps = null;
jest.mock('../../DetalhePrestacaoDeContas/TrilhaDeStatus', () => ({
    TrilhaDeStatus: (props) => {
        mockCapturedTrilhaProps = props;
        return <div data-testid="mock-trilha" />;
    },
}));

let mockCapturedFormProps = null;
jest.mock('../../DetalhePrestacaoDeContas/FormRecebimentoPelaDiretoria', () => ({
    FormRecebimentoPelaDiretoria: (props) => {
        mockCapturedFormProps = props;
        return <div data-testid="mock-form-recebimento" />;
    },
}));

let mockCapturedComentariosProps = null;
jest.mock('../../DetalhePrestacaoDeContas/ComentariosDeAnalise', () => (props) => {
    mockCapturedComentariosProps = props;
    return <div data-testid="mock-comentarios" />;
});

const mockRetornaSeTemPermissao = jest.fn();
jest.mock('../../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc', () => ({
    RetornaSeTemPermissaoEdicaoAcompanhamentoDePc: () => mockRetornaSeTemPermissao(),
}));

const mockRetornaSeFlagAtiva = jest.fn();
jest.mock('../RetornaSeFlagAtiva', () => ({
    RetornaSeFlagAtiva: () => mockRetornaSeFlagAtiva(),
}));

jest.mock('../components/BarraInfo', () => ({
    BarraInfo: () => <div data-testid="mock-barra-info" />,
}));

let mockCapturedModalProps = null;
jest.mock('../components/ModalConcluirPcNaoApresentada', () => ({
    ModalConcluirPcNaoApresentada: (props) => {
        mockCapturedModalProps = props;
        return props.show ? (
            <div data-testid="mock-modal-concluir">
                <button data-testid="btn-confirmar-concluir" onClick={props.onConcluirPcNaoApresentada}>
                    confirmar
                </button>
                <button data-testid="btn-fechar-concluir" onClick={props.handleClose}>
                    fechar
                </button>
            </div>
        ) : null;
    },
}));

const mockMutatePostPc = jest.fn();
jest.mock('../hooks/usePostPrestacaoContaReprovadaNaoApresentacao', () => ({
    usePostPrestacaoContaReprovadaNaoApresentacao: () => ({
        mutationPostPrestacaoContaReprovadaNaoApresentacao: {
            mutateAsync: mockMutatePostPc,
        },
    }),
}));

const mockMutatePostNotificar = jest.fn();
jest.mock('../hooks/usePostNotificarPrestacaoContaReprovadaNaoApresentacao', () => ({
    usePostNotificarPrestacaoContaReprovadaNaoApresentacao: () => ({
        mutationPostNotificarPrestacaoContaReprovadaNaoApresentacao: {
            mutateAsync: mockMutatePostNotificar,
        },
    }),
}));

const prestacaoDeContasMock = {
    uuid: 'pc-1',
    status: 'NAO_APRESENTADA',
    associacao: { uuid: 'assoc-1' },
    periodo_uuid: 'periodo-1',
};

describe('DetalhePrestacaoDeContasNaoApresentada', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        mockCapturedCabecalhoProps = null;
        mockCapturedBotoesProps = null;
        mockCapturedTrilhaProps = null;
        mockCapturedFormProps = null;
        mockCapturedComentariosProps = null;
        mockCapturedModalProps = null;
        mockRetornaSeTemPermissao.mockReturnValue(true);
        mockRetornaSeFlagAtiva.mockReturnValue(false);
        getTabelasPrestacoesDeContas.mockResolvedValue({ NAO_APRESENTADA: 'Não apresentada' });
        mockMutatePostPc.mockResolvedValue({ data: { uuid: 'pc-reprovada-1' } });
        mockMutatePostNotificar.mockResolvedValue({ data: { uuid: 'notificacao-1' } });
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
    });

    it('não renderiza o conteúdo principal quando não há prestação de contas no localStorage', async () => {
        render(<DetalhePrestacaoDeContasNaoApresentada />);

        expect(screen.getByText('Acompanhamento das Prestações de Contas')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-cabecalho')).not.toBeInTheDocument();
        await waitFor(() => expect(getTabelasPrestacoesDeContas).toHaveBeenCalled());
    });

    it('renderiza o cabeçalho, trilha de status e formulário quando há prestação de contas no localStorage', async () => {
        localStorage.setItem('prestacao_de_contas_nao_apresentada', JSON.stringify(prestacaoDeContasMock));

        render(<DetalhePrestacaoDeContasNaoApresentada />);

        expect(await screen.findByTestId('mock-cabecalho')).toBeInTheDocument();
        expect(mockCapturedCabecalhoProps.prestacaoDeContas).toEqual(prestacaoDeContasMock);
        expect(screen.getByTestId('mock-trilha')).toBeInTheDocument();
        expect(screen.getByTestId('mock-form-recebimento')).toBeInTheDocument();
        expect(mockCapturedFormProps.disabledNome).toBe(true);
        expect(mockCapturedFormProps.disabledData).toBe(true);
        expect(mockCapturedFormProps.disabledStatus).toBe(true);
        expect(mockCapturedFormProps.exibeMotivo).toBe(false);
        expect(mockCapturedFormProps.exibeRecomendacoes).toBe(false);
    });

    it('carrega a tabela de prestações de contas ao montar', async () => {
        localStorage.setItem('prestacao_de_contas_nao_apresentada', JSON.stringify(prestacaoDeContasMock));

        render(<DetalhePrestacaoDeContasNaoApresentada />);

        await screen.findByTestId('mock-cabecalho');

        expect(getTabelasPrestacoesDeContas).toHaveBeenCalled();
    });

    it('não exibe a BarraInfo quando a flag está desativada', async () => {
        localStorage.setItem('prestacao_de_contas_nao_apresentada', JSON.stringify(prestacaoDeContasMock));
        mockRetornaSeFlagAtiva.mockReturnValue(false);

        render(<DetalhePrestacaoDeContasNaoApresentada />);

        await screen.findByTestId('mock-cabecalho');
        expect(screen.queryByTestId('mock-barra-info')).not.toBeInTheDocument();
    });

    it('exibe a BarraInfo quando a flag está ativada', async () => {
        localStorage.setItem('prestacao_de_contas_nao_apresentada', JSON.stringify(prestacaoDeContasMock));
        mockRetornaSeFlagAtiva.mockReturnValue(true);

        render(<DetalhePrestacaoDeContasNaoApresentada />);

        await screen.findByTestId('mock-cabecalho');
        expect(screen.getByTestId('mock-barra-info')).toBeInTheDocument();
    });

    it('não renderiza ComentariosDeAnalise quando a prestação de contas não possui associação/periodo', async () => {
        localStorage.setItem('prestacao_de_contas_nao_apresentada', JSON.stringify({ uuid: 'pc-1' }));

        render(<DetalhePrestacaoDeContasNaoApresentada />);

        await screen.findByTestId('mock-cabecalho');
        expect(screen.queryByTestId('mock-comentarios')).not.toBeInTheDocument();
    });

    it('renderiza ComentariosDeAnalise com editavel de acordo com a permissão quando associação e período existem', async () => {
        localStorage.setItem('prestacao_de_contas_nao_apresentada', JSON.stringify(prestacaoDeContasMock));
        mockRetornaSeTemPermissao.mockReturnValue(false);

        render(<DetalhePrestacaoDeContasNaoApresentada />);

        expect(await screen.findByTestId('mock-comentarios')).toBeInTheDocument();
        expect(mockCapturedComentariosProps.associacaoUuid).toBe('assoc-1');
        expect(mockCapturedComentariosProps.periodoUuid).toBe('periodo-1');
        expect(mockCapturedComentariosProps.editavel).toBe(false);
    });

    it('abre o modal de concluir PC não apresentada ao acionar setShowModalConcluirPcNaoApresentada', async () => {
        localStorage.setItem('prestacao_de_contas_nao_apresentada', JSON.stringify(prestacaoDeContasMock));

        render(<DetalhePrestacaoDeContasNaoApresentada />);

        await screen.findByTestId('mock-cabecalho');
        expect(screen.queryByTestId('mock-modal-concluir')).not.toBeInTheDocument();

        act(() => {
            screen.getByTestId('btn-abrir-modal').click();
        });

        expect(screen.getByTestId('mock-modal-concluir')).toBeInTheDocument();
    });

    it('fecha o modal quando handleClose é chamado', async () => {
        localStorage.setItem('prestacao_de_contas_nao_apresentada', JSON.stringify(prestacaoDeContasMock));

        render(<DetalhePrestacaoDeContasNaoApresentada />);

        await screen.findByTestId('mock-cabecalho');
        act(() => {
            screen.getByTestId('btn-abrir-modal').click();
        });
        expect(screen.getByTestId('mock-modal-concluir')).toBeInTheDocument();

        act(() => {
            screen.getByTestId('btn-fechar-concluir').click();
        });

        expect(screen.queryByTestId('mock-modal-concluir')).not.toBeInTheDocument();
    });

    it('conclui a PC não apresentada com sucesso: cria a PC reprovada e dispara a notificação', async () => {
        localStorage.setItem('prestacao_de_contas_nao_apresentada', JSON.stringify(prestacaoDeContasMock));

        render(<DetalhePrestacaoDeContasNaoApresentada />);

        await screen.findByTestId('mock-cabecalho');
        act(() => {
            screen.getByTestId('btn-abrir-modal').click();
        });

        await act(async () => {
            screen.getByTestId('btn-confirmar-concluir').click();
        });

        expect(mockMutatePostPc).toHaveBeenCalledWith({
            payload: expect.objectContaining({
                periodo: 'periodo-1',
                associacao: 'assoc-1',
                data_de_reprovacao: expect.any(String),
            }),
        });
        expect(mockMutatePostNotificar).toHaveBeenCalledWith({
            payload: { prestacao_conta_reprovada_nao_apresentacao: 'pc-reprovada-1' },
        });
        expect(screen.queryByTestId('mock-modal-concluir')).not.toBeInTheDocument();
    });

    it('trata falha ao concluir a PC não apresentada sem quebrar a tela', async () => {
        localStorage.setItem('prestacao_de_contas_nao_apresentada', JSON.stringify(prestacaoDeContasMock));
        mockMutatePostPc.mockRejectedValue(new Error('falha ao criar'));

        render(<DetalhePrestacaoDeContasNaoApresentada />);

        await screen.findByTestId('mock-cabecalho');
        act(() => {
            screen.getByTestId('btn-abrir-modal').click();
        });

        await act(async () => {
            screen.getByTestId('btn-confirmar-concluir').click();
        });

        expect(mockMutatePostNotificar).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(
            'Falha ao Criar/Notificar Prestação de Contas Reprovada por não Apresentação',
            expect.any(Error)
        );
    });
});
