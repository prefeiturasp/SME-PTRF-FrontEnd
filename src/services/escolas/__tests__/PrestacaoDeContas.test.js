import api from '../../api';
import { visoesService } from '../../visoes.service.js';
import { 
    getStatusPeriodoPorData,
    postConcluirPeriodo,
    getPeriodosNaoFuturos,
    getPeriodosAteAgoraForaImplantacaoDaAssociacao,
    getStatus,
    getIniciarPrestacaoDeContas,
    getTransacoes,
    patchConciliarDespesa,
    patchDesconciliarDespesa,
    getConciliar,
    getDesconciliar,
    getDespesasPrestacaoDeContas,
    getReceitasPrestacaoDeContas,
    getConciliarReceita,
    getDesconciliarReceita,
    getObservacoes,
    getVisualizarExtratoBancario,
    getDownloadExtratoBancario,
    pathSalvarJustificativaPrestacaoDeConta,
    pathExtratoBancarioPrestacaoDeConta,
    getDataPreenchimentoAta,
    getIniciarAta,
    getIniciarPreviaAta,
    getInfoAta,
    getPreviaInfoAta,
    gerarPreviaRelatorioAposAcertos,
    regerarRelatorioAposAcertos,
    regerarPreviaRelatorioAposAcertos,
    verificarStatusGeracaoAposAcertos,
    downloadDocumentPdfAposAcertos,
    getConcluirPrestacaoDeConta,
    getFiqueDeOlhoPrestacoesDeContas,
    getTextosPaaUe,
    patchTextosPaaUe,
    getAtaRetificadora,
    getIniciarAtaRetificadora,
    getMembrosCargos,
    getStatusPresidente
 } from '../PrestacaoDeContas.service.js';
import { TOKEN_ALIAS, ASSOCIACAO_UUID } from '../../auth.service.js';

jest.mock('../../visoes.service.js', () => ({
    visoesService: {
        featureFlagAtiva: jest.fn(),
    }
}));

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
const receita_uuid = '1234';
const periodo_uuid = '1234';
const uuidPrestacaoDeContas = '1234';

describe('Testes para funções de análise', () => {
    
    beforeEach(() => {
        localStorage.setItem(ASSOCIACAO_UUID, associacao_uuid);
        localStorage.setItem(TOKEN_ALIAS, mockToken);
        localStorage.setItem('uuidPrestacaoConta', uuidPrestacaoDeContas);
        
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
    test('getStatusPeriodoPorData deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_associacao = associacao_uuid;
        const data_incial_periodo = '2023-01-01';
        const result = await getStatusPeriodoPorData(uuid_associacao, data_incial_periodo);
        expect(api.get).toHaveBeenCalledWith(
            `/api/associacoes/${uuid_associacao}/status-periodo/?data=${data_incial_periodo}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('postConcluirPeriodo deve chamar a API corretamente COM flag novo-processo-pc', async () => {
        visoesService.featureFlagAtiva.mockReturnValue(true)
        api.post.mockResolvedValue({ data: mockData })
        const justificativaPendencia='testes-justificativa'
        const result = await postConcluirPeriodo(periodo_uuid, justificativaPendencia);
        expect(api.post).toHaveBeenCalledWith(
            `/api/prestacoes-contas/concluir-v2/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&periodo_uuid=${periodo_uuid}`,
            {
                justificativa_acertos_pendentes: 'testes-justificativa',
                associacao_uuid: localStorage.getItem(ASSOCIACAO_UUID),
                periodo_uuid: periodo_uuid
            },
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('postConcluirPeriodo deve chamar a API corretamente SEM flag novo-processo-pc', async () => {
        visoesService.featureFlagAtiva.mockReturnValue(false)
        api.post.mockResolvedValue({ data: mockData })
        const justificativaPendencia='teste-justificativa'
        const result = await postConcluirPeriodo(periodo_uuid, justificativaPendencia);
        expect(api.post).toHaveBeenCalledWith(
            `/api/prestacoes-contas/concluir/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&periodo_uuid=${periodo_uuid}`,
            {justificativa_acertos_pendentes: 'teste-justificativa'},
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('getPeriodosNaoFuturos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getPeriodosNaoFuturos();
        expect(api.get).toHaveBeenCalledWith(
            `/api/periodos/lookup-until-now/`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getPeriodosAteAgoraForaImplantacaoDaAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_associacao = associacao_uuid;
        const result = await getPeriodosAteAgoraForaImplantacaoDaAssociacao(uuid_associacao);
        expect(api.get).toHaveBeenCalledWith(
            `/api/associacoes/${uuid_associacao}/periodos-ate-agora-fora-implantacao/`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getStatus deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const conta_uuid = '1234';
        const result = await getStatus(periodo_uuid, conta_uuid);
        expect(api.get).toHaveBeenCalledWith(
            `/api/prestacoes-contas/por-conta-e-periodo/?conta_associacao_uuid=${conta_uuid}&periodo_uuid=${periodo_uuid}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getIniciarPrestacaoDeContas deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const conta_uuid = '1234';
        const result = await getIniciarPrestacaoDeContas(conta_uuid, periodo_uuid);
        expect(api.post).toHaveBeenCalledWith(
            `/api/prestacoes-contas/iniciar/?conta_associacao_uuid=${conta_uuid}&periodo_uuid=${periodo_uuid}`,
            {},
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getTransacoes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const conta_uuid = '';
        const conferido = '';
        const acao_associacao_uuid = '';
        const ordenar_por_numero_do_documento = '';
        const ordenar_por_data_especificacao = '';
        const ordenar_por_valor = '';
        const ordenar_por_imposto = '';
        const result = await getTransacoes(periodo_uuid, conta_uuid, conferido, acao_associacao_uuid, ordenar_por_numero_do_documento, ordenar_por_data_especificacao, ordenar_por_valor, ordenar_por_imposto);
        const params= {
            periodo: periodo_uuid,
            conta_associacao: conta_uuid,
            conferido: conferido,
            acao_associacao: acao_associacao_uuid,
            ordenar_por_numero_do_documento: ordenar_por_numero_do_documento,
            ordenar_por_data_especificacao: ordenar_por_data_especificacao,
            ordenar_por_valor: ordenar_por_valor,
            ordenar_por_imposto: ordenar_por_imposto
        }
        const apiUrl = '/api/conciliacoes/transacoes-despesa/';
        const queryString = Object.keys(params)
            .filter((key) => params[key] !== undefined && params[key] !== null) 
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        const apiUrlWithParams = `${apiUrl}?${queryString}`;
        expect(api.get).toHaveBeenCalledWith(
            apiUrlWithParams,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('patchConciliarDespesa deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const conta_uuid = '1234';
        const transacao_uuid = '1234';
        const result = await patchConciliarDespesa(periodo_uuid, conta_uuid, transacao_uuid);
        expect(api.patch).toHaveBeenCalledWith(
            `/api/conciliacoes/conciliar-despesa/?periodo=${periodo_uuid}&conta_associacao=${conta_uuid}&transacao=${transacao_uuid}`,
            {},
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('patchDesconciliarDespesa deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const conta_uuid = '1234';
        const transacao_uuid = '1234';
        const result = await patchDesconciliarDespesa(conta_uuid, transacao_uuid);
        expect(api.patch).toHaveBeenCalledWith(
            `/api/conciliacoes/desconciliar-despesa/?conta_associacao=${conta_uuid}&transacao=${transacao_uuid}`,
            {},
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getConciliar deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const rateio_uuid = '1234';
        const result = await getConciliar(rateio_uuid, periodo_uuid);
        expect(api.patch).toHaveBeenCalledWith(
            `/api/rateios-despesas/${rateio_uuid}/conciliar/?periodo=${periodo_uuid}`,
            {},
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getDesconciliar deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const rateio_uuid = '1234';
        const result = await getDesconciliar(rateio_uuid, periodo_uuid);
        expect(api.patch).toHaveBeenCalledWith(
            `/api/rateios-despesas/${rateio_uuid}/desconciliar/?periodo=${periodo_uuid}`,
            {},
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getDespesasPrestacaoDeContas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const conta_uuid = '1234';
        const acao_associacao_uuid = '1234';
        const conferido = true;
        const result = await getDespesasPrestacaoDeContas(periodo_uuid, conta_uuid, acao_associacao_uuid, conferido);
        expect(api.get).toHaveBeenCalledWith(
            `/api/conciliacoes/despesas/?periodo=${periodo_uuid}&conta_associacao=${conta_uuid}&acao_associacao=${acao_associacao_uuid}&conferido=${conferido}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getReceitasPrestacaoDeContas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const conta_uuid = '1234';
        const acao_associacao_uuid = '1234';
        const conferido = true;
        const result = await getReceitasPrestacaoDeContas(periodo_uuid, conta_uuid, acao_associacao_uuid, conferido);
        expect(api.get).toHaveBeenCalledWith(
            `/api/conciliacoes/receitas/?periodo=${periodo_uuid}&conta_associacao=${conta_uuid}&acao_associacao=${acao_associacao_uuid}&conferido=${conferido}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getConciliarReceita deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const receita_uuid = '1234';
        const periodo_uuid = '1234';
        const result = await getConciliarReceita(receita_uuid, periodo_uuid);
        expect(api.patch).toHaveBeenCalledWith(
            `/api/receitas/${receita_uuid}/conciliar/?periodo=${periodo_uuid}`,
            {},
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getDesconciliarReceita deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const result = await getDesconciliarReceita(receita_uuid, periodo_uuid);
        expect(api.patch).toHaveBeenCalledWith(
            `/api/receitas/${receita_uuid}/desconciliar/?periodo=${periodo_uuid}`,
            {},
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getObservacoes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const conta_uuid = '1234';
        const result = await getObservacoes(periodo_uuid, conta_uuid, associacao_uuid);
        expect(api.get).toHaveBeenCalledWith(
            `/api/conciliacoes/observacoes/?periodo=${periodo_uuid}&conta_associacao=${conta_uuid}&associacao=${associacao_uuid}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getVisualizarExtratoBancario deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: undefined })
        const observacao_uuid = '1234';
        const result = await getVisualizarExtratoBancario(observacao_uuid);
        expect(api.get).toHaveBeenCalledWith(
            `/api/conciliacoes/download-extrato-bancario/?observacao_uuid=${observacao_uuid}`,
            {
                ...getAuthHeader(),
                responseType: 'blob',
                timeout: 30000
            }
        )
        expect(result).toEqual(undefined);
    });
    
    test('getDownloadExtratoBancario deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: undefined })
        const nome_do_arquivo_com_extensao = 'teste'
        const observacao_uuid = '1234'
        const result = await getDownloadExtratoBancario(nome_do_arquivo_com_extensao, observacao_uuid);
        expect(api.get).toHaveBeenCalledWith(
            `/api/conciliacoes/download-extrato-bancario/?observacao_uuid=${observacao_uuid}`,
            {
                ...getAuthHeader(),
                responseType: 'blob',
                timeout: 30000
            }
        )
        expect(result).toEqual(undefined);
    });
    
    test('pathSalvarJustificativaPrestacaoDeConta deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const payload = {
            periodo_uuid: periodo_uuid,
            conta_associacao_uuid: '1234',
            observacao: 'teste'
        }
        const formData = new FormData();
        formData.append("periodo_uuid", payload.periodo_uuid);
        formData.append("conta_associacao_uuid", payload.conta_associacao_uuid);
        formData.append("observacao", payload.observacao);
        formData.append("justificativa_ou_extrato_bancario", "JUSTIFICATIVA")
        const result = await pathSalvarJustificativaPrestacaoDeConta(payload);
        expect(api.patch).toHaveBeenCalledWith(
            `/api/conciliacoes/salvar-observacoes/`,
            formData,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('pathExtratoBancarioPrestacaoDeConta deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const getAuthHeaderFormdata = () => {
            return {
                headers: {
                    'Authorization': `JWT ${mockToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
        };
        const payload = {
            periodo_uuid: periodo_uuid,
            conta_associacao_uuid: '1234',
            saldo_extrato: '1234',
            data_extrato: '2000-01-01',
            data_atualizacao_comprovante_extrato: '2000-01-01',
            comprovante_extrato: '2000-01-01'
        }
        const result = await pathExtratoBancarioPrestacaoDeConta(payload);
        const formData = new FormData();
        formData.append("periodo_uuid", payload.periodo_uuid);
        formData.append("conta_associacao_uuid", payload.conta_associacao_uuid);
        formData.append("saldo_extrato", payload.saldo_extrato);
        formData.append("justificativa_ou_extrato_bancario", "EXTRATO_BANCARIO")
        if (payload.data_extrato){
            formData.append("data_extrato", payload.data_extrato);
        }
        if (payload.data_atualizacao_comprovante_extrato){
            formData.append("data_atualizacao_comprovante_extrato", payload.data_atualizacao_comprovante_extrato);
        }
        if (payload.comprovante_extrato){
            formData.append("comprovante_extrato", payload.comprovante_extrato);
        }
        expect(api.patch).toHaveBeenCalledWith(
            `/api/conciliacoes/salvar-observacoes/`,
            formData,
            getAuthHeaderFormdata()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getDataPreenchimentoAta deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getDataPreenchimentoAta(uuidPrestacaoDeContas);
        expect(api.get).toHaveBeenCalledWith(
            `/api/prestacoes-contas/${uuidPrestacaoDeContas}/ata/`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getIniciarAta deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await getIniciarAta(uuidPrestacaoDeContas);
        expect(api.post).toHaveBeenCalledWith(
            `/api/prestacoes-contas/${uuidPrestacaoDeContas}/iniciar-ata/`,
            {},
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getIniciarPreviaAta deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const associacaoUuid = associacao_uuid;
        const periodoUuid = periodo_uuid;
        const result = await getIniciarPreviaAta(associacaoUuid, periodoUuid);
        expect(api.post).toHaveBeenCalledWith(
            `/api/prestacoes-contas/iniciar-previa-ata/?associacao=${associacaoUuid}&periodo=${periodoUuid}`,
            {},
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getInfoAta deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getInfoAta();
        expect(api.get).toHaveBeenCalledWith(
            `/api/prestacoes-contas/${localStorage.getItem("uuidPrestacaoConta")}/info-para-ata/`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getPreviaInfoAta deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const associacaoUuid = associacao_uuid;
        const periodoUuid = periodo_uuid;
        const result = await getPreviaInfoAta(associacaoUuid, periodoUuid);
        expect(api.get).toHaveBeenCalledWith(
            `/api/prestacoes-contas/previa-info-para-ata/?associacao=${associacaoUuid}&periodo=${periodoUuid}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('gerarPreviaRelatorioAposAcertos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid = '1234';
        const result = await gerarPreviaRelatorioAposAcertos(uuid);
        expect(api.get).toHaveBeenCalledWith(
            `/api/analises-prestacoes-contas/previa-relatorio-apos-acertos/?analise_prestacao_uuid=${uuid}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('regerarRelatorioAposAcertos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid = '1234';
        const result = await regerarRelatorioAposAcertos(uuid);
        expect(api.get).toHaveBeenCalledWith(
            `/api/analises-prestacoes-contas/regerar-relatorio-apos-acertos/?analise_prestacao_uuid=${uuid}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('regerarPreviaRelatorioAposAcertos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid = '1234';
        const result = await regerarPreviaRelatorioAposAcertos(uuid);
        expect(api.get).toHaveBeenCalledWith(
            `/api/analises-prestacoes-contas/regerar-previa-relatorio-apos-acertos/?analise_prestacao_uuid=${uuid}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('verificarStatusGeracaoAposAcertos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid = '1234';
        const result = await verificarStatusGeracaoAposAcertos(uuid);
        expect(api.get).toHaveBeenCalledWith(
            `/api/analises-prestacoes-contas/status-info_relatorio_apos_acertos/?analise_prestacao_uuid=${uuid}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('downloadDocumentPdfAposAcertos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: undefined })
        const analise_atual_uuid = '1234';
        const result = await downloadDocumentPdfAposAcertos(analise_atual_uuid);
        expect(api.get).toHaveBeenCalledWith(
            `/api/analises-prestacoes-contas/download-documento-pdf_apos_acertos/?analise_prestacao_uuid=${analise_atual_uuid}`,
            {
                responseType: 'blob',
                timeout: 30000,
                ...getAuthHeader()
            }
        )
        expect(result).toEqual(undefined);
    });
    
    test('getConcluirPrestacaoDeConta deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const payload = { teste: 'testes' }
        const result = await getConcluirPrestacaoDeConta(uuidPrestacaoDeContas, payload);
        expect(api.patch).toHaveBeenCalledWith(
            `/api/prestacoes-contas/${uuidPrestacaoDeContas}/concluir/`,
            payload,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getFiqueDeOlhoPrestacoesDeContas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getFiqueDeOlhoPrestacoesDeContas();
        expect(api.get).toHaveBeenCalledWith(
            `/api/prestacoes-contas/fique-de-olho/`,
            getAuthHeader()
        )
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
        expect(result).toEqual({ data: mockData });
    });
    
    test('getAtaRetificadora deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const prestacao_uuid = uuidPrestacaoDeContas;
        const result = await getAtaRetificadora(prestacao_uuid);
        expect(api.get).toHaveBeenCalledWith(
            `/api/prestacoes-contas/${prestacao_uuid}/ata-retificacao/`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getIniciarAtaRetificadora deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await getIniciarAtaRetificadora(uuidPrestacaoDeContas);
        expect(api.post).toHaveBeenCalledWith(
            `/api/prestacoes-contas/${uuidPrestacaoDeContas}/iniciar-ata-retificacao/`,
            {},
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getMembrosCargos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getMembrosCargos(associacao_uuid);
        expect(api.get).toHaveBeenCalledWith(
            `/api/membros-associacao/membros-cargos/?associacao_uuid=${associacao_uuid}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getStatusPresidente deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getStatusPresidente(associacao_uuid);
        expect(api.get).toHaveBeenCalledWith(
            `/api/associacoes/${associacao_uuid}/status-presidente/`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

});
