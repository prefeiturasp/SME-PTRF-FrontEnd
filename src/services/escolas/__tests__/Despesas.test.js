import api from '../../api';
import { 
    deleteDespesa,
    getDespesasTabelas,
    getEspecificacoesCapital,
    getEspecificacoesCusteio,
    getDespesa,
    getListaDespesas,
    getListaDespesasPaginacao,
    ordenacaoDespesas,
    ordenacaoDespesasPaginacao,
    criarDespesa,
    alterarDespesa,
    getNomeRazaoSocial,
    getDespesaCadastrada,
    patchAtrelarSaidoDoRecurso,
    getMotivosPagamentoAntecipado,
    getTagInformacao,
    marcarLancamentoAtualizado,
    marcarLancamentoExcluido,
    marcarGastoIncluido,
    getValidarDataDaDespesa
 } from '../Despesas.service.js';
import { TOKEN_ALIAS, ASSOCIACAO_UUID } from '../../auth.service.js';


jest.mock('../../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));


const mockToken = 'fake-token';
const associacao_uuid = '12345';
const mockData = [{ id: 1, nome: 'Teste 1' }];

describe('Testes para funções de análise', () => {
    
    beforeEach(() => {
        localStorage.setItem(ASSOCIACAO_UUID, associacao_uuid);
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

    test('deleteDespesa deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData });
        const uuid = '1234'
        const result = await deleteDespesa(uuid);

        expect(api.delete).toHaveBeenCalledWith(
            `api/despesas/${uuid}/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getDespesasTabelas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getDespesasTabelas(associacao_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/despesas/tabelas/?associacao_uuid=${associacao_uuid ? associacao_uuid : localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getDespesasTabelas deve chamar a API corretamente SEM parametro, obtendo direto pelo localStorage', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getDespesasTabelas(null);

        expect(api.get).toHaveBeenCalledWith(
            `api/despesas/tabelas/?associacao_uuid=${associacao_uuid ? associacao_uuid : localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getEspecificacoesCapital deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getEspecificacoesCapital();

        expect(api.get).toHaveBeenCalledWith(
            `api/especificacoes/?aplicacao_recurso=CAPITAL`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getEspecificacoesCusteio deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const id_tipo_custeio = '1234'
        const result = await getEspecificacoesCusteio(id_tipo_custeio);
        expect(api.get).toHaveBeenCalledWith(
            `api/especificacoes/?aplicacao_recurso=CUSTEIO&tipo_custeio=${id_tipo_custeio}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getDespesa deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const idDespesa = '1234'
        const result = await getDespesa(idDespesa);
        expect(api.get).toHaveBeenCalledWith(
            `api/despesas/${idDespesa}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getListaDespesas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getListaDespesas();
        expect(api.get).toHaveBeenCalledWith(
            `api/despesas/?associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getListaDespesasPaginacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const page = 1;
        const result = await getListaDespesasPaginacao(page);
        expect(api.get).toHaveBeenCalledWith(
            `api/despesas/?associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&page=${page}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('ordenacaoDespesas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const palavra=''
        const aplicacao_recurso=''
        const acao_associacao__uuid=''
        const despesa__status=''
        const fornecedor=''
        const data_inicio=''
        const data_fim=''
        const conta_associacao__uuid=''
        const filtro_vinculo_atividades=''
        const filtro_informacoes=''
        const ordenar_por_numero_do_documento=''
        const ordenar_por_data_especificacao=''
        const ordenar_por_valor=''
        const ordenarPorImposto=false
        const result = await ordenacaoDespesas(palavra, aplicacao_recurso, acao_associacao__uuid, despesa__status, fornecedor, data_inicio, data_fim, conta_associacao__uuid, filtro_vinculo_atividades, filtro_informacoes, ordenar_por_numero_do_documento, ordenar_por_data_especificacao, ordenar_por_valor, ordenarPorImposto);
        expect(api.get).toHaveBeenCalledWith(
            `api/despesas/?search=${palavra}&aplicacao_recurso=${aplicacao_recurso}&rateios__acao_associacao__uuid=${acao_associacao__uuid}&status=${despesa__status}&fornecedor=${fornecedor}${data_inicio ? '&data_inicio='+data_inicio : ""}${data_fim ? '&data_fim='+data_fim : ""}&rateios__conta_associacao__uuid=${conta_associacao__uuid}&filtro_vinculo_atividades=${filtro_vinculo_atividades}&filtro_informacoes=${filtro_informacoes}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}${ordenar_por_numero_do_documento ? "&ordenar_por_numero_do_documento="+ordenar_por_numero_do_documento : ""}${ordenar_por_data_especificacao ? "&ordenar_por_data_especificacao="+ordenar_por_data_especificacao : ""}${ordenar_por_valor ? "&ordenar_por_valor="+ordenar_por_valor : ""}${ordenarPorImposto ? "&ordenar_por_imposto="+ordenarPorImposto : ""}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('ordenacaoDespesasPaginacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const palavra='';
        const aplicacao_recurso='';
        const acao_associacao__uuid='';
        const despesa__status='';
        const fornecedor='';
        const data_inicio='';
        const data_fim='';
        const conta_associacao__uuid='';
        const filtro_vinculo_atividades='';
        const filtro_informacoes='';
        const ordenar_por_numero_do_documento= '';
        const ordenar_por_data_especificacao='';
        const ordenar_por_valor='';
        const ordenarPorImposto=false;
        const page=1;
        const result = await ordenacaoDespesasPaginacao(palavra, aplicacao_recurso, acao_associacao__uuid, despesa__status, fornecedor, data_inicio, data_fim, conta_associacao__uuid, filtro_vinculo_atividades, filtro_informacoes, ordenar_por_numero_do_documento, ordenar_por_data_especificacao, ordenar_por_valor, ordenarPorImposto, page);
        expect(api.get).toHaveBeenCalledWith(
            `api/despesas/?search=${palavra}&aplicacao_recurso=${aplicacao_recurso}&rateios__acao_associacao__uuid=${acao_associacao__uuid}&status=${despesa__status}&fornecedor=${fornecedor}${data_inicio ? '&data_inicio='+data_inicio : ""}${data_fim ? '&data_fim='+data_fim : ""}&rateios__conta_associacao__uuid=${conta_associacao__uuid}&filtro_vinculo_atividades=${filtro_vinculo_atividades}&filtro_informacoes=${filtro_informacoes}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}${ordenar_por_numero_do_documento ? "&ordenar_por_numero_do_documento="+ordenar_por_numero_do_documento : ""}${ordenar_por_data_especificacao ? "&ordenar_por_data_especificacao="+ordenar_por_data_especificacao : ""}${ordenar_por_valor ? "&ordenar_por_valor="+ordenar_por_valor : ""}${ordenarPorImposto ? "&ordenar_por_imposto="+ordenarPorImposto : ""}&page=${page}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('criarDespesa deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const result = await criarDespesa(payload);
        expect(api.post).toHaveBeenCalledWith(
            `api/despesas/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual({ data: mockData});
    });

    test('criarDespesa deve chamar a API e retornar erro', async () => {
        api.post.mockRejectedValue(new Error("Erro na API"));
        const payload = { teste: 'testes'}
        const result = await criarDespesa(payload);
        expect(api.post).toHaveBeenCalledWith(
            `api/despesas/`,
            payload,
            getAuthHeader()
        );
        expect(api.post).rejects.toThrow("Erro na API")
    });

    test('alterarDespesa deve chamar a API corretamente', async () => {
        api.put.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const idDespesa = 1
        const result = await alterarDespesa(payload, idDespesa);
        expect(api.put).toHaveBeenCalledWith(
            `api/despesas/${idDespesa}/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual({ data: mockData});
    });

    test('alterarDespesa deve chamar a API com retorno de erro', async () => {
        api.put.mockRejectedValue({data: mockData});
        const payload = { teste: 'testes'}
        const idDespesa = 1
        const result = await alterarDespesa(payload, idDespesa);
        expect(api.put).toHaveBeenCalledWith(
            `api/despesas/${idDespesa}/`,
            payload,
            getAuthHeader()
        );
        expect(result).rejects.Error
    });

    test('getNomeRazaoSocial deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const cpf_cnpj = 1
        const result = await getNomeRazaoSocial(cpf_cnpj);
        expect(api.get).toHaveBeenCalledWith(
            `/api/fornecedores/?uuid=&cpf_cnpj=${cpf_cnpj}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getNomeRazaoSocial deve chamar a API sem parâmetro', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const cpf_cnpj = null
        const result = await getNomeRazaoSocial(cpf_cnpj);
        expect(api.get).not.toHaveBeenCalled();
        expect(result).toEqual("");
    });

    test('getDespesaCadastrada deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        let tipo_documento='';
        let numero_documento='';
        let cpf_cnpj_fornecedor='';
        let despesa_uuid=null;
        const result = await getDespesaCadastrada(tipo_documento, numero_documento, cpf_cnpj_fornecedor, despesa_uuid=null);
        expect(api.get).toHaveBeenCalledWith(
            `api/despesas/ja-lancada/?tipo_documento=${tipo_documento}&numero_documento=${numero_documento}&cpf_cnpj_fornecedor=${cpf_cnpj_fornecedor}${despesa_uuid ? '&despesa_uuid='+despesa_uuid : ''}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('patchAtrelarSaidoDoRecurso deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const receita_uuid='1234'
        const despesa_uuid='1234';
        const result = await patchAtrelarSaidoDoRecurso(receita_uuid, despesa_uuid);
        expect(api.patch).toHaveBeenCalledWith(
            `api/receitas/${receita_uuid}/atrelar-saida-recurso/?despesa_uuid=${despesa_uuid}`,
            {},
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getMotivosPagamentoAntecipado deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getMotivosPagamentoAntecipado();
        expect(api.get).toHaveBeenCalledWith(
            `api/motivos-pagamento-antecipado/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getTagInformacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getTagInformacao();
        expect(api.get).toHaveBeenCalledWith(
            `api/despesas/tags-informacoes/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('marcarLancamentoAtualizado deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const uuid_analise_lancamento = '1234';
        const result = await marcarLancamentoAtualizado(uuid_analise_lancamento);
        expect(api.post).toHaveBeenCalledWith(
            `/api/analises-lancamento-prestacao-conta/${uuid_analise_lancamento}/marcar-lancamento-atualizado/`,
            {},
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('marcarLancamentoExcluido deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const uuid_analise_lancamento = '1234';
        const result = await marcarLancamentoExcluido(uuid_analise_lancamento);
        expect(api.post).toHaveBeenCalledWith(
            `/api/analises-lancamento-prestacao-conta/${uuid_analise_lancamento}/marcar-lancamento-excluido/`,
            {},
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('marcarGastoIncluido deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const result = await marcarGastoIncluido(payload);
        expect(api.post).toHaveBeenCalledWith(
            `/api/analises-documento-prestacao-conta/marcar-como-gasto-incluido/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getValidarDataDaDespesa deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const data_da_depesa = '2026-01-01';
        const result = await getValidarDataDaDespesa(associacao_uuid, data_da_depesa);
        expect(api.get).toHaveBeenCalledWith(
            `/api/despesas/validar-data-da-despesa?associacao_uuid=${associacao_uuid}&data=${data_da_depesa}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

});
