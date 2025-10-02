import api from '../../api';
import {
    getTabelaArquivosDeCarga,
    getArquivosDeCargaFiltros,
    postCreateArquivoDeCarga,
    patchAlterarArquivoDeCarga,
    deleteArquivoDeCarga,
    getDownloadArquivoDeCarga,
    postProcessarArquivoDeCarga,
    getDownloadModeloArquivoDeCarga,
    patchAlterarFiqueDeOlhoPrestacoesDeContas,
    patchAlterarFiqueDeOlhoRelatoriosConsolidadosDre,
    getTipoReceita,
    postTipoReceita,
    patchTipoReceita,
    deleteTipoReceita,
    getFiltrosTipoReceita,
    getUnidadesTipoReceita,
    getUnidadesNaoVinculadasTipoReceita,
    vincularUnidadeTipoReceita,
    vincularUnidadeTipoReceitaEmLote,
    desvincularUnidadeTipoReceita,
    desvincularUnidadeTipoReceitaEmLote,
    getDres,
    getTiposContas,
    getFiltroTiposContas,
    postTipoConta,
    patchTipoConta,
    deleteTipoConta,
    getTodasTags,
    getFiltrosTags,
    postCreateTag,
    patchAlterarTag,
    deleteTag,
    getAssociacoes,
    getParametrizacoesAssociacoes,
    getTabelaAssociacoes,
    getFiltrosAssociacoes,
    getAssociacaoPorUuid,
    getUnidadePeloCodigoEol,
    postCriarAssociacao,
    patchUpdateAssociacao,
    deleteAssociacao,
    getAcoesAssociacao,
    getContasAssociacao,
    validarDataDeEncerramento,
    getTodosPeriodos,
    getPeriodoPorReferencia,
    getDatasAtendemRegras,
    getPeriodoPorUuid,
    postCriarPeriodo,
    patchUpdatePeriodo,
    deletePeriodo,
    getTodasAcoesDasAssociacoes,
    getParametrizacoesAcoesAssociacoes,
    getListaDeAcoes,
    getListaDeAcertosLancamentos,
    getListaDeAcertosDocumentos,
    getTabelaCategoria,
    getTabelaDocumento,
    getTabelaCategoriaDocumentos,
    getFiltros,
    postAddAcaoAssociacao,
    putAtualizarAcaoAssociacao,
    getContasAssociacoes,
    getContasAssociacoesFiltros,
    postContasAssociacoes,
    patchContasAssociacoes,
    deleteContasAssociacoes,
    getFiltrosDadosContasAssociacoes,
    putAtualizarAcertosLancamentos,
    putAtualizarAcertosDocumentos,
    deleteAcaoAssociacao,
    getAcoesFiltradas,
    getAcertosLancamentosFiltrados,
    getAcertosDocumentosFiltrados,
    postAddAcao,
    postAddAcertosLancamentos,
    postAddAcertosDocumentos,
    putAtualizarAcao,
    deleteAcao,
    deleteAcertosLancamentos,
    deleteAcertosDocumentos,
    getUnidadesPorAcao,
    getAcao,
    deleteAcoesAssociacoesEmLote,
    getAssociacoesNaoVinculadasAAcao,
    addAcoesAssociacoesEmLote,
    getTodosTiposDeCusteio,
    getFiltrosTiposDeCusteio,
    postCreateTipoDeCusteio,
    patchAlterarTipoDeCusteio,
    deleteTipoDeCusteio,
    getTodosTiposDeDocumento,
    getFiltrosTiposDeDocumento,
    postCreateTipoDeDocumento,
    patchAlterarTipoDeDocumento,
    deleteTipoDeDocumento,
    getTiposDeTransacao,
    getFiltrosTiposDeTransacao,
    postTipoDeTransacao,
    patchTipoDeTransacao,
    deleteTipoDeTransacao,
    getAcoesPDDECategorias,
    postAcoesPDDECategorias,
    patchAcoesPDDECategorias,
    deleteAcoesPDDECategorias,
    deleteAcoesPDDE,
    getAcoesPDDE,
    postAcoesPDDE,
    patchAcoesPDDE,
    getFornecedores,
    getFiltrosFornecedores,
    postCreateFornecedor,
    patchAlterarFornecedor,
    deleteFornecedor,
    getMotivosEstorno,
    postCreateMotivoEstorno,
    patchAlterarMotivoEstorno,
    deleteMotivoEstorno,
    getRepasses,
    getTabelasRepasse,
    getTabelasRepassePorAssociacao,
    postRepasse,
    patchRepasse,
    deleteRepasse,
    getEspecificacoesMateriaisServicos,
    getTabelasEspecificacoesMateriaisServicos,
    postEspecificacoesMateriaisServicos,
    patchEspecificacoesMateriaisServicos,
    deleteEspecificacoesMateriaisServicos,
    getTodosMotivosPagamentoAntecipado,
    getFiltrosMotivosPagamentoAntecipado,
    postCreateMotivoPagamentoAntecipado,
    patchAlterarMotivoPagamentoAntecipado,
    deleteMotivoPagamentoAntecipado,
    getMotivosDevolucaoTesouro,
    postMotivosDevolucaoTesouro,
    patchMotivosDevolucaoTesouro,
    deleteMotivoDevolucaoTesouro,
    getMotivosAprovacaoPcRessalva,
    postMotivoAprovacaoPcRessalva,
    patchMotivosAprovacaoPcRessalva,
    deleteMotivoAprovacaoPcRessalva,
    getTiposDeCredito,
    getFiltrosTiposDeCredito,
    getAssociacoesPeloNome,
    getPeriodosPaa,
    postPeriodosPaa,
    patchPeriodosPaa,
    deletePeriodosPaa,
    getPaaVigente,
    getParametroPaa,
    postPaa
} from '../Parametrizacoes.service.js';
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
const uuid = '1234'

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

    test('getTabelaArquivosDeCarga  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTabelaArquivosDeCarga();
        const url = `/api/arquivos/tabelas/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getArquivosDeCargaFiltros  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const tipo_carga = 'teste'
        const identificador = 'teste'
        const status = 'teste'
        const data_execucao = 'teste'
        const result = await getArquivosDeCargaFiltros(tipo_carga, identificador, status, data_execucao);
        const url = `/api/arquivos/?tipo_carga=${tipo_carga}${identificador ? "&identificador=" + identificador : ""}${status ? "&status=" + status : ""}${data_execucao ? "&data_execucao=" + data_execucao : ""}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postCreateArquivoDeCarga deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const payload = {
            identificador: '1234',
            tipo_carga: 'teste',
            tipo_delimitador: 'teste',
            status: 'teste',
            conteudo: 'teste',
            periodo: 'teste',
            tipo_de_conta: 'teste'
        }
        const formData = new FormData();
        formData.append("identificador", payload.identificador);
        formData.append("tipo_carga", payload.tipo_carga);
        formData.append("tipo_delimitador", payload.tipo_delimitador);
        formData.append("status", payload.status);
        formData.append("conteudo", payload.conteudo);
        if (payload.periodo) {
            formData.append("periodo", payload.periodo);
        }
        if (payload.tipo_de_conta) {
            formData.append("tipo_de_conta", payload.tipo_de_conta);
        }
        const result = await postCreateArquivoDeCarga(payload);
        expect(api.post).toHaveBeenCalledWith(
            `/api/arquivos/`,
            formData,
            authHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('patchAlterarArquivoDeCarga deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const uuid_arquivo_de_carga = '1234'
        const payload = {
            identificador: '1234',
            tipo_delimitador: 'teste',
            conteudo: 'teste',
            periodo: 'teste',
            tipo_de_conta: 'teste',
        }
        const formData = new FormData();
        formData.append("identificador", payload.identificador);
        formData.append("tipo_delimitador", payload.tipo_delimitador);
        formData.append("conteudo", payload.conteudo);
        if (payload.periodo) {
            formData.append("periodo", payload.periodo);
        }
        if (payload.tipo_de_conta) {
            formData.append("tipo_de_conta", payload.tipo_de_conta);
        }
        const result = await patchAlterarArquivoDeCarga(uuid_arquivo_de_carga, payload);
        expect(api.patch).toHaveBeenCalledWith(
            `/api/arquivos/${uuid_arquivo_de_carga}/`,
            formData,
            authHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('getFiltrosTipoReceita  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getFiltrosTipoReceita();
        const url = `/api/tipos-receitas/filtros/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getDres  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getDres();
        const url = `/api/dres/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTiposContas  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTiposContas();
        const url = `/api/tipos-conta/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTodasTags  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTodasTags();
        const url = `/api/tags/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getAssociacoes  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getAssociacoes();
        const url = `/api/associacoes/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTabelaAssociacoes  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTabelaAssociacoes();
        const url = `/api/associacoes/tabelas/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTodasAcoesDasAssociacoes  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTodasAcoesDasAssociacoes();
        const url = `/api/acoes-associacoes/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getListaDeAcoes  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getListaDeAcoes();
        const url = `/api/acoes/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getListaDeAcertosLancamentos  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getListaDeAcertosLancamentos();
        const url = `/api/tipos-acerto-lancamento/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getListaDeAcertosDocumentos  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getListaDeAcertosDocumentos();
        const url = `/api/tipos-acerto-documento/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTabelaCategoria  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTabelaCategoria();
        const url = `api/tipos-acerto-lancamento/tabelas/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTabelaDocumento  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTabelaDocumento();
        const url = `api/tipos-acerto-documento/tabelas/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTabelaCategoriaDocumentos  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTabelaCategoriaDocumentos();
        const url = `api/tipos-acerto-documento/tabelas/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getContasAssociacoes  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getContasAssociacoes();
        const url = `/api/contas-associacoes/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getFiltrosDadosContasAssociacoes  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getFiltrosDadosContasAssociacoes();
        const url = `/api/contas-associacoes/filtros`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTodosTiposDeCusteio  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTodosTiposDeCusteio();
        const url = `/api/tipos-custeio/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTodosTiposDeDocumento  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTodosTiposDeDocumento();
        const url = `/api/tipos-documento/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTiposDeTransacao  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTiposDeTransacao();
        const url = `/api/tipos-transacao/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getAcoesPDDECategorias  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getAcoesPDDECategorias();
        const url = `/api/programas-pdde/?page1&page_size=100`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getFornecedores  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getFornecedores();
        const url = `/api/fornecedores/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTabelasRepasse  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTabelasRepasse();
        const url = `/api/repasses/tabelas/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTabelasEspecificacoesMateriaisServicos  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTabelasEspecificacoesMateriaisServicos();
        const url = `/api/especificacoes-materiais-servicos/tabelas/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTodosMotivosPagamentoAntecipado  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTodosMotivosPagamentoAntecipado();
        const url = `/api/motivos-pagamento-antecipado/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getFiltrosTiposDeCredito  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getFiltrosTiposDeCredito();
        const url = `/api/tipos-receitas/filtros/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('deleteArquivoDeCarga  deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const uuid_arquivo_de_carga = '1234'
        const result = await deleteArquivoDeCarga(uuid_arquivo_de_carga);
        const url = `/api/arquivos/${uuid_arquivo_de_carga}`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual({data: mockData});
    });

    it('getDownloadArquivoDeCarga  deve baixar o arquivo corretamente na API', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponseArquivo = { data: mockBlob };
        const uuid_arquivo_de_carga='1234'
        const nome_do_arquivo_com_extensao='teste.txt'

        api.get.mockResolvedValue(mockResponseArquivo);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        });
        await getDownloadArquivoDeCarga(uuid_arquivo_de_carga, nome_do_arquivo_com_extensao);

        expect(api.get).toHaveBeenCalledWith(
           `/api/arquivos/${uuid_arquivo_de_carga}/download/`,
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

    it('getDownloadArquivoDeCarga  deve baixar o arquivo corretamente na API com erro', async () => {
        const uuid_arquivo_de_carga='1234'
        const nome_do_arquivo_com_extensao='teste.txt'

        api.get.mockRejectedValue(new Error('Erro de API'));
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        });
        await getDownloadArquivoDeCarga(uuid_arquivo_de_carga, nome_do_arquivo_com_extensao);

        expect(api.get).toHaveBeenCalledWith(
           `/api/arquivos/${uuid_arquivo_de_carga}/download/`,
            expect.objectContaining({
            responseType: 'blob',
            timeout: 30000,
            ...authHeader()
        }));

        expect(api.get).rejects.toThrow('Erro de API');
        
        mockCreateObjectURL.mockRestore();
        mockCreateElement.mockRestore();
    });

    it('getDownloadModeloArquivoDeCarga   deve baixar o arquivo corretamente na API', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponseArquivo = { data: mockBlob };
        const tipo_arquivo_de_carga='teste'

        api.get.mockResolvedValue(mockResponseArquivo);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        });
        await getDownloadModeloArquivoDeCarga(tipo_arquivo_de_carga);

        expect(api.get).toHaveBeenCalledWith(
           `/api/modelos-cargas/${tipo_arquivo_de_carga}/download/`,
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

    it('getDownloadModeloArquivoDeCarga   deve baixar o arquivo corretamente na API com erro', async () => {
        const tipo_arquivo_de_carga='teste'

        api.get.mockRejectedValue(new Error("Erro de API"));
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        });
        await getDownloadModeloArquivoDeCarga(tipo_arquivo_de_carga);

        expect(api.get).toHaveBeenCalledWith(
           `/api/modelos-cargas/${tipo_arquivo_de_carga}/download/`,
            expect.objectContaining({
            responseType: 'blob',
            timeout: 30000,
            ...authHeader()
        }));

        expect(api.get).rejects.toThrow('Erro de API');
        mockCreateObjectURL.mockRestore();
        mockCreateElement.mockRestore();
    });

    test('postProcessarArquivoDeCarga  deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const uuid_arquivo_de_carga = '1234'
        const result = await postProcessarArquivoDeCarga(uuid_arquivo_de_carga);
        const url = `/api/arquivos/${uuid_arquivo_de_carga}/processar/`
        expect(api.post).toHaveBeenCalledWith(url, {}, authHeader())
        expect(result).toEqual(mockData);
    });

    test('patchAlterarFiqueDeOlhoPrestacoesDeContas  deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const result = await patchAlterarFiqueDeOlhoPrestacoesDeContas(payload);
        const url = `/api/prestacoes-contas/update-fique-de-olho/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('patchAlterarFiqueDeOlhoRelatoriosConsolidadosDre  deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const result = await patchAlterarFiqueDeOlhoRelatoriosConsolidadosDre(payload);
        const url = `/api/relatorios-consolidados-dre/update-fique-de-olho/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTipoReceita deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTipoReceita(uuid);
        const url = `/api/tipos-receitas/${uuid}/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postTipoReceita deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postTipoReceita(payload);
        const url = `/api/tipos-receitas/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('patchTipoReceita deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const result = await patchTipoReceita(uuid, payload);
        const url = `/api/tipos-receitas/${uuid}/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('deleteTipoReceita deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const result = await deleteTipoReceita(uuid);
        const url = `/api/tipos-receitas/${uuid}/`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getUnidadesTipoReceita deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const nome_ou_codigo = '1234'
        const dre = '1234'
        const page= 1
        const result = await getUnidadesTipoReceita(uuid, nome_ou_codigo, dre, page);
        const url = `/api/tipos-receitas/${uuid}/unidades-vinculadas/?nome_ou_codigo=${nome_ou_codigo}&dre=${dre}&page=${page}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getUnidadesNaoVinculadasTipoReceita deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const nome_ou_codigo = '1234'
        const dre = '1234'
        const page= 1
        const result = await getUnidadesNaoVinculadasTipoReceita(uuid, nome_ou_codigo, dre, page);
        const url = `/api/tipos-receitas/${uuid}/unidades-nao-vinculadas/?nome_ou_codigo=${nome_ou_codigo}&dre=${dre}&page=${page}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('vincularUnidadeTipoReceita deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const unidadeUUID = '1234'
        const result = await vincularUnidadeTipoReceita(uuid, unidadeUUID);
        const url = `/api/tipos-receitas/${uuid}/unidade/${unidadeUUID}/vincular/`
        expect(api.post).toHaveBeenCalledWith(url, {}, authHeader())
        expect(result).toEqual(mockData);
    });

    test('vincularUnidadeTipoReceitaEmLote deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await vincularUnidadeTipoReceitaEmLote(uuid, payload);
        const url = `/api/tipos-receitas/${uuid}/vincular-em-lote/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('desvincularUnidadeTipoReceita deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const unidadeUUID = '1234'
        const result = await desvincularUnidadeTipoReceita(uuid, unidadeUUID);
        const url = `/api/tipos-receitas/${uuid}/unidade/${unidadeUUID}/desvincular/`
        expect(api.post).toHaveBeenCalledWith(url, {}, authHeader())
        expect(result).toEqual(mockData);
    });

    test('desvincularUnidadeTipoReceitaEmLote deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await desvincularUnidadeTipoReceitaEmLote(uuid, payload);
        const url = `/api/tipos-receitas/${uuid}/desvincular-em-lote/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });
    test('getFiltroTiposContas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const nome = 'teste'
        const result = await getFiltroTiposContas(nome);
        const url = `/api/tipos-conta/?nome=${nome}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    test('postTipoConta deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postTipoConta(payload);
        const url = `/api/tipos-conta/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });
    test('patchTipoConta deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const tipo_conta_uuid = '1234'
        const result = await patchTipoConta(tipo_conta_uuid, payload);
        const url = `/api/tipos-conta/${tipo_conta_uuid}/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });
    test('deleteTipoConta deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const tipo_conta_uuid = '1234'
        const result = await deleteTipoConta(tipo_conta_uuid);
        const url = `/api/tipos-conta/${tipo_conta_uuid}/`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual({data: mockData});
    });
    
    test('getFiltrosTags deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const nome = 'teste'
        const status = 'teste'
        const result = await getFiltrosTags(nome, status);
        const url = `/api/tags/?nome=${nome}&status=${status}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postCreateTag deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postCreateTag(payload);
        const url = `/api/tags/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('patchAlterarTag deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const tag_uuid = '1234'
        const result = await patchAlterarTag(tag_uuid, payload);
        const url = `/api/tags/${tag_uuid}/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('deleteTag deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const tag_uuid = '1234'
        const result = await deleteTag(tag_uuid);
        const url = `/api/tags/${tag_uuid}/`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual({data: mockData});
    });

    test('getParametrizacoesAssociacoes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const page = '1'
        const tipo_unidade = 'teste'
        const unidade__dre__uuid = '1234'
        const nome = 'teste'
        const informacoes = 'teste'
        const result = await getParametrizacoesAssociacoes(page, tipo_unidade, unidade__dre__uuid, nome, informacoes);
        const url = `/api/parametrizacoes-associacoes/?page=${page}&page_size=${20}&unidade__tipo_unidade=${tipo_unidade}&unidade__dre__uuid=${unidade__dre__uuid}&nome=${nome}&filtro_informacoes=${informacoes}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getFiltrosAssociacoes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const tipo_unidade = 'teste'
        const unidade__dre__uuid = '1234'
        const nome = 'teste'
        const informacoes = 'teste'
        const result = await getFiltrosAssociacoes(tipo_unidade, unidade__dre__uuid, nome, informacoes);
        const url = `/api/associacoes/?unidade__tipo_unidade=${tipo_unidade}&unidade__dre__uuid=${unidade__dre__uuid}&nome=${nome}&filtro_informacoes=${informacoes}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getAssociacaoPorUuid deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getAssociacaoPorUuid(associacao_uuid);
        const url = `/api/associacoes/${associacao_uuid}/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getUnidadePeloCodigoEol deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const codigo_eol_unidade = '1234'
        const result = await getUnidadePeloCodigoEol(codigo_eol_unidade);
        const url = `/api/associacoes/eol/?codigo_eol=${codigo_eol_unidade}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postCriarAssociacao deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postCriarAssociacao(payload);
        const url = `/api/associacoes/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('patchUpdateAssociacao deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const result = await patchUpdateAssociacao(associacao_uuid, payload);
        const url = `/api/associacoes/${associacao_uuid}/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('deleteAssociacao deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const result = await deleteAssociacao(associacao_uuid);
        const url = `/api/associacoes/${associacao_uuid}/`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual({data: mockData});
    });

    test('getAcoesAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getAcoesAssociacao(associacao_uuid);
        const url = `api/acoes-associacoes/?associacao__uuid=${associacao_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getContasAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getContasAssociacao(associacao_uuid);
        const url = `api/associacoes/${associacao_uuid}/contas/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('validarDataDeEncerramento deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const periodo_inicial = '1234'
        const data_de_encerramento = '1234'        
        const result = await validarDataDeEncerramento(associacao_uuid, data_de_encerramento, periodo_inicial);
        const url = `api/associacoes/${associacao_uuid}/validar-data-de-encerramento/?data_de_encerramento=${data_de_encerramento}&periodo_inicial=${periodo_inicial}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTodosPeriodos deve chamar a API corretamente sem referencia', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTodosPeriodos();
        const url = `/api/periodos/?referencia=`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTodosPeriodos deve chamar a API corretamente com referencia', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const referencia = '2023'
        const result = await getTodosPeriodos(referencia);
        const url = `/api/periodos/?referencia=${referencia}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getPeriodoPorReferencia deve chamar a API corretamente com referencia', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const referencia = '2024';
        const result = await getPeriodoPorReferencia(referencia);
        const url = `/api/periodos/?referencia=${referencia}`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getDatasAtendemRegras deve chamar a API corretamente com todos os parâmetros', async () => {
        api.get.mockResolvedValue({ data: { atendem: true } });
        const data_inicio_realizacao_despesas = '2024-01-01';
        const data_fim_realizacao_despesas = '2024-12-31';
        const periodo_anterior_uuid = 'uuid-anterior';
        const periodo_uuid = 'uuid-atual';

        const result = await getDatasAtendemRegras(
            data_inicio_realizacao_despesas,
            data_fim_realizacao_despesas,
            periodo_anterior_uuid,
            periodo_uuid
        );

        const expectedParams = new URLSearchParams({
            data_inicio_realizacao_despesas,
            periodo_anterior_uuid,
            data_fim_realizacao_despesas,
            periodo_uuid,
        });
        const url = `/api/periodos/verificar-datas/?${expectedParams.toString()}`;

        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual({ atendem: true });
    });

    test('getDatasAtendemRegras deve chamar a API corretamente sem data_fim_realizacao_despesas', async () => {
        api.get.mockResolvedValue({ data: { atendem: true } });
        const data_inicio_realizacao_despesas = '2024-01-01';
        const periodo_anterior_uuid = 'uuid-anterior';
        const periodo_uuid = 'uuid-atual';

        const result = await getDatasAtendemRegras(
            data_inicio_realizacao_despesas,
            null, // data_fim_realizacao_despesas is null/undefined
            periodo_anterior_uuid,
            periodo_uuid
        );

        const expectedParams = new URLSearchParams({
            data_inicio_realizacao_despesas,
            periodo_anterior_uuid,
            periodo_uuid,
        });
        const url = `/api/periodos/verificar-datas/?${expectedParams.toString()}`;

        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual({ atendem: true });
    });

    test('getDatasAtendemRegras deve chamar a API corretamente sem periodo_uuid', async () => {
        api.get.mockResolvedValue({ data: { atendem: false } });
        const data_inicio_realizacao_despesas = '2024-01-01';
        const data_fim_realizacao_despesas = '2024-12-31';
        const periodo_anterior_uuid = 'uuid-anterior';

        const result = await getDatasAtendemRegras(
            data_inicio_realizacao_despesas,
            data_fim_realizacao_despesas,
            periodo_anterior_uuid,
            null // periodo_uuid is null/undefined
        );

        const expectedParams = new URLSearchParams({
            data_inicio_realizacao_despesas,
            periodo_anterior_uuid,
            data_fim_realizacao_despesas,
        });
        const url = `/api/periodos/verificar-datas/?${expectedParams.toString()}`;

        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual({ atendem: false });
    });

    test('getDatasAtendemRegras deve chamar a API corretamente sem data_fim e periodo_uuid', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const data_inicio_realizacao_despesas = '2024-01-01';
        const periodo_anterior_uuid = 'uuid-anterior';

        const result = await getDatasAtendemRegras(data_inicio_realizacao_despesas, null, periodo_anterior_uuid,null);

        const expectedParams = new URLSearchParams({
            data_inicio_realizacao_despesas,
            periodo_anterior_uuid,
        });
        const url = `/api/periodos/verificar-datas/?${expectedParams.toString()}`;

        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getPeriodoPorUuid deve chamar a API corretamente', async () => {
        const periodo_uuid = 'uuid-periodo-123';
        api.get.mockResolvedValue({ data: mockData });
        const result = await getPeriodoPorUuid(periodo_uuid);
        const url = `/api/periodos/${periodo_uuid}/`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('postCriarPeriodo deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const result = await postCriarPeriodo(payload);
        const url = `/api/periodos/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('patchUpdatePeriodo deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const periodo_uuid = 'uuid-periodo-456';
        const result = await patchUpdatePeriodo(periodo_uuid, payload);
        const url = `/api/periodos/${periodo_uuid}/`;
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deletePeriodo deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue(mockData);
        const periodo_uuid = '1234';
        const result = await deletePeriodo(periodo_uuid);
        const url = `/api/periodos/${periodo_uuid}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getParametrizacoesAcoesAssociacoes deve chamar a API corretamente com todos os parâmetros', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const page = 1;
        const nome_cod_eol = 'teste-nome';
        const acao__uuid = 'uuid-acao-123';
        const status = 'ativo';
        const filtro_informacoes = 'info1,info2';

        const result = await getParametrizacoesAcoesAssociacoes(
            page,
            nome_cod_eol,
            acao__uuid,
            status,
            filtro_informacoes
        );

        const url = `/api/parametrizacoes-acoes-associacoes/?page=${page}&page_size=20&nome=${nome_cod_eol}&acao__uuid=${acao__uuid}&status=${status}&filtro_informacoes=${filtro_informacoes}`;

        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getParametrizacoesAcoesAssociacoes deve chamar a API corretamente com parâmetros opcionais ausentes', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const page = 1;
        const nome_cod_eol = ''
        const acao__uuid = ''
        const status = ''
        const filtro_informacoes = ''

        const result = await getParametrizacoesAcoesAssociacoes(page, nome_cod_eol, acao__uuid, status, filtro_informacoes);

        const url = `/api/parametrizacoes-acoes-associacoes/?page=${page}&page_size=20&nome=${nome_cod_eol}&acao__uuid=${acao__uuid}&status=${status}&filtro_informacoes=${filtro_informacoes}`;

        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getFiltros deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const nome = 'teste-nome';
        const acao__uuid = 'uuid-acao-456';
        const status = 'inativo';
        const filtro_informacoes = 'info3,info4';
        const result = await getFiltros(nome, acao__uuid, status, filtro_informacoes);

        const url = `/api/acoes-associacoes/?nome=${nome}&acao__uuid=${acao__uuid}&status=${status}&filtro_informacoes=${filtro_informacoes}`;

        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('postAddAcaoAssociacao deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const result = await postAddAcaoAssociacao(payload);
        const url = `/api/acoes-associacoes/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('putAtualizarAcaoAssociacao deve chamar a API corretamente', async () => {
        const acao_associacao_uuid = '1234';
        api.put.mockResolvedValue({ data: mockData });

        const result = await putAtualizarAcaoAssociacao(acao_associacao_uuid, payload);

        const url = `/api/acoes-associacoes/${acao_associacao_uuid}/`;
        expect(api.put).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getContasAssociacoesFiltros deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const page = 2;
        const associacao_nome = 'Assoc Teste';
        const tipo_conta_uuid = '1234';
        const status = 'ativo';
        const result = await getContasAssociacoesFiltros(page, associacao_nome, tipo_conta_uuid, status);
        const url = `/api/contas-associacoes/?page=${page}&page_size=20&associacao_nome=${associacao_nome}&tipo_conta_uuid=${tipo_conta_uuid}&status=${status}`;

        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('postContasAssociacoes deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const result = await postContasAssociacoes(payload);
        const url = `/api/contas-associacoes/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('patchContasAssociacoes deve chamar a API corretamente', async () => {
        const tag_uuid = 'uuid-conta-assoc-789';
        api.patch.mockResolvedValue({ data: mockData });

        const result = await patchContasAssociacoes(tag_uuid, payload);

        const url = `/api/contas-associacoes/${tag_uuid}/`;
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteContasAssociacoes deve chamar a API corretamente', async () => {
        const tag_uuid = 'uuid-conta-assoc-def';
        api.delete.mockResolvedValue(mockData);

        const result = await deleteContasAssociacoes(tag_uuid);

        const url = `/api/contas-associacoes/${tag_uuid}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('putAtualizarAcertosLancamentos deve chamar a API corretamente', async () => {
        const acerto_lancamento_uuid = 'uuid-lancamento-1';
        api.patch.mockResolvedValue({ data: mockData });

        const result = await putAtualizarAcertosLancamentos(acerto_lancamento_uuid, payload);

        const url = `/api/tipos-acerto-lancamento/${acerto_lancamento_uuid}/`;
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });
   
    test('putAtualizarAcertosDocumentos deve chamar a API corretamente', async () => {
        const acerto_documento_uuid = '1234';
        api.patch.mockResolvedValue({ data: mockData });

        const result = await putAtualizarAcertosDocumentos(acerto_documento_uuid, payload);

        const url = `/api/tipos-acerto-documento/${acerto_documento_uuid}/`;
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteAcaoAssociacao deve chamar a API corretamente', async () => {
        const acao_associacao_uuid = '1234';
        api.delete.mockResolvedValue(mockData);

        const result = await deleteAcaoAssociacao(acao_associacao_uuid);

        const url = `/api/acoes-associacoes/${acao_associacao_uuid}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getAcoesFiltradas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const nome = 'Acao Teste';
        const result = await getAcoesFiltradas(nome);
        const url = `/api/acoes/?nome=${nome}`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getAcertosLancamentosFiltrados deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const nome = 'teste';
        const categoria = 'Categoria A';
        const ativo = 'true';
        const result = await getAcertosLancamentosFiltrados(nome, categoria, ativo);
        const url = `/api/tipos-acerto-lancamento/?nome=${nome}&categoria=${categoria}&ativo=${ativo}`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getAcertosDocumentosFiltrados deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const nome = 'Doc Teste';
        const categoria = 'Categoria C';
        const ativo = 'false';
        const documento_relacionado = 'Doc Relacionado';
        const result = await getAcertosDocumentosFiltrados(nome, categoria, ativo, documento_relacionado);
        const url = `/api/tipos-acerto-documento/?nome=${nome}&categoria=${categoria}&ativo=${ativo}&documento_relacionado=${documento_relacionado}`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('postAddAcao deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const result = await postAddAcao(payload);
        const url = `/api/acoes/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('postAddAcertosLancamentos deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const result = await postAddAcertosLancamentos(payload);
        const url = `/api/tipos-acerto-lancamento/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('postAddAcertosDocumentos deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const result = await postAddAcertosDocumentos(payload);
        const url = `/api/tipos-acerto-documento/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('putAtualizarAcao deve chamar a API corretamente', async () => {
        const acao_uuid = '1234';
        api.put.mockResolvedValue({ data: mockData });
        const result = await putAtualizarAcao(acao_uuid, payload);
        const url = `/api/acoes/${acao_uuid}/`;
        expect(api.put).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteAcao deve chamar a API corretamente', async () => {
        const acao_uuid = 'uuid-acao-del';
        api.delete.mockResolvedValue(mockData);
        const result = await deleteAcao(acao_uuid);
        const url = `/api/acoes/${acao_uuid}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteAcertosLancamentos deve chamar a API corretamente', async () => {
        const lancamento_uuid = 'uuid-lanc-del';
        api.delete.mockResolvedValue(mockData);
        const result = await deleteAcertosLancamentos(lancamento_uuid);
        const url = `/api/tipos-acerto-lancamento/${lancamento_uuid}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteAcertosDocumentos deve chamar a API corretamente', async () => {
        const documento_uuid = '1234';
        api.delete.mockResolvedValue(mockData);
        const result = await deleteAcertosDocumentos(documento_uuid);
        const url = `/api/tipos-acerto-documento/${documento_uuid}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteAcertosDocumentos deve lançar erro se a API falhar', async () => {
        const documento_uuid = 'uuid-doc-del-err';
        const errorMessage = 'Erro ao deletar acerto de documento';
        api.delete.mockRejectedValue(new Error(errorMessage));
        await expect(deleteAcertosDocumentos(documento_uuid)).rejects.toThrow(errorMessage);
        const url = `/api/tipos-acerto-documento/${documento_uuid}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
    });

    test('getUnidadesPorAcao deve chamar a API corretamente com todos os parâmetros', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const acao_uuid = 'uuid-acao-unidades';
        const pagina = 2;
        const nome = 'Unidade Teste';
        const informacoes = ['info1', 'info2'];
        const result = await getUnidadesPorAcao(acao_uuid, pagina, nome, informacoes);
        const url = `api/acoes-associacoes/?acao__uuid=${acao_uuid}&page=${pagina}&nome=${nome}&filtro_informacoes=${informacoes.join(',')}`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getUnidadesPorAcao deve chamar a API corretamente com parâmetros default', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const acao_uuid = 'uuid-acao-unidades-default';
        const result = await getUnidadesPorAcao(acao_uuid);
        const url = `api/acoes-associacoes/?acao__uuid=${acao_uuid}&page=1&nome=&filtro_informacoes=`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getAcao deve chamar a API corretamente com uuid', async () => {
        const acao_uuid = 'uuid-acao-get';
        api.get.mockResolvedValue({ data: mockData });
        const result = await getAcao(acao_uuid);
        const url = `/api/acoes/${acao_uuid}/`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteAcoesAssociacoesEmLote deve chamar a API corretamente', async () => {
        const lotePayload = { uuids: ['uuid1', 'uuid2'] };
        api.post.mockResolvedValue({ data: { success: true } });
        const result = await deleteAcoesAssociacoesEmLote(lotePayload);
        const url = `/api/acoes-associacoes/excluir-lote/`;
        expect(api.post).toHaveBeenCalledWith(url, lotePayload, authHeader());
        expect(result).toEqual({ success: true });
    });

    test('getAssociacoesNaoVinculadasAAcao deve chamar a API corretamente sem nome', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const acao_uuid = 'uuid-acao-nao-vinc';
        const filtro_informacoes = ['infoA', 'infoB'];
        const result = await getAssociacoesNaoVinculadasAAcao(acao_uuid, "", filtro_informacoes);
        const url = `api/acoes/${acao_uuid}/associacoes-nao-vinculadas/?filtro_informacoes=${filtro_informacoes.join(',')}`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getAssociacoesNaoVinculadasAAcao deve chamar a API corretamente com nome', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const acao_uuid = 'uuid-acao-nao-vinc-nome';
        const nome = 'Assoc Nome';
        const filtro_informacoes = ['infoC'];
        const result = await getAssociacoesNaoVinculadasAAcao(acao_uuid, nome, filtro_informacoes);
        const url = `api/acoes/${acao_uuid}/associacoes-nao-vinculadas-por-nome/${nome}/?filtro_informacoes=${filtro_informacoes.join(',')}`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('addAcoesAssociacoesEmLote deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const result = await addAcoesAssociacoesEmLote(payload);
        const url = `/api/acoes-associacoes/incluir-lote/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getFiltrosTiposDeCusteio deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const nome = 'Custeio Teste';
        const result = await getFiltrosTiposDeCusteio(nome);
        const url = `/api/tipos-custeio/?nome=${nome}`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('postCreateTipoDeCusteio deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const result = await postCreateTipoDeCusteio(payload);
        const url = `/api/tipos-custeio/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('patchAlterarTipoDeCusteio deve chamar a API corretamente', async () => {
        const tag_uuid = '1234';
        api.patch.mockResolvedValue({ data: mockData });
        const result = await patchAlterarTipoDeCusteio(tag_uuid, payload);
        const url = `/api/tipos-custeio/${tag_uuid}/`;
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteTipoDeCusteio deve chamar a API corretamente', async () => {
        const tag_uuid = '1234';
        api.delete.mockResolvedValue(mockData);
        const result = await deleteTipoDeCusteio(tag_uuid);
        const url = `/api/tipos-custeio/${tag_uuid}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getFiltrosTiposDeDocumento deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const nome = 'Documento Teste';
        const result = await getFiltrosTiposDeDocumento(nome);
        const url = `/api/tipos-documento/?nome=${nome}`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('postCreateTipoDeDocumento deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const result = await postCreateTipoDeDocumento(payload);
        const url = `/api/tipos-documento/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('patchAlterarTipoDeDocumento deve chamar a API corretamente', async () => {
        const tag_uuid = 'uuid-doc-patch';
        api.patch.mockResolvedValue({ data: mockData });
        const result = await patchAlterarTipoDeDocumento(tag_uuid, payload);
        const url = `/api/tipos-documento/${tag_uuid}/`;
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteTipoDeDocumento deve chamar a API corretamente', async () => {
        const tag_uuid = 'uuid-doc-del';
        api.delete.mockResolvedValue(mockData);
        const result = await deleteTipoDeDocumento(tag_uuid);
        const url = `/api/tipos-documento/${tag_uuid}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getFiltrosTiposDeTransacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const nome = 'Transacao Teste';
        const result = await getFiltrosTiposDeTransacao(nome);
        const url = `/api/tipos-transacao/?nome=${nome}`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('postTipoDeTransacao deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const result = await postTipoDeTransacao(payload);
        const url = `/api/tipos-transacao/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('patchTipoDeTransacao deve chamar a API corretamente', async () => {
        const tag_uuid = 'uuid-trans-patch';
        api.patch.mockResolvedValue({ data: mockData });
        const result = await patchTipoDeTransacao(tag_uuid, payload);
        const url = `/api/tipos-transacao/${tag_uuid}/`;
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteTipoDeTransacao deve chamar a API corretamente', async () => {
        const tag_uuid = 'uuid-trans-del';
        api.delete.mockResolvedValue(mockData);
        const result = await deleteTipoDeTransacao(tag_uuid);
        const url = `/api/tipos-transacao/${tag_uuid}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('postAcoesPDDECategorias deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const result = await postAcoesPDDECategorias(payload);
        const url = `/api/programas-pdde/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('patchAcoesPDDECategorias deve chamar a API corretamente', async () => {
        const categoriaUuid = 'uuid-cat-pdde-patch';
        api.patch.mockResolvedValue({ data: mockData });
        const result = await patchAcoesPDDECategorias(categoriaUuid, payload);
        const url = `/api/programas-pdde/${categoriaUuid}/`;
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteAcoesPDDECategorias deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData });
        const categoriaUuid = '1234'
        const acaoUuid = '1234'
        const result = await deleteAcoesPDDECategorias(categoriaUuid, acaoUuid);
        const url = `/api/programas-pdde/${categoriaUuid}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteAcoesPDDE deve chamar a API corretamente', async () => {
        const acaoUuid = '1234';
        api.delete.mockResolvedValue({ data: mockData });
        const result = await deleteAcoesPDDE(acaoUuid);
        const url = `/api/acoes-pdde/${acaoUuid}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getAcoesPDDE deve chamar a API corretamente com todos os parâmetros', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const nome = 'Acao PDDE Teste';
        const categoria = 'uuid-cat-filter';
        const currentPage = 2;
        const rowsPerPage = 10;
        const result = await getAcoesPDDE(nome, categoria, currentPage, rowsPerPage);
        const url = `/api/acoes-pdde/?nome=${nome}&programa__uuid=${categoria}&page=${currentPage}&page_size=${rowsPerPage}`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('postAcoesPDDE deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const result = await postAcoesPDDE(payload);
        const url = '/api/acoes-pdde/';
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('patchAcoesPDDE deve chamar a API corretamente', async () => {
        const acaoUuid = 'uuid-acao-pdde-patch';
        api.patch.mockResolvedValue({ data: mockData });
        const result = await patchAcoesPDDE(acaoUuid, payload);
        const url = `/api/acoes-pdde/${acaoUuid}/`;
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getFiltrosFornecedores deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const nome = 'Fornecedor Teste';
        const cpf_cnpj = '12345678900';
        const result = await getFiltrosFornecedores(nome, cpf_cnpj);
        const url = `/api/fornecedores/?nome=${nome}&cpf_cnpj=${cpf_cnpj}`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('postCreateFornecedor deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const result = await postCreateFornecedor(payload);
        const url = `/api/fornecedores/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('patchAlterarFornecedor deve chamar a API corretamente', async () => {
        const fornecedores_id = 'forn-123';
        api.patch.mockResolvedValue({ data: mockData });
        const result = await patchAlterarFornecedor(fornecedores_id, payload);
        const url = `/api/fornecedores/${fornecedores_id}/`;
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteFornecedor deve chamar a API corretamente', async () => {
        const fornecedores_id = 'forn-789';
        const mockResponse = { status: 204, data: null };
        api.delete.mockResolvedValue(mockResponse);
        const result = await deleteFornecedor(fornecedores_id);
        const url = `/api/fornecedores/${fornecedores_id}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockResponse);
    });

    test('getMotivosEstorno deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const motivo = 'Erro de digitação';
        const result = await getMotivosEstorno(motivo);
        const url = `/api/motivos-estorno/?motivo=${motivo}`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('postCreateMotivoEstorno deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const result = await postCreateMotivoEstorno(payload);
        const url = `/api/motivos-estorno/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('patchAlterarMotivoEstorno deve chamar a API corretamente', async () => {
        const motivo_uuid = 'motivo-123';
        api.patch.mockResolvedValue({ data: mockData });
        const result = await patchAlterarMotivoEstorno(motivo_uuid, payload);
        const url = `/api/motivos-estorno/${motivo_uuid}/`;
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteMotivoEstorno deve chamar a API corretamente', async () => {
        const motivo_uuid = 'motivo-789';
        const mockResponse = { status: 204, data: null };
        api.delete.mockResolvedValue(mockResponse);
        const result = await deleteMotivoEstorno(motivo_uuid);
        const url = `/api/motivos-estorno/${motivo_uuid}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockResponse);
    });

    test('getRepasses deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const filter = { search: 'teste', periodo: 'p1', conta: 'c1', acao: 'a1', status: 's1' };
        const currentPage = 2;
        const result = await getRepasses(filter, currentPage);
        const expectedParams = {
            search: filter.search,
            periodo: filter.periodo,
            conta: filter.conta,
            acao: filter.acao,
            status: filter.status,
            page_size: 20,
            page: currentPage,
        };
        expect(api.get).toHaveBeenCalledWith(`/api/repasses/`, {
            ...authHeader(),
            params: expectedParams,
        });
        expect(result).toEqual(mockData);
    });

    test('getTabelasRepassePorAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const assoc_uuid = 'assoc-uuid-repasse';
        const result = await getTabelasRepassePorAssociacao(assoc_uuid);
        const url = `/api/repasses/tabelas-por-associacao/?associacao_uuid=${assoc_uuid}`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('postRepasse deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue(mockData);
        const result = await postRepasse(payload);
        const url = `api/repasses/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('patchRepasse deve chamar a API corretamente', async () => {
        const uuid_repasse = '1234';
        api.patch.mockResolvedValue(mockData);
        const result = await patchRepasse(uuid_repasse, payload);
        const url = `api/repasses/${uuid_repasse}/`;
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteRepasse deve chamar a API corretamente', async () => {
        const uuid_repasse = '1234';
        api.delete.mockResolvedValue(mockData);
        const result = await deleteRepasse(uuid_repasse);
        const url = `api/repasses/${uuid_repasse}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getEspecificacoesMateriaisServicos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const filter = { descricao: 'desc', tipo_custeio: 'tc', aplicacao_recurso: 'ar', ativa: 'true' };
        const currentPage = 1;
        const result = await getEspecificacoesMateriaisServicos(filter, currentPage);
        const expectedParams = {
            descricao: filter.descricao,
            tipo_custeio: filter.tipo_custeio,
            aplicacao_recurso: filter.aplicacao_recurso,
            ativa: filter.ativa,
            page_size: 20,
            page: currentPage,
        };

        expect(api.get).toHaveBeenCalledWith(`/api/especificacoes-materiais-servicos/`, {
            ...authHeader(),
            params: expectedParams,
        });
        expect(result).toEqual(mockData);
    });

    test('postEspecificacoesMateriaisServicos deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue(mockData);
        const result = await postEspecificacoesMateriaisServicos(payload);
        const url = `/api/especificacoes-materiais-servicos/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('patchEspecificacoesMateriaisServicos deve chamar a API corretamente', async () => {
        const especUuid = 'espec-123';
        api.patch.mockResolvedValue(mockData);
        const result = await patchEspecificacoesMateriaisServicos(especUuid, payload);
        const url = `/api/especificacoes-materiais-servicos/${especUuid}/`;
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteEspecificacoesMateriaisServicos deve chamar a API corretamente', async () => {
        const especUuid = 'espec-789';
        api.delete.mockResolvedValue(mockData);
        const result = await deleteEspecificacoesMateriaisServicos(especUuid);
        const url = `/api/especificacoes-materiais-servicos/${especUuid}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getFiltrosMotivosPagamentoAntecipado deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const nome = 'Motivo Teste';
        const result = await getFiltrosMotivosPagamentoAntecipado(nome);
        const url = `/api/motivos-pagamento-antecipado/?motivo=${nome}`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('postCreateMotivoPagamentoAntecipado deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const result = await postCreateMotivoPagamentoAntecipado(payload);
        const url = `/api/motivos-pagamento-antecipado/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('patchAlterarMotivoPagamentoAntecipado deve chamar a API corretamente', async () => {
        const tag_uuid = 'motivo-pa-123';
        api.patch.mockResolvedValue({ data: mockData });
        const result = await patchAlterarMotivoPagamentoAntecipado(tag_uuid, payload);
        const url = `/api/motivos-pagamento-antecipado/${tag_uuid}/`;
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteMotivoPagamentoAntecipado deve chamar a API corretamente', async () => {
        const tag_uuid = 'motivo-pa-789';
        api.delete.mockResolvedValue(mockData);
        const result = await deleteMotivoPagamentoAntecipado(tag_uuid);
        const url = `/api/motivos-pagamento-antecipado/${tag_uuid}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getMotivosDevolucaoTesouro deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const filter = { nome: 'Devolução Teste' };
        const currentPage = 1;
        const result = await getMotivosDevolucaoTesouro(filter, currentPage);
        const expectedParams = {
            nome: filter.nome,
            page: currentPage,
        };
        expect(api.get).toHaveBeenCalledWith(`/api/motivos-devolucao-ao-tesouro/?page_size=20`, {
            ...authHeader(),
            params: expectedParams,
        });
        expect(result).toEqual(mockData);
    });

    test('postMotivosDevolucaoTesouro deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue(mockData);
        const result = await postMotivosDevolucaoTesouro(payload);
        const url = `api/motivos-devolucao-ao-tesouro/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('patchMotivosDevolucaoTesouro deve chamar a API corretamente', async () => {
        const uuidMotivo = 'motivo-dev-123';
        api.patch.mockResolvedValue(mockData);
        const result = await patchMotivosDevolucaoTesouro(uuidMotivo, payload);
        const url = `api/motivos-devolucao-ao-tesouro/${uuidMotivo}/`;
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteMotivoDevolucaoTesouro deve chamar a API corretamente', async () => {
        const uuidMotivo = 'motivo-dev-789';
        api.delete.mockResolvedValue(mockData);
        const result = await deleteMotivoDevolucaoTesouro(uuidMotivo);
        const url = `api/motivos-devolucao-ao-tesouro/${uuidMotivo}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getMotivosAprovacaoPcRessalva deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const filter = { motivo: 'Ressalva Teste' };
        const currentPage = 1;
        const result = await getMotivosAprovacaoPcRessalva(filter, currentPage);
        const expectedParams = {
            motivo: filter.motivo,
            page: currentPage,
        };
        expect(api.get).toHaveBeenCalledWith(`/api/motivos-aprovacao-ressalva-parametrizacao/?page_size=20`, {
            ...authHeader(),
            params: expectedParams,
        });
        expect(result).toEqual(mockData);
    });

    test('postMotivoAprovacaoPcRessalva deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue(mockData);
        const result = await postMotivoAprovacaoPcRessalva(payload);
        const url = `api/motivos-aprovacao-ressalva-parametrizacao/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('patchMotivosAprovacaoPcRessalva deve chamar a API corretamente', async () => {
        const uuidMotivo = 'motivo-res-123';
        api.patch.mockResolvedValue(mockData);
        const result = await patchMotivosAprovacaoPcRessalva(uuidMotivo, payload);
        const url = `api/motivos-aprovacao-ressalva-parametrizacao/${uuidMotivo}/`;
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader());
        expect(result).toEqual(mockData);
    });

    test('deleteMotivoAprovacaoPcRessalva deve chamar a API corretamente', async () => {
        const uuidMotivo = 'motivo-res-789';
        api.delete.mockResolvedValue(mockData);
        const result = await deleteMotivoAprovacaoPcRessalva(uuidMotivo);
        const url = `api/motivos-aprovacao-ressalva-parametrizacao/${uuidMotivo}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getTiposDeCredito deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const filter = { nome: 'Credito Teste', ativo: true };
        const currentPage = 1;
        const result = await getTiposDeCredito(filter, currentPage);
        const expectedParams = {
            page: currentPage,
            ...filter,
        };
        expect(api.get).toHaveBeenCalledWith(`/api/tipos-receitas/?page_size=20`, {
            ...authHeader(),
            params: expectedParams,
        });
        expect(result).toEqual(mockData);
    });

    test('getAssociacoesPeloNome deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const nome = 'Assoc Nome Teste';
        const result = await getAssociacoesPeloNome(nome);
        const url = `/api/associacoes/?nome=${nome}`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('getPeriodosPaa deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const page = 1;
        const page_size = 20;

        const params = {
            page,
            page_size,
        };
        const result = await getPeriodosPaa({}, page, page_size);
        const url = `/api/periodos-paa/`;
        expect(api.get).toHaveBeenCalledWith(url, {...authHeader(), params: params});
        expect(result).toEqual(mockData);
    });

    test('postPeriodosPaa deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue(mockData);
        const result = await postPeriodosPaa(payload);
        const url = `/api/periodos-paa/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
    });

    test('patchPeriodosPaa deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue(mockData);
        const result = await patchPeriodosPaa(uuid, payload);
        const url = `/api/periodos-paa/${uuid}/`;
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader());
    });

    test('deletePeriodosPaa deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue(mockData);
        const result = await deletePeriodosPaa(uuid);
        const url = `/api/periodos-paa/${uuid}/`;
        expect(api.delete).toHaveBeenCalledWith(url, authHeader());
    });

    test('getPaaVigente deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const associacao_uuid = '1234';
        const result = await getPaaVigente(associacao_uuid);
        const url = `/api/associacoes/${associacao_uuid}/paa-vigente/`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });
    
    test('getParametroPaa deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getParametroPaa();
        const url = `/api/parametros-paa/mes-elaboracao-paa/`;
        expect(api.get).toHaveBeenCalledWith(url, authHeader());
        expect(result).toEqual(mockData);
    });

    test('postPaa deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue(mockData);
        await postPaa(payload);
        const url = `/api/paa/`;
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader());
    });

});
