import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InfosContas } from '../InfosContas';

jest.mock('../../../../../../services/dres/Associacoes.service', () => ({
    aprovarSolicitacaoEncerramentoConta: jest.fn(),
    rejeitarSolicitacaoEncerramentoConta: jest.fn(),
    getContas: jest.fn(),
    getMotivosRejeicaoEncerramentoContas: jest.fn(),
    getContasAssociacaoEncerradas: jest.fn(),
}));
jest.mock('../../../../../../services/visoes.service', () => ({
    visoesService: {
        getPermissoes: jest.fn(),
    },
}));
jest.mock('../../../../../../utils/Loading', () => () => <div data-testid="loading">Loading...</div>);
jest.mock('../../../../../Globais/Mensagens/MsgImgCentralizada', () => ({
    MsgImgCentralizada: ({ texto }: any) => <div>{texto}</div>,
}));
jest.mock('../../../../../Globais/ToastCustom', () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));
jest.mock('../TabelaContasEncerradas', () => ({
    TabelaContasEncerradas: ({ contas }: any) => <div data-testid="tabela-contas-encerradas">{contas?.length || 0}</div>,
}));

let capturedModalConfirmarProps: any = null;
jest.mock('../ModalConfirmarEncerramento', () => ({
    ModalConfirmarEncerramento: (props: any) => {
        capturedModalConfirmarProps = props;
        return props.show ? <div data-testid="modal-confirmar">{props.titulo}</div> : null;
    },
}));

let capturedModalRejeitarProps: any = null;
jest.mock('../ModalRejeitarEncerramento', () => ({
    ModalRejeitarEncerramento: (props: any) => {
        capturedModalRejeitarProps = props;
        return props.show ? <div data-testid="modal-rejeitar">{props.titulo}</div> : null;
    },
}));

jest.mock('../BarraStatusEncerramentoConta', () => ({
    BarraStatusEncerramentoConta: () => <div data-testid="barra-status-encerramento" />,
}));

import {
    aprovarSolicitacaoEncerramentoConta,
    rejeitarSolicitacaoEncerramentoConta,
    getContas,
    getMotivosRejeicaoEncerramentoContas,
    getContasAssociacaoEncerradas,
} from '../../../../../../services/dres/Associacoes.service';
import { visoesService } from '../../../../../../services/visoes.service';
import { toastCustom } from '../../../../../Globais/ToastCustom';

describe('InfosContas', () => {
    const dadosDaAssociacao = {
        dados_da_associacao: {
            uuid: 'assoc-uuid',
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        capturedModalConfirmarProps = null;
        capturedModalRejeitarProps = null;
        (getMotivosRejeicaoEncerramentoContas as jest.Mock).mockResolvedValue({
            results: [],
        });
        (getContasAssociacaoEncerradas as jest.Mock).mockResolvedValue([]);
    });

    function makeConta({
        permiteInativacao = true,
        solicitacaoStatus = 'PENDENTE',
        hasSolicitacao = true,
        saldoAtualConta = 100,
        nomeRecurso,
    }: {
        permiteInativacao?: boolean;
        solicitacaoStatus?: string;
        hasSolicitacao?: boolean;
        saldoAtualConta?: number | null;
        nomeRecurso?: string;
    } = {}) {
        return {
            banco_nome: 'Banco X',
            tipo_conta: { nome: 'Tipo Y', permite_inativacao: permiteInativacao },
            agencia: '1234',
            numero_conta: '12345-6',
            saldo_atual_conta: saldoAtualConta,
            nome_recurso: nomeRecurso,
            solicitacao_encerramento: hasSolicitacao
                ? {
                    status: solicitacaoStatus,
                    uuid: 'solic-uuid',
                    data_de_encerramento_na_agencia: '2025-01-01',
                }
                : null,
            uuid: 'conta-uuid',
        };
    }

    const renderComContaHabilitada = async (overrides = {}, permitePermissao = true) => {
        const conta = makeConta(overrides);
        (getContas as jest.Mock).mockResolvedValue([conta]);
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(permitePermissao);

        render(<InfosContas dadosDaAssociacao={dadosDaAssociacao} />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        return conta;
    };

    test('renderiza loading inicialmente', () => {
        (getContas as jest.Mock).mockImplementation(() => new Promise(() => { }));
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(true);

        render(<InfosContas dadosDaAssociacao={dadosDaAssociacao} />);

        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    test('renderiza mensagem quando não há contas', async () => {
        (getContas as jest.Mock).mockResolvedValue([]);
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(true);
        (getContasAssociacaoEncerradas as jest.Mock).mockResolvedValue([]);

        render(<InfosContas dadosDaAssociacao={dadosDaAssociacao} />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        expect(
            screen.getByText(/não há conta vinculada a esta associação/i)
        ).toBeInTheDocument();
    });

    test('exibe mensagem quando todas as contas foram encerradas', async () => {
        const contasEncerradas = [makeConta()];
        (getContas as jest.Mock).mockResolvedValue([]);
        (getContasAssociacaoEncerradas as jest.Mock).mockResolvedValue(contasEncerradas);
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(true);

        render(<InfosContas dadosDaAssociacao={dadosDaAssociacao} />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        expect(
            screen.getByText(/as contas da associação foram encerradas/i)
        ).toBeInTheDocument();
    });

    test('exibe mensagem padrão quando não há contas nem lista de contas encerradas definida', async () => {
        (getContas as jest.Mock).mockResolvedValue([]);
        (getContasAssociacaoEncerradas as jest.Mock).mockResolvedValue(undefined);
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(true);

        render(<InfosContas dadosDaAssociacao={dadosDaAssociacao} />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        expect(
            screen.getByText(/não encontramos nenhuma conta, tente novamente/i)
        ).toBeInTheDocument();
    });

    test('renderiza dados básicos da conta', async () => {
        const contas = [makeConta({ hasSolicitacao: false })];
        (getContas as jest.Mock).mockResolvedValue(contas);
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(true);

        render(<InfosContas dadosDaAssociacao={dadosDaAssociacao} />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Banco X')).toBeInTheDocument();
        expect(screen.getByText('Tipo Y')).toBeInTheDocument();
        expect(screen.getByText('1234')).toBeInTheDocument();
        expect(screen.getByText('12345-6')).toBeInTheDocument();
    });

    test('exibe R$ 0 quando a conta não possui saldo atual', async () => {
        const contas = [makeConta({ hasSolicitacao: false, saldoAtualConta: 0 })];
        (getContas as jest.Mock).mockResolvedValue(contas);
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(true);

        render(<InfosContas dadosDaAssociacao={dadosDaAssociacao} />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        expect(screen.getByText('R$ 0')).toBeInTheDocument();
    });

    test('renderiza múltiplas contas de mesmo recurso e de recursos diferentes', async () => {
        const contas = [
            makeConta({ hasSolicitacao: false, nomeRecurso: 'PTRF Custeio' }),
            makeConta({ hasSolicitacao: false, nomeRecurso: 'PTRF Custeio' }),
            makeConta({ hasSolicitacao: false, nomeRecurso: 'Outro Recurso' }),
        ];
        (getContas as jest.Mock).mockResolvedValue(contas);
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(true);

        render(<InfosContas dadosDaAssociacao={dadosDaAssociacao} />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        expect(screen.getByText('PTRF Custeio')).toBeInTheDocument();
        expect(screen.getByText('Outro Recurso')).toBeInTheDocument();
        expect(screen.getAllByText('Banco X')).toHaveLength(3);
    });

    test('renderiza tabela de contas encerradas quando há contas encerradas', async () => {
        const contasEncerradas = [makeConta()];
        (getContas as jest.Mock).mockResolvedValue([makeConta({ hasSolicitacao: false })]);
        (getContasAssociacaoEncerradas as jest.Mock).mockResolvedValue(contasEncerradas);
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(true);

        render(<InfosContas dadosDaAssociacao={dadosDaAssociacao} />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('tabela-contas-encerradas')).toBeInTheDocument();
    });

    test('não busca contas quando a associação não possui uuid', async () => {
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(true);

        render(<InfosContas dadosDaAssociacao={{ dados_da_associacao: { uuid: null } }} />);

        await waitFor(() => {
            expect(getMotivosRejeicaoEncerramentoContas).toHaveBeenCalled();
        });

        expect(getContas).not.toHaveBeenCalled();
        expect(getContasAssociacaoEncerradas).not.toHaveBeenCalled();
    });

    test('adiciona indicativo de seleção aos motivos de rejeição retornados pelo serviço', async () => {
        (getMotivosRejeicaoEncerramentoContas as jest.Mock).mockResolvedValue({
            results: [{ uuid: 'm1', nome: 'Motivo 1' }],
        });
        await renderComContaHabilitada();

        fireEvent.click(screen.getByText('Rejeitar encerramento'));

        expect(capturedModalRejeitarProps.motivosRejeicao).toEqual([
            { uuid: 'm1', nome: 'Motivo 1', selected: false },
        ]);
    });

    test('exibe barra de status quando a solicitação foi rejeitada e a conta permite inativação', async () => {
        const contas = [makeConta({ solicitacaoStatus: 'REJEITADA' })];
        (getContas as jest.Mock).mockResolvedValue(contas);
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(true);

        render(<InfosContas dadosDaAssociacao={dadosDaAssociacao} />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('barra-status-encerramento')).toBeInTheDocument();
    });

    test('desabilita os botões de encerramento quando o usuário não possui permissão', async () => {
        await renderComContaHabilitada({}, false);

        expect(screen.getByText('Confirmar encerramento')).toBeDisabled();
        expect(screen.getByText('Rejeitar encerramento')).toBeDisabled();
    });

    test('habilita os botões de encerramento quando o usuário possui permissão', async () => {
        await renderComContaHabilitada();

        expect(screen.getByText('Confirmar encerramento')).toBeEnabled();
        expect(screen.getByText('Rejeitar encerramento')).toBeEnabled();
    });

    test('abre e fecha o modal de confirmação de encerramento', async () => {
        await renderComContaHabilitada();

        fireEvent.click(screen.getByText('Confirmar encerramento'));
        expect(screen.getByTestId('modal-confirmar')).toBeInTheDocument();

        act(() => {
            capturedModalConfirmarProps.handleClose();
        });
        expect(screen.queryByTestId('modal-confirmar')).not.toBeInTheDocument();
    });

    test('confirma o encerramento da conta com sucesso', async () => {
        (aprovarSolicitacaoEncerramentoConta as jest.Mock).mockResolvedValue({ status: 200 });
        await renderComContaHabilitada();
        (getContas as jest.Mock).mockClear();
        (getContasAssociacaoEncerradas as jest.Mock).mockClear();

        fireEvent.click(screen.getByText('Confirmar encerramento'));

        await act(async () => {
            await capturedModalConfirmarProps.onConfirmarEncerramento();
        });

        expect(aprovarSolicitacaoEncerramentoConta).toHaveBeenCalledWith('solic-uuid');
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith('Conta encerrada com sucesso');
        expect(getContas).toHaveBeenCalledWith('assoc-uuid', true);
        expect(getContasAssociacaoEncerradas).toHaveBeenCalledWith('assoc-uuid');
        expect(screen.queryByTestId('modal-confirmar')).not.toBeInTheDocument();
    });

    test('exibe erro ao confirmar encerramento quando a resposta não é 200', async () => {
        (aprovarSolicitacaoEncerramentoConta as jest.Mock).mockResolvedValue({ status: 400 });
        await renderComContaHabilitada();

        fireEvent.click(screen.getByText('Confirmar encerramento'));

        await act(async () => {
            await capturedModalConfirmarProps.onConfirmarEncerramento();
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith('Erro ao encerrar conta');
    });

    test('loga o erro quando a confirmação de encerramento lança uma exceção', async () => {
        const erro = new Error('Falha ao confirmar');
        (aprovarSolicitacaoEncerramentoConta as jest.Mock).mockRejectedValue(erro);
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        await renderComContaHabilitada();

        fireEvent.click(screen.getByText('Confirmar encerramento'));

        await act(async () => {
            await capturedModalConfirmarProps.onConfirmarEncerramento();
        });

        expect(consoleLogSpy).toHaveBeenCalledWith(erro);
        consoleLogSpy.mockRestore();
    });

    test('abre e fecha o modal de rejeição de encerramento', async () => {
        await renderComContaHabilitada();

        fireEvent.click(screen.getByText('Rejeitar encerramento'));
        expect(screen.getByTestId('modal-rejeitar')).toBeInTheDocument();

        act(() => {
            capturedModalRejeitarProps.handleClose();
        });
        expect(screen.queryByTestId('modal-rejeitar')).not.toBeInTheDocument();
    });

    test('exibe erro quando nenhum motivo é selecionado nem informado ao rejeitar', async () => {
        await renderComContaHabilitada();

        fireEvent.click(screen.getByText('Rejeitar encerramento'));

        act(() => {
            capturedModalRejeitarProps.onRejeitarEncerramento([], '');
        });

        expect(capturedModalRejeitarProps.errorModalRejeicao).toBe(
            'Selecionar ou digitar pelo menos um motivo.'
        );
        expect(rejeitarSolicitacaoEncerramentoConta).not.toHaveBeenCalled();
    });

    test('rejeita o encerramento com motivos selecionados com sucesso', async () => {
        (rejeitarSolicitacaoEncerramentoConta as jest.Mock).mockResolvedValue({ status: 200 });
        await renderComContaHabilitada();
        (getContas as jest.Mock).mockClear();
        (getContasAssociacaoEncerradas as jest.Mock).mockClear();

        fireEvent.click(screen.getByText('Rejeitar encerramento'));

        await act(async () => {
            await capturedModalRejeitarProps.onRejeitarEncerramento(
                [{ uuid: 'm1', selected: true }, { uuid: 'm2', selected: false }],
                ''
            );
        });

        expect(rejeitarSolicitacaoEncerramentoConta).toHaveBeenCalledWith(
            { outros_motivos_rejeicao: '', motivos_rejeicao: ['m1'] },
            'solic-uuid'
        );
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith('Solicitação negada com sucesso');
        expect(getContas).toHaveBeenCalledWith('assoc-uuid', true);
        expect(getContasAssociacaoEncerradas).toHaveBeenCalledWith('assoc-uuid');
        expect(screen.queryByTestId('modal-rejeitar')).not.toBeInTheDocument();
    });

    test('rejeita o encerramento apenas com outros motivos preenchidos', async () => {
        (rejeitarSolicitacaoEncerramentoConta as jest.Mock).mockResolvedValue({ status: 200 });
        await renderComContaHabilitada();

        fireEvent.click(screen.getByText('Rejeitar encerramento'));

        await act(async () => {
            await capturedModalRejeitarProps.onRejeitarEncerramento([], 'Motivo digitado à mão');
        });

        expect(rejeitarSolicitacaoEncerramentoConta).toHaveBeenCalledWith(
            { outros_motivos_rejeicao: 'Motivo digitado à mão', motivos_rejeicao: [] },
            'solic-uuid'
        );
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith('Solicitação negada com sucesso');
    });

    test('exibe erro ao rejeitar encerramento quando a resposta não é 200', async () => {
        (rejeitarSolicitacaoEncerramentoConta as jest.Mock).mockResolvedValue({ status: 400 });
        await renderComContaHabilitada();

        fireEvent.click(screen.getByText('Rejeitar encerramento'));

        await act(async () => {
            await capturedModalRejeitarProps.onRejeitarEncerramento(
                [{ uuid: 'm1', selected: true }],
                ''
            );
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao tentar rejeitar solicitação de encerramento'
        );
    });

    test('loga o erro quando a rejeição de encerramento lança uma exceção', async () => {
        const erro = new Error('Falha ao rejeitar');
        (rejeitarSolicitacaoEncerramentoConta as jest.Mock).mockRejectedValue(erro);
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        await renderComContaHabilitada();

        fireEvent.click(screen.getByText('Rejeitar encerramento'));

        await act(async () => {
            await capturedModalRejeitarProps.onRejeitarEncerramento(
                [{ uuid: 'm1', selected: true }],
                ''
            );
        });

        expect(consoleLogSpy).toHaveBeenCalledWith(erro);
        consoleLogSpy.mockRestore();
    });

    test('não confirma o encerramento quando não há conta selecionada no modal', async () => {
        await renderComContaHabilitada();

        await act(async () => {
            await capturedModalConfirmarProps.onConfirmarEncerramento();
        });

        expect(aprovarSolicitacaoEncerramentoConta).not.toHaveBeenCalled();
    });

    test('não rejeita o encerramento quando não há conta selecionada no modal', async () => {
        await renderComContaHabilitada();

        await act(async () => {
            await capturedModalRejeitarProps.onRejeitarEncerramento(
                [{ uuid: 'm1', selected: true }],
                ''
            );
        });

        expect(rejeitarSolicitacaoEncerramentoConta).not.toHaveBeenCalled();
    });

    test('usa os valores padrão de motivosRejeicao e outrosMotivosRejeicao quando chamado sem argumentos', async () => {
        await renderComContaHabilitada();

        fireEvent.click(screen.getByText('Rejeitar encerramento'));

        act(() => {
            capturedModalRejeitarProps.onRejeitarEncerramento();
        });

        expect(capturedModalRejeitarProps.errorModalRejeicao).toBe(
            'Selecionar ou digitar pelo menos um motivo.'
        );
        expect(rejeitarSolicitacaoEncerramentoConta).not.toHaveBeenCalled();
    });
});
