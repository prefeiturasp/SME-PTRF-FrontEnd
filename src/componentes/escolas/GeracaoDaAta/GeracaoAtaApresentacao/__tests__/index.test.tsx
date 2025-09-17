import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
        window.localStorage.setItem('periodoPrestacaoDeConta', JSON.stringify(periodo));
    });

    function setupMocks({
        gerarOuEditarAta = true,
        temPermissao = true,
        statusGeracaoPdf = null as StatusGeracao,
    } = {}) {
        (visoesService.getPermissoes as jest.Mock).mockReturnValue(temPermissao);

        (getAtas as jest.Mock).mockResolvedValue({
            status_geracao_pdf: statusGeracaoPdf,
        } as DadosAta);

        (getPeriodoFechado as jest.Mock).mockResolvedValue({
            gerar_ou_editar_ata_apresentacao: gerarOuEditarAta,
        });

        (getGerarAtaPdf as jest.Mock).mockResolvedValue({});
        (getDownloadAtaPdf as jest.Mock).mockResolvedValue({});
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
});