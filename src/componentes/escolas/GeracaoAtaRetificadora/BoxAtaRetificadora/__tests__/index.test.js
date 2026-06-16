import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
    } = {}) {
        visoesService.getPermissoes.mockReturnValue(temPermissao);

        getAtas.mockResolvedValue({
            status_geracao_pdf: null,
        });

        getPeriodoFechado.mockResolvedValue({
            gerar_ou_editar_ata_retificacao: gerarOuEditarAta,
        });

        getGerarAtaPdf.mockResolvedValue({});
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
});
