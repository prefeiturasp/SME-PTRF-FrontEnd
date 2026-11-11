import React from 'react';
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GeracaoAtaApresentacao } from '../index';

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

jest.mock('../../ModalNaoPodeGerarAta', () => ({
    ModalNaoPodeGerarAta: () => null,
}));

import {
    getGerarAtaPdf,
    getAtas,
    getDownloadAtaPdf,
} from '../../../../../services/escolas/AtasAssociacao.service';
import { getPeriodoFechado } from '../../../../../services/escolas/Associacao.service';
import { visoesService } from '../../../../../services/visoes.service';
import { geracaoDocumentosStorageService } from '../../../../../services/storages/GeracaoDeDocumentos.storage.service';

type StatusGeracao = 'EM_PROCESSAMENTO' | 'CONCLUIDO' | null;
type DadosAta = {
    status_geracao_pdf?: StatusGeracao;
};

describe('GeracaoAtaApresentacao - habilitação do botão "gerar ata"', () => {
    const defaultProps = {
        uuidAtaApresentacao: 'ata-uuid',
        uuidPrestacaoConta: 'pc-uuid',
        corBoxAtaApresentacao: 'verde',
        textoBoxAtaApresentacao: 'Ata de apresentação',
        dataBoxAtaApresentacao: 'Status/data',
        onClickVisualizarAta: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        const periodo = { data_inicial: '2025-01-01' };
        geracaoDocumentosStorageService.setPeriodo({ 'periodoPrestacaoDeConta': JSON.stringify(periodo) });
        window.localStorage.setItem('periodoPrestacaoDeConta', JSON.stringify(periodo));
    });

    function setupMocks({
        gerarOuEditarAta = true,
        temPermissao = true,
        statusGeracaoPdf = null as StatusGeracao,
        v2Ativa = true,
    } = {}) {
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(temPermissao);
        (visoesService.featureFlagAtiva as jest.Mock).mockImplementation(
            (flag: string) => flag === 'historico-de-membros-v2' && v2Ativa
        );

        (getAtas as jest.Mock).mockResolvedValue({
            status_geracao_pdf: statusGeracaoPdf,
        } as DadosAta);

        (getPeriodoFechado as jest.Mock).mockResolvedValue({
            gerar_ou_editar_ata_apresentacao: gerarOuEditarAta,
        });

        (getGerarAtaPdf as jest.Mock).mockResolvedValue({});
        (getDownloadAtaPdf as jest.Mock).mockResolvedValue({});
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
        (getGerarAtaPdf as jest.Mock).mockRejectedValueOnce(erroParticipantesAlterados);

        render(<GeracaoAtaApresentacao {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'gerar ata' })).toBeEnabled();
        });

        await userEvent.click(screen.getByRole('button', { name: 'gerar ata' }));

        return screen.findByRole('dialog');
    }

    test('botão "gerar ata" habilitado quando uuidPrestacaoConta e gerar_ou_editar_ata_apresentacao=true e usuário tem permissão', async () => {
        setupMocks({
            gerarOuEditarAta: true,
            temPermissao: true,
            statusGeracaoPdf: null,
        });

        render(<GeracaoAtaApresentacao {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /gerar ata/i })).toBeEnabled();
        });
    });

    test('botão "gerar ata" desabilitado quando usuário não tem permissão', async () => {
        setupMocks({
            gerarOuEditarAta: true,
            temPermissao: false,
            statusGeracaoPdf: null,
        });

        render(<GeracaoAtaApresentacao {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /gerar ata/i })).toBeInTheDocument();
        });

        expect(screen.getByRole('button', { name: /gerar ata/i })).toBeDisabled();
    });

    test('botão "gerar ata" desabilitado quando gerar_ou_editar_ata_apresentacao=false', async () => {
        setupMocks({
            gerarOuEditarAta: false,
            temPermissao: true,
            statusGeracaoPdf: null,
        });

        render(<GeracaoAtaApresentacao {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /gerar ata/i })).toBeInTheDocument();
        });

        expect(screen.getByRole('button', { name: /gerar ata/i })).toBeDisabled();
    });

    test('botão "gerar ata" desabilitado quando não há uuidPrestacaoConta', async () => {
        setupMocks({
            gerarOuEditarAta: true,
            temPermissao: true,
            statusGeracaoPdf: null,
        });

        render(
            <GeracaoAtaApresentacao
                {...defaultProps}
                uuidPrestacaoConta={undefined as any}
            />
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /gerar ata/i })).toBeInTheDocument();
        });

        expect(screen.getByRole('button', { name: /gerar ata/i })).toBeDisabled();
    });

    test('exibe texto com spinner quando status_geracao_pdf = "EM_PROCESSAMENTO"', async () => {
        setupMocks({
            gerarOuEditarAta: true,
            temPermissao: true,
            statusGeracaoPdf: 'EM_PROCESSAMENTO',
        });

        render(<GeracaoAtaApresentacao {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByText(/Gerando ata em PDF/i)).toBeInTheDocument();
        });
    });

    test('aciona getGerarAtaPdf ao clicar em "gerar ata" quando habilitado', async () => {
        setupMocks({
            gerarOuEditarAta: true,
            temPermissao: true,
            statusGeracaoPdf: null,
        });

        render(<GeracaoAtaApresentacao {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /gerar ata/i })).toBeEnabled();
        });

        await userEvent.click(screen.getByRole('button', { name: /gerar ata/i }));
        expect(getGerarAtaPdf).toHaveBeenCalledWith(defaultProps.uuidPrestacaoConta, defaultProps.uuidAtaApresentacao);
    });

    test('recarrega os dados da ata e não abre o modal de participantes quando a geração é bem-sucedida', async () => {
        setupMocks();

        render(<GeracaoAtaApresentacao {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'gerar ata' })).toBeEnabled();
        });
        expect(getAtas).toHaveBeenCalledTimes(1);

        await userEvent.click(screen.getByRole('button', { name: 'gerar ata' }));

        await waitFor(() => {
            expect(getAtas).toHaveBeenCalledTimes(2);
        });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
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
        expect(getGerarAtaPdf).toHaveBeenLastCalledWith(defaultProps.uuidPrestacaoConta, defaultProps.uuidAtaApresentacao);
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
        (getGerarAtaPdf as jest.Mock).mockRejectedValueOnce({
            ...erroParticipantesAlterados,
            response: {
                ...erroParticipantesAlterados.response,
                data: { ...erroParticipantesAlterados.response.data, campos_invalidos: ['local da reunião'] },
            },
        });

        render(<GeracaoAtaApresentacao {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'gerar ata' })).toBeEnabled();
        });

        await userEvent.click(screen.getByRole('button', { name: 'gerar ata' }));

        expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith('historico-de-membros-v2');
        expect(getGerarAtaPdf).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('não abre o modal de participantes quando a geração falha por campos inválidos', async () => {
        setupMocks();
        (getGerarAtaPdf as jest.Mock).mockRejectedValueOnce({
            status: 422,
            response: { status: 422, data: { campos_invalidos: ['local da reunião'] } },
        });

        render(<GeracaoAtaApresentacao {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'gerar ata' })).toBeEnabled();
        });

        await userEvent.click(screen.getByRole('button', { name: 'gerar ata' }));

        expect(getGerarAtaPdf).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
