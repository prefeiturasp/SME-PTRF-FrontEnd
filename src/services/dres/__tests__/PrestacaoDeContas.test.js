import api from '../../api';
import { 
    getPrestacoesDeContas,
    getPrestacoesDeContasNaoRecebidaNaoGerada,
    getPrestacoesDeContasTodosOsStatus,
    getQtdeUnidadesDre,
    getTabelasPrestacoesDeContas,
    getPrestacaoDeContasDetalhe,
    getPreviaPrestacaoDeContasDetalhe,
    getReceberPrestacaoDeContas,
    getReabrirPrestacaoDeContas,
    getDesfazerRecebimento,
    getAnalisarPrestacaoDeContas,
    getDesfazerAnalise,
    getSalvarAnalise,
    getInfoAta,
    getConcluirAnalise,
    getDesfazerConclusaoAnalise,
    getDespesasPorFiltros,
    getTiposDevolucao,
    marcarDevolucaoTesouro,
    desmarcarDevolucaoTesouro,
    getComentariosDeAnalise,
    criarComentarioDeAnalise,
    editarComentarioDeAnalise,
    deleteComentarioDeAnalise,
    getReordenarComentarios,
    getSalvarDevoulucoesAoTesouro,
    deleteDevolucaoAoTesouro,
    postNotificarComentarios,
    postNotificarPendenciaGeracaoAtaApresentacao,
    getMotivosAprovadoComRessalva,
    getMotivosReprovacao,
    getVisualizarArquivoDeReferencia,
    getDownloadArquivoDeReferencia,
    getLancamentosParaConferencia,
    getDespesasPeriodosAnterioresParaConferencia,
    getUltimaAnalisePc,
    postLancamentosParaConferenciaMarcarComoCorreto,
    postLancamentosParaConferenciaMarcarNaoConferido,
    getTiposDeAcertoLancamentos,
    getTiposDeAcertoLancamentosAgrupadoCategoria,
    getListaDeSolicitacaoDeAcertos,
    postSolicitacoesParaAcertos,
    getDocumentosParaConferencia,
    postDocumentosParaConferenciaMarcarComoCorreto,
    postDocumentosParaConferenciaMarcarNaoConferido,
    getTiposDeAcertosDocumentos,
    getTabelas,
    getSolicitacaoDeAcertosDocumentos,
    postSolicitacoesParaAcertosDocumentos,
    getExtratosBancariosAjustes,
    getTemAjustesExtratos,
    getLancamentosAjustes,
    getDespesasPeriodosAnterioresAjustes,
    getDocumentosAjustes,
    getContasDaAssociacao,
    getContasDaAssociacaoComAcertosEmLancamentos,
    getContasDaAssociacaoComAcertosEmDespesasPeriodosAnteriores,
    getAnalisesDePcDevolvidas,
    patchReceberAposAcertos,
    patchDesfazerReceberAposAcertos,
    getRelatorioAcertosInfo,
    gerarPreviaRelatorioAcertos,
    getAnalisePrestacaoConta,
    getAnaliseLancamentosPrestacaoConta,
    getAnaliseDocumentosPrestacaoConta,
    postLimparStatusLancamentoPrestacaoConta,
    postLimparStatusDocumentoPrestacaoConta,
    postJustificarNaoRealizacaoLancamentoPrestacaoConta,
    postJustificarNaoRealizacaoDocumentoPrestacaoConta,
    postMarcarComoRealizadoLancamentoPrestacaoConta,
    postMarcarComoRealizadoDocumentoPrestacaoConta,
    postMarcarComoLancamentoEsclarecido,
    postMarcarComoDocumentoEsclarecido,
    patchAnaliseLancamentoPrestacaoConta,
    downloadDocumentoPreviaPdf,
    postAnaliseAjustesSaldoPorConta,
    deleteAnaliseAjustesSaldoPorConta,
    getAnaliseAjustesSaldoPorConta,
    getContasComMovimentoNaPc,
    getContasComMovimentoDespesasPeriodosAnteriores,
    postMarcarGastoComoConciliado,
    postMarcarGastoDesconciliado,
    postSalvarJustificativasAdicionais,
    postRestaurarJustificativasAdicionais,
    getTagsConferenciaLancamento,
    getTagsConferenciaDocumento,
    getStatusPeriodo
 } from '../PrestacaoDeContas.service.js';
import { ASSOCIACAO_UUID, TOKEN_ALIAS } from '../../auth.service.js';

jest.mock('../../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));


const mockToken = 'fake-token';
const mockData = [{ id: 1, nome: 'Teste 1' }];
const payload = { nome: 'Teste 1' }
const associacao_uuid = '1234'

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

    test('getPrestacoesDeContas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let periodo_uuid="teste"
        let nome="teste"
        let associacao__unidade__tipo_unidade='teste'
        let status="teste"
        let tecnico_uuid="teste"
        let data_inicio="teste"
        let data_fim="teste"
        const result = await getPrestacoesDeContas(periodo_uuid,  nome, associacao__unidade__tipo_unidade, status, tecnico_uuid, data_inicio, data_fim);
        const url = `/api/prestacoes-contas/?associacao__unidade__dre__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&periodo__uuid=${periodo_uuid}${nome ? '&nome=' + nome : ''}${associacao__unidade__tipo_unidade ? '&associacao__unidade__tipo_unidade=' + associacao__unidade__tipo_unidade : ''}${status ? '&status=' + status : ''}${tecnico_uuid ? '&tecnico=' + tecnico_uuid : ''}${data_inicio ? '&data_inicio='+data_inicio : ''}${data_fim ? '&data_fim='+data_fim : ''}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    test('getPrestacoesDeContas deve chamar a API sem parâmetros', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let periodo_uuid=''
        let nome=''
        let associacao__unidade__tipo_unidade=''
        let status=''
        let tecnico_uuid=''
        let data_inicio=''
        let data_fim=''
        const result = await getPrestacoesDeContas(periodo_uuid,  nome, associacao__unidade__tipo_unidade, status, tecnico_uuid, data_inicio, data_fim);
        const url = `/api/prestacoes-contas/?associacao__unidade__dre__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&periodo__uuid=${periodo_uuid}${nome ? '&nome=' + nome : ''}${associacao__unidade__tipo_unidade ? '&associacao__unidade__tipo_unidade=' + associacao__unidade__tipo_unidade : ''}${status ? '&status=' + status : ''}${tecnico_uuid ? '&tecnico=' + tecnico_uuid : ''}${data_inicio ? '&data_inicio='+data_inicio : ''}${data_fim ? '&data_fim='+data_fim : ''}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getPrestacoesDeContasNaoRecebidaNaoGerada deve chamar a API corretamente com todos os parâmetros', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let periodo_uuid=""
        let nome=""
        let tipo_unidade=''
        let status=''
        const result = await getPrestacoesDeContasNaoRecebidaNaoGerada(periodo_uuid, nome, tipo_unidade, status);
        const url = `/api/prestacoes-contas/nao-recebidas/?associacao__unidade__dre__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&periodo__uuid=${periodo_uuid}${nome ? '&nome=' + nome : ''}${tipo_unidade ? '&tipo_unidade=' + tipo_unidade : ''}${status ? '&status=' + status : ''}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getPrestacoesDeContasTodosOsStatus deve chamar a API corretamente com todos os parâmetros', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const periodo_uuid="1234"
        const nome="teste"
        const tipo_unidade='teste'
        const result = await getPrestacoesDeContasTodosOsStatus(periodo_uuid, nome, tipo_unidade);
        const url = `/api/prestacoes-contas/todos-os-status/?associacao__unidade__dre__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&periodo__uuid=${periodo_uuid}${nome ? '&nome=' + nome : ''}${tipo_unidade ? '&tipo_unidade=' + tipo_unidade : ''}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getQtdeUnidadesDre deve chamar a API corretamente com periodoUuid', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const periodoUuid = 'periodo1';
        const result = await getQtdeUnidadesDre(periodoUuid);
        const url = `/api/dres/${localStorage.getItem(ASSOCIACAO_UUID)}/qtd-unidades/?periodo__uuid=${periodoUuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getQtdeUnidadesDre deve chamar a API corretamente sem periodoUuid', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const periodoUuid = null;
        const result = await getQtdeUnidadesDre(periodoUuid);
        const url = `/api/dres/${localStorage.getItem(ASSOCIACAO_UUID)}/qtd-unidades/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getTabelasPrestacoesDeContas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTabelasPrestacoesDeContas();
        const url = `/api/prestacoes-contas/tabelas/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getTabelasPrestacoesDeContas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTabelasPrestacoesDeContas();
        const url = `/api/prestacoes-contas/tabelas/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getPrestacaoDeContasDetalhe deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const prestacao_conta_uuid = '1234'
        const result = await getPrestacaoDeContasDetalhe(prestacao_conta_uuid);
        const url = `/api/prestacoes-contas/${prestacao_conta_uuid}/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getPreviaPrestacaoDeContasDetalhe deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const periodo_uuid = '1234'
        const result = await getPreviaPrestacaoDeContasDetalhe(periodo_uuid);
        const url = `/api/prestacoes-contas/previa/?associacao=${localStorage.getItem(ASSOCIACAO_UUID)}&periodo=${periodo_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getInfoAta deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const prestacao_conta_uuid = '1234'
        const result = await getInfoAta(prestacao_conta_uuid);
        const url = `/api/prestacoes-contas/${prestacao_conta_uuid}/info-para-ata/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getDespesasPorFiltros deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let associacao_uuid='teste'
        let cpf_cnpj_fornecedor='teste'
        let tipo_documento__id='teste'
        let numero_documento='teste'
        const result = await getDespesasPorFiltros(associacao_uuid, cpf_cnpj_fornecedor, tipo_documento__id, numero_documento);
        const url = `/api/despesas/?associacao__uuid=${associacao_uuid}&cpf_cnpj_fornecedor=${cpf_cnpj_fornecedor}&tipo_documento__id=${tipo_documento__id}&numero_documento=${numero_documento}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getTiposDevolucao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTiposDevolucao();
        const url = `/api/tipos-devolucao-ao-tesouro/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getComentariosDeAnalise deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const prestacao_uuid="1234"
        const associacao_uuid="1234"
        const periodo_uuid="1234"
        const result = await getComentariosDeAnalise(prestacao_uuid, associacao_uuid, periodo_uuid);
        const url = `/api/comentarios-de-analises/comentarios/${prestacao_uuid ?  "?prestacao_conta__uuid="+prestacao_uuid : "?associacao_uuid="+associacao_uuid+"&periodo_uuid="+periodo_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getMotivosAprovadoComRessalva deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getMotivosAprovadoComRessalva();
        const url = `/api/motivos-aprovacao-ressalva/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getMotivosReprovacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getMotivosReprovacao();
        const url = `/api/motivos-reprovacao/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getLancamentosParaConferencia deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let prestacao_de_contas_uuid='1234'
        let analise_atual_uuid='1234'
        let conta_uuid='1234'
        let acao_associacao_uuid=`1234`
        let tipo_lancamento=`teste`
        let ordenar_por_imposto=`1`
        let filtrar_por_data_inicio=`2025-04-07`
        let filtrar_por_data_fim=`2025-04-07`
        let filtrar_por_nome_fornecedor=`teste`
        let filtrar_por_numero_de_documento=`teste`
        let filtrar_por_tipo_de_documento=`teste`
        let filtrar_por_tipo_de_pagamento=`teste`
        let filtrar_por_informacoes= []
        let filtrar_por_conferencia = []
        const result = await getLancamentosParaConferencia(prestacao_de_contas_uuid, analise_atual_uuid, conta_uuid, acao_associacao_uuid, tipo_lancamento, ordenar_por_imposto, filtrar_por_data_inicio, filtrar_por_data_fim, filtrar_por_nome_fornecedor, filtrar_por_numero_de_documento, filtrar_por_tipo_de_documento, filtrar_por_tipo_de_pagamento, filtrar_por_informacoes, filtrar_por_conferencia);
        const url = `/api/prestacoes-contas/${prestacao_de_contas_uuid}/lancamentos/?analise_prestacao=${analise_atual_uuid}&conta_associacao=${conta_uuid}${acao_associacao_uuid ? '&acao_associacao='+acao_associacao_uuid : ''}${tipo_lancamento ? '&tipo='+tipo_lancamento : ''}${ordenar_por_imposto ? '&ordenar_por_imposto='+ordenar_por_imposto : ''}${filtrar_por_data_inicio ? '&filtrar_por_data_inicio='+filtrar_por_data_inicio : ''}${filtrar_por_data_fim ? '&filtrar_por_data_fim='+filtrar_por_data_fim : ''}${filtrar_por_nome_fornecedor ? '&filtrar_por_nome_fornecedor='+filtrar_por_nome_fornecedor : ''}${filtrar_por_numero_de_documento ? '&filtrar_por_numero_de_documento='+filtrar_por_numero_de_documento : ''}${filtrar_por_tipo_de_documento ? '&filtrar_por_tipo_de_documento='+filtrar_por_tipo_de_documento : ''}${filtrar_por_tipo_de_pagamento ? '&filtrar_por_tipo_de_pagamento='+filtrar_por_tipo_de_pagamento : ''}${filtrar_por_informacoes ? '&filtrar_por_informacoes='+filtrar_por_informacoes : ''}${filtrar_por_conferencia ? '&filtrar_por_conferencia='+filtrar_por_conferencia : ''}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getDespesasPeriodosAnterioresParaConferencia deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let prestacao_de_contas_uuid='1234'
        let analise_atual_uuid='1234'
        let conta_uuid='1234'
        let acao_associacao_uuid=`1234`
        let tipo_lancamento=`teste`
        let ordenar_por_imposto=`1`
        let filtrar_por_data_inicio=`2025-04-07`
        let filtrar_por_data_fim=`2025-04-07`
        let filtrar_por_nome_fornecedor=`teste`
        let filtrar_por_numero_de_documento=`teste`
        let filtrar_por_tipo_de_documento=`teste`
        let filtrar_por_tipo_de_pagamento=`teste`
        let filtrar_por_informacoes= []
        let filtrar_por_conferencia = []
        const result = await getDespesasPeriodosAnterioresParaConferencia(prestacao_de_contas_uuid, analise_atual_uuid, conta_uuid, acao_associacao_uuid, tipo_lancamento, ordenar_por_imposto, filtrar_por_data_inicio, filtrar_por_data_fim, filtrar_por_nome_fornecedor, filtrar_por_numero_de_documento, filtrar_por_tipo_de_documento, filtrar_por_tipo_de_pagamento, filtrar_por_informacoes, filtrar_por_conferencia);
        const url = `/api/prestacoes-contas/${prestacao_de_contas_uuid}/despesas-periodos-anteriores/?analise_prestacao=${analise_atual_uuid}&conta_associacao=${conta_uuid}${acao_associacao_uuid ? '&acao_associacao='+acao_associacao_uuid : ''}${tipo_lancamento ? '&tipo='+tipo_lancamento : ''}${ordenar_por_imposto ? '&ordenar_por_imposto='+ordenar_por_imposto : ''}${filtrar_por_data_inicio ? '&filtrar_por_data_inicio='+filtrar_por_data_inicio : ''}${filtrar_por_data_fim ? '&filtrar_por_data_fim='+filtrar_por_data_fim : ''}${filtrar_por_nome_fornecedor ? '&filtrar_por_nome_fornecedor='+filtrar_por_nome_fornecedor : ''}${filtrar_por_numero_de_documento ? '&filtrar_por_numero_de_documento='+filtrar_por_numero_de_documento : ''}${filtrar_por_tipo_de_documento ? '&filtrar_por_tipo_de_documento='+filtrar_por_tipo_de_documento : ''}${filtrar_por_tipo_de_pagamento ? '&filtrar_por_tipo_de_pagamento='+filtrar_por_tipo_de_pagamento : ''}${filtrar_por_informacoes ? '&filtrar_por_informacoes='+filtrar_por_informacoes : ''}${filtrar_por_conferencia ? '&filtrar_por_conferencia='+filtrar_por_conferencia : ''}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getUltimaAnalisePc deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let prestacao_de_contas_uuid='1234'
        const result = await getUltimaAnalisePc(prestacao_de_contas_uuid);
        const url = `/api/prestacoes-contas/${prestacao_de_contas_uuid}/ultima-analise-pc/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getTiposDeAcertoLancamentos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTiposDeAcertoLancamentos();
        const url = `/api/tipos-acerto-lancamento/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getTiposDeAcertoLancamentosAgrupadoCategoria deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let aplicavel_despesas_periodos_anteriores='1234'
        let is_repasse=null
        const result = await getTiposDeAcertoLancamentosAgrupadoCategoria(aplicavel_despesas_periodos_anteriores, is_repasse);
        const url = `/api/tipos-acerto-lancamento/tabelas/${aplicavel_despesas_periodos_anteriores ? `?aplicavel_despesas_periodos_anteriores=${aplicavel_despesas_periodos_anteriores}` : ''}${is_repasse ? `?is_repasse=${is_repasse}` : ''}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getListaDeSolicitacaoDeAcertos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const prestacao_de_contas_uuid = '1234'
        const analise_lancamento_uuid = '1234'
        const result = await getListaDeSolicitacaoDeAcertos(prestacao_de_contas_uuid, analise_lancamento_uuid);
        const url = `/api/prestacoes-contas/${prestacao_de_contas_uuid}/analises-de-lancamento/?analise_lancamento=${analise_lancamento_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getDocumentosParaConferencia deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const prestacao_de_contas_uuid = '1234'
        const analise_atual_uuid = '1234'
        const result = await getDocumentosParaConferencia(prestacao_de_contas_uuid, analise_atual_uuid);
        const url = `/api/prestacoes-contas/${prestacao_de_contas_uuid}/documentos/?analise_prestacao=${analise_atual_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getTiposDeAcertosDocumentos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const documento_uuid = '1234'
        const result = await getTiposDeAcertosDocumentos(documento_uuid);
        const url = `/api/tipos-acerto-documento/?tipos_documento_prestacao__uuid=${documento_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getTabelas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const documento_uuid = '1234'
        const result = await getTabelas(documento_uuid);
        const url = `/api/tipos-acerto-documento/tabelas/?tipos_documento_prestacao__uuid=${documento_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getSolicitacaoDeAcertosDocumentos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const prestacao_de_contas_uuid = '1234'
        const analise_documento_uuid = '1234'
        const result = await getSolicitacaoDeAcertosDocumentos(prestacao_de_contas_uuid, analise_documento_uuid);
        const url = `/api/prestacoes-contas/${prestacao_de_contas_uuid}/analises-de-documento/?analise_documento=${analise_documento_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getExtratosBancariosAjustes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const conta_uuid = '1234'
        const analise_atual_uuid = '1234'
        const result = await getExtratosBancariosAjustes(analise_atual_uuid, conta_uuid);
        const url = `/api/analises-prestacoes-contas/${analise_atual_uuid}/ajustes-extratos-bancarios/?conta_associacao=${conta_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getTemAjustesExtratos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const analise_atual_uuid = '1234'
        const result = await getTemAjustesExtratos(analise_atual_uuid);
        const url = `/api/analises-prestacoes-contas/${analise_atual_uuid}/verifica-ajustes-extratos/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getLancamentosAjustes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let analise_atual_uuid='1234'
        let conta_uuid='1234'
        let tipo_lancamento=null
        let tipo_acerto=null
        const result = await getLancamentosAjustes(analise_atual_uuid, conta_uuid, tipo_lancamento, tipo_acerto);
        const url = `/api/analises-prestacoes-contas/${analise_atual_uuid}/lancamentos-com-ajustes/?conta_associacao=${conta_uuid}${tipo_lancamento ? '&tipo='+tipo_lancamento : ''}${tipo_acerto ? '&tipo_acerto='+tipo_acerto : ''}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getDespesasPeriodosAnterioresAjustes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let analise_atual_uuid='1234'
        let conta_uuid='1234'
        let tipo_lancamento=null
        let tipo_acerto=null
        const result = await getDespesasPeriodosAnterioresAjustes(analise_atual_uuid, conta_uuid, tipo_lancamento, tipo_acerto);
        const url = `/api/analises-prestacoes-contas/${analise_atual_uuid}/despesas-periodos-anteriores-com-ajustes/?conta_associacao=${conta_uuid}${tipo_lancamento ? '&tipo='+tipo_lancamento : ''}${tipo_acerto ? '&tipo_acerto='+tipo_acerto : ''}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getDocumentosAjustes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let analise_atual_uuid='1234'
        const result = await getDocumentosAjustes(analise_atual_uuid);
        const url = `/api/analises-prestacoes-contas/${analise_atual_uuid}/documentos-com-ajuste/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getContasDaAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getContasDaAssociacao(associacao_uuid);
        const url = `/api/associacoes/${associacao_uuid}/contas/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getContasDaAssociacaoComAcertosEmLancamentos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const analise_prestacao_uuid = '1234'
        const result = await getContasDaAssociacaoComAcertosEmLancamentos(associacao_uuid, analise_prestacao_uuid);
        const url = `/api/associacoes/contas-com-acertos-em-lancamentos/?associacao_uuid=${associacao_uuid}&analise_prestacao_uuid=${analise_prestacao_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getContasDaAssociacaoComAcertosEmDespesasPeriodosAnteriores deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const analise_prestacao_uuid = '1234'
        const result = await getContasDaAssociacaoComAcertosEmDespesasPeriodosAnteriores(associacao_uuid, analise_prestacao_uuid);
        const url = `/api/associacoes/contas-com-acertos-em-despesas-periodos-anteriores/?associacao_uuid=${associacao_uuid}&analise_prestacao_uuid=${analise_prestacao_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getAnalisesDePcDevolvidas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const prestacao_de_contas_uuid = '1234'
        const result = await getAnalisesDePcDevolvidas(prestacao_de_contas_uuid);
        const url = `/api/prestacoes-contas/${prestacao_de_contas_uuid}/devolucoes/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getRelatorioAcertosInfo deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const analise_atual_uuid = '1234'
        const result = await getRelatorioAcertosInfo(analise_atual_uuid);
        const url = `/api/analises-prestacoes-contas/status-info/?analise_prestacao_uuid=${analise_atual_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('gerarPreviaRelatorioAcertos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const analise_prestacao_uuid = '1234'
        const result = await gerarPreviaRelatorioAcertos(analise_prestacao_uuid);
        const url = `/api/analises-prestacoes-contas/previa/?analise_prestacao_uuid=${analise_prestacao_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getAnalisePrestacaoConta deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const analise_prestacao_uuid = '1234'
        const result = await getAnalisePrestacaoConta(analise_prestacao_uuid);
        const url = `/api/analises-prestacoes-contas/${analise_prestacao_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getAnaliseLancamentosPrestacaoConta deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_analise_prestacao = '1234'
        const visao = 'DRE'
        const result = await getAnaliseLancamentosPrestacaoConta(uuid_analise_prestacao, visao);
        const url = `/api/analises-lancamento-prestacao-conta/tabelas/${uuid_analise_prestacao ? "?uuid_analise_prestacao="+uuid_analise_prestacao : ""}${visao ? "&visao="+visao : ""}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getAnaliseDocumentosPrestacaoConta deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_analise_prestacao = '1234'
        const visao = 'DRE'
        const result = await getAnaliseDocumentosPrestacaoConta(uuid_analise_prestacao, visao);
        const url = `/api/analises-documento-prestacao-conta/tabelas/${uuid_analise_prestacao ? "?uuid_analise_prestacao="+uuid_analise_prestacao : ""}${visao ? "&visao="+visao : ""}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getAnaliseAjustesSaldoPorConta deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let conta_associacao_uuid='1234'
        let prestacao_conta_uuid='1234'
        let analise_prestacao_uuid='1234'
        const result = await getAnaliseAjustesSaldoPorConta(conta_associacao_uuid, prestacao_conta_uuid, analise_prestacao_uuid);
        const url = `/api/analises-conta-prestacao-conta/get-ajustes-saldo-conta/?conta_associacao=${conta_associacao_uuid}&prestacao_conta=${prestacao_conta_uuid}&analise_prestacao_conta=${analise_prestacao_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getContasComMovimentoNaPc deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let prestacao_de_contas_uuid='1234'
        const result = await getContasComMovimentoNaPc(prestacao_de_contas_uuid);
        const url = `/api/prestacoes-contas/${prestacao_de_contas_uuid}/contas-com-movimento/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getContasComMovimentoDespesasPeriodosAnteriores deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let prestacao_de_contas_uuid='1234'
        const result = await getContasComMovimentoDespesasPeriodosAnteriores(prestacao_de_contas_uuid);
        const url = `/api/prestacoes-contas/${prestacao_de_contas_uuid}/contas-com-movimento-despesas-periodos-anteriores/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getTagsConferenciaLancamento deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTagsConferenciaLancamento();
        const url = `/api/analises-lancamento-prestacao-conta/tags-informacoes-conferencia/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getTagsConferenciaDocumento deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTagsConferenciaDocumento();
        const url = `/api/analises-documento-prestacao-conta/tags-informacoes-conferencia/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getStatusPeriodo deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_associacao='1234'
        const data_incial_periodo='1234'
        const result = await getStatusPeriodo(uuid_associacao, data_incial_periodo);
        const url = `/api/associacoes/${uuid_associacao}/status-periodo/?data=${data_incial_periodo}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getReceberPrestacaoDeContas deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const prestacao_conta_uuid = '1234'
        const result = await getReceberPrestacaoDeContas(prestacao_conta_uuid, payload);
        const url = `/api/prestacoes-contas/${prestacao_conta_uuid}/receber/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getDesfazerRecebimento deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const prestacao_conta_uuid = '1234'
        const result = await getDesfazerRecebimento(prestacao_conta_uuid);
        const url = `/api/prestacoes-contas/${prestacao_conta_uuid}/desfazer-recebimento/`
        expect(api.patch).toHaveBeenCalledWith(url, {}, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getAnalisarPrestacaoDeContas deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const prestacao_conta_uuid = '1234'
        const result = await getAnalisarPrestacaoDeContas(prestacao_conta_uuid);
        const url = `/api/prestacoes-contas/${prestacao_conta_uuid}/analisar/`
        expect(api.patch).toHaveBeenCalledWith(url, {}, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getDesfazerAnalise deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const prestacao_conta_uuid = '1234'
        const result = await getDesfazerAnalise(prestacao_conta_uuid);
        const url = `/api/prestacoes-contas/${prestacao_conta_uuid}/desfazer-analise/`
        expect(api.patch).toHaveBeenCalledWith(url, {}, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getSalvarAnalise deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const prestacao_conta_uuid = '1234'
        const result = await getSalvarAnalise(prestacao_conta_uuid, payload);
        const url = `/api/prestacoes-contas/${prestacao_conta_uuid}/salvar-analise/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getConcluirAnalise deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const prestacao_conta_uuid = '1234'
        const result = await getConcluirAnalise(prestacao_conta_uuid, payload);
        const url = `/api/prestacoes-contas/${prestacao_conta_uuid}/concluir-analise/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getDesfazerConclusaoAnalise deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const prestacao_conta_uuid = '1234'
        const result = await getDesfazerConclusaoAnalise(prestacao_conta_uuid);
        const url = `/api/prestacoes-contas/${prestacao_conta_uuid}/desfazer-conclusao-analise/`
        expect(api.patch).toHaveBeenCalledWith(url, {}, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('editarComentarioDeAnalise deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const comentario_uuid = '1234'
        const result = await editarComentarioDeAnalise(comentario_uuid, payload);
        const url = `/api/comentarios-de-analises/${comentario_uuid}/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getReordenarComentarios deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const result = await getReordenarComentarios(payload);
        const url = `/api/comentarios-de-analises/reordenar-comentarios/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getSalvarDevoulucoesAoTesouro deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const prestacao_conta_uuid = '1234'
        const result = await getSalvarDevoulucoesAoTesouro(prestacao_conta_uuid, payload);
        const url = `/api/prestacoes-contas/${prestacao_conta_uuid}/salvar-devolucoes-ao-tesouro/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('patchReceberAposAcertos deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const prestacao_conta_uuid = '1234'
        const result = await patchReceberAposAcertos(prestacao_conta_uuid, payload);
        const url = `/api/prestacoes-contas/${prestacao_conta_uuid}/receber-apos-acertos/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('patchDesfazerReceberAposAcertos deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const prestacao_conta_uuid = '1234'
        const result = await patchDesfazerReceberAposAcertos(prestacao_conta_uuid);
        const url = `/api/prestacoes-contas/${prestacao_conta_uuid}/desfazer-recebimento-apos-acertos/`
        expect(api.patch).toHaveBeenCalledWith(url, {}, authHeader())
        expect(result).toEqual(mockData);
    });

    test('patchAnaliseLancamentoPrestacaoConta deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const result = await patchAnaliseLancamentoPrestacaoConta(payload);
        const url = `/api/analises-lancamento-prestacao-conta/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('marcarDevolucaoTesouro deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const uuid_analise_lancamento = '1234'
        const result = await marcarDevolucaoTesouro(uuid_analise_lancamento);
        const url = `/api/analises-lancamento-prestacao-conta/${uuid_analise_lancamento}/marcar-devolucao-tesouro-atualizada/`
        expect(api.post).toHaveBeenCalledWith(url, {}, authHeader())
        expect(result).toEqual(mockData);
    });

    test('desmarcarDevolucaoTesouro deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const uuid_analise_lancamento = '1234'
        const result = await desmarcarDevolucaoTesouro(uuid_analise_lancamento);
        const url = `/api/analises-lancamento-prestacao-conta/${uuid_analise_lancamento}/marcar-devolucao-tesouro-nao-atualizada/`
        expect(api.post).toHaveBeenCalledWith(url, {}, authHeader())
        expect(result).toEqual(mockData);
    });

    test('criarComentarioDeAnalise deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await criarComentarioDeAnalise(payload);
        const url = `/api/comentarios-de-analises/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postNotificarComentarios deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postNotificarComentarios(payload);
        const url = `/api/notificacoes/notificar/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postNotificarPendenciaGeracaoAtaApresentacao deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const prestacao_conta_uuid = '1234'
        const result = await postNotificarPendenciaGeracaoAtaApresentacao(prestacao_conta_uuid);
        const url = `/api/prestacoes-contas/${prestacao_conta_uuid}/notificar/pendencia_geracao_ata_apresentacao/`
        expect(api.post).toHaveBeenCalledWith(url, null, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getReabrirPrestacaoDeContas deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const prestacao_conta_uuid = '1234'
        const result = await getReabrirPrestacaoDeContas(prestacao_conta_uuid);
        const url = `/api/prestacoes-contas/${prestacao_conta_uuid}/reabrir/`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual({ data: mockData });
    });

    test('deleteComentarioDeAnalise deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const comentario_uuid = '1234'
        const result = await deleteComentarioDeAnalise(comentario_uuid);
        const url = `/api/comentarios-de-analises/${comentario_uuid}/`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual({ data: mockData });
    });

    test('deleteDevolucaoAoTesouro deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const uuid_pc = '1234'
        const result = await deleteDevolucaoAoTesouro(uuid_pc, payload);
        const url = `/api/prestacoes-contas/${uuid_pc}/apagar-devolucoes-ao-tesouro/`
        expect(api.delete).toHaveBeenCalledWith(url, { data: payload, ...authHeader() })
        expect(result).toEqual({ data: mockData });
    });

    test('postLancamentosParaConferenciaMarcarComoCorreto deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const prestacao_de_contas_uuid = '1234'
        const result = await postLancamentosParaConferenciaMarcarComoCorreto(prestacao_de_contas_uuid, payload);
        const url = `/api/prestacoes-contas/${prestacao_de_contas_uuid}/lancamentos-corretos/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postLancamentosParaConferenciaMarcarNaoConferido deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const prestacao_de_contas_uuid = '1234'
        const result = await postLancamentosParaConferenciaMarcarNaoConferido(prestacao_de_contas_uuid, payload);
        const url = `/api/prestacoes-contas/${prestacao_de_contas_uuid}/lancamentos-nao-conferidos/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postSolicitacoesParaAcertos deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const prestacao_de_contas_uuid = '1234'
        const result = await postSolicitacoesParaAcertos(prestacao_de_contas_uuid, payload);
        const url = `/api/prestacoes-contas/${prestacao_de_contas_uuid}/solicitacoes-de-acerto/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postDocumentosParaConferenciaMarcarComoCorreto deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const prestacao_de_contas_uuid = '1234'
        const result = await postDocumentosParaConferenciaMarcarComoCorreto(prestacao_de_contas_uuid, payload);
        const url = `/api/prestacoes-contas/${prestacao_de_contas_uuid}/documentos-corretos/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postDocumentosParaConferenciaMarcarNaoConferido deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const prestacao_de_contas_uuid = '1234'
        const result = await postDocumentosParaConferenciaMarcarNaoConferido(prestacao_de_contas_uuid, payload);
        const url = `/api/prestacoes-contas/${prestacao_de_contas_uuid}/documentos-nao-conferidos/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postSolicitacoesParaAcertosDocumentos deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const prestacao_de_contas_uuid = '1234'
        const result = await postSolicitacoesParaAcertosDocumentos(prestacao_de_contas_uuid, payload);
        const url = `/api/prestacoes-contas/${prestacao_de_contas_uuid}/solicitacoes-de-acerto-documento/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postLimparStatusLancamentoPrestacaoConta deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postLimparStatusLancamentoPrestacaoConta(payload);
        const url = `/api/analises-lancamento-prestacao-conta/limpar-status/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('postLimparStatusDocumentoPrestacaoConta deve chamar API corretamente', async ()=>{
        api.post.mockResolvedValue({ data: mockData })
        const result = await postLimparStatusDocumentoPrestacaoConta(payload)
        const url = `/api/analises-documento-prestacao-conta/limpar-status/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData)
    })

    test('postJustificarNaoRealizacaoLancamentoPrestacaoConta deve chamar API corretamente', async ()=>{
        api.post.mockResolvedValue({ data: mockData })
        const result = await postJustificarNaoRealizacaoLancamentoPrestacaoConta(payload)
        const url = `/api/analises-lancamento-prestacao-conta/justificar-nao-realizacao/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData)
    })

    test('postJustificarNaoRealizacaoDocumentoPrestacaoConta deve chamar API corretamente', async ()=>{
        api.post.mockResolvedValue({ data: mockData })
        const result = await postJustificarNaoRealizacaoDocumentoPrestacaoConta(payload)
        const url = `/api/analises-documento-prestacao-conta/justificar-nao-realizacao/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData)
    })

    test('postMarcarComoRealizadoLancamentoPrestacaoConta deve chamar API corretamente', async ()=>{
        api.post.mockResolvedValue({ data: mockData })
        const result = await postMarcarComoRealizadoLancamentoPrestacaoConta(payload)
        const url = `/api/analises-lancamento-prestacao-conta/marcar-como-realizado/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData)
    })

    test('postMarcarComoRealizadoDocumentoPrestacaoConta deve chamar API corretamente', async ()=>{
        api.post.mockResolvedValue({ data: mockData })
        const result = await postMarcarComoRealizadoDocumentoPrestacaoConta(payload)
        const url = `/api/analises-documento-prestacao-conta/marcar-como-realizado/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData)
    })

    test('postMarcarComoLancamentoEsclarecido deve chamar API corretamente', async ()=>{
        api.post.mockResolvedValue({ data: mockData })
        const result = await postMarcarComoLancamentoEsclarecido(payload)
        const url = `/api/analises-lancamento-prestacao-conta/marcar-como-esclarecido/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData)
    })

    test('postMarcarComoDocumentoEsclarecido deve chamar API corretamente', async ()=>{
        api.post.mockResolvedValue({ data: mockData })
        const result = await postMarcarComoDocumentoEsclarecido(payload)
        const url = `/api/analises-documento-prestacao-conta/marcar-como-esclarecido/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData)
    })

    test('postLancamentosParaConferenciaMarcarComoCorreto deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const prestacao_de_contas_uuid = '1234'
        const result = await postLancamentosParaConferenciaMarcarComoCorreto(prestacao_de_contas_uuid, payload);
        const url = `/api/prestacoes-contas/${prestacao_de_contas_uuid}/lancamentos-corretos/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postLancamentosParaConferenciaMarcarNaoConferido deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const prestacao_de_contas_uuid = '1234'
        const result = await postLancamentosParaConferenciaMarcarNaoConferido(prestacao_de_contas_uuid, payload);
        const url = `/api/prestacoes-contas/${prestacao_de_contas_uuid}/lancamentos-nao-conferidos/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postAnaliseAjustesSaldoPorConta deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postAnaliseAjustesSaldoPorConta(payload);
        const url = `/api/analises-conta-prestacao-conta/salvar-ajustes-saldo-conta/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postMarcarGastoComoConciliado deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postMarcarGastoComoConciliado(payload);
        const url = `/api/analises-lancamento-prestacao-conta/marcar-como-conciliado/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postMarcarGastoDesconciliado deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postMarcarGastoDesconciliado(payload);
        const url = `/api/analises-lancamento-prestacao-conta/marcar-como-desconciliado/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postSalvarJustificativasAdicionais deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postSalvarJustificativasAdicionais(payload);
        const url = `/api/analises-documento-prestacao-conta/editar-informacao-conciliacao/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postRestaurarJustificativasAdicionais deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postRestaurarJustificativasAdicionais(payload);
        const url = `/api/analises-documento-prestacao-conta/restaurar-justificativa-original/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('deleteAnaliseAjustesSaldoPorConta deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const analise_uuid = '1234'
        const result = await deleteAnaliseAjustesSaldoPorConta(analise_uuid);
        const url = `/api/analises-conta-prestacao-conta/${analise_uuid}/`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual({data: mockData});
    });

    it('getVisualizarArquivoDeReferencia deve baixar o arquivo corretamente na API quando tipo for igual a DF', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
        const uuid = '1234'
        let nome_do_arquivo = 'teste.test'
        let tipo = 'DF'
        api.get.mockResolvedValue(mockResponse);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        });

        await getVisualizarArquivoDeReferencia  (nome_do_arquivo, uuid, tipo);

        expect(api.get).toHaveBeenCalledWith(
            `/api/demonstrativo-financeiro/${uuid}/pdf`,
            expect.objectContaining({
            responseType: 'blob',
            timeout: 30000,
            ...authHeader()
        }));

        expect(mockCreateObjectURL).toHaveBeenCalled();

        mockCreateObjectURL.mockRestore();
    });

    it('getVisualizarArquivoDeReferencia deve baixar o arquivo corretamente na API quando tipo for igual a RB', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
        const uuid = '1234'
        let nome_do_arquivo = 'teste.test'
        let tipo = 'RB'
        api.get.mockResolvedValue(mockResponse);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        });

        await getVisualizarArquivoDeReferencia  (nome_do_arquivo, uuid, tipo);

        expect(api.get).toHaveBeenCalledWith(
            `/api/relacao-bens/${uuid}/pdf`,
            expect.objectContaining({
            responseType: 'blob',
            timeout: 30000,
            ...authHeader()
        }));

        expect(mockCreateObjectURL).toHaveBeenCalled();

        mockCreateObjectURL.mockRestore();
    });

    it('getVisualizarArquivoDeReferencia deve baixar o arquivo corretamente na API quando tipo for igual a EB', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
        const uuid = '1234'
        let nome_do_arquivo = 'teste.test'
        let tipo = 'EB'
        api.get.mockResolvedValue(mockResponse);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        });

        await getVisualizarArquivoDeReferencia  (nome_do_arquivo, uuid, tipo);

        expect(api.get).toHaveBeenCalledWith(
            `/api/conciliacoes/${uuid}/extrato-bancario`,
            expect.objectContaining({
            responseType: 'blob',
            timeout: 30000,
            ...authHeader()
        }));

        expect(mockCreateObjectURL).toHaveBeenCalled();

        mockCreateObjectURL.mockRestore();
    });

    it('getVisualizarArquivoDeReferencia deve baixar o arquivo corretamente na API quando tipo for igual a AP', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
        const uuid = '1234'
        let nome_do_arquivo = 'teste.test'
        let tipo = 'AP'
        api.get.mockResolvedValue(mockResponse);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        });

        await getVisualizarArquivoDeReferencia  (nome_do_arquivo, uuid, tipo);

        expect(api.get).toHaveBeenCalledWith(
            `api/atas-associacao/download-arquivo-ata/?ata-uuid=${uuid}`,
            expect.objectContaining({
            responseType: 'blob',
            timeout: 30000,
            ...authHeader()
        }));

        expect(mockCreateObjectURL).toHaveBeenCalled();

        mockCreateObjectURL.mockRestore();
    });

    it('getDownloadArquivoDeReferencia  deve baixar o arquivo corretamente na API quando tipo for igual a DF', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
        const uuid = '1234'
        let nome_do_arquivo = 'teste.test'
        let tipo = 'DF'
        api.get.mockResolvedValue(mockResponse);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        });

        await getDownloadArquivoDeReferencia (nome_do_arquivo, uuid, tipo);

        expect(api.get).toHaveBeenCalledWith(
            `/api/demonstrativo-financeiro/${uuid}/pdf`,
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

    it('getDownloadArquivoDeReferencia  deve baixar o arquivo corretamente na API quando tipo for igual a RB', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
        const uuid = '1234'
        let nome_do_arquivo = 'teste.test'
        let tipo = 'RB'
        api.get.mockResolvedValue(mockResponse);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        });

        await getDownloadArquivoDeReferencia (nome_do_arquivo, uuid, tipo);

        expect(api.get).toHaveBeenCalledWith(
            `/api/relacao-bens/${uuid}/pdf`,
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

    it('getDownloadArquivoDeReferencia  deve baixar o arquivo corretamente na API quando tipo for igual a EB', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
        const uuid = '1234'
        let nome_do_arquivo = 'teste.test'
        let tipo = 'EB'
        api.get.mockResolvedValue(mockResponse);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        });

        await getDownloadArquivoDeReferencia (nome_do_arquivo, uuid, tipo);

        expect(api.get).toHaveBeenCalledWith(
            `/api/conciliacoes/${uuid}/extrato-bancario`,
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

    it('getDownloadArquivoDeReferencia  deve baixar o arquivo corretamente na API quando tipo for igual a AP', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
        const uuid = '1234'
        let nome_do_arquivo = 'teste.test'
        let tipo = 'AP'
        api.get.mockResolvedValue(mockResponse);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        });

        await getDownloadArquivoDeReferencia (nome_do_arquivo, uuid, tipo);

        expect(api.get).toHaveBeenCalledWith(
            `api/atas-associacao/download-arquivo-ata/?ata-uuid=${uuid}`,
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

    it('downloadDocumentoPreviaPdf deve baixar o arquivo corretamente na API', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
        const analise_atual_uuid = '1234'
        api.get.mockResolvedValue(mockResponse);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        });

        await downloadDocumentoPreviaPdf(analise_atual_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/analises-prestacoes-contas/download-documento-pdf/?analise_prestacao_uuid=${analise_atual_uuid}`,
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

    it('downloadDocumentoPreviaPdf deve baixar o arquivo corretamente na API com erro', async () => {
        const analise_atual_uuid = '1234'
        api.get.mockRejectedValue(new Error("Error de API"));
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        });

        await downloadDocumentoPreviaPdf(analise_atual_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/analises-prestacoes-contas/download-documento-pdf/?analise_prestacao_uuid=${analise_atual_uuid}`,
            expect.objectContaining({
            responseType: 'blob',
            timeout: 30000,
            ...authHeader()
        }));

        expect(api.get).rejects.toThrow("Error de API");
        mockCreateObjectURL.mockRestore();
        mockCreateElement.mockRestore();
        
    });

});
