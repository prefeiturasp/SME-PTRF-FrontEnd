import api from '../../api';
import { 
    getResumoDRE,
    detalhamentoConsolidadoDRE,
    detalhamentoConferenciaDocumentos,
    deleteReabreConsolidadoDRE,
    getTodosOsResponsaveis,
    postAnalisarRelatorio,
    postMarcarComoPublicadoNoDiarioOficial,
    postMarcarComoAnalisado,
    gravarAcertosDocumentos,
    marcarAcertosDocumentosComoCorreto,
    marcarAcertosDocumentosComoNaoCorreto,
    downloadDocumentoRelatorio,
    getResumoConsolidado,
    gerarPreviaRelatorioDevolucaoAcertosSme,
    verificarStatusGeracaoDevolucaoAcertosSme,
    downloadDocumentPdfDevolucaoAcertos    
 } from '../AcompanhamentoSME.service.js';
import { TOKEN_ALIAS, ASSOCIACAO_UUID } from '../../auth.service.js';

jest.mock('../../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));


const mockToken = 'fake-token';
const mockData = [{ id: 1, nome: 'Teste 1' }];
const associacao_uuid = '1234'
const payload = { teste: 'teste' }

describe('Testes para funções de análise', () => {
    
    beforeEach(() => {
        localStorage.setItem(ASSOCIACAO_UUID, associacao_uuid);
        localStorage.setItem(TOKEN_ALIAS, mockToken);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    const authHeader = () => {
        return {
            headers: {
                'Authorization': `JWT ${mockToken}`,
                'Content-Type': 'application/json'
            }
        };
    };

    test('postAnalisarRelatorio deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postAnalisarRelatorio(payload);
        const url = `/api/consolidados-dre/analisar/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual({data: mockData});
    });
    
    test('postMarcarComoPublicadoNoDiarioOficial deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postMarcarComoPublicadoNoDiarioOficial(payload);
        const url = `/api/consolidados-dre/marcar-como-publicado-no-diario-oficial/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual({data: mockData});
    });
    
    test('postMarcarComoAnalisado deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postMarcarComoAnalisado(payload);
        const url = `/api/consolidados-dre/marcar-como-analisado/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual({data: mockData});
    });
    
    test('gravarAcertosDocumentos deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await gravarAcertosDocumentos(payload);
        const url = `/api/analises-documentos-consolidados-dre/gravar-acerto/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual({data: mockData});
    });
    
    test('marcarAcertosDocumentosComoCorreto deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const result = await marcarAcertosDocumentosComoCorreto(payload);
        const url = `/api/analises-documentos-consolidados-dre/marcar-como-correto/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual({data: mockData});
    });
    
    test('marcarAcertosDocumentosComoNaoCorreto deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const result = await marcarAcertosDocumentosComoNaoCorreto(payload);
        const url = `/api/analises-documentos-consolidados-dre/marcar-como-nao-conferido/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual({data: mockData});
    });
    
    test('getResumoDRE deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const dre__uuid = '1234'
        const periodo_uuid = '1234'
        const nome = '1234'
        const tipo_unidade = '1234'
        const devolucao_tesouro = '1234'
        const status = '1234'
        const result = await getResumoDRE(dre__uuid, periodo_uuid, nome, tipo_unidade, devolucao_tesouro, status);
        const url = `/api/prestacoes-contas/todos-os-status/?associacao__unidade__dre__uuid=${dre__uuid}&periodo__uuid=${periodo_uuid}${nome ? '&nome=' + nome : ''}${tipo_unidade ? '&tipo_unidade=' + tipo_unidade : ''}${devolucao_tesouro ? '&devolucao_tesouro=' + devolucao_tesouro : ''}${status ? '&status=' + status : ''}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('detalhamentoConsolidadoDRE deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_consolidado = '1234'
        const result = await detalhamentoConsolidadoDRE(uuid_consolidado);
        const url = `/api/consolidados-dre/detalhamento/?uuid=${uuid_consolidado}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual({data: mockData});
    });
    
    test('detalhamentoConferenciaDocumentos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_consolidado = '1234'
        const uuid_analise_atual = '1234'
        const result = await detalhamentoConferenciaDocumentos(uuid_consolidado, uuid_analise_atual);
        const url = `/api/consolidados-dre/detalhamento-conferencia-documentos/?uuid=${uuid_consolidado}${uuid_analise_atual ? "&analise_atual="+uuid_analise_atual : ''}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual({data: mockData});
    });
    
    test('getTodosOsResponsaveis deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const visao = 'SME'
        const result = await getTodosOsResponsaveis(visao);
        const url = `/api/usuarios/usuarios-servidores-por-visao/?visao=${visao}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('deleteReabreConsolidadoDRE deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const uuid_consolidado = 'SME'
        const result = await deleteReabreConsolidadoDRE(uuid_consolidado);
        const url = `/api/consolidados-dre/reabrir-consolidado/?uuid=${uuid_consolidado}`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual({data: mockData});
    });
    
    test('getResumoConsolidado deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const analise_uuid = '1234'
        const result = await getResumoConsolidado(analise_uuid);
        const url = `/api/analises-consolidados-dre/${analise_uuid}/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual({data: mockData});
    });
    
    test('gerarPreviaRelatorioDevolucaoAcertosSme deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid = '1234'
        const result = await gerarPreviaRelatorioDevolucaoAcertosSme(uuid);
        const url = `/api/analises-consolidados-dre/previa-relatorio-devolucao-acertos/?analise_consolidado_uuid=${uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('verificarStatusGeracaoDevolucaoAcertosSme deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid = '1234'
        const result = await verificarStatusGeracaoDevolucaoAcertosSme(uuid);
        const url = `/api/analises-consolidados-dre/status-info_relatorio_devolucao_acertos/?analise_consolidado_uuid=${uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('downloadDocumentoRelatorio deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const documento = {
            tipo_documento: "tipo",
            uuid: '1234'
        }
        const result = await downloadDocumentoRelatorio(documento);
        const url = `/api/analises-documentos-consolidados-dre/download-documento/?tipo_documento=${documento.tipo_documento}&documento_uuid=${documento.uuid}`
        expect(api.get).toHaveBeenCalledWith(url, 
            expect.objectContaining({
                responseType: 'blob',
                timeout: 30000,
                ...authHeader()
            })
        )
        expect(result).toEqual({data: mockData});
    });

    it('downloadDocumentPdfDevolucaoAcertos  deve baixar o arquivo corretamente na API', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
        const analise_atual_uuid = '1234'

        api.get.mockResolvedValue(mockResponse);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        });

        await downloadDocumentPdfDevolucaoAcertos(analise_atual_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/analises-consolidados-dre/download-documento-pdf_devolucao_acertos/?analise_consolidado_uuid=${analise_atual_uuid}`,
            expect.objectContaining({
            responseType: 'blob',
            timeout: 30000,
            ...authHeader()
        }));

        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockCreateElement).toHaveBeenCalledWith('a');

        mockCreateObjectURL.mockRestore();
        mockCreateElement.mockRestore();
        
    });


});
