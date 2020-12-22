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
const routesConfig = [
    {
        exact: true,
        path: "/dashboard",
        component: DashboardPage,
        permissoes: ['view_associacao', ],
    },
    {
        exact: true,
        path: "/dados-da-associacao",
        component: DadosDaAssociacaoPage,
        permissoes: ['view_associacao'],
    },
    {
        exact: true,
        path: "/cadastro-de-despesa/:origem?",
        component: CadastroDeDespesa,
        permissoes: ['view_despesa'],
    },
    {
        exact: true,
        path: "/cadastro-de-despesa-recurso-proprio/:uuid?",
        component: CadastroSaida,
        permissoes: ['view_receita']
    },
    {
        exact: true,
        path: "/lista-de-despesas",
        component: ListaDeDespesasPage,
        permissoes: ['view_despesa', ],
    },
    {
        exact: true,
        path: "/edicao-de-despesa/:associacao/:origem?",
        component: EdicaoDeDespesa,
        permissoes: ['view_despesa'],
    },
    {
        exact: true,
        path: "/cadastro-de-credito/:origem?",
        component: CadastroDeReceita,
        permissoes: ['view_receita'],
    },
    {
        exact: true,
        path: "/edicao-de-receita/:uuid/:origem?",
        component: EdicaoDeReceita,
        permissoes: ['view_receita'],
    },
    {
        exact: true,
        path: "/lista-de-receitas",
        component: ListaDeReceitasPage,
        permissoes: ['view_receita'],
    },
    {
        exact: true,
        path: "/cadastro-de-valores-reprogramados",
        component: ValoresReprogramadosPage,
        permissoes: ['permissao_total'],
    },
    {
        exact: true,
        path: "/membros-da-associacao",
        component: MembrosDaAssociacaoPage,
        permissoes: ['view_associacao'],
    },
    {
        exact: true,
        path: "/dados-das-contas-da-associacao",
        component: DadosDasContasPage,
        permissoes: ['view_associacao'],
    },
    {
        exact: true,
        path: "/prestacao-de-contas",
        component: PrestacaoDeContasPage,
        permissoes: ['view_prestacaoconta'],
    },
    {
        exact: true,
        path: "/detalhe-das-prestacoes",
        component: DetalhedasPrestacoesPage,
        permissoes: ['view_prestacaoconta'],
    },
    {
        exact: true,
        path: "/visualizacao-da-ata/:uuid_ata",
        component: VisualizacaoDaAta,
        permissoes: ['view_prestacaoconta'],
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
        permissoes: ['view_associacao_dre'],
    },
    {
        exact: true,
        path: "/dre-dados-da-unidade-educacional",
        component: DadosDaUnidadeEducacionalPage,
        permissoes: ['view_associacao_dre', 'view_dados_unidade_dre'],
    },
    {
        exact: true,
        path: "/dre-dados-da-associacao",
        component: DadosDaAssociacaoDrePage,
        permissoes: ['view_associacao_dre'],
    },
    {
        exact: true,
        path: "/dre-dados-das-contas",
        component: DadosDasContasDrePage,
        permissoes: ['view_associacao_dre'],
    },
    {
        exact: true,
        path: "/dre-processos-sei",
        component: ProcessosSeiPage,
        permissoes: ['view_associacao_dre'],
    },
    {
        exact: true,
        path: "/dre-dados-da-diretoria",
        component: DadosDaDiretoriaDrePage,
        permissoes: ['view_dadosdiretoria_dre'],
    },
    {
        exact: true,
        path: "/dre-regularidade-unidade-educacional",
        component: PaginaRegularidadeUnidadeEducacional,
        permissoes: ['view_associacao_dre', 'view_regularidade_dre'],
    },
    {
        exact: true,
        path: "/dre-situacao-financeira-unidade-educacional",
        component: SituacaoFinanceiraUnidadeEducacionalPage,
        permissoes: ['view_associacao_dre', 'view_situacao_financeira_dre'],
    },
    {
        exact: true,
        path: "/dre-tecnicos-da-diretoria",
        component: TecnicosDaDiretoriaDrePage,
        permissoes: ['view_dadosdiretoria_dre'],
    },
    {
        exact: true,
        path: "/dre-faq",
        component: FaqDrePage,
        permissoes: ['view_dadosdiretoria_dre'],
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
        permissoes: ['view_dadosdiretoria_dre'],
    },
    {
        exact: true,
        path: "/dre-dashboard",
        component: DreDashboardPage,
        permissoes: ['view_dashboard_dre'],
    },
    {
        exact: true,
        path: "/dre-lista-prestacao-de-contas/:periodo_uuid?/:status_prestacao?",
        component: ListaPrestacaoDeContas,
        permissoes: ['view_dashboard_dre'],
    },
    {
        exact: true,
        path: "/dre-detalhe-prestacao-de-contas/:prestacao_conta_uuid?",
        component: DetalhePrestacaoDeContas,
        permissoes: ['view_dashboard_dre'],
    },
    {
        exact: true,
        path: "/dre-detalhe-prestacao-de-contas-nao-apresentada",
        component: DetalhePrestacaoDeContasNaoApresentada,
        permissoes: ['view_dashboard_dre'],
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
        permissoes: ['view_default'],
    },

    {
        exact: true,
        path: "/dre-relatorio-consolidado",
        component: RelatorioConsolidadoPage,
        permissoes: ['view_dashboard_dre'],
    },

    {
        exact: true,
        path: "/dre-relatorio-consolidado-apuracao/:periodo_uuid/:conta_uuid/",
        component: RelatorioConsolidadoApuracao,
        permissoes: ['view_dashboard_dre'],
    },
    {
        exact: true,
        path: "/dre-relatorio-consolidado-dados-das-ues/:periodo_uuid/:conta_uuid/",
        component: RelatorioConsolidadoDadosDasUes,
        permissoes: ['view_dashboard_dre'],
    },
    {
        exact: true,
        path: "/painel-parametrizacoes",
        component: PainelParametrizacoesPage,
        permissoes: ['view_default'],
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

