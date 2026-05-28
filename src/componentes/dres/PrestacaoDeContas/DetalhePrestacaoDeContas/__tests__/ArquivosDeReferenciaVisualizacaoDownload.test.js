import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArquivosDeReferenciaVisualizacaoDownload from '../ArquivosDeReferencia/ArquivosDeReferenciaVisualizacaoDownload';
import {
    getDownloadArquivoDeReferencia,
    getDocumentosPaa,
} from '../../../../../services/dres/PrestacaoDeContas.service';

import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    useParams: jest.fn(),
}));

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
    },
}));

jest.mock('../../../../../services/dres/PrestacaoDeContas.service', () => ({
    getDownloadArquivoDeReferencia: jest.fn(),
    getDocumentosPaa: jest.fn(),
}));

jest.mock('../ModalVisualizarArquivoDeReferencia', () => {
    return function MockModal({ show, handleClose, nomeArquivoReferencia }) {
        if (!show) return null;
        return (
            <div data-testid="modal-visualizar">
                <span>Modal Aberto: {nomeArquivoReferencia}</span>
                <button onClick={handleClose}>Fechar Modal</button>
            </div>
        );
    };
});

jest.mock('react-tooltip', () => ({
    Tooltip: () => <div data-testid="react-tooltip" />,
}));


describe('ArquivosDeReferenciaVisualizacaoDownload Component', () => {
    const mockUuid = '123-abc-prestacao';

    const defaultInfoAta = {
        conta_associacao: {
            uuid: 'conta-unida-999'
        }
    };

    const defaultPrestacaoDeContas = {
        arquivos_referencia: [
            {
                uuid: 'arq-1',
                nome: 'Documento PAA 15/10/2023 14:30',
                tipo: 'PDF',
                conta_uuid: 'conta-unida-999',
                arquivo_apresentado_em_todas_as_contas: false
            },
            {
                uuid: 'arq-2',
                nome: 'Ata PAA 2023-11-20',
                tipo: 'DOCX',
                conta_uuid: 'outra-conta',
                arquivo_apresentado_em_todas_as_contas: true // Deve aparecer via filtro global
            }
        ]
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useParams.mockReturnValue({ prestacao_conta_uuid: mockUuid });
        getDocumentosPaa.mockResolvedValue([]);
    });

    it('deve exibir a mensagem de lista vazia quando não houver arquivos de referência', async () => {
        const prestacaoVazia = { arquivos_referencia: [] };
        
        render(
            <ArquivosDeReferenciaVisualizacaoDownload 
                prestacaoDeContas={prestacaoVazia} 
                infoAta={defaultInfoAta} 
            />
        );

        const mensagemVazia = screen.getByText('Não existem arquivos de referência para serem exibidos');
        expect(mensagemVazia).toBeInTheDocument();
        expect(mensagemVazia.tagName).toBe('STRONG');
    });

    it('deve carregar os documentos PAA da API no useEffect se houver prestacao_conta_uuid', async () => {
        const mockDocumentosAPI = [
            { uuid: 'api-doc-1', nome: 'Plano Anual', tipo: 'PDF', conta_uuid: 'conta-unida-999' }
        ];
        getDocumentosPaa.mockResolvedValueOnce(mockDocumentosAPI);

        render(
            <ArquivosDeReferenciaVisualizacaoDownload 
                prestacaoDeContas={defaultPrestacaoDeContas} 
                infoAta={defaultInfoAta} 
            />
        );

        expect(getDocumentosPaa).toHaveBeenCalledWith(mockUuid);

        await waitFor(() => {
            expect(screen.getByText('Documento PAA')).toBeInTheDocument();
            expect(screen.getByText('Documento pendente de geração.')).toBeInTheDocument();
        });
    });

    it('deve formatar corretamente as variações de nomes de documentos nos templates', async () => {
        const prestacaoVariada = {
            arquivos_referencia: [
                { uuid: 'v1', nome: 'Documento PAA retificado gerado dia 10/10/2023', conta_uuid: 'conta-unida-999' },
                { uuid: 'v2', nome: 'Ata de Retificação do PAA 2026-05-28', conta_uuid: 'conta-unida-999' },
                { uuid: 'v3', nome: 'Arquivo Comum Qualquer.pdf', conta_uuid: 'conta-unida-999' }
            ]
        };

        render(
            <ArquivosDeReferenciaVisualizacaoDownload 
                prestacaoDeContas={prestacaoVariada} 
                infoAta={defaultInfoAta} 
            />
        );

        expect(screen.getByText('Documento retificado gerado em 10/10/2023')).toBeInTheDocument();

        expect(screen.getByText('Ata de Retificação do PAA')).toBeInTheDocument();
        expect(screen.getByText('Documento retificado gerado em 28/05/2026')).toBeInTheDocument();

        expect(screen.getByText('Arquivo Comum Qualquer.pdf')).toBeInTheDocument();
    });

    it('deve desabilitar os botões de ação se o arquivo não possuir UUID', async () => {
        const prestacaoSemUuid = {
            arquivos_referencia: [
                { uuid: null, nome: 'Arquivo Sem ID.pdf', conta_uuid: 'conta-unida-999' }
            ]
        };

        render(
            <ArquivosDeReferenciaVisualizacaoDownload 
                prestacaoDeContas={prestacaoSemUuid} 
                infoAta={defaultInfoAta} 
            />
        );

        const botoes = screen.getAllByRole('button');
        
        botoes.forEach(botao => {
            expect(botao).toBeDisabled();
        });
    });

    it('deve abrir o modal de visualização ao clicar no botão de visualizar e fechá-lo em seguida', async () => {
        const user = userEvent.setup();
        
        render(
            <ArquivosDeReferenciaVisualizacaoDownload 
                prestacaoDeContas={defaultPrestacaoDeContas} 
                infoAta={defaultInfoAta} 
            />
        );

        const botoesVisualizar = screen.getAllByRole('button');
        
        await user.click(botoesVisualizar[0]);

        expect(screen.getByTestId('modal-visualizar')).toBeInTheDocument();
        expect(screen.getByText(/Modal Aberto: Documento PAA 15\/10\/2023 14:30/)).toBeInTheDocument();

        const botaoFechar = screen.getByRole('button', { name: /fechar modal/i });
        await user.click(botaoFechar);

        expect(screen.queryByTestId('modal-visualizar')).not.toBeInTheDocument();
    });

    it('deve disparar o download com sucesso ao clicar no botão de download', async () => {
        const user = userEvent.setup();
        getDownloadArquivoDeReferencia.mockResolvedValueOnce({ status: 200 });

        render(
            <ArquivosDeReferenciaVisualizacaoDownload 
                prestacaoDeContas={defaultPrestacaoDeContas} 
                infoAta={defaultInfoAta} 
            />
        );

        const botoes = screen.getAllByRole('button');
        const botaoDownload = botoes[1]; 

        await user.click(botaoDownload);

        expect(getDownloadArquivoDeReferencia).toHaveBeenCalledWith(
            'Documento PAA 15/10/2023 14:30',
            'arq-1',
            'PDF'
        );
    });

    it('deve exibir um toast de erro se a promise de download falhar', async () => {
        const user = userEvent.setup();
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        
        const mockErro = { response: 'Erro no servidor genérico' };
        getDownloadArquivoDeReferencia.mockRejectedValueOnce(mockErro);

        render(
            <ArquivosDeReferenciaVisualizacaoDownload 
                prestacaoDeContas={defaultPrestacaoDeContas} 
                infoAta={defaultInfoAta} 
            />
        );

        const botoes = screen.getAllByRole('button');
        const botaoDownload = botoes[1];

        await user.click(botaoDownload);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('O download do arquivo falhou.');
            expect(consoleSpy).toHaveBeenCalledWith('Erro ao efetuar o download ', 'Erro no servidor genérico');
        });

        consoleSpy.mockRestore();
    });
});