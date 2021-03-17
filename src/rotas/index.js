import React from "react";
import {Route, Switch} from 'react-router-dom'
import {Login} from "../paginas/Login";
import {Pagina404} from "../paginas/escolas/404";
import {DashboardPage} from "../paginas/Dashboard";
import {CadastroDeDespesa} from "../paginas/escolas/Despesas/CadastroDeDespesas";
import {EdicaoDeDespesa} from "../paginas/escolas/Despesas/EdicaoDeDespesa";
import {ListaDeDespesasPage} from '../paginas/escolas/Despesas/ListaDeDespesas';
import {CadastroSaida} from "../paginas/escolas/Despesas/CadastroSaida";
import {CadastroDeReceita} from '../paginas/escolas/Receitas/CadastroReceita';
import {EdicaoDeReceita} from '../paginas/escolas/Receitas/EdicaoReceita';
import {ListaDeReceitasPage} from "../paginas/escolas/Receitas/ListaDeReceitas";
import {DadosDaAssociacaoPage} from "../paginas/escolas/Associacao";
import {PrestacaoDeContasPage} from "../paginas/escolas/PrestacaoDeContas";
import {DetalhedasPrestacoesPage} from "../paginas/escolas/DetalheDasPrestacoes";
import {VisualizacaoDaAta} from "../componentes/escolas/GeracaoDaAta/VisualizacaoDaAta";
import {MembrosDaAssociacaoPage} from "../paginas/escolas/MembrosDaAssociacao";
import {ValoresReprogramadosPage} from "../paginas/escolas/ValoresReprogramados";
import {DadosDasContasPage} from "../paginas/escolas/DadosDasContasAssociacao";
import {EsqueciMinhaSenhaPage} from "../paginas/Login/EsqueciMinhaSenha";
import {RedefinirSenhaPage} from "../paginas/Login/RedefinirMinhaSenha";
import {MeusDadosPage} from "../paginas/escolas/MeusDados";
import {AssociacoesPage} from "../paginas/dres/Associacoes";
import {ProcessosSeiPage} from "../paginas/dres/Associacoes/ProcessosSei";
import {CentralDeNotificacoesPage} from "../paginas/CentralDeNotificacoes";
import {authService} from '../services/auth.service';
import {visoesService} from "../services/visoes.service";
import {PaginaSemPermissao} from "../paginas/SemPermissao";
import {GestaoDePerfisPage} from "../paginas/GestaoDePerfis";
import {ConsultaDeSaldosBancarios} from "../componentes/sme/ConsultaDeSaldosBancarios";
// Faz o redirect de acordo com a Visao Selecionada
import {RedirectLoginVisaoUe} from "../utils/RedirectLoginVisaoUe";
import {DadosDaUnidadeEducacionalPage} from "../paginas/dres/Associacoes/DadosDaUnidadeEducacional";
import {DadosDaAssociacaoDrePage} from "../paginas/dres/Associacoes/DadosDaAssociacao";
import {DadosDasContasDrePage} from "../paginas/dres/Associacoes/DadosDasContas";
import {PaginaRegularidadeUnidadeEducacional} from "../paginas/dres/Associacoes/RegularidadeUnidadeEducacional"
import {DadosDaDiretoriaDrePage} from "../paginas/dres/Diretoria/DadosDaDiretoria";
import {TecnicosDaDiretoriaDrePage} from "../paginas/dres/Diretoria/TecnicosDaDiretoria";
import {FaqDrePage} from "../paginas/dres/ApoioDiretoria/Faq";
import {SituacaoFinanceiraUnidadeEducacionalPage} from "../paginas/dres/Associacoes/SituacaoFinanceiraUnidadeEducacional";
import {AtribuicoesPage} from "../paginas/dres/Diretoria/Atribuicoes";
import {DreDashboardPage} from "../paginas/dres/DreDashboard";
import {ListaPrestacaoDeContas} from "../componentes/dres/PrestacaoDeContas/ListaPrestacaoDeContas";
import {DetalhePrestacaoDeContas} from "../componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas";
import {DetalhePrestacaoDeContasNaoApresentada} from "../componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContasNaoApresentada";
import {RelatorioConsolidadoPage} from "../paginas/dres/RelatorioConsolidado";
import {RelatorioConsolidadoApuracao} from "../componentes/dres/RelatorioConsolidado/RelatorioConsolidadoApuracao";
import {RelatorioConsolidadoDadosDasUes} from "../componentes/dres/RelatorioConsolidado/RelatorioConsolidadoDadosDasUes";
import {PainelParametrizacoesPage} from "../paginas/SME/Parametrizacoes/PainelParametrizacoes";
import {AcompanhamentoPcsSmePage} from "../paginas/SME/AcompanhamentoPcsSme";
import {AcoesDasAssociacoes} from "../componentes/sme/Parametrizacoees/Estrutura/AcoesDasAssociacoes";
import {Acoes} from "../componentes/sme/Parametrizacoees/Estrutura/Acoes";
import {AssociacoesDaAcao} from "../componentes/sme/Parametrizacoees/Estrutura/Acoes/AssociacoesDaAcao";
import {VinculaAssociacoesAAcao} from "../componentes/sme/Parametrizacoees/Estrutura/Acoes/VinculaAssociacoesAAcao";
import {Periodos} from "../componentes/sme/Parametrizacoees/Estrutura/Periodos";
import {Associacoes} from "../componentes/sme/Parametrizacoees/Estrutura/Associacoes";
import {Tags} from "../componentes/sme/Parametrizacoees/Estrutura/Tags";
import {FiqueDeOlho} from "../componentes/sme/Parametrizacoees/EdicaoDeTextos/FiqueDeOlho";
import ArquivosDeCarga from "../componentes/Globais/ArquivosDeCarga";
import {TiposDeCusteio} from "../componentes/sme/Parametrizacoees/Despesas/TiposDeCusteio"

const routesConfig = [
    {
        exact: true,
        path: "/dashboard",
        component: DashboardPage,
        permissoes: ['access_painel_recursos_ue', ],
    },
    {
        exact: true,
        path: "/dados-da-associacao",
        component: DadosDaAssociacaoPage,
        permissoes: ['access_dados_associacao'],
    },
    {
        exact: true,
        path: "/cadastro-de-despesa/:origem?",
        component: CadastroDeDespesa,
        permissoes: ['access_despesa'],
    },
    {
        exact: true,
        path: "/cadastro-de-despesa-recurso-proprio/:uuid?",
        component: CadastroSaida,
        permissoes: ['access_receita']
    },
    {
        exact: true,
        path: "/lista-de-despesas",
        component: ListaDeDespesasPage,
        permissoes: ['access_despesa', ],
    },
    {
        exact: true,
        path: "/edicao-de-despesa/:associacao/:origem?",
        component: EdicaoDeDespesa,
        permissoes: ['access_despesa'],
    },
    {
        exact: true,
        path: "/cadastro-de-credito/:origem?",
        component: CadastroDeReceita,
        permissoes: ['access_receita'],
    },
    {
        exact: true,
        path: "/edicao-de-receita/:uuid/:origem?",
        component: EdicaoDeReceita,
        permissoes: ['access_receita'],
    },
    {
        exact: true,
        path: "/lista-de-receitas",
        component: ListaDeReceitasPage,
        permissoes: ['access_receita'],
    },
    {
        exact: true,
        path: "/cadastro-de-valores-reprogramados",
        component: ValoresReprogramadosPage,
        permissoes: ['add_valores_reprogramados'],
    },
    {
        exact: true,
        path: "/membros-da-associacao",
        component: MembrosDaAssociacaoPage,
        permissoes: ['access_dados_associacao'],
    },
    {
        exact: true,
        path: "/dados-das-contas-da-associacao",
        component: DadosDasContasPage,
        permissoes: ['access_dados_associacao'],
    },
    {
        exact: true,
        path: "/prestacao-de-contas",
        component: PrestacaoDeContasPage,
        permissoes: ['access_prestacao_contas'],
    },
    {
        exact: true,
        path: "/detalhe-das-prestacoes",
        component: DetalhedasPrestacoesPage,
        permissoes: ['access_prestacao_contas'],
    },
    {
        exact: true,
        path: "/visualizacao-da-ata/:uuid_ata",
        component: VisualizacaoDaAta,
        permissoes: ['access_prestacao_contas'],
    },
    {
        exact: true,
        path: "/meus-dados",
        component: MeusDadosPage,
        permissoes: ['view_default'],
    },
    {
        exact: true,
        path: "/dre-associacoes",
        component: AssociacoesPage,
        permissoes: ['access_associacao_dre'],
    },
    {
        exact: true,
        path: "/dre-dados-da-unidade-educacional",
        component: DadosDaUnidadeEducacionalPage,
        permissoes: ['access_associacao_dre', 'access_dados_unidade_dre'],
    },
    {
        exact: true,
        path: "/dre-dados-da-associacao",
        component: DadosDaAssociacaoDrePage,
        permissoes: ['access_associacao_dre'],
    },
    {
        exact: true,
        path: "/dre-dados-das-contas",
        component: DadosDasContasDrePage,
        permissoes: ['access_associacao_dre'],
    },
    {
        exact: true,
        path: "/dre-processos-sei",
        component: ProcessosSeiPage,
        permissoes: ['access_associacao_dre'],
    },
    {
        exact: true,
        path: "/dre-dados-da-diretoria",
        component: DadosDaDiretoriaDrePage,
        permissoes: ['access_dados_diretoria'],
    },
    {
        exact: true,
        path: "/dre-regularidade-unidade-educacional",
        component: PaginaRegularidadeUnidadeEducacional,
        permissoes: ['access_associacao_dre', 'access_regularidade_dre'],
    },
    {
        exact: true,
        path: "/dre-situacao-financeira-unidade-educacional",
        component: SituacaoFinanceiraUnidadeEducacionalPage,
        permissoes: ['access_associacao_dre', 'access_situacao_financeira_dre'],
    },
    {
        exact: true,
        path: "/dre-tecnicos-da-diretoria",
        component: TecnicosDaDiretoriaDrePage,
        permissoes: ['access_dados_diretoria'],
    },
    {
        exact: true,
        path: "/dre-faq",
        component: FaqDrePage,
        permissoes: ['access_faq_dre'],
    },
    {
        exact: true,
        path: "/central-de-notificacoes",
        component: CentralDeNotificacoesPage,
        permissoes: ['view_default'],
    },
    {
        exact: true,
        path: "/dre-atribuicoes/:tecnico_uuid?",
        component: AtribuicoesPage,
        permissoes: ['access_dados_diretoria'],
    },
    {
        exact: true,
        path: "/dre-dashboard",
        component: DreDashboardPage,
        permissoes: ['access_acompanhamento_pcs_dre'],
    },
    {
        exact: true,
        path: "/dre-lista-prestacao-de-contas/:periodo_uuid?/:status_prestacao?",
        component: ListaPrestacaoDeContas,
        permissoes: ['access_acompanhamento_pcs_dre'],
    },
    {
        exact: true,
        path: "/dre-detalhe-prestacao-de-contas/:prestacao_conta_uuid?",
        component: DetalhePrestacaoDeContas,
        permissoes: ['access_acompanhamento_pcs_dre'],
    },
    {
        exact: true,
        path: "/dre-detalhe-prestacao-de-contas-nao-apresentada",
        component: DetalhePrestacaoDeContasNaoApresentada,
        permissoes: ['access_acompanhamento_pcs_dre'],
    },

    {
        exact: true,
        path: "/sem-permissao-de-acesso",
        component: PaginaSemPermissao,
        permissoes: ['view_default'],
    },

    {
        exact: true,
        path: "/gestao-de-perfis",
        component: GestaoDePerfisPage,
        permissoes: ['access_gestao_perfis_ue', 'access_gestao_perfis_dre', 'access_gestao_perfis_sme'],
    },

    {
        exact: true,
        path: "/dre-relatorio-consolidado",
        component: RelatorioConsolidadoPage,
        permissoes: ['access_relatorio_consolidado_dre'],
    },

    {
        exact: true,
        path: "/dre-relatorio-consolidado-apuracao/:periodo_uuid/:conta_uuid/",
        component: RelatorioConsolidadoApuracao,
        permissoes: ['access_relatorio_consolidado_dre'],
    },
    {
        exact: true,
        path: "/dre-relatorio-consolidado-dados-das-ues/:periodo_uuid/:conta_uuid/",
        component: RelatorioConsolidadoDadosDasUes,
        permissoes: ['access_relatorio_consolidado_dre'],
    },
    {
        exact: true,
        path: "/parametro-arquivos-de-carga/:tipo_de_carga/",
        component: ArquivosDeCarga,
        permissoes: ['access_arquivos_carga'],
    },
    {
        exact: true,
        path: "/painel-parametrizacoes",
        component: PainelParametrizacoesPage,
        permissoes: ['access_painel_parametrizacoes'],
    },
    {
        exact: true,
        path: "/parametro-associacoes",
        component: Associacoes,
        permissoes: ['access_painel_parametrizacoes'],
    },
    {
        exact: true,
        path: "/parametro-acoes-associacoes",
        component: AcoesDasAssociacoes,
        permissoes: ['access_painel_parametrizacoes'],
    },
    {
        exact: true,
        path: "/parametro-periodos",
        component: Periodos,
        permissoes: ['access_painel_parametrizacoes'],
    },
    {
        exact: true,
        path: "/parametro-tags",
        component: Tags,
        permissoes: ['access_painel_parametrizacoes'],
    },
    {
        exact: true,
        path: "/acompanhamento-pcs-sme",
        component: AcompanhamentoPcsSmePage,
        permissoes: ['access_acompanhamento_pc_sme'],
    },
    {
        exact: true,
        path: "/parametro-acoes",
        component: Acoes,
        permissoes: ['access_painel_parametrizacoes'],
    },
    {
        exact: true,
        path: "/parametro-textos-fique-de-olho",
        component: FiqueDeOlho,
        permissoes: ['access_painel_parametrizacoes'],
    },
    {
        exact: true,
        path: "/associacoes-da-acao/:acao_uuid?",
        component: AssociacoesDaAcao,
        permissoes: ['access_painel_parametrizacoes'],
    },
    {
        exact: true,
        path: "/vincula-associacoes-a-acao/:acao_uuid?",
        component: VinculaAssociacoesAAcao,
        permissoes: ['access_painel_parametrizacoes'],
    },
    {
        exact: true,
        path: "/parametro-tipos-custeio",
        component: TiposDeCusteio,
        permissoes: ['access_painel_parametrizacoes'],
    },
    {
        exact: true,
        path: "/consulta-de-saldos-bancarios",
        component: ConsultaDeSaldosBancarios,
        permissoes: ['access_consulta_saldo_bancario'],
    },
    {
        exact: true,
        path: "/",
        component: RedirectLoginVisaoUe,
        permissoes: ['view_default'],
    },

];

const PrivateRouter = (
    {component: Component, ...rest} // eslint-disable-line
) => (
    <Route
        {...rest}
        render={props =>
            authService.isLoggedIn() ? (

                    visoesService.getPermissoes(rest.permissoes) ? (
                            <Component {...props} />
                        ) :
                        <Route path="*" component={PaginaSemPermissao}/>
                ) :
                window.location.assign("/login")
            /* <Redirect
              to={{ pathname: "/login", state: { from: props.location } }} // eslint-disable-line
            /> */
        }
    />
);

export const Rotas = () => {
    return (
        <Switch>
            <Route path="/login" component={Login}/>
            <Route strict path="/esqueci-minha-senha/" component={EsqueciMinhaSenhaPage}/>
            <Route exact={true} path="/redefinir-senha/:uuid/" component={RedefinirSenhaPage}/>
            {routesConfig.map(
                (value, key) => {
                    return (
                        <PrivateRouter
                            key={key}
                            exact={value.exact}
                            path={value.path}
                            component={value.component}
                            permissoes={value.permissoes}
                        />
                    );
                })}
            <Route path="*" component={Pagina404}/>
        </Switch>
    )
};

