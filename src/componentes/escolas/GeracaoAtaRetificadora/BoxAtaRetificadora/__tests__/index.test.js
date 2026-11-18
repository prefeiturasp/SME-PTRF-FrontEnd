import React from 'react';
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BoxAtaRetificadora } from '../index';

jest.mock('../../../../../services/escolas/AtasAssociacao.service', () => ({
    getGerarAtaPdf: jest.fn(),
    getAtas: jest.fn(),
    getDownloadAtaPdf: jest.fn(),
}));

jest.mock('../../../../../services/escolas/Associacao.service', () => ({
    getPeriodoFechado: jest.fn(),
}));

jest.mock('../../../../../services/visoes.service', () => ({
    visoesService: {
        getPermissoes: jest.fn(),
        featureFlagAtiva: jest.fn(),
    },
}));

jest.mock('../../../GeracaoDaAta/ModalNaoPodeGerarAta', () => ({
    ModalNaoPodeGerarAta: () => null,
}));

import {
    getGerarAtaPdf,
    getAtas,
} from '../../../../../services/escolas/AtasAssociacao.service';
import { getPeriodoFechado } from '../../../../../services/escolas/Associacao.service';
import { visoesService } from '../../../../../services/visoes.service';

describe('BoxAtaRetificadora - habilitação do botão "gerar ata"', () => {
    const defaultProps = {
        corBoxAtaRetificadora: 'verde',
        textoBoxAtaRetificadora: 'Ata de retificação',
        dataBoxAtaRetificadora: 'Status/data',
        onClickVisualizarAta: jest.fn(),
        uuidPrestacaoConta: 'pc-uuid',
        uuidAtaRetificacao: 'ata-uuid',
        statusPc: 'DEVOLVIDA_RETORNADA',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        const periodo = { data_inicial: '2025-01-01' };
        window.localStorage.setItem('periodoPrestacaoDeConta', JSON.stringify(periodo));
    });

    function setupMocks({
        gerarOuEditarAta = true,
        temPermissao = true,
        v2Ativa = true,
    } = {}) {
        visoesService.getPermissoes.mockReturnValue(temPermissao);
        visoesService.featureFlagAtiva.mockImplementation((flag) => flag === 'historico-de-membros-v2' && v2Ativa);

        getAtas.mockResolvedValue({
            status_geracao_pdf: null,
        });

        getPeriodoFechado.mockResolvedValue({
            gerar_ou_editar_ata_retificacao: gerarOuEditarAta,
        });

        getGerarAtaPdf.mockResolvedValue({});
    }

    const MENSAGEM_PARTICIPANTES =
        'Os participantes da ata foram atualizados de acordo com o histórico de membros. Revise a ata antes de gerar o documento.';

    const erroParticipantesAlterados = {
        status: 409,
        response: {
            status: 409,
            data: {
                erro: 'participantes_alterados_pelo_historico',
                mensagem: MENSAGEM_PARTICIPANTES,
            },
        },
    };

    async function abrirModalParticipantes() {
        getGerarAtaPdf.mockRejectedValueOnce(erroParticipantesAlterados);

        render(<BoxAtaRetificadora {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Gerar ata' })).toBeEnabled();
        });

        await userEvent.click(screen.getByRole('button', { name: 'Gerar ata' }));

        return screen.findByRole('dialog');
    }

    test('botão "gerar ata" habilitado quando gerar_ou_editar_ata_retificacao=true e usuário tem permissão', async () => {
        setupMocks({
            gerarOuEditarAta: true,
            temPermissao: true,
        });

        render(<BoxAtaRetificadora {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /gerar ata/i })).toBeEnabled();
        });
    });

    test('botão "gerar ata" desabilitado quando usuário não tem permissão', async () => {
        setupMocks({
            gerarOuEditarAta: true,
            temPermissao: false,
        });

        render(<BoxAtaRetificadora {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /gerar ata/i })).toBeInTheDocument();
        });

        expect(screen.getByRole('button', { name: /gerar ata/i })).toBeDisabled();
    });

    test('botão "gerar ata" desabilitado quando gerar_ou_editar_ata_retificacao=false', async () => {
        setupMocks({
            gerarOuEditarAta: false,
            temPermissao: true,
        });

        render(<BoxAtaRetificadora {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /gerar ata/i })).toBeInTheDocument();
        });

        expect(screen.getByRole('button', { name: /gerar ata/i })).toBeDisabled();
    });

    test('abre o modal de participantes alterados com a mensagem do backend quando a geração retorna 409', async () => {
        setupMocks();

        const modal = await abrirModalParticipantes();

        expect(within(modal).getByText(MENSAGEM_PARTICIPANTES)).toBeInTheDocument();
        expect(within(modal).getByRole('button', { name: 'Gerar ata' })).toBeEnabled();
        expect(within(modal).getByRole('button', { name: 'Visualizar ata' })).toBeInTheDocument();
    });

    test('gera a ata novamente e fecha o modal ao clicar em "Gerar ata" no modal de participantes', async () => {
        setupMocks();

        const modal = await abrirModalParticipantes();

        await userEvent.click(within(modal).getByRole('button', { name: 'Gerar ata' }));

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
        expect(getGerarAtaPdf).toHaveBeenCalledTimes(2);
        expect(getGerarAtaPdf).toHaveBeenLastCalledWith(defaultProps.uuidPrestacaoConta, defaultProps.uuidAtaRetificacao);
    });

    test('chama onClickVisualizarAta e fecha o modal ao clicar em "Visualizar ata" no modal de participantes', async () => {
        setupMocks();

        const modal = await abrirModalParticipantes();

        await userEvent.click(within(modal).getByRole('button', { name: 'Visualizar ata' }));

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
        expect(defaultProps.onClickVisualizarAta).toHaveBeenCalledTimes(1);
        expect(getGerarAtaPdf).toHaveBeenCalledTimes(1);
    });

    test('fecha o modal de participantes ao pressionar Escape sem gerar nem visualizar a ata', async () => {
        setupMocks();

        const modal = await abrirModalParticipantes();

        fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape', keyCode: 27 });

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
        expect(getGerarAtaPdf).toHaveBeenCalledTimes(1);
        expect(defaultProps.onClickVisualizarAta).not.toHaveBeenCalled();
    });

    test('não abre o modal de participantes quando a flag historico-de-membros-v2 está desativada', async () => {
        setupMocks({ v2Ativa: false });
        getGerarAtaPdf.mockRejectedValueOnce({
            ...erroParticipantesAlterados,
            response: {
                ...erroParticipantesAlterados.response,
                data: { ...erroParticipantesAlterados.response.data, campos_invalidos: ['local da reunião'] },
            },
        });

        render(<BoxAtaRetificadora {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Gerar ata' })).toBeEnabled();
        });

        await userEvent.click(screen.getByRole('button', { name: 'Gerar ata' }));

        expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith('historico-de-membros-v2');
        expect(getGerarAtaPdf).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('não abre o modal de participantes quando a geração falha por campos inválidos', async () => {
        setupMocks();
        getGerarAtaPdf.mockRejectedValueOnce({
            status: 422,
            response: { status: 422, data: { campos_invalidos: ['local da reunião'] } },
        });

        render(<BoxAtaRetificadora {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Gerar ata' })).toBeEnabled();
        });

        await userEvent.click(screen.getByRole('button', { name: 'Gerar ata' }));

        expect(getGerarAtaPdf).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
