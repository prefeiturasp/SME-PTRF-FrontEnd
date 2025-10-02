import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
jest.mock('../TabelaContasEncerradas', () => ({
    TabelaContasEncerradas: ({ contas }: any) => <div data-testid="tabela-contas-encerradas">{contas?.length || 0}</div>,
}));
jest.mock('../ModalConfirmarEncerramento', () => ({
    ModalConfirmarEncerramento: () => null,
}));
jest.mock('../ModalRejeitarEncerramento', () => ({
    ModalRejeitarEncerramento: () => null,
}));
jest.mock('../BarraStatusEncerramentoConta', () => ({
    BarraStatusEncerramentoConta: () => null,
}));

import {
    getContas,
    getMotivosRejeicaoEncerramentoContas,
    getContasAssociacaoEncerradas,
} from '../../../../../../services/dres/Associacoes.service';
import { visoesService } from '../../../../../../services/visoes.service';

describe('InfosContas', () => {
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
            saldo_atual_conta: 100,
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

    test('renderiza loading inicialmente', () => {
        (getContas as jest.Mock).mockImplementation(() => new Promise(() => {}));
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
});