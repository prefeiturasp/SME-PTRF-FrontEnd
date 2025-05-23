import {
  USUARIO_NOME,
  ASSOCIACAO_NOME_ESCOLA,
  ASSOCIACAO_TIPO_ESCOLA,
} from "../../../services/auth.service";
import { visoesService } from "../../../services/visoes.service";
import IconeMenuPainel from "../../../assets/img/icone-menu-painel.svg";
import IconeMenuCreditosDaEscola from "../../../assets/img/icone-menu-creditos-da-escola.svg";
import IconeMenuGastosDaEscola from "../../../assets/img/icone-menu-gastos-da-escola.svg";
import IconeMenuPrestacaoDeContas from "../../../assets/img/icone-menu-prestacao-de-contas.svg";
import IconeDadosDaDiretoria from "../../../assets/img/icone-dados-da-diretoria.svg";
import IconeAcompanhamento from "../../../assets/img/icone-menu-dre-acompanhamento.svg";
import IconeRelatorio from "../../../assets/img/icone-menu-dre-relatorio.svg";
import IconeApoioDiretoria from "../../../assets/img/icone-apoio-a-diretoria.svg";
import IconeGestaoDePerfis from "../../../assets/img/icone-menu-gestao-de-perfis.svg";
import IconeMenuParametrizacoes from "../../../assets/img/icone-menu-parametrizacoes.svg";
import IconeMenuPrestacaoContas from "../../../assets/img/icone-menu-pestracao-conta.svg";
import IconeMenuSaldosBancarios from "../../../assets/img/icone-menu-sme-saldos-bancarios.svg";
import IconeMenuFornecedores from "../../../assets/img/icone-menu-fornecedores.svg";
import IconeMenuValoresReprogramados from "../../../assets/img/icone-menu-valores-reprogramados.svg";
import IconeMenuSuporteUnidades from "../../../assets/img/icone-menu-suporte-unidades.svg";
import IconeMenuExtracaoDados from "../../../assets/img/icone-dados-da-diretoria.svg";
import IconePaa from "../../../assets/img/icone-paa.svg";
import IconeMenuSituacaoPatrimonial from "../../../assets/img/icones-menu/icone-menu-situacao-patrimonial.svg";

const getDadosUsuario = () => {
  let usuario = localStorage.getItem(USUARIO_NOME);
  return usuario ? usuario.split(" ")[0] : "";
};

const getDadosUnidade = () => {
  return {
    tipo_escola: localStorage.getItem(ASSOCIACAO_TIPO_ESCOLA)
      ? localStorage.getItem(ASSOCIACAO_TIPO_ESCOLA)
      : "",
    nome_escola: localStorage.getItem(ASSOCIACAO_NOME_ESCOLA)
      ? localStorage.getItem(ASSOCIACAO_NOME_ESCOLA)
      : "",
  };
};

const UrlsMenuEscolas = {
  dados_iniciais: {
    default_selected: "dados-da-associacao",
    usuario: getDadosUsuario(),
    associacao_tipo_escola: getDadosUnidade().tipo_escola,
    associacao_nome_escola: getDadosUnidade().nome_escola,
  },
  lista_de_urls: [
    {
      label: "Dados da Associação",
      url: "dados-da-associacao",
      dataFor: "dados_da_associacao",
      icone: IconeDadosDaDiretoria,
      permissoes: ["access_dados_associacao"],
    },
    {
      label: "Resumo dos recursos",
      url: "dashboard",
      dataFor: "resumo_dos_recursos",
      icone: IconeMenuPainel,
      permissoes: ["access_painel_recursos_ue"],
    },
    {
      label: "Créditos da escola",
      url: "lista-de-receitas",
      dataFor: "creditos_da_escola",
      icone: IconeMenuCreditosDaEscola,
      permissoes: ["access_receita"],
    },
    {
      label: "Gastos da escola",
      url: "lista-de-despesas",
      dataFor: "gastos_da_escola",
      icone: IconeMenuGastosDaEscola,
      permissoes: ["access_despesa"],
    },
    {
      label: "Prestação de contas",
      url: "prestacao-de-contas",
      dataFor: "prestacao_de_contas",
      icone: IconeMenuPrestacaoDeContas,
      permissoes: ["access_prestacao_contas", "access_conciliacao_bancaria"],
      subItens: [
        {
          label: "Conciliação Bancária",
          url: "detalhe-das-prestacoes",
          dataFor: "detalhe_das_prestacoes",
          icone: "",
          permissoes: ["access_conciliacao_bancaria"],
          id: "detalhe_das_prestacoes",
        },
        {
          label: "Geração de documentos",
          url: "prestacao-de-contas",
          dataFor: "prestacao_de_contas",
          icone: "",
          permissoes: ["access_prestacao_contas"],
          id: "geracao_documento",
        },
        {
          label: "Análise DRE",
          url: "analise-dre",
          dataFor: "analise_dre",
          icone: "",
          permissoes: ["access_analise_dre"],
          id: "analise_dre",
        },
      ],
    },
    {
      label: "Gestão de perfis",
      url: "gestao-de-perfis",
      dataFor: "gestao_de_perfis",
      icone: IconeGestaoDePerfis,
      permissoes: ["access_gestao_perfis_ue"],
    },
    {
      label: "Gestão de usuários",
      url: "gestao-de-usuarios-list",
      dataFor: "gestao_de_usuarios",
      icone: IconeGestaoDePerfis,
      permissoes: ["access_gestao_usuarios_ue", "change_gestao_usuarios_ue"],
      featureFlag: "gestao-usuarios",
    },
    {
      label: "Plano Anual de Atividades",
      url: "paa",
      dataFor: "paa",
      icone: IconePaa,
      permissoes: ["access_paa"],
      featureFlag: "paa",
      subItens: [
        {
          label: "Elaboração",
          url: "paa",
          dataFor: "paa",
          icone: "",
          permissoes: ["access_paa"],
        },
        {
          label: "Execução do PAA",
          url: "execucao-paa",
          dataFor: "execucao-paa",
          icone: "",
          permissoes: ["access_paa"],
        },
      ],
    },
    {
      label: "Situação patrimonial",
      url: "lista-situacao-patrimonial",
      dataFor: "situacao_patrimonial",
      icone: IconeMenuSituacaoPatrimonial,
      permissoes: ["access_situacao_patrimonial"],
      featureFlag: "situacao-patrimonial",
    },
  ],
};

const UrlsMenuDres = {
  dados_iniciais: {
    default_selected: "dre-dashboard",
    usuario: getDadosUsuario(),
    associacao_tipo_escola: getDadosUnidade().tipo_escola,
    associacao_nome_escola: getDadosUnidade().nome_escola,
  },
  lista_de_urls: [
    {
      label: "Associações",
      url: "dre-associacoes",
      dataFor: "dre_associacoes",
      icone: IconeMenuGastosDaEscola,
      permissoes: ["access_associacao_dre"],
    },
    {
      label: "Valores reprogramados",
      url: "dre-valores-reprogramados",
      dataFor: "dre-valores-reprogramados",
      icone: IconeMenuValoresReprogramados,
      permissoes: ["access_valores_reprogramados_dre"],
    },
    {
      label: "Regularidade",
      url: "regularidade-associacoes",
      dataFor: "regularidade_associacoes",
      icone: IconeMenuGastosDaEscola,
      permissoes: ["access_regularidade_dre"],
    },
    {
      label: "Acompanhamento de PC",
      url: "dre-dashboard",
      dataFor: "dre_dashboard",
      icone: IconeAcompanhamento,
      permissoes: ["access_dados_diretoria"],
    },
    {
      label: "Consolidado das PCs",
      url: "dre-relatorio-consolidado",
      dataFor: "dre_relatorio_consolidado",
      icone: IconeRelatorio,
      permissoes: ["access_relatorio_consolidado_dre"],
    },
    {
      label: "Dados da Diretoria",
      url: "dre-dados-da-diretoria",
      dataFor: "dre_dados_da_diretoria",
      icone: IconeDadosDaDiretoria,
      permissoes: ["access_dados_diretoria"],
    },
    {
      label: "Apoio à Diretoria",
      url: "apoio-a-diretoria",
      dataFor: "apoio_a_diretoria",
      icone: IconeApoioDiretoria,
      permissoes: ["access_dados_diretoria"],
      subItens: [
        {
          label: "Perguntas Frequentes",
          url: "dre-faq",
          dataFor: "dre_faq",
          icone: IconeDadosDaDiretoria,
          permissoes: ["access_faq_dre"],
        },
      ],
    },
    {
      label: "Fornecedores",
      url: "parametro-fornecedores",
      dataFor: "parametro_fornecedores",
      icone: IconeMenuFornecedores,
      permissoes: ["access_fornecedores"],
    },
    {
      label: "Suporte às Unidades",
      url: "suporte-unidades-dre",
      dataFor: "suporte_unidades_dre",
      icone: IconeMenuSuporteUnidades,
      permissoes: ["access_suporte_unidades_dre"],
    },
    {
      label: "Extração de dados",
      url: "extracoes-dados",
      dataFor: "extracao_de_dados",
      icone: IconeMenuExtracaoDados,
      permissoes: ["access_extracao_de_dados_dre"],
    },
    {
      label: "Gestão de perfis",
      url: "gestao-de-perfis",
      dataFor: "gestao_de_perfis",
      icone: IconeGestaoDePerfis,
      permissoes: ["access_gestao_perfis_dre"],
    },
    {
      label: "Gestão de usuários",
      url: "gestao-de-usuarios-list",
      dataFor: "gestao_de_usuarios",
      icone: IconeGestaoDePerfis,
      permissoes: ["access_gestao_usuarios_dre", "change_gestao_usuarios_dre"],
      featureFlag: "gestao-usuarios",
    },
  ],
};

const UrlsMenuSME = {
  dados_iniciais: {
    default_selected: "painel-parametrizacoes",
    usuario: getDadosUsuario(),
    associacao_tipo_escola: getDadosUnidade().tipo_escola,
    associacao_nome_escola: getDadosUnidade().nome_escola,
  },
  lista_de_urls: [
    {
      label: "Parametrizações",
      url: "painel-parametrizacoes",
      dataFor: "sme_painel_parametrizacoes",
      icone: IconeMenuParametrizacoes,
      permissoes: [
        "access_painel_parametrizacoes",
        "change_painel_parametrizacoes",
      ],
    },
    {
      label: "Prestação de Contas",
      url: "prestacao-contas-sme",
      dataFor: "prestacao_contas_sme",
      icone: IconeMenuPrestacaoContas,
      permissoes: [
        "access_acompanhamento_pc_sme",
        "access_analise_relatorios_consolidados_sme",
      ],
      subItens: [
        {
          label: "Acompanhamento de PCs",
          url: "acompanhamento-pcs-sme",
          dataFor: "acompanhamento_pcs_sme",
          icone: IconeAcompanhamento,
          permissoes: ["access_acompanhamento_pc_sme"],
        },
        {
          label: "Relatórios consolidados das DREs",
          url: "analises-relatorios-consolidados-dre",
          dataFor: "analises_relatorios_consolidados_dre",
          icone: "",
          permissoes: ["access_analise_relatorios_consolidados_sme"],
        },
      ],
    },
    {
      label: "Consulta de saldos bancários",
      url: "consulta-de-saldos-bancarios",
      dataFor: "consulta_de_saldos_bancarios",
      icone: IconeMenuSaldosBancarios,
      permissoes: ["access_consulta_saldo_bancario"],
    },
    {
      label: "Suporte às Unidades",
      url: "suporte-unidades-sme",
      dataFor: "suporte_unidades_sme",
      icone: IconeMenuSuporteUnidades,
      permissoes: ["access_suporte_unidades_sme"],
    },
    {
      label: "Extração de dados",
      url: "extracoes-dados",
      dataFor: "extracao_de_dados",
      icone: IconeMenuExtracaoDados,
      permissoes: ["access_extracao_de_dados_sme"],
    },
    {
      label: "Gestão de perfis",
      url: "gestao-de-perfis",
      dataFor: "gestao_de_perfis",
      icone: IconeGestaoDePerfis,
      permissoes: ["access_gestao_perfis_sme"],
    },
    {
      label: "Gestão de usuários",
      url: "gestao-de-usuarios-list",
      dataFor: "gestao_de_usuarios",
      icone: IconeGestaoDePerfis,
      permissoes: ["access_gestao_usuarios_sme", "change_gestao_usuarios_sme"],
      featureFlag: "gestao-usuarios",
    },
  ],
};

const GetUrls = () => {
  let dados_usuario_logado = visoesService.getDadosDoUsuarioLogado();

  if (
    dados_usuario_logado &&
    dados_usuario_logado.visao_selecionada &&
    dados_usuario_logado.visao_selecionada.nome &&
    dados_usuario_logado.visao_selecionada.nome === "SME"
  ) {
    return UrlsMenuSME;
  } else if (
    dados_usuario_logado &&
    dados_usuario_logado.visao_selecionada &&
    dados_usuario_logado.visao_selecionada.nome &&
    dados_usuario_logado.visao_selecionada.nome === "DRE"
  ) {
    return UrlsMenuDres;
  } else if (
    dados_usuario_logado &&
    dados_usuario_logado.visao_selecionada &&
    dados_usuario_logado.visao_selecionada.nome &&
    dados_usuario_logado.visao_selecionada.nome === "UE"
  ) {
    return UrlsMenuEscolas;
  } else {
    if (
      dados_usuario_logado &&
      dados_usuario_logado.visoes &&
      dados_usuario_logado.visoes.find((visao) => visao.tipo === "SME")
    ) {
      return UrlsMenuSME;
    } else if (
      dados_usuario_logado &&
      dados_usuario_logado.visoes &&
      dados_usuario_logado.visoes.find((visao) => visao.tipo === "DRE")
    ) {
      return UrlsMenuDres;
    } else if (
      dados_usuario_logado &&
      dados_usuario_logado.visoes &&
      dados_usuario_logado.visoes.find((visao) => visao.tipo === "UE")
    ) {
      return UrlsMenuEscolas;
    } else {
      return UrlsMenuEscolas;
    }
  }
};

export const getUrls = {
  GetUrls,
};
