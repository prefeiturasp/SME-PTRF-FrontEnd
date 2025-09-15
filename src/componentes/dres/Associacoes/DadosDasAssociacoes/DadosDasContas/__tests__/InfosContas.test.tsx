import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
jest.mock('../TabelaContasEncerradas', () => ({
    TabelaContasEncerradas: ({ contas }: any) => <div data-testid="tabela-contas-encerradas">{contas?.length || 0}</div>,
}));
jest.mock('../ModalConfirmarEncerramento', () => ({
    ModalConfirmarEncerramento: () => null,
}));
jest.mock('../ModalRejeitarEncerramento', () => ({
    ModalRejeitarEncerramento: () => null,
}));

import {
    getContas,
    getMotivosRejeicaoEncerramentoContas,
    getContasAssociacaoEncerradas,
} from '../../../../../../services/dres/Associacoes.service';
import { visoesService } from '../../../../../../services/visoes.service';

describe('InfosContas - habilitação de botões', () => {
    const dadosDaAssociacao = {
        dados_da_associacao: {
            uuid: 'assoc-uuid',
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (getMotivosRejeicaoEncerramentoContas as jest.Mock).mockResolvedValue({
            results: [],
        });
        (getContasAssociacaoEncerradas as jest.Mock).mockResolvedValue([]);
    });

    function makeConta({
        permiteInativacao = true,
        solicitacaoStatus = 'PENDENTE',
        hasSolicitacao = true,
    } = {}) {
        return {
            banco_nome: 'Banco X',
            tipo_conta: { nome: 'Tipo Y', permite_inativacao: permiteInativacao },
            agencia: '1234',
            numero_conta: '12345-6',
            saldo_atual_conta: 0,
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

    test('botões habilitados quando: solicitacao PENDENTE, permite_inativacao=true, e permissão concedida', async () => {
        const contas = [makeConta()];
        (getContas as jest.Mock).mockResolvedValue(contas);
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(true);

        render(<InfosContas dadosDaAssociacao={dadosDaAssociacao} />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        const btnConfirmar = screen.getByRole('button', { name: /Confirmar encerramento/i });
        const btnRejeitar = screen.getByRole('button', { name: /Rejeitar encerramento/i });

        expect(btnConfirmar).toBeEnabled();
        expect(btnRejeitar).toBeEnabled();
    });

    test('botões desabilitados quando não há solicitacao de encerramento', async () => {
        const contas = [makeConta({ hasSolicitacao: false })];
        (getContas as jest.Mock).mockResolvedValue(contas);
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(true);

        render(<InfosContas dadosDaAssociacao={dadosDaAssociacao} />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        const btnConfirmar = screen.getByRole('button', { name: /Confirmar encerramento/i });
        const btnRejeitar = screen.getByRole('button', { name: /Rejeitar encerramento/i });

        expect(btnConfirmar).toBeDisabled();
        expect(btnRejeitar).toBeDisabled();
    });

    test('botões desabilitados quando solicitacao.status !== PENDENTE (ex.: REJEITADA)', async () => {
        const contas = [makeConta({ solicitacaoStatus: 'REJEITADA' })];
        (getContas as jest.Mock).mockResolvedValue(contas);
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(true);

        render(<InfosContas dadosDaAssociacao={dadosDaAssociacao} />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        const btnConfirmar = screen.getByRole('button', { name: /Confirmar encerramento/i });
        const btnRejeitar = screen.getByRole('button', { name: /Rejeitar encerramento/i });

        expect(btnConfirmar).toBeDisabled();
        expect(btnRejeitar).toBeDisabled();
    });

    test('botões desabilitados quando tipo_conta.permite_inativacao = false', async () => {
        const contas = [makeConta({ permiteInativacao: false })];
        (getContas as jest.Mock).mockResolvedValue(contas);
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(true);

        render(<InfosContas dadosDaAssociacao={dadosDaAssociacao} />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        const btnConfirmar = screen.getByRole('button', { name: /Confirmar encerramento/i });
        const btnRejeitar = screen.getByRole('button', { name: /Rejeitar encerramento/i });

        expect(btnConfirmar).toBeDisabled();
        expect(btnRejeitar).toBeDisabled();
    });

    test('botões desabilitados quando usuário não tem permissão', async () => {
        const contas = [makeConta()];
        (getContas as jest.Mock).mockResolvedValue(contas);
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(false);

        render(<InfosContas dadosDaAssociacao={dadosDaAssociacao} />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        const btnConfirmar = screen.getByRole('button', { name: /Confirmar encerramento/i });
        const btnRejeitar = screen.getByRole('button', { name: /Rejeitar encerramento/i });

        expect(btnConfirmar).toBeDisabled();
        expect(btnRejeitar).toBeDisabled();
    });

    test('renderiza mensagem quando não há contas e não quebra testes', async () => {
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
});