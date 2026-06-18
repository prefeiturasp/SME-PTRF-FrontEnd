import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConferenciaDeDocumentos from '../index';
import { getDocumentosParaConferencia, getUltimaAnalisePc } from '../../../../../../services/dres/PrestacaoDeContas.service';
import { gerarUuid } from '../../../../../../utils/ValidacoesAdicionaisFormularios';

jest.mock('../../../../../../services/dres/PrestacaoDeContas.service', () => ({
    getDocumentosParaConferencia: jest.fn(),
    getUltimaAnalisePc: jest.fn(),
}));

jest.mock('../../../../../../utils/ValidacoesAdicionaisFormularios', () => ({
    gerarUuid: jest.fn(),
}));

jest.mock('../TabelaConferenciaDeDocumentos', () => {
    return function MockTabela({ listaDeDocumentosParaConferencia, loadingDocumentosParaConferencia }) {
        return (
            <div data-testid="mock-tabela-conferencia">
                <span data-testid="loading-state">{loadingDocumentosParaConferencia ? 'Carregando' : 'Pronto'}</span>
                <ul data-testid="lista-documentos">
                {listaDeDocumentosParaConferencia.map((doc, idx) => (
                    <li key={idx} data-testid="item-documento">
                    {doc.nome} - Selecionado: {doc.selecionado ? 'Sim' : 'Não'} - UUID: {doc.uuid_documento}
                    </li>
                ))}
                </ul>
            </div>
        );
    };
});

describe('ConferenciaDeDocumentos', () => {
    const mockOnUpdateLista = jest.fn();
    
    const prestacaoDeContasValida = {
        uuid: 'pc-123',
        analise_atual: { uuid: 'analise-456' }
    };

    const mockDocsRetornados = [
        { id: 1, nome: 'Documento Fiscal 1' },
        { id: 2, nome: 'Recibo 2' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        gerarUuid.mockReturnValue('mocked-uuid');
    });

    it('deve renderizar o título principal do componente', async () => {
        getDocumentosParaConferencia.mockResolvedValueOnce([]);
        
        render(<ConferenciaDeDocumentos prestacaoDeContas={prestacaoDeContasValida} />);

        expect(screen.getByRole('heading', { name: /conferência de documentos/i })).toBeInTheDocument();
        await waitFor(() => expect(screen.getByTestId('loading-state')).toHaveTextContent('Pronto'));
    });

    it('deve buscar documentos usando analise_atual quando editavel for true', async () => {
        getDocumentosParaConferencia.mockResolvedValueOnce(mockDocsRetornados);

        render(
            <ConferenciaDeDocumentos 
                prestacaoDeContas={prestacaoDeContasValida} 
                editavel={true}
                onUpdateListaDeDocumentosParaConferencia={mockOnUpdateLista}
            />
        );

        expect(screen.getByTestId('loading-state')).toHaveTextContent('Carregando');

        await waitFor(() => {
            expect(getDocumentosParaConferencia).toHaveBeenCalledWith('pc-123', 'analise-456');
            expect(getUltimaAnalisePc).not.toHaveBeenCalled();
            expect(screen.getByTestId('loading-state')).toHaveTextContent('Pronto');
        });

        const itens = screen.getAllByTestId('item-documento');
        expect(itens).toHaveLength(2);
        expect(itens[0]).toHaveTextContent('Documento Fiscal 1 - Selecionado: Não - UUID: mocked-uuid');
        
        expect(mockOnUpdateLista).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar a API se prestacaoDeContas ou analise_atual estiverem incompletos em modo editável', async () => {
        const pcInvalida = { uuid: 'pc-123' };
        
        render(<ConferenciaDeDocumentos prestacaoDeContas={pcInvalida} editavel={true} />);

        await waitFor(() => {
            expect(getDocumentosParaConferencia).not.toHaveBeenCalled();
            expect(screen.getByTestId('loading-state')).toHaveTextContent('Pronto');
        });
    });

    it('deve buscar a última análise e depois os documentos quando editavel for false', async () => {
        const mockUltimaAnalise = { uuid: 'analise-passada-789' };
        getUltimaAnalisePc.mockResolvedValueOnce(mockUltimaAnalise);
        getDocumentosParaConferencia.mockResolvedValueOnce(mockDocsRetornados);

        render(
            <ConferenciaDeDocumentos 
                prestacaoDeContas={prestacaoDeContasValida} 
                editavel={false}
                onUpdateListaDeDocumentosParaConferencia={mockOnUpdateLista}
            />
        );

        await waitFor(() => {
            expect(getUltimaAnalisePc).toHaveBeenCalledWith('pc-123');
            expect(getDocumentosParaConferencia).toHaveBeenCalledWith('pc-123', 'analise-passada-789');
        });

        const itens = screen.getAllByTestId('item-documento');
        expect(itens).toHaveLength(2);
        expect(mockOnUpdateLista).toHaveBeenCalledTimes(1);
    });

    it('não deve buscar documentos se a última análise não retornar um uuid válido', async () => {
        getUltimaAnalisePc.mockResolvedValueOnce(null);

        render(<ConferenciaDeDocumentos prestacaoDeContas={prestacaoDeContasValida} editavel={false} />);

        await waitFor(() => {
            expect(getUltimaAnalisePc).toHaveBeenCalledWith('pc-123');
            expect(getDocumentosParaConferencia).not.toHaveBeenCalled();
        });
    });

    it('deve definir a lista como vazia se a API retornar uma lista vazia ou nula', async () => {
        getDocumentosParaConferencia.mockResolvedValueOnce([]);

        render(
            <ConferenciaDeDocumentos 
                prestacaoDeContas={prestacaoDeContasValida} 
                onUpdateListaDeDocumentosParaConferencia={mockOnUpdateLista}
            />
        );

        await waitFor(() => {
            const itens = screen.queryAllByTestId('item-documento');
            expect(itens).toHaveLength(0);
            expect(mockOnUpdateLista).toHaveBeenCalledTimes(1);
        });
    });
});