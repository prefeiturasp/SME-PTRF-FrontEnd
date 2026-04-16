import api from '../../api';
import {
    getSaldoAtualPorAcaoAssociacao,
    postReceitasPrevistasPaa,
    patchReceitasPrevistasPaa,
    downloadPdfLevantamentoPrioridades,
    getRecursosProprios,
    getTotalizadorRecursoProprio,
    getFontesRecursos,
    getProgramasPddeTotais,
    getAcoesPDDE,
    postRecursoProprioPaa,
    patchRecursoProprioPaa,
    deleteRecursoProprioPaa,
    getTextosPaaUe,
    patchTextosPaaUe,
    postGerarDocumentoFinalPaa,
    getPaaRetificacao,
    postIniciarRetificacaoPaa,
    postGerarDocumentoPreviaPaa,
    getStatusGeracaoDocumentoPaa,
    getDownloadArquivoPrevia,
    getDownloadArquivoFinal,
    getPaa,
    patchPaa,
    getReceitasPrevistasOutrosRecursosPeriodo,
    postReceitasPrevistasOutrosRecursosPeriodo,
    patchReceitasPrevistasOutrosRecursosPeriodo,
    ObterUrlModeloArquivoPlanoAnual,
    getAcoesPTRFPrioridades,
    getAcoesPDDEPrioridades,
    postReceitaPrevistaPDDE,
    patchReceitaPrevistaPDDE,
    getPaaReceitasPrevistas,
    postDesativarAtualizacaoSaldoPAA,
    postAtivarAtualizacaoSaldoPAA,
    postImportarPrioridades,
    getPrioridadesTabelas,
    getPrioridades,
    getPrioridadesRelatorio,
    postPrioridade,
    postDuplicarPrioridade,
    getResumoPrioridades,
    getAtividadesEstatutariasPrevistas,
    getPaaVigenteEAnteriores,
    downloadDocumentoFinalPaa,
    getAtividadesEstatutariasDisponiveis,
    createAtividadeEstatutariaPaa,
    linkAtividadeEstatutariaExistentePaa,
    updateAtividadeEstatutariaPaa,
    deleteAtividadeEstatutariaPaa,
    getRecursosPropriosPrevistos,
    patchPrioridade,
    deletePrioridade,
    deletePrioridadesEmLote,
    getObjetivosPaa,
    postGerarAtaPaa,
    getStatusAtaPaa,
    getDownloadAtaPaa,
    getPlanoOrcamentario,
} from '../Paa.service.js';
import { TOKEN_ALIAS } from '../../auth.service.js';

jest.mock('../../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));


const mockToken = 'fake-token';
const mockData = [{ id: 1, nome: 'Teste 1' }];

describe('Testes para funções de análise', () => {
    
    beforeEach(() => {
        localStorage.setItem(TOKEN_ALIAS, mockToken);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    const getAuthHeader = () => {
        return {
            headers: {
                'Authorization': `JWT ${mockToken}`,
                'Content-Type': 'application/json'
            }
        };
    };

    test('getSaldoAtualPorAcaoAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const acaoAssociacaoUUID = '1234'
        const result = await getSaldoAtualPorAcaoAssociacao(acaoAssociacaoUUID);

        expect(api.get).toHaveBeenCalledWith(
            `api/acoes-associacoes/${acaoAssociacaoUUID}/obter-saldo-atual/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('postReceitasPrevistasPaa deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const result = await postReceitasPrevistasPaa(payload);

        expect(api.post).toHaveBeenCalledWith(
            `api/receitas-previstas-paa/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('patchReceitasPrevistasPaa deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const uuid = '1234'
        const result = await patchReceitasPrevistasPaa(uuid, payload);

        expect(api.patch).toHaveBeenCalledWith(
            `api/receitas-previstas-paa/${uuid}/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    it('downloadPdfLevantamentoPrioridades deve baixar o arquivo corretamente na API', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
        const associacao_uuid = '1234'
        api.get.mockResolvedValue(mockResponse);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return {
                setAttribute: jest.fn(),
                click: jest.fn(),
                href: '',
            };
        });

        await downloadPdfLevantamentoPrioridades(associacao_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/paa/download-pdf-levantamento-prioridades/`,
            expect.objectContaining({
            responseType: 'blob',
            timeout: 30000,
            ...getAuthHeader(),
            params: {
                associacao_uuid : associacao_uuid
            }
        }));

        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockCreateElement).toHaveBeenCalledWith('a');

        mockCreateObjectURL.mockRestore();
        mockCreateElement.mockRestore();
    });

    it('downloadPdfLevantamentoPrioridades deve executar click, removeChild e revokeObjectURL', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/pdf' });
        api.get.mockResolvedValue({ data: mockBlob });
        window.URL.createObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.revokeObjectURL = jest.fn();
        const mockLink = { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
        jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
        jest.spyOn(document.body, 'removeChild').mockImplementation(() => {});

        await downloadPdfLevantamentoPrioridades('assoc-uuid');

        expect(mockLink.click).toHaveBeenCalled();
        expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
        expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://dummy-url');

        jest.restoreAllMocks();
    });

    test('getRecursosProprios deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const associacaoUUID = '1234'
        const page = '1'
        const result = await getRecursosProprios(associacaoUUID);

        expect(api.get).toHaveBeenCalledWith(
            `api/recursos-proprios-paa/?associacao__uuid=${associacaoUUID}&page=${page}&page_size=20`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getTotalizadorRecursoProprio deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const associacaoUUID = '1234'
        const result = await getTotalizadorRecursoProprio(associacaoUUID);

        expect(api.get).toHaveBeenCalledWith(
            `api/recursos-proprios-paa/total/?associacao__uuid=${associacaoUUID}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getFontesRecursos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getFontesRecursos();

        expect(api.get).toHaveBeenCalledWith(`api/fontes-recursos-paa/`, getAuthHeader());
        expect(result).toEqual(mockData);
    });

    test('getCategoriasPddeTotais deve chamar a API corretamente', async () => {
        localStorage.setItem('PAA', '1234');
        api.get.mockResolvedValue({ data: mockData });
        const result = await getProgramasPddeTotais();

        expect(api.get).toHaveBeenCalledWith(
            `api/programas-pdde/totais/?paa_uuid=1234&pagination=false`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getAcoesPDDE deve chamar a API corretamente', async () => {
        localStorage.setItem('PAA', '1234');
        api.get.mockResolvedValue({ data: mockData });
        const currentPage = 1;
        const rowsPerPage = 20;
        const result = await getAcoesPDDE();

        expect(api.get).toHaveBeenCalledWith(
            `/api/acoes-pdde/receitas-previstas-pdde/?page=${currentPage}&page_size=${rowsPerPage}&paa_uuid=1234`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('patchRecursoProprioPaa deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const uuid = '1234'
        const result = await patchRecursoProprioPaa(uuid, payload);

        expect(api.patch).toHaveBeenCalledWith(
            `api/recursos-proprios-paa/${uuid}/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('postRecursoProprioPaa deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const result = await postRecursoProprioPaa(payload);

        expect(api.post).toHaveBeenCalledWith(
            `api/recursos-proprios-paa/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('deleteRecursoProprioPaa deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData });
        const uuid = '1234'
        const result = await deleteRecursoProprioPaa(uuid);

        expect(api.delete).toHaveBeenCalledWith(
            `api/recursos-proprios-paa/${uuid}/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getTextosPaaUe deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTextosPaaUe();
        expect(api.get).toHaveBeenCalledWith(
            `/api/parametros-paa/textos-paa-ue/`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('patchTextosPaaUe deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const payload = { teste: 'testes' }
        const result = await patchTextosPaaUe(payload);
        expect(api.patch).toHaveBeenCalledWith(
            `/api/parametros-paa/update-textos-paa-ue/`,
            payload,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('getRecursosProprios deve incluir paaUUID na URL quando fornecido', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const associacaoUUID = 'assoc-uuid';
        const page = 2;
        const paaUUID = 'paa-uuid';
        const result = await getRecursosProprios(associacaoUUID, page, paaUUID);

        expect(api.get).toHaveBeenCalledWith(
            `api/recursos-proprios-paa/?associacao__uuid=${associacaoUUID}&page=${page}&page_size=20&paa__uuid=${paaUUID}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getTotalizadorRecursoProprio deve incluir paaUUID na URL quando fornecido', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const associacaoUUID = 'assoc-uuid';
        const paaUUID = 'paa-uuid';
        const result = await getTotalizadorRecursoProprio(associacaoUUID, paaUUID);

        expect(api.get).toHaveBeenCalledWith(
            `api/recursos-proprios-paa/total/?associacao__uuid=${associacaoUUID}&paa__uuid=${paaUUID}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('deleteRecursoProprioPaa deve incluir query param quando confirmaPrioridades=true', async () => {
        api.delete.mockResolvedValue({ data: mockData });
        const uuid = 'uuid-123';
        const result = await deleteRecursoProprioPaa(uuid, true);

        expect(api.delete).toHaveBeenCalledWith(
            `api/recursos-proprios-paa/${uuid}/?confirmar_limpeza_prioridades_paa=true`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('downloadPdfLevantamentoPrioridades deve retornar erro quando a API falha', async () => {
        const mockError = { response: { status: 500 } };
        api.get.mockRejectedValue(mockError);

        const result = await downloadPdfLevantamentoPrioridades('assoc-uuid');

        expect(result).toEqual(mockError.response);
    });

    test('postGerarDocumentoFinalPaa deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const paa_uuid = 'paa-uuid';
        const payload = { formato: 'pdf' };
        const result = await postGerarDocumentoFinalPaa(paa_uuid, payload);

        expect(api.post).toHaveBeenCalledWith(
            `/api/paa/${paa_uuid}/gerar-documento/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('postGerarDocumentoFinalPaa deve usar payload vazio por padrão', async () => {
        api.post.mockResolvedValue({ data: mockData });
        await postGerarDocumentoFinalPaa('paa-uuid');

        expect(api.post).toHaveBeenCalledWith(
            `/api/paa/paa-uuid/gerar-documento/`,
            {},
            getAuthHeader()
        );
    });

    test('getPaaRetificacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const paa_uuid = 'paa-uuid';
        const result = await getPaaRetificacao(paa_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/paa/${paa_uuid}/paa-retificacao/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('postIniciarRetificacaoPaa deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const paa_uuid = 'paa-uuid';
        const payload = { justificativa: 'motivo' };
        const result = await postIniciarRetificacaoPaa(paa_uuid, payload);

        expect(api.post).toHaveBeenCalledWith(
            `/api/paa/${paa_uuid}/iniciar-retificacao/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('postGerarDocumentoPreviaPaa deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const paa_uuid = 'paa-uuid';
        const result = await postGerarDocumentoPreviaPaa(paa_uuid);

        expect(api.post).toHaveBeenCalledWith(
            `/api/paa/${paa_uuid}/gerar-previa-documento/`,
            {},
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getStatusGeracaoDocumentoPaa deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const paa_uuid = 'paa-uuid';
        const result = await getStatusGeracaoDocumentoPaa(paa_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/paa/${paa_uuid}/status-geracao/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    it('getDownloadArquivoPrevia deve baixar o arquivo corretamente', async () => {
        const mockBlob = new Blob(['content'], { type: 'application/pdf' });
        api.get.mockResolvedValue({ data: mockBlob });
        window.URL.createObjectURL = jest.fn(() => 'blob:previa-url');
        const mockLink = { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
        jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});

        await getDownloadArquivoPrevia('paa-uuid');

        expect(api.get).toHaveBeenCalledWith(
            `/api/paa/paa-uuid/documento-previa/`,
            expect.objectContaining({ responseType: 'blob', timeout: 30000 })
        );
        expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'Documento_Prévia_PAA.pdf');
        expect(mockLink.click).toHaveBeenCalled();

        jest.restoreAllMocks();
    });

    it('getDownloadArquivoPrevia deve retornar erro quando a API falha', async () => {
        const mockError = { response: { status: 500 } };
        api.get.mockRejectedValue(mockError);

        const result = await getDownloadArquivoPrevia('paa-uuid');

        expect(result).toEqual(mockError.response);
    });

    it('getDownloadArquivoFinal deve baixar o arquivo corretamente', async () => {
        const mockBlob = new Blob(['content'], { type: 'application/pdf' });
        api.get.mockResolvedValue({ data: mockBlob });
        window.URL.createObjectURL = jest.fn(() => 'blob:final-url');
        const mockLink = { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
        jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});

        await getDownloadArquivoFinal('paa-uuid');

        expect(api.get).toHaveBeenCalledWith(
            `/api/paa/paa-uuid/documento-final/`,
            expect.objectContaining({ responseType: 'blob', timeout: 30000 })
        );
        expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'Documento_Final_PAA.pdf');
        expect(mockLink.click).toHaveBeenCalled();

        jest.restoreAllMocks();
    });

    it('getDownloadArquivoFinal deve retornar erro quando a API falha', async () => {
        const mockError = { response: { status: 404 } };
        api.get.mockRejectedValue(mockError);

        const result = await getDownloadArquivoFinal('paa-uuid');

        expect(result).toEqual(mockError.response);
    });

    test('getPaa deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const uuid = 'paa-uuid';
        const result = await getPaa(uuid);

        expect(api.get).toHaveBeenCalledWith(`api/paa/${uuid}/`, getAuthHeader());
        expect(result).toEqual(mockData);
    });

    test('patchPaa deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const uuid = 'paa-uuid';
        const payload = { status: 'PUBLICADO' };
        const result = await patchPaa(uuid, payload);

        expect(api.patch).toHaveBeenCalledWith(`api/paa/${uuid}/`, payload, getAuthHeader());
        expect(result).toEqual(mockData);
    });

    test('getReceitasPrevistasOutrosRecursosPeriodo deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const uuid = 'paa-uuid';
        const params = { periodo: '2024' };
        const result = await getReceitasPrevistasOutrosRecursosPeriodo(uuid, params);

        expect(api.get).toHaveBeenCalledWith(
            `api/paa/${uuid}/outros-recursos-do-periodo`,
            { ...getAuthHeader(), params }
        );
        expect(result).toEqual(mockData);
    });

    test('postReceitasPrevistasOutrosRecursosPeriodo deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const payload = { valor: 1000 };
        const result = await postReceitasPrevistasOutrosRecursosPeriodo(payload);

        expect(api.post).toHaveBeenCalledWith(
            `api/receitas-previstas-outros-recursos-periodo/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('patchReceitasPrevistasOutrosRecursosPeriodo deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const uuid = 'rec-uuid';
        const payload = { valor: 2000 };
        const result = await patchReceitasPrevistasOutrosRecursosPeriodo(uuid, payload);

        expect(api.patch).toHaveBeenCalledWith(
            `api/receitas-previstas-outros-recursos-periodo/${uuid}/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    it('ObterUrlModeloArquivoPlanoAnual deve retornar URL do blob com tipo padrão', async () => {
        const mockBlob = new Blob(['content'], { type: 'application/pdf' });
        api.get.mockResolvedValue({ data: mockBlob, headers: { 'content-type': 'application/pdf' } });
        window.URL.createObjectURL = jest.fn(() => 'blob:modelo-url');

        const result = await ObterUrlModeloArquivoPlanoAnual();

        expect(api.get).toHaveBeenCalledWith(
            `/api/modelos-cargas-paa/MODELO_PLANO_ANUAL/download/`,
            expect.objectContaining({ responseType: 'blob', timeout: 30000 })
        );
        expect(window.URL.createObjectURL).toHaveBeenCalled();
        expect(result).toBe('blob:modelo-url');
    });

    it('ObterUrlModeloArquivoPlanoAnual deve aceitar tipo_carga personalizado', async () => {
        api.get.mockResolvedValue({ data: new Blob([]), headers: {} });
        window.URL.createObjectURL = jest.fn(() => 'blob:outro-url');

        await ObterUrlModeloArquivoPlanoAnual('OUTRO_TIPO');

        expect(api.get).toHaveBeenCalledWith(
            `/api/modelos-cargas-paa/OUTRO_TIPO/download/`,
            expect.objectContaining({ responseType: 'blob' })
        );
    });

    test('getAcoesPTRFPrioridades deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const paa_uuid = 'paa-uuid';
        const result = await getAcoesPTRFPrioridades(paa_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/acoes-associacoes/acoes-ptrf-paa/?pagination=false&paa_uuid=${paa_uuid}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getAcoesPDDEPrioridades deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const paa_uuid = 'paa-uuid';
        const result = await getAcoesPDDEPrioridades(paa_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/acoes-pdde/acoes-pdde-paa/?paa_uuid=${paa_uuid}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('postReceitaPrevistaPDDE deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const payload = { acao: 'PDDE' };
        const result = await postReceitaPrevistaPDDE(payload);

        expect(api.post).toHaveBeenCalledWith(
            `api/receitas-previstas-pdde/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('patchReceitaPrevistaPDDE deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const uuid = 'rec-pdde-uuid';
        const payload = { valor: 500 };
        const result = await patchReceitaPrevistaPDDE(uuid, payload);

        expect(api.patch).toHaveBeenCalledWith(
            `api/receitas-previstas-pdde/${uuid}/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getPaaReceitasPrevistas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const uuid = 'paa-uuid';
        const result = await getPaaReceitasPrevistas(uuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/paa/${uuid}/receitas-previstas/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('postDesativarAtualizacaoSaldoPAA deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const uuid = 'paa-uuid';
        const result = await postDesativarAtualizacaoSaldoPAA(uuid);

        expect(api.post).toHaveBeenCalledWith(
            `api/paa/${uuid}/desativar-atualizacao-saldo/`,
            {},
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('postAtivarAtualizacaoSaldoPAA deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const uuid = 'paa-uuid';
        const result = await postAtivarAtualizacaoSaldoPAA(uuid);

        expect(api.post).toHaveBeenCalledWith(
            `api/paa/${uuid}/ativar-atualizacao-saldo/`,
            {},
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('postImportarPrioridades deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const uuid_atual = 'paa-atual';
        const uuid_anterior = 'paa-anterior';
        const result = await postImportarPrioridades(uuid_atual, uuid_anterior);

        expect(api.post).toHaveBeenCalledWith(
            `api/paa/${uuid_atual}/importar-prioridades/${uuid_anterior}/?confirmar=0`,
            {},
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('postImportarPrioridades deve aceitar confirmar=1', async () => {
        api.post.mockResolvedValue({ data: mockData });
        await postImportarPrioridades('paa-atual', 'paa-anterior', 1);

        expect(api.post).toHaveBeenCalledWith(
            `api/paa/paa-atual/importar-prioridades/paa-anterior/?confirmar=1`,
            {},
            getAuthHeader()
        );
    });

    test('getPrioridadesTabelas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const paa_uuid = 'paa-uuid';
        const result = await getPrioridadesTabelas(paa_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/prioridades-paa/tabelas/?paa__uuid=${paa_uuid}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getPrioridades deve chamar a API com parâmetros padrão', async () => {
        localStorage.setItem('PAA', 'paa-uuid');
        api.get.mockResolvedValue({ data: mockData });
        const result = await getPrioridades({});

        expect(api.get).toHaveBeenCalledWith(
            expect.stringContaining('api/prioridades-paa/'),
            getAuthHeader()
        );
        expect(api.get).toHaveBeenCalledWith(
            expect.stringContaining('paa__uuid=paa-uuid'),
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getPrioridades deve incluir page e page_size na URL', async () => {
        localStorage.setItem('PAA', 'paa-uuid');
        api.get.mockResolvedValue({ data: mockData });
        await getPrioridades({}, 2, 10);

        expect(api.get).toHaveBeenCalledWith(
            expect.stringContaining('page=2&page_size=10'),
            getAuthHeader()
        );
    });

    test('getPrioridadesRelatorio deve chamar a API corretamente', async () => {
        localStorage.setItem('PAA', 'paa-uuid');
        api.get.mockResolvedValue({ data: mockData });
        const result = await getPrioridadesRelatorio();

        expect(api.get).toHaveBeenCalledWith(
            expect.stringContaining('api/prioridades-paa-relatorio/'),
            getAuthHeader()
        );
        expect(api.get).toHaveBeenCalledWith(
            expect.stringContaining('paa__uuid=paa-uuid'),
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('postPrioridade deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const payload = { nome: 'Prioridade 1' };
        const result = await postPrioridade(payload);

        expect(api.post).toHaveBeenCalledWith(
            `api/prioridades-paa/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('postDuplicarPrioridade deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const uuid = 'prio-uuid';
        const result = await postDuplicarPrioridade(uuid);

        expect(api.post).toHaveBeenCalledWith(
            `api/prioridades-paa/${uuid}/duplicar/`,
            {},
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getResumoPrioridades deve chamar a API corretamente', async () => {
        localStorage.setItem('PAA', 'paa-uuid');
        api.get.mockResolvedValue({ data: mockData });
        const result = await getResumoPrioridades();

        expect(api.get).toHaveBeenCalledWith(
            `api/paa/paa-uuid/resumo-prioridades/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getAtividadesEstatutariasPrevistas deve chamar a API quando paaUuid é fornecido', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const paaUuid = 'paa-uuid';
        const result = await getAtividadesEstatutariasPrevistas(paaUuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/paa/${paaUuid}/atividades-estatutarias-previstas/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getAtividadesEstatutariasPrevistas deve retornar { results: [] } quando paaUuid não é fornecido', async () => {
        const result = await getAtividadesEstatutariasPrevistas(undefined);
        expect(result).toEqual({ results: [] });
        expect(api.get).not.toHaveBeenCalled();
    });

    test('getPaaVigenteEAnteriores deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const associacaoUuid = 'assoc-uuid';
        const result = await getPaaVigenteEAnteriores(associacaoUuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/paa/paa-vigente-e-anteriores/?associacao_uuid=${associacaoUuid}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    it('downloadDocumentoFinalPaa deve baixar o arquivo corretamente', async () => {
        const mockBlob = new Blob(['content'], { type: 'application/pdf' });
        api.get.mockResolvedValue({ data: mockBlob });
        window.URL.createObjectURL = jest.fn(() => 'blob:doc-final-url');
        window.URL.revokeObjectURL = jest.fn();
        const mockLink = { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
        jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
        jest.spyOn(document.body, 'removeChild').mockImplementation(() => {});

        const paaUuid = 'paa-uuid';
        await downloadDocumentoFinalPaa(paaUuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/paa/${paaUuid}/documento-final/`,
            expect.objectContaining({ responseType: 'blob', timeout: 30000 })
        );
        expect(mockLink.setAttribute).toHaveBeenCalledWith('download', `plano_anual_${paaUuid}.pdf`);
        expect(mockLink.click).toHaveBeenCalled();
        expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:doc-final-url');

        jest.restoreAllMocks();
    });

    test('getAtividadesEstatutariasDisponiveis deve chamar a API quando paaUuid é fornecido', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const paaUuid = 'paa-uuid';
        const result = await getAtividadesEstatutariasDisponiveis(paaUuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/paa/${paaUuid}/atividades-estatutarias-disponiveis/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getAtividadesEstatutariasDisponiveis deve retornar { results: [] } quando paaUuid não é fornecido', async () => {
        const result = await getAtividadesEstatutariasDisponiveis(undefined);
        expect(result).toEqual({ results: [] });
        expect(api.get).not.toHaveBeenCalled();
    });

    test('createAtividadeEstatutariaPaa deve chamar patch com dados da atividade', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const paaUuid = 'paa-uuid';
        const atividade = { nome: 'Reunião', tipo: 'GERAL', data: '2024-01-15' };
        const result = await createAtividadeEstatutariaPaa(paaUuid, atividade);

        expect(api.patch).toHaveBeenCalledWith(
            `api/paa/${paaUuid}/`,
            { atividades_estatutarias: [{ nome: atividade.nome, tipo: atividade.tipo, data: atividade.data }] },
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('createAtividadeEstatutariaPaa deve lançar erro quando paaUuid não é fornecido', async () => {
        await expect(createAtividadeEstatutariaPaa(undefined, {})).rejects.toThrow(
            'PAA UUID é obrigatório para atualizar atividades estatutárias.'
        );
    });

    test('linkAtividadeEstatutariaExistentePaa deve chamar patch com atividade_estatutaria e data', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const paaUuid = 'paa-uuid';
        const atividade = { atividade_estatutaria: 'at-uuid', data: '2024-02-10' };
        const result = await linkAtividadeEstatutariaExistentePaa(paaUuid, atividade);

        expect(api.patch).toHaveBeenCalledWith(
            `api/paa/${paaUuid}/`,
            { atividades_estatutarias: [{ atividade_estatutaria: atividade.atividade_estatutaria, data: atividade.data }] },
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('updateAtividadeEstatutariaPaa deve chamar patch com todos os campos', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const paaUuid = 'paa-uuid';
        const atividade = { atividade_estatutaria: 'at-uuid', nome: 'Nova', tipo: 'ESPECIAL', data: '2024-03-01' };
        const result = await updateAtividadeEstatutariaPaa(paaUuid, atividade);

        expect(api.patch).toHaveBeenCalledWith(
            `api/paa/${paaUuid}/`,
            {
                atividades_estatutarias: [{
                    atividade_estatutaria: atividade.atividade_estatutaria,
                    nome: atividade.nome,
                    tipo: atividade.tipo,
                    data: atividade.data,
                }],
            },
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('deleteAtividadeEstatutariaPaa deve chamar patch com _destroy=true', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const paaUuid = 'paa-uuid';
        const atividadeUuid = 'at-uuid';
        const result = await deleteAtividadeEstatutariaPaa(paaUuid, atividadeUuid);

        expect(api.patch).toHaveBeenCalledWith(
            `api/paa/${paaUuid}/`,
            { atividades_estatutarias: [{ atividade_estatutaria: atividadeUuid, _destroy: true }] },
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getRecursosPropriosPrevistos deve chamar a API quando paaUuid é fornecido', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const paaUuid = 'paa-uuid';
        const result = await getRecursosPropriosPrevistos(paaUuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/paa/${paaUuid}/recursos-proprios-previstos/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getRecursosPropriosPrevistos deve retornar [] quando paaUuid não é fornecido', async () => {
        const result = await getRecursosPropriosPrevistos(undefined);
        expect(result).toEqual([]);
        expect(api.get).not.toHaveBeenCalled();
    });

    test('patchPrioridade deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const uuid = 'prio-uuid';
        const payload = { descricao: 'atualizado' };
        const result = await patchPrioridade(uuid, payload);

        expect(api.patch).toHaveBeenCalledWith(
            `api/prioridades-paa/${uuid}/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('deletePrioridade deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData });
        const uuid = 'prio-uuid';
        const result = await deletePrioridade(uuid);

        expect(api.delete).toHaveBeenCalledWith(
            `api/prioridades-paa/${uuid}/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('deletePrioridadesEmLote deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const payload = { uuids: ['uuid-1', 'uuid-2'] };
        const result = await deletePrioridadesEmLote(payload);

        expect(api.post).toHaveBeenCalledWith(
            `api/prioridades-paa/excluir-lote/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getObjetivosPaa deve chamar a API corretamente', async () => {
        localStorage.setItem('PAA', 'paa-uuid');
        api.get.mockResolvedValue({ data: mockData });
        const result = await getObjetivosPaa();

        expect(api.get).toHaveBeenCalledWith(
            `api/paa/paa-uuid/objetivos/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('postGerarAtaPaa deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const paa_uuid = 'paa-uuid';
        const payload = { data_reuniao: '2024-01-10' };
        const result = await postGerarAtaPaa(paa_uuid, payload);

        expect(api.post).toHaveBeenCalledWith(
            `/api/atas-paa/gerar-ata/`,
            { ...payload, paa_uuid },
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getStatusAtaPaa deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const ata_paa_uuid = 'ata-uuid';
        const result = await getStatusAtaPaa(ata_paa_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/atas-paa/${ata_paa_uuid}/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    it('getDownloadAtaPaa deve baixar a ata corretamente', async () => {
        const mockBlob = new Blob(['content'], { type: 'application/pdf' });
        api.get.mockResolvedValue({ data: mockBlob });
        window.URL.createObjectURL = jest.fn(() => 'blob:ata-url');
        window.URL.revokeObjectURL = jest.fn();
        const mockLink = { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
        jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
        jest.spyOn(document.body, 'removeChild').mockImplementation(() => {});

        await getDownloadAtaPaa('ata-uuid');

        expect(api.get).toHaveBeenCalledWith(
            `/api/atas-paa/download-arquivo-ata-paa/?ata-paa-uuid=ata-uuid`,
            expect.objectContaining({ responseType: 'blob', timeout: 30000 })
        );
        expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'Ata_Apresentacao_PAA.pdf');
        expect(mockLink.click).toHaveBeenCalled();

        jest.restoreAllMocks();
    });

    it('getDownloadAtaPaa deve retornar erro quando a API falha', async () => {
        const mockError = { response: { status: 500 } };
        api.get.mockRejectedValue(mockError);

        const result = await getDownloadAtaPaa('ata-uuid');

        expect(result).toEqual(mockError.response);
    });

    test('getPlanoOrcamentario deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const paaUuid = 'paa-uuid';
        const result = await getPlanoOrcamentario(paaUuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/paa/${paaUuid}/plano-orcamentario/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

});
