import api from '../../api';
import { 
    getConsolidadoDre,
    getConsolidadoDrePorUuid,
    getConsolidadoDrePorUuidAtaDeParecerTecnico,
    getConsolidadosDreJaPublicadosProximaPublicacao,
    getStatusConsolidadoDre,
    postPublicarConsolidadoDre,
    getStatusRelatorioConsolidadoDePublicacoesParciais,
    postGerarPreviaConsolidadoDre,
    postCriarAtaAtrelarAoConsolidadoDre,
    postMarcarComoPublicadoNoDiarioOficial,
    postDesmarcarComoPublicadoNoDiarioOficial,
    getDownloadRelatorio,
    devolverConsolidado,
    getFiqueDeOlhoRelatoriosConsolidados,
    getConsultarStatus,
    getTiposConta,
    getExecucaoFinanceira,
    getDevolucoesContaPtrf,
    getJustificativa,
    postJustificativa,
    patchJustificativa,
    getDevolucoesAoTesouro,
    getItensDashboard,
    getItensDashboardComDreUuid,
    getListaPrestacaoDeContasDaDre,
    getTiposDeUnidade,
    getStatusPc,
    getListaPrestacaoDeContasDaDreFiltros,
    putCriarEditarDeletarObservacaoDevolucaoContaPtrf,
    putCriarEditarDeletarObservacaoDevolucaoTesouro,
    postGerarRelatorio,
    postGerarPreviaRelatorio,
    postGerarLauda,
    getListaAssociacoesNaoRegularizadas,
    getTrilhaStatus,
    getPcsDoConsolidado,
    getPcsRetificaveis,
    postRetificarPcs,
    getPcsEmRetificacao,
    postDesfazerRetificacaoPcs,
    updateRetificarPcs,
    patchMotivoRetificaoPcs
 } from '../RelatorioConsolidado.service.js';
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
const associacao_uuid = '1234'
const payload = { nome: 'Teste 1' }


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

    it('getDownloadRelatorio deve baixar o arquivo corretamente na API corretamente', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
        const relatorio_uuid = '1234'
        const versao = '1234'
        api.get.mockResolvedValue(mockResponse);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        });

        await getDownloadRelatorio(relatorio_uuid, versao);

        expect(api.get).toHaveBeenCalledWith(
            `/api/consolidados-dre/${relatorio_uuid}/download-relatorio-consolidado`,
            expect.objectContaining({
            responseType: 'blob',
            timeout: 30000,
            ...authHeader()
        }));

        expect(mockCreateObjectURL).toHaveBeenCalled();

        mockCreateObjectURL.mockRestore();
    });

    test('putCriarEditarDeletarObservacaoDevolucaoContaPtrf deve chamar a API corretamente', async () =>{
        api.put.mockResolvedValue({ data: mockData })
        const dre_uuid='1234'
        const periodo_uuid='1234'
        const conta_uuid='1234'
        const tipo_devolucao_uuid='1234'
        const result = await putCriarEditarDeletarObservacaoDevolucaoContaPtrf (dre_uuid, periodo_uuid, conta_uuid, tipo_devolucao_uuid, payload);
        const url = `/api/relatorios-consolidados-dre/update-observacao-devolucoes-a-conta/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}&tipo_devolucao=${tipo_devolucao_uuid}`
        expect(api.put).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('putCriarEditarDeletarObservacaoDevolucaoTesouro deve chamar a API corretamente', async () =>{
        api.put.mockResolvedValue({ data: mockData })
        const dre_uuid='1234'
        const periodo_uuid='1234'
        const conta_uuid='1234'
        const tipo_devolucao_uuid='1234'
        const result = await putCriarEditarDeletarObservacaoDevolucaoTesouro (dre_uuid, periodo_uuid, conta_uuid, tipo_devolucao_uuid, payload);
        const url = `/api/relatorios-consolidados-dre/update-observacao-devolucoes-ao-tesouro/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}&tipo_devolucao=${tipo_devolucao_uuid}`
        expect(api.put).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('devolverConsolidado deve chamar a API corretamente', async () =>{
        api.patch.mockResolvedValue({ data: mockData })
        const consolidado_uuid='1234'
        const dataLimiteDevolucao='2025-04-08'
        const result = await devolverConsolidado(consolidado_uuid, dataLimiteDevolucao);
        const url = `/api/consolidados-dre/${consolidado_uuid}/devolver-consolidado/`
        expect(api.patch).toHaveBeenCalledWith(url, {data_limite: dataLimiteDevolucao}, authHeader())
        expect(result).toEqual(mockData);
    });

    test('patchJustificativa deve chamar a API corretamente', async () =>{
        api.patch.mockResolvedValue({ data: mockData })
        const justificativa_uuid='1234'
        const payload='1234'
        const result = await patchJustificativa(justificativa_uuid, payload);
        const url = `/api/justificativas-relatorios-consolidados-dre/${justificativa_uuid}/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('patchMotivoRetificaoPcs deve chamar a API corretamente', async () =>{
        api.patch.mockResolvedValue({ data: mockData })
        const consolidado_uuid='1234'
        const payload='1234'
        const result = await patchMotivoRetificaoPcs(consolidado_uuid, payload);
        const url = `/api/consolidados-dre/${consolidado_uuid}/update_motivo_retificacao/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postGerarPreviaConsolidadoDre deve chamar a API corretamente', async () =>{
        api.post.mockResolvedValue({ data: mockData })
        
        const result = await postGerarPreviaConsolidadoDre(payload);
        const url = `/api/consolidados-dre/gerar-previa/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postCriarAtaAtrelarAoConsolidadoDre deve chamar a API corretamente', async () =>{
        api.post.mockResolvedValue({ data: mockData })
        
        const result = await postCriarAtaAtrelarAoConsolidadoDre(payload);
        const url = `/api/consolidados-dre/criar-ata-e-atelar-ao-consolidado/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postMarcarComoPublicadoNoDiarioOficial deve chamar a API corretamente', async () =>{
        api.post.mockResolvedValue({ data: mockData })
        
        const result = await postMarcarComoPublicadoNoDiarioOficial(payload);
        const url = `/api/consolidados-dre/marcar-como-publicado-no-diario-oficial/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postDesmarcarComoPublicadoNoDiarioOficial deve chamar a API corretamente', async () =>{
        api.post.mockResolvedValue({ data: mockData })
        
        const result = await postDesmarcarComoPublicadoNoDiarioOficial(payload);
        const url = `/api/consolidados-dre/marcar-como-nao-publicado-no-diario-oficial/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postPublicarConsolidadoDre deve chamar a API corretamente', async () =>{
        api.post.mockResolvedValue({ data: mockData })
        
        const result = await postPublicarConsolidadoDre(payload);
        const url = `/api/consolidados-dre/publicar/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postJustificativa deve chamar a API corretamente', async () =>{
        api.post.mockResolvedValue({ data: mockData })
        
        const result = await postJustificativa(payload);
        const url = `/api/justificativas-relatorios-consolidados-dre/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postGerarRelatorio deve chamar a API corretamente', async () =>{
        api.post.mockResolvedValue({ data: mockData })
        
        const result = await postGerarRelatorio(payload);
        const url = `/api/relatorios-consolidados-dre/gerar-relatorio/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postGerarPreviaRelatorio deve chamar a API corretamente', async () =>{
        api.post.mockResolvedValue({ data: mockData })
        
        const result = await postGerarPreviaRelatorio(payload);
        const url = `/api/relatorios-consolidados-dre/previa/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postGerarLauda deve chamar a API corretamente', async () =>{
        api.post.mockResolvedValue({ data: mockData })
        
        const result = await postGerarLauda(payload);
        const url = `/api/relatorios-consolidados-dre/gerar-lauda/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postRetificarPcs deve chamar a API corretamente', async () =>{
        api.post.mockResolvedValue({ data: mockData })
        const consolidado_uuid = '1234'
        const result = await postRetificarPcs(consolidado_uuid, payload);
        const url = `/api/consolidados-dre/${consolidado_uuid}/retificar/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postDesfazerRetificacaoPcs deve chamar a API corretamente', async () =>{
        api.post.mockResolvedValue({ data: mockData })
        const consolidado_uuid = '1234'
        const result = await postDesfazerRetificacaoPcs(consolidado_uuid, payload);
        const url = `/api/consolidados-dre/${consolidado_uuid}/desfazer_retificacao/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('updateRetificarPcs deve chamar a API corretamente', async () =>{
        api.post.mockResolvedValue({ data: mockData })
        const consolidado_uuid = '1234'
        const result = await updateRetificarPcs(consolidado_uuid, payload);
        const url = `/api/consolidados-dre/${consolidado_uuid}/update_retificacao/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getConsolidadoDre deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dre_uuid = '1234'
        const periodo_uuid = '1234'
        const result = await getConsolidadoDre(dre_uuid, periodo_uuid);
        const url = `/api/consolidados-dre/?dre=${dre_uuid}&periodo=${periodo_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getConsolidadosDreJaPublicadosProximaPublicacao deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dre_uuid = '1234'
        const periodo_uuid = '1234'
        const result = await getConsolidadosDreJaPublicadosProximaPublicacao(dre_uuid, periodo_uuid);
        const url = `/api/consolidados-dre/publicados-e-proxima-publicacao/?dre=${dre_uuid}&periodo=${periodo_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getStatusConsolidadoDre deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dre_uuid = '1234'
        const periodo_uuid = '1234'
        const result = await getStatusConsolidadoDre(dre_uuid, periodo_uuid);
        const url = `/api/consolidados-dre/status-consolidado-dre/?dre=${dre_uuid}&periodo=${periodo_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getStatusRelatorioConsolidadoDePublicacoesParciais deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dre_uuid = '1234'
        const periodo_uuid = '1234'
        const result = await getStatusRelatorioConsolidadoDePublicacoesParciais(dre_uuid, periodo_uuid);
        const url = `/api/consolidados-dre/retorna-status-relatorio-consolidado-de-publicacoes-parciais/?dre=${dre_uuid}&periodo=${periodo_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getItensDashboardComDreUuid deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const uuid_periodo = '1234'
        const dre_uuid = '1234'
        const result = await getItensDashboardComDreUuid(uuid_periodo, dre_uuid);
        const url = `/api/prestacoes-contas/dashboard/?periodo=${uuid_periodo}&dre_uuid=${dre_uuid}&add_aprovadas_ressalva=SIM`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getTrilhaStatus deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dre_uuid = '1234'
        const uuid_periodo = '1234'
        const result = await getTrilhaStatus(dre_uuid, uuid_periodo);
        const url = `/api/consolidados-dre/trilha-de-status/?dre=${dre_uuid}&periodo=${uuid_periodo}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getConsultarStatus deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dre_uuid = '1234'
        const periodo_uuid = '1234'
        const conta_uuid='1234'
        const result = await getConsultarStatus(dre_uuid, periodo_uuid, conta_uuid);
        const url = `/api/relatorios-consolidados-dre/status-relatorio/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getExecucaoFinanceira deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dre_uuid = '1234'
        const periodo_uuid = '1234'
        const consolidado_dre_uuid='1234'
        const result = await getExecucaoFinanceira(dre_uuid, periodo_uuid, consolidado_dre_uuid);
        const url = `/api/relatorios-consolidados-dre/info-execucao-financeira/?dre=${dre_uuid}&periodo=${periodo_uuid}${consolidado_dre_uuid ? '&consolidado_dre=' + consolidado_dre_uuid : ""}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getDevolucoesContaPtrf deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dre_uuid = '1234'
        const periodo_uuid = '1234'
        const conta_uuid='1234'
        const result = await getDevolucoesContaPtrf(dre_uuid, periodo_uuid, conta_uuid);
        const url = `/api/relatorios-consolidados-dre/info-devolucoes-conta/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getJustificativa deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dre_uuid = '1234'
        const periodo_uuid = '1234'
        const conta_uuid='1234'
        const result = await getJustificativa(dre_uuid, periodo_uuid, conta_uuid);
        const url = `/api/justificativas-relatorios-consolidados-dre/?dre__uuid=${dre_uuid}&periodo__uuid=${periodo_uuid}&tipo_conta__uuid=${conta_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getDevolucoesAoTesouro deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dre_uuid = '1234'
        const periodo_uuid = '1234'
        const conta_uuid='1234'
        const result = await getDevolucoesAoTesouro(dre_uuid, periodo_uuid, conta_uuid);
        const url = `/api/relatorios-consolidados-dre/info-devolucoes-ao-tesouro/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getListaPrestacaoDeContasDaDre deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dre_uuid = '1234'
        const periodo_uuid = '1234'
        const conta_uuid='1234'
        const result = await getListaPrestacaoDeContasDaDre(dre_uuid, periodo_uuid, conta_uuid);
        const url = `/api/relatorios-consolidados-dre/info-execucao-financeira-unidades/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getFiqueDeOlhoRelatoriosConsolidados deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        
        const result = await getFiqueDeOlhoRelatoriosConsolidados();
        const url = `/api/relatorios-consolidados-dre/fique-de-olho/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTiposConta deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        
        const result = await getTiposConta();
        const url = `/api/tipos-conta/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTiposDeUnidade deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        
        const result = await getTiposDeUnidade();
        const url = `/api/associacoes/tabelas/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getStatusPc deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        
        const result = await getStatusPc();
        const url = `/api/prestacoes-contas/tabelas/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getListaPrestacaoDeContasDaDreFiltros deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dre_uuid = '1234'
        const periodo_uuid = '1234'
        const conta_uuid = '1234'
        const nome = '1234'
        const tipo_unidade = '1234'
        const status = '1234'
        const result = await getListaPrestacaoDeContasDaDreFiltros(dre_uuid, periodo_uuid, conta_uuid, nome, tipo_unidade, status);
        const url = `/api/relatorios-consolidados-dre/info-execucao-financeira-unidades/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}${nome ? '&nome='+nome : ''}${tipo_unidade ? '&tipo_unidade='+tipo_unidade : ''}${status ? '&status='+status : ''}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getConsolidadoDrePorUuid deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const consolidado_uuid = '1234'
        const result = await getConsolidadoDrePorUuid(consolidado_uuid);
        const url = `/api/consolidados-dre/${consolidado_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getConsolidadoDrePorUuidAtaDeParecerTecnico deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const ata_de_parecer_tecnico_uuid = '1234'
        const result = await getConsolidadoDrePorUuidAtaDeParecerTecnico(ata_de_parecer_tecnico_uuid);
        const url = `/api/consolidados-dre/consolidado-dre-por-ata-uuid/?ata=${ata_de_parecer_tecnico_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getItensDashboard deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const uuid_periodo = '1234'
        const result = await getItensDashboard(uuid_periodo);
        const url = `/api/prestacoes-contas/dashboard/?periodo=${uuid_periodo}&dre_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&add_aprovadas_ressalva=SIM`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getListaAssociacoesNaoRegularizadas deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dre_uuid = '1234'
        const result = await getListaAssociacoesNaoRegularizadas(dre_uuid);
        const url = `/api/associacoes/?unidade__dre__uuid=${dre_uuid}&status_regularidade=PENDENTE`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getPcsDoConsolidado deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const consolidado_uuid = '1234'
        const result = await getPcsDoConsolidado(consolidado_uuid);
        const url = `/api/consolidados-dre/${consolidado_uuid}/pcs-do-consolidado/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getPcsRetificaveis deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const consolidado_uuid = '1234'
        const result = await getPcsRetificaveis(consolidado_uuid);
        const url = `/api/consolidados-dre/${consolidado_uuid}/pcs-retificaveis/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getPcsEmRetificacao deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const consolidado_uuid = '1234'
        const result = await getPcsEmRetificacao(consolidado_uuid);
        const url = `/api/consolidados-dre/${consolidado_uuid}/pcs-em-retificacao/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

});