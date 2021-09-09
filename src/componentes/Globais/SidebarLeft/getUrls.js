import {USUARIO_NOME, ASSOCIACAO_NOME_ESCOLA, ASSOCIACAO_TIPO_ESCOLA} from '../../../services/auth.service'
import {visoesService} from "../../../services/visoes.service";
import IconeMenuPainel from '../../../assets/img/icone-menu-painel.svg'
import IconeMenuCreditosDaEscola from '../../../assets/img/icone-menu-creditos-da-escola.svg'
import IconeMenuGastosDaEscola from '../../../assets/img/icone-menu-gastos-da-escola.svg'
import IconeMenuPrestacaoDeContas from '../../../assets/img/icone-menu-prestacao-de-contas.svg'
import IconeDadosDaDiretoria from '../../../assets/img/icone-dados-da-diretoria.svg'
import IconeAcompanhamento from "../../../assets/img/icone-menu-dre-acompanhamento.svg"
import IconeRelatorio from "../../../assets/img/icone-menu-dre-relatorio.svg"
import IconeApoioDiretoria from "../../../assets/img/icone-apoio-a-diretoria.svg"
import IconeGestaoDePerfis from "../../../assets/img/icone-menu-gestao-de-perfis.svg"
import IconeMenuParametrizacoes from "../../../assets/img/icone-menu-parametrizacoes.svg"
import IconeMenuSaldosBancarios from "../../../assets/img/icone-menu-sme-saldos-bancarios.svg"
import IconeMenuFornecedores from "../../../assets/img/icone-menu-fornecedores.svg"

const getDadosUsuario = () =>{
    let usuario = localStorage.getItem(USUARIO_NOME);
    return usuario ? usuario.split(' ')[0] : ''
};

const getDadosUnidade = () =>{
    return {
        tipo_escola: localStorage.getItem(ASSOCIACAO_TIPO_ESCOLA) ? localStorage.getItem(ASSOCIACAO_TIPO_ESCOLA) : "",
        nome_escola: localStorage.getItem(ASSOCIACAO_NOME_ESCOLA) ? localStorage.getItem(ASSOCIACAO_NOME_ESCOLA) : ""
    }
};

const UrlsMenuEscolas ={
    dados_iniciais: {
        default_selected: "dados-da-associacao",
        usuario: getDadosUsuario(),
        associacao_tipo_escola: getDadosUnidade().tipo_escola,
        associacao_nome_escola: getDadosUnidade().nome_escola
    },
    lista_de_urls:[
        {label: "Dados da Associação", url: "dados-da-associacao", dataFor:"dados_da_associacao", icone:IconeDadosDaDiretoria, permissoes: ['access_dados_associacao'],},
        {label: "Resumo dos recursos", url: "dashboard", dataFor:"resumo_dos_recursos", icone:IconeMenuPainel, permissoes: ['access_painel_recursos_ue',],},
        {label: "Créditos da escola", url: "lista-de-receitas", dataFor:"creditos_da_escola", icone:IconeMenuCreditosDaEscola, permissoes: ['access_receita'],},
        {label: "Gastos da escola", url: "lista-de-despesas", dataFor:"gastos_da_escola", icone:IconeMenuGastosDaEscola, permissoes: ['access_despesa', ],},
        {label: "Prestação de contas", url: "prestacao-de-contas", dataFor:"prestacao_de_contas", icone:IconeMenuPrestacaoDeContas, permissoes: ['access_prestacao_contas', 'access_conciliacao_bancaria'],
            subItens: [
                {
                    label: "Conciliação Bancária", url: "detalhe-das-prestacoes", dataFor:"detalhe_das_prestacoes", icone:"", permissoes: ['access_conciliacao_bancaria', ]
                },
                {
                    label: "Geração de documentos", url: "prestacao-de-contas", dataFor:"prestacao_de_contas", icone:"", permissoes: ['access_prestacao_contas']
                },
                {
                    label: "Análises DRE", url: "analise-dre", dataFor:"analise_dre", icone:"", permissoes: ['access_analise_dre']
                },
            ]
        },
        {label: "Gestão de perfis", url: "gestao-de-perfis", dataFor:"gestao_de_perfis", icone:IconeGestaoDePerfis, permissoes: ['access_gestao_perfis_ue'],},
    ]
};

const UrlsMenuDres ={
    dados_iniciais: {
        default_selected: "dre-dashboard",
        usuario: getDadosUsuario(),
        associacao_tipo_escola: getDadosUnidade().tipo_escola,
        associacao_nome_escola: getDadosUnidade().nome_escola
    },
    lista_de_urls:[
        {label: "Associações", url: "dre-associacoes", dataFor:"dre_associacoes", icone:IconeMenuGastosDaEscola, permissoes: ['access_associacao_dre'],},
        {label: "Acompanhamento de PC", url: "dre-dashboard", dataFor:"dre_dashboard", icone:IconeAcompanhamento, permissoes: ['access_dados_diretoria'],},
        {label: "Relatório consolidado", url: "dre-relatorio-consolidado", dataFor:"dre_relatorio_consolidado", icone:IconeRelatorio, permissoes: ['access_relatorio_consolidado_dre']},
        {label: "Dados da Diretoria", url: "dre-dados-da-diretoria", dataFor:"dre_dados_da_diretoria", icone:IconeDadosDaDiretoria, permissoes: ['access_dados_diretoria']},
        {label: "Apoio à Diretoria", url: "apoio-a-diretoria", dataFor:"apoio_a_diretoria", icone:IconeApoioDiretoria, permissoes: ['access_dados_diretoria'],
            subItens: [
                {
                    label: "Perguntas Frequentes", url: "dre-faq", dataFor:"dre_faq", icone:IconeDadosDaDiretoria, permissoes: ['access_faq_dre']
                }
            ]
        },
        {label: "Fornecedores", url: "parametro-fornecedores", dataFor:"parametro_fornecedores", icone:IconeMenuFornecedores, permissoes: ['access_fornecedores'],},
        {label: "Gestão de perfis", url: "gestao-de-perfis", dataFor:"gestao_de_perfis", icone:IconeGestaoDePerfis, permissoes: ['access_gestao_perfis_dre'],},
    ]
};

const UrlsMenuSME ={
    dados_iniciais: {
        default_selected: "acompanhamento-pcs-sme",
        usuario: getDadosUsuario(),
        associacao_tipo_escola: getDadosUnidade().tipo_escola,
        associacao_nome_escola: getDadosUnidade().nome_escola
    },
    lista_de_urls:[
        {label: "Parametrizações", url: "painel-parametrizacoes", dataFor:"sme_painel_parametrizacoes", icone:IconeMenuParametrizacoes, permissoes: ['access_painel_parametrizacoes'],},
        {label: "Acompanhamento de PCs", url: "acompanhamento-pcs-sme", dataFor:"acompanhamento_pcs_sme", icone:IconeAcompanhamento, permissoes: ['access_acompanhamento_pc_sme'],},
        {label: "Consulta de saldos bancários", url: "consulta-de-saldos-bancarios", dataFor:"consulta_de_saldos_bancarios", icone:IconeMenuSaldosBancarios, permissoes: ['access_consulta_saldo_bancario'],},
        {label: "Gestão de perfis", url: "gestao-de-perfis", dataFor:"gestao_de_perfis", icone:IconeGestaoDePerfis, permissoes: ['access_gestao_perfis_sme'],},
    ]
};



const GetUrls = () =>{

    let dados_usuario_logado = visoesService.getDadosDoUsuarioLogado();

    if (dados_usuario_logado.visao_selecionada.nome === 'SME'){
        return UrlsMenuSME
    }else if(dados_usuario_logado.visao_selecionada.nome === 'DRE'){
        return UrlsMenuDres
    }else if (dados_usuario_logado.visao_selecionada.nome === 'UE'){
        return UrlsMenuEscolas
    }else {
        if ( dados_usuario_logado.visoes.find(visao=> visao.tipo === 'SME')){
            return UrlsMenuSME
        }else if (dados_usuario_logado.visoes.find(visao=> visao.tipo === 'DRE')){
            return UrlsMenuDres
        }else if (dados_usuario_logado.visoes.find(visao=> visao.tipo === 'UE')){
            return UrlsMenuEscolas
        }else {
            return UrlsMenuEscolas
        }
    }
};

export const getUrls = {
    GetUrls
};