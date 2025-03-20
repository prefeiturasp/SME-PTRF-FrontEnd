import React from "react";
import { Route, Switch } from "react-router-dom";
import { Login } from "../paginas/Login";
import { LoginSuporte } from "../paginas/LoginSuporte";
import { Pagina404 } from "../paginas/escolas/404";
import { DashboardPage } from "../paginas/Dashboard";
import { CadastroDeDespesa } from "../paginas/escolas/Despesas/CadastroDeDespesas";
import { EdicaoDeDespesa } from "../paginas/escolas/Despesas/EdicaoDeDespesa";
import { ListaDeDespesasPage } from "../paginas/escolas/Despesas/ListaDeDespesas";
import { CadastroSaida } from "../paginas/escolas/Despesas/CadastroSaida";
import { CadastroDeReceita } from "../paginas/escolas/Receitas/CadastroReceita";
import { EdicaoDeReceita } from "../paginas/escolas/Receitas/EdicaoReceita";
import { ListaDeReceitasPage } from "../paginas/escolas/Receitas/ListaDeReceitas";
import { DadosDaAssociacaoPage } from "../paginas/escolas/Associacao";
import { PrestacaoDeContasPage } from "../paginas/escolas/PrestacaoDeContas";
import { DetalhedasPrestacoesPage } from "../paginas/escolas/DetalheDasPrestacoes";
import { VisualizacaoDaAta } from "../componentes/escolas/GeracaoDaAta/VisualizacaoDaAta";
import { EdicaoAta } from "../componentes/escolas/GeracaoDaAta/VisualizacaoDaAta/EdicaoAta";
import { MembrosDaAssociacaoPage } from "../paginas/escolas/MembrosDaAssociacao";
import { PaginaMandatoVigente } from "../componentes/escolas/MembrosDaAssociacao/pages/PaginaMandatoVigente";
import { ValoresReprogramados } from "../componentes/Globais/ValoresReprogramados";
import { DadosDasContasPage } from "../paginas/escolas/DadosDasContasAssociacao";
import { EsqueciMinhaSenhaPage } from "../paginas/Login/EsqueciMinhaSenha";
import { RedefinirSenhaPage } from "../paginas/Login/RedefinirMinhaSenha";
import { MeusDadosPage } from "../paginas/escolas/MeusDados";
import { AssociacoesPage } from "../paginas/dres/Associacoes";
import { DetalhesDaAssociacaoDrePage } from "../paginas/dres/Associacoes/DetalhesDaAssociacao";
import { CentralDeNotificacoesPage } from "../paginas/CentralDeNotificacoes";
import { CentralDeDownloadsPage } from "../paginas/CentralDeDownloads";
import { authService } from "../services/auth.service";
import { visoesService } from "../services/visoes.service";
import { PaginaSemPermissao } from "../paginas/SemPermissao";
import { GestaoDePerfisPage } from "../paginas/GestaoDePerfis";
import { GestaoDePerfisForm } from "../componentes/Globais/GestaoDePerfis/GestaoDePerfisForm";
import { ConsultaDeSaldosBancarios } from "../componentes/sme/ConsultaDeSaldosBancarios";
import { ConsultaDeSaldosBancariosDetalhesAssociacoes } from "../componentes/sme/ConsultaDeSaldosBancarios/ConsultaDeSaldosBancariosDetalhesAssociacoes";
import { RegularidadeAssociacoesPage } from "../paginas/dres/RegularidadeAssociacoes";
import { ValoresReprogramadosDrePage } from "../paginas/dres/ValoresReprogramadosDre";
import { AnalisesRegularidadeAssociacaoPage } from "../paginas/dres/RegularidadeAssociacoes/AnalisesRegularidadeDaAssociacao";
import { SuporteAsUnidadesDre } from "../paginas/dres/SuporteAsUnidades";
import { SuporteAsUnidadesSme } from "../paginas/SME/SuporteAsUnidades";
import { GestaoDeUsuariosListPage } from "../componentes/Globais/GestaoDeUsuariosList";
// Faz o redirect de acordo com a Visao Selecionada
import { RedirectLoginVisaoUe } from "../utils/RedirectLoginVisaoUe";
import { DadosDaDiretoriaDrePage } from "../paginas/dres/Diretoria/DadosDaDiretoria";
import { TecnicosDaDiretoriaDrePage } from "../paginas/dres/Diretoria/TecnicosDaDiretoria";
import { ComissoesDrePage } from "../paginas/dres/Diretoria/Comissoes";
import { FaqDrePage } from "../paginas/dres/ApoioDiretoria/Faq";
import { AtribuicoesPage } from "../paginas/dres/Diretoria/Atribuicoes";
import { DreDashboardPage } from "../paginas/dres/DreDashboard";
import { ListaPrestacaoDeContas } from "../componentes/dres/PrestacaoDeContas/ListaPrestacaoDeContas";
import { DetalhePrestacaoDeContas } from "../componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas";
import { DetalhePrestacaoDeContasNaoApresentada } from "../componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContasNaoApresentada";
import RelatorioConsolidado from "../componentes/dres/RelatorioConsolidado";
// TODO Remover RelatorioConsolidadoApuracao
import { RelatorioConsolidadoApuracao } from "../componentes/dres/RelatorioConsolidado/RelatorioConsolidadoApuracao";
import { RelatorioConsolidadoEmTela } from "../componentes/dres/RelatorioConsolidado/RelatorioConsolidadoEmTela";
import { RelatorioConsolidadoDadosDasUes } from "../componentes/dres/RelatorioConsolidado/RelatorioConsolidadoDadosDasUes";
import RetificacaoRelatorioConsolidado from "../componentes/dres/RelatorioConsolidado/RetificacaoRelatorioConsolidado";
import { PainelParametrizacoesPage } from "../paginas/SME/Parametrizacoes/PainelParametrizacoes";
import { AcompanhamentoPcsSmePage } from "../paginas/SME/PrestacaoDeContas/AcompanhamentoPcsSme";
import { AcompanhamentoPcsPorDre } from "../paginas/SME/PrestacaoDeContas/AcompanhamentoPcsSmePorDre";
import { RelatorioConsolidadoPage } from "../paginas/SME/PrestacaoDeContas/RelatorioConsolidado";
import { AcompanhamentoRelatorioConsolidadosSmeListagem } from "../componentes/sme/AcompanhamentoRelatoriosConsolidadosSME/AcompanhamentoRelatoriosConsolidadosSmeListagem";
import { AcoesDasAssociacoes } from "../componentes/sme/Parametrizacoes/Estrutura/AcoesDasAssociacoes";
import { ContasDasAssociacoes } from "../componentes/sme/Parametrizacoes/Estrutura/ContasDasAssociacoes";
import { Acoes } from "../componentes/sme/Parametrizacoes/Estrutura/Acoes";
import { AssociacoesDaAcao } from "../componentes/sme/Parametrizacoes/Estrutura/Acoes/AssociacoesDaAcao";
import { VinculaAssociacoesAAcao } from "../componentes/sme/Parametrizacoes/Estrutura/Acoes/VinculaAssociacoesAAcao";
import { Periodos } from "../componentes/sme/Parametrizacoes/Estrutura/Periodos";
import { Associacoes } from "../componentes/sme/Parametrizacoes/Estrutura/Associacoes";
import { Tags } from "../componentes/sme/Parametrizacoes/Estrutura/Tags";
import { TiposConta } from "../componentes/sme/Parametrizacoes/Estrutura/TiposConta";
import { FiqueDeOlho } from "../componentes/sme/Parametrizacoes/EdicaoDeTextos/FiqueDeOlho";
import ArquivosDeCarga from "../componentes/Globais/ArquivosDeCarga";
import { EspecificacoesMateriaisServicos } from "../componentes/sme/Parametrizacoes/Despesas/EspecificacoesMateriaisServicos";
import { TiposDocumento } from "../componentes/sme/Parametrizacoes/Despesas/TiposDocumento";
import { TiposDeCusteio } from "../componentes/sme/Parametrizacoes/Despesas/TiposDeCusteio";
import { TiposDeTransacao } from "../componentes/sme/Parametrizacoes/Despesas/TiposDeTransacao";
import { Fornecedores } from "../componentes/sme/Parametrizacoes/Despesas/Fornecedores";
import { AnaliseDre } from "../componentes/escolas/AnaliseDre";
import { DetalharAcertos } from "../componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/DetalharAcertos";
import DetalharAcertosDocumentos from "../componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeDocumentos/DetalharAcertosDocumentos";
import { ResumoDosAcertos } from "../componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ResumoDosAcertos";
import ConsultaDetalhamentoAnaliseDaDre from "../componentes/escolas/AnaliseDre/ConsultaDetalhamentoAnaliseDaDre";
import CadastroDeMembrosDaAssociacao from "../componentes/escolas/Associacao/Membros/CadastroDeMembrosDaAssociacao";
import { VisualizacaoDaAtaParecerTecnico } from "../componentes/dres/RelatorioConsolidado/AtaParecerTecnico/VisualizacaoAtaParecerTecnico";
import { EdicaoAtaParecerTecnico } from "../componentes/dres/RelatorioConsolidado/AtaParecerTecnico/VisualizacaoAtaParecerTecnico/EdicaoAta";
import { ParametrizacoesMotivosDeEstorno } from "../componentes/sme/Parametrizacoes/Receitas/ParametrizacoesMotivosEstorno";
import { ParametrizacoesTiposAcertosLancamentos } from "../componentes/sme/Parametrizacoes/PrestacaoContas/TiposAcertosLancamentos";
import { ParametrizacoesTiposAcertosDocumentos } from "../componentes/sme/Parametrizacoes/PrestacaoContas/TiposAcertosDocumentos";
import { ParametrizacoesMotivosDevolucaoTesouro } from "../componentes/sme/Parametrizacoes/Dre/ParametrizacoesMotivosDevolucaoTesouro";
import { ParametrizacoesMotivosAprovacaoPcRessalva } from "../componentes/sme/Parametrizacoes/Dre/MotivosAprovacaoPcRessalva";
import { DevolucaoAoTesouroAjuste } from "../componentes/Globais/DevolucaoAoTesouroAjuste";
import { AcompanhamentoDeRelatorioConsolidadoSMEDetalhe } from "../componentes/sme/AcompanhamentoRelatoriosConsolidadosSME/AcompanhamentoDeRelatorioConsolidadoSMEDetalhe";
import { AcompanhamentoDeRelatorioConsolidadoSMEResumoAcertos } from "../componentes/sme/AcompanhamentoRelatoriosConsolidadosSME/AcompanhamentoDeRelatorioConsolidadoSMEResumoAcertos";
import { ExtracaoDadosPage } from "../paginas/ExtracaoDados";
import { GestaoDeUsuariosFormPage } from "../componentes/Globais/GestaoDeUsuariosForm";
import { GestaoDeUsuariosAdicionarUnidadePage } from "../componentes/Globais/GestaoDeUsuariosAdicionarUnidade";
import { Mandatos } from "../componentes/sme/Mandatos";
import { MotivosRejeicaoEncerramentoConta } from "../componentes/sme/Parametrizacoes/Estrutura/MotivosRejeicaoEncerramentoConta";
import { PaginaMandatosAnteriores } from "../componentes/escolas/MembrosDaAssociacao/pages/PaginaMandatosAnteriores";
import { ParametrizacoesRepasses } from "../componentes/sme/Parametrizacoes/Receitas/ParametrizacoesRepasses";
import { MotivosPagamentoAntecipado } from "../componentes/sme/Parametrizacoes/Despesas/MotivosPagamentoAntecipado";
import { TextosPaa } from "../componentes/sme/Parametrizacoes/EdicaoDeTextos/TextosPaa";
import { ElaboracaoPaa } from "../componentes/escolas/Paa/ElaboracaoPaa";
import { ElaborarNovoPlano } from "../componentes/escolas/Paa/ElaboracaoPaa/ElaborarNovoPlano";
import { ExecucaoDoPaa } from "../componentes/escolas/Paa/ExecucaoDoPaa";
import { CadastroTipoReceitaPage } from "../paginas/SME/Parametrizacoes/TiposReceita/CadastroTipoReceita";
import { EdicaoTipoReceitaPage } from "../paginas/SME/Parametrizacoes/TiposReceita/EdicaoTipoReceita";
import { TiposDeCredito } from '../componentes/sme/Parametrizacoes/Receitas/TiposDeCredito';

// Migrando para V6 do react-router-dom
// Referencia: https://github.com/remix-run/react-router/discussions/8753
import { CompatRoute } from "react-router-dom-v5-compat";
import { PaginaCadastroHistoricoDeMembros } from "../componentes/escolas/MembrosDaAssociacao/pages/PaginaCadastroHistoricoDeMembros";
import { ChamaTypescriptFirstComponent } from "../componentes/ChamaTypescriptFirstComponent";
import { PaginaDetalhePrestacaoContaReprovadaNaoApresentacao } from "../componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContasNaoApresentada/pages/PaginaDetalhePrestacaoContaReprovadaNaoApresentacao";

const routesConfig = [
  {
    exact: true,
    path: "/dashboard",
    component: DashboardPage,
    permissoes: ["access_painel_recursos_ue"],
  },
  {
    exact: true,
    path: "/dados-da-associacao",
    component: DadosDaAssociacaoPage,
    permissoes: ["access_dados_associacao", "change_associacao"],
  },
  {
    exact: true,
    path: "/cadastro-de-despesa/:origem?",
    component: CadastroDeDespesa,
    permissoes: ["access_despesa"],
  },
  {
    exact: true,
    path: "/cadastro-de-despesa-recurso-proprio/:uuid_receita?/:uuid_despesa?",
    component: CadastroSaida,
    permissoes: ["access_receita"],
  },
  {
    exact: true,
    path: "/lista-de-despesas",
    component: ListaDeDespesasPage,
    permissoes: ["access_despesa"],
  },
  {
    exact: true,
    path: "/edicao-de-despesa/:associacao/:origem?",
    component: EdicaoDeDespesa,
    permissoes: ["access_despesa"],
  },
  {
    exact: true,
    path: "/cadastro-de-credito/:origem?",
    component: CadastroDeReceita,
    permissoes: ["access_receita"],
  },
  {
    exact: true,
    path: "/edicao-de-receita/:uuid/:origem?",
    component: EdicaoDeReceita,
    permissoes: ["access_receita"],
  },
  {
    exact: true,
    path: "/lista-de-receitas",
    component: ListaDeReceitasPage,
    permissoes: ["access_receita"],
  },
  {
    exact: true,
    path: "/cadastro-de-valores-reprogramados",
    component: ValoresReprogramados,
    permissoes: [
      "access_valores_reprogramados_ue",
      "access_valores_reprogramados_dre",
    ],
  },
  {
    exact: true,
    path: "/membros-da-associacao",
    component: MembrosDaAssociacaoPage,
    permissoes: ["access_dados_associacao", "change_associacao"],
  },
  {
    exact: true,
    path: "/membros-da-associacao-mandato-vigente",
    component: PaginaMandatoVigente,
    permissoes: ["access_dados_associacao", "change_associacao"],
  },
  {
    exact: true,
    path: "/membros-da-associacao-mandatos-anteriores",
    component: PaginaMandatosAnteriores,
    permissoes: ["access_dados_associacao", "change_associacao"],
  },
  {
    exact: true,
    path: "/cadastro-historico-de-membros/:composicaoUuid?",
    component: PaginaCadastroHistoricoDeMembros,
    permissoes: ["access_dados_associacao", "change_associacao"],
  },
  {
    exact: true,
    path: "/cadastro-de-membros-da-associacao/:uuid_membro_associacao?",
    component: CadastroDeMembrosDaAssociacao,
    permissoes: ["access_dados_associacao"],
  },
  {
    exact: true,
    path: "/dados-das-contas-da-associacao",
    component: DadosDasContasPage,
    permissoes: ["access_dados_associacao", "change_associacao"],
  },
  {
    exact: true,
    path: "/prestacao-de-contas/:monitoramento?",
    component: PrestacaoDeContasPage,
    permissoes: ["access_prestacao_contas"],
  },
  {
    exact: true,
    path: "/detalhe-das-prestacoes/:periodo_uuid?/:conta_uuid?/:origem?",
    component: DetalhedasPrestacoesPage,
    permissoes: ["access_prestacao_contas"],
  },
  {
    exact: true,
    path: "/visualizacao-da-ata/:uuid_ata",
    component: VisualizacaoDaAta,
    permissoes: ["access_prestacao_contas"],
  },
  {
    exact: true,
    path: "/devolucao-ao-tesouro-ajuste/",
    component: DevolucaoAoTesouroAjuste,
    permissoes: ["access_prestacao_contas"],
  },
  {
    exact: true,
    path: "/edicao-da-ata/:uuid_ata",
    component: EdicaoAta,
    permissoes: ["access_prestacao_contas"],
  },
  {
    exact: true,
    path: "/meus-dados",
    component: MeusDadosPage,
    permissoes: ["view_default"],
  },
  {
    exact: true,
    path: "/dre-associacoes",
    component: AssociacoesPage,
    permissoes: ["access_associacao_dre"],
  },
  {
    exact: true,
    path: "/dre-valores-reprogramados",
    component: ValoresReprogramadosDrePage,
    permissoes: ["access_valores_reprogramados_dre"],
  },

  {
    exact: true,
    path: "/dre-detalhes-associacao/:origem?/:periodo_uuid?/:conta_uuid?",
    component: DetalhesDaAssociacaoDrePage,
    permissoes: ["access_associacao_dre"],
  },
  {
    exact: true,
    path: "/dre-dados-da-diretoria",
    component: DadosDaDiretoriaDrePage,
    permissoes: ["access_dados_diretoria"],
  },
  {
    exact: true,
    path: "/dre-tecnicos-da-diretoria",
    component: TecnicosDaDiretoriaDrePage,
    permissoes: ["access_tecnicos_da_diretoria"],
  },
  {
    exact: true,
    path: "/dre-comissoes",
    component: ComissoesDrePage,
    permissoes: ["access_comissoes_dre"],
  },
  {
    exact: true,
    path: "/dre-faq",
    component: FaqDrePage,
    permissoes: ["access_faq_dre"],
  },
  {
    exact: true,
    path: "/central-de-notificacoes",
    component: CentralDeNotificacoesPage,
    permissoes: ["view_default"],
  },
  {
    exact: true,
    path: "/central-de-downloads",
    component: CentralDeDownloadsPage,
    permissoes: ["view_default"],
  },
  {
    exact: true,
    path: "/dre-atribuicoes/:tecnico_uuid?",
    component: AtribuicoesPage,
    permissoes: ["access_atribuicao_por_ue"],
  },
  {
    exact: true,
    path: "/dre-dashboard",
    component: DreDashboardPage,
    permissoes: ["access_acompanhamento_pcs_dre"],
  },
  {
    exact: true,
    path: "/dre-lista-prestacao-de-contas/:periodo_uuid?/:status_prestacao?",
    component: ListaPrestacaoDeContas,
    permissoes: ["access_acompanhamento_pcs_dre"],
  },
  {
    exact: true,
    path: "/dre-detalhe-prestacao-de-contas/:prestacao_conta_uuid?",
    component: DetalhePrestacaoDeContas,
    permissoes: ["access_acompanhamento_pcs_dre"],
  },
  {
    exact: true,
    path: "/dre-detalhe-prestacao-de-contas-nao-apresentada",
    component: DetalhePrestacaoDeContasNaoApresentada,
    permissoes: ["access_acompanhamento_pcs_dre"],
  },
  {
    exact: true,
    path: "/dre-detalhe-prestacao-de-contas-detalhar-acertos/:prestacao_conta_uuid",
    component: DetalharAcertos,
    permissoes: ["access_acompanhamento_pcs_dre"],
  },
  {
    exact: true,
    path: "/dre-detalhe-prestacao-de-contas-detalhar-acertos-documentos/:prestacao_conta_uuid",
    component: DetalharAcertosDocumentos,
    permissoes: ["access_acompanhamento_pcs_dre"],
  },
  {
    exact: true,
    path: "/dre-detalhe-prestacao-de-contas-resumo-acertos/:prestacao_conta_uuid?",
    component: ResumoDosAcertos,
    permissoes: ["access_acompanhamento_pcs_dre"],
  },
  {
    exact: true,
    path: "/dre-detalhe-prestacao-de-contas-resumo-acertos/:prestacao_conta_uuid?",
    component: ResumoDosAcertos,
    permissoes: ["access_acompanhamento_pcs_dre"],
  },
  {
    exact: true,
    path: "/suporte-unidades-dre",
    component: SuporteAsUnidadesDre,
    permissoes: ["access_suporte_unidades_dre"],
  },
  {
    exact: true,
    path: "/sem-permissao-de-acesso",
    component: PaginaSemPermissao,
    permissoes: ["view_default"],
  },

  {
    exact: true,
    path: "/gestao-de-perfis",
    component: GestaoDePerfisPage,
    permissoes: [
      "access_gestao_perfis_ue",
      "access_gestao_perfis_dre",
      "access_gestao_perfis_sme",
    ],
  },
  {
    exact: true,
    path: "/gestao-de-usuarios-list",
    component: GestaoDeUsuariosListPage,
    permissoes: [
      "access_gestao_usuarios_ue",
      "change_gestao_usuarios_ue",
      "access_gestao_usuarios_dre",
      "change_gestao_usuarios_dre",
      "access_gestao_usuarios_sme",
      "change_gestao_usuarios_sme",
    ],
    featureFlag: "gestao-usuarios",
  },
  {
    exact: true,
    path: "/gestao-de-usuarios-form/:id_usuario?",
    component: GestaoDeUsuariosFormPage,
    permissoes: [
      "access_gestao_usuarios_ue",
      "change_gestao_usuarios_ue",
      "access_gestao_usuarios_dre",
      "change_gestao_usuarios_dre",
      "access_gestao_usuarios_sme",
      "change_gestao_usuarios_sme",
    ],
    featureFlag: "gestao-usuarios",
  },
  {
    exact: true,
    path: "/gestao-de-usuarios-adicionar-unidade/:id_usuario?",
    component: GestaoDeUsuariosAdicionarUnidadePage,
    permissoes: ["access_gestao_usuarios_sme"],
    featureFlag: "gestao-usuarios",
  },
  {
    exact: true,
    path: "/extracoes-dados",
    component: ExtracaoDadosPage,
    permissoes: ["access_gestao_perfis_dre", "access_extracao_de_dados_sme"],
  },

  {
    exact: true,
    path: "/gestao-de-perfis-form/:id_usuario?",
    component: GestaoDePerfisForm,
    permissoes: [
      "access_gestao_perfis_ue",
      "access_gestao_perfis_dre",
      "access_gestao_perfis_sme",
    ],
  },
  {
    exact: true,
    path: "/parametro-tipos-receita",
    component: TiposDeCredito,
    permissoes: ['access_painel_parametrizacoes', 'change_painel_parametrizacoes'],
  },
  {
    exact: true,
    path: "/dre-relatorio-consolidado",
    component: RelatorioConsolidado,
    permissoes: ["access_relatorio_consolidado_dre"],
  },
  {
    exact: true,
    path: "/visualizacao-da-ata-parecer-tecnico/:uuid_ata/:ja_publicado?",
    component: VisualizacaoDaAtaParecerTecnico,
    permissoes: ["access_relatorio_consolidado_dre"],
  },
  {
    exact: true,
    path: "/edicao-da-ata-parecer-tecnico/:uuid_ata",
    component: EdicaoAtaParecerTecnico,
    permissoes: ["access_relatorio_consolidado_dre"],
  },
  {
    exact: true,
    path: "/dre-relatorio-consolidado-apuracao/:periodo_uuid/:conta_uuid/:ja_publicado?/:consolidado_dre_uuid?",
    component: RelatorioConsolidadoApuracao,
    permissoes: ["access_relatorio_consolidado_dre"],
  },
  {
    exact: true,
    path: "/dre-relatorio-consolidado-em-tela/:periodo_uuid/:ja_publicado?/:consolidado_dre_uuid?",
    component: RelatorioConsolidadoEmTela,
    permissoes: ["access_relatorio_consolidado_dre"],
  },
  {
    exact: true,
    path: "/dre-relatorio-consolidado-dados-das-ues/:periodo_uuid/:conta_uuid/:ja_publicado?",
    component: RelatorioConsolidadoDadosDasUes,
    permissoes: ["access_relatorio_consolidado_dre"],
  },
  {
    exact: true,
    path: "/dre-relatorio-consolidado-retificacao/:relatorio_consolidado_uuid/",
    component: RetificacaoRelatorioConsolidado,
    permissoes: ["access_retificacao_dre"],
  },
  {
    exact: true,
    path: "/parametro-arquivos-de-carga/:tipo_de_carga/:versao?",
    component: ArquivosDeCarga,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
      "access_gestao_usuarios_sme",
      "change_gestao_usuarios_sme",
    ],
  },
  {
    exact: true,
    path: "/painel-parametrizacoes",
    component: PainelParametrizacoesPage,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-associacoes",
    component: Associacoes,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-acoes-associacoes",
    component: AcoesDasAssociacoes,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-contas-associacoes",
    component: ContasDasAssociacoes,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-periodos",
    component: Periodos,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-tags",
    component: Tags,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-tipos-conta",
    component: TiposConta,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-tipos-documento",
    component: TiposDocumento,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-mandato",
    component: Mandatos,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/motivos-rejeicao",
    component: MotivosRejeicaoEncerramentoConta,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/acompanhamento-pcs-sme",
    component: AcompanhamentoPcsSmePage,
    permissoes: ["access_acompanhamento_pc_sme"],
  },
  {
    exact: true,
    path: "/acompanhamento-pcs-sme/:dre_uuid?/:periodo_uuid?",
    component: AcompanhamentoPcsPorDre,
    permissoes: ["access_acompanhamento_pc_sme"],
  },
  {
    exact: true,
    path: "/analises-relatorios-consolidados-dre",
    component: RelatorioConsolidadoPage,
    permissoes: ["access_analise_relatorios_consolidados_sme"],
  },
  {
    exact: true,
    path: "/analise-relatorio-consolidado-dre-detalhe/:consolidado_dre_uuid/",
    component: AcompanhamentoDeRelatorioConsolidadoSMEDetalhe,
    permissoes: ["access_analise_relatorios_consolidados_sme"],
  },
  {
    exact: true,
    path: "/analise-relatorio-consolidado-dre-detalhe-acertos-resumo/:consolidado_dre_uuid/",
    component: AcompanhamentoDeRelatorioConsolidadoSMEResumoAcertos,
    permissoes: ["access_analise_relatorios_consolidados_sme"],
  },
  {
    exact: true,
    path: "/listagem-relatorios-consolidados-dre/:periodo_uuid?/:status_sme?",
    component: AcompanhamentoRelatorioConsolidadosSmeListagem,
    permissoes: ["access_analise_relatorios_consolidados_sme"],
  },
  {
    exact: true,
    path: "/parametro-acoes",
    component: Acoes,
    permissoes: ["access_painel_parametrizacoes"],
  },
  {
    exact: true,
    path: "/parametro-textos-fique-de-olho",
    component: FiqueDeOlho,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-textos-paa",
    component: TextosPaa,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
    featureFlag: "paa",
  },
  {
    exact: true,
    path: "/associacoes-da-acao/:acao_uuid?",
    component: AssociacoesDaAcao,
    permissoes: ["access_painel_parametrizacoes"],
  },
  {
    exact: true,
    path: "/vincula-associacoes-a-acao/:acao_uuid?",
    component: VinculaAssociacoesAAcao,
    permissoes: ["access_painel_parametrizacoes"],
  },
  {
    exact: true,
    path: "/parametro-especificacoes",
    component: EspecificacoesMateriaisServicos,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-tipos-custeio",
    component: TiposDeCusteio,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-tipos-transacao",
    component: TiposDeTransacao,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-Fornecedores",
    component: Fornecedores,
    permissoes: [
      "access_fornecedores",
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-tipos-acertos-lancamentos",
    component: ParametrizacoesTiposAcertosLancamentos,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-tipos-acertos-documentos",
    component: ParametrizacoesTiposAcertosDocumentos,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-motivos-estorno",
    component: ParametrizacoesMotivosDeEstorno,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-repasse",
    component: ParametrizacoesRepasses,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-motivos-devolucao-tesouro",
    component: ParametrizacoesMotivosDevolucaoTesouro,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/parametro-motivos-pc-aprovada-ressalva",
    component: ParametrizacoesMotivosAprovacaoPcRessalva,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/consulta-de-saldos-bancarios/:periodo_uuid?/:conta_uuid?/",
    component: ConsultaDeSaldosBancarios,
    permissoes: ["access_consulta_saldo_bancario"],
  },
  {
    exact: true,
    path: "/consulta-de-saldos-bancarios-detalhes-associacoes/:periodo_uuid/:conta_uuid/:dre_uuid/",
    component: ConsultaDeSaldosBancariosDetalhesAssociacoes,
    permissoes: ["access_consulta_saldo_bancario"],
  },
  {
    exact: true,
    path: "/analise-dre",
    component: AnaliseDre,
    permissoes: ["access_analise_dre"],
  },
  {
    exact: true,
    path: "/consulta-detalhamento-analise-da-dre/:prestacao_conta_uuid?",
    component: ConsultaDetalhamentoAnaliseDaDre,
    permissoes: ["access_analise_dre"],
  },
  {
    exact: true,
    path: "/",
    component: RedirectLoginVisaoUe,
    permissoes: ["view_default"],
  },
  {
    exact: true,
    path: "/regularidade-associacoes",
    component: RegularidadeAssociacoesPage,
    permissoes: ["access_regularidade_dre"],
  },
  {
    exact: true,
    path: "/analises-regularidade-associacao/:associacao_uuid/",
    component: AnalisesRegularidadeAssociacaoPage,
    permissoes: ["access_regularidade_dre"],
  },
  {
    exact: true,
    path: "/suporte-unidades-sme",
    component: SuporteAsUnidadesSme,
    permissoes: ["access_suporte_unidades_sme"],
  },
  {
    exact: true,
    path: "/dre-detalhe-prestacao-de-contas-reprovada-nao-apresentacao/:prestacao_conta_uuid/",
    component: PaginaDetalhePrestacaoContaReprovadaNaoApresentacao,
    permissoes: ["access_acompanhamento_pcs_dre"],
  },
  {
    exact: true,
    path: "/componente-typescript",
    component: ChamaTypescriptFirstComponent,
    permissoes: ["view_default"],
  },
  {
    exact: true,
    path: "/parametro-motivos-pagamento-antecipado",
    component: MotivosPagamentoAntecipado,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/paa",
    component: ElaboracaoPaa,
    permissoes: ["access_paa"],
    featureFlag: "paa",
  },
  {
    exact: true,
    path: "/elaborar-novo-paa",
    component: ElaborarNovoPlano,
    permissoes: ["access_paa", "change_paa"],
    featureFlag: "paa",
  },
  {
    exact: true,
    path: "/execucao-paa",
    component: ExecucaoDoPaa,
    permissoes: ["access_paa"],
    featureFlag: "paa",
  },
  {
    exact: true,
    path: "/cadastro-tipo-de-credito/",
    component: CadastroTipoReceitaPage,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
  {
    exact: true,
    path: "/edicao-tipo-de-credito/:uuid/",
    component: EdicaoTipoReceitaPage,
    permissoes: [
      "access_painel_parametrizacoes",
      "change_painel_parametrizacoes",
    ],
  },
];

const PrivateRouter = (
  { component: Component, ...rest } // eslint-disable-line
) => (
  <Route
    {...rest}
    render={
      (props) =>
        authService.isLoggedIn() ? (
          rest.featureFlag && visoesService.getPermissoes(rest.permissoes) ? (
            <Component {...props} />
          ) : (
            <Route path="*" component={PaginaSemPermissao} />
          )
        ) : (
          window.location.assign("/login")
        )
      /* <Redirect
              to={{ pathname: "/login", state: { from: props.location } }} // eslint-disable-line
            /> */
    }
  />
);

export const Rotas = () => {
  return (
    <Switch>
      {/*
            <Route path="/login" component={Login}/>
            Migrando para V6 do react-router-dom
            Referencia: https://github.com/remix-run/react-router/discussions/8753
            */}
      <CompatRoute path="/login" component={Login} />
      <CompatRoute path="/login-suporte" component={LoginSuporte} />
      <Route
        strict
        path="/esqueci-minha-senha/"
        component={EsqueciMinhaSenhaPage}
      />
      <Route
        exact={true}
        path="/redefinir-senha/:uuid/"
        component={RedefinirSenhaPage}
      />
      {routesConfig.map((value, key) => {
        return (
          <PrivateRouter
            key={key}
            exact={value.exact}
            path={value.path}
            component={value.component}
            permissoes={value.permissoes}
            featureFlag={
              value.featureFlag
                ? visoesService.featureFlagAtiva(value.featureFlag)
                : true
            }
          />
        );
      })}
      <Route path="*" component={Pagina404} />
    </Switch>
  );
};
