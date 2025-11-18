import { Button } from "antd";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RelatorioTabelaGrupo } from "../components/RelatorioTabelaGrupo";
import { RelatorioVisualizacao } from "../components/RelatorioVisualizacao";
import { useGetReceitasPrevistas } from "../../ReceitasPrevistas/hooks/useGetReceitasPrevistas";
import { useGetPrioridadesRelatorio } from "../PlanoAplicacao/hooks/useGetPrioridadesRelatorio";
import { useGetProgramasPddeTotais } from "../../ReceitasPrevistas/hooks/useGetProgramasPddeTotais";
import { useGetTotalizadorRecursoProprio } from "../../DetalhamentoRecursosProprios/hooks/useGetTotalizarRecursoProprio";
import { MsgImgCentralizada } from "../../../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../../../assets/img/img-404.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { ASSOCIACAO_UUID } from "../../../../../../../services/auth.service";
import { planoOrcamentarioUtils } from "./utils";
import "./styles.scss";

const {
  prioridades: prioridadesUtils,
  format: { resumo: formatResumo, total: formatResumoTotal },
  construirSecoes,
} = planoOrcamentarioUtils;

const montarColunas = () => [
  {
    title: "Recursos",
    dataIndex: "nome",
    key: "nome",
    render: (nome, linha) => (
      <span
        className={`relatorio-plano-orcamentario__recurso${
          linha.isTotal ? " relatorio-plano-orcamentario__recurso--total" : ""
        }`}
      >
        {nome}
      </span>
    ),
    width: 200,
  },
  {
    title: "",
    key: "receitas-despesas-legendas",
    align: "left",
    render: (_, linha) =>
      linha.isTotal ? null : (
        <div className="relatorio-plano-orcamentario__receitas-despesas-labels">
          <span>Custeio (R$)</span>
          <span>Capital (R$)</span>
          <span>Livre Aplicação (R$)</span>
        </div>
      ),
    width: 180,
  },
  {
    title: "Receitas",
    dataIndex: "receitas",
    key: "receitas",
    align: "right",
    render: (receitas, linha) =>
      linha.isTotal
        ? formatResumoTotal(
            receitas,
            "relatorio-plano-orcamentario__receitas"
          )
        : formatResumo(
            receitas,
            "relatorio-plano-orcamentario__receitas",
            {
              useStrong: false,
              hideCusteioCapital: linha.ocultarCusteioCapital,
            }
          ),
    width: 220,
  },
  {
    title: "Despesas",
    dataIndex: "despesas",
    key: "despesas",
    align: "right",
    render: (despesas, linha) =>
      linha.isTotal
        ? formatResumoTotal(
            despesas,
            "relatorio-plano-orcamentario__despesas"
          )
        : formatResumo(
            despesas,
            "relatorio-plano-orcamentario__despesas",
            {
              useStrong: false,
              hideCusteioCapital: linha.ocultarCusteioCapital,
              isDespesa: true,
            }
          ),
    width: 220,
  },
  {
    title: "Saldo",
    dataIndex: "saldos",
    key: "saldo",
    align: "right",
    render: (saldos, linha) =>
      linha.isTotal
        ? formatResumoTotal(saldos, "relatorio-plano-orcamentario__saldos")
        : formatResumo(saldos, "relatorio-plano-orcamentario__saldos", {
            hideCusteioCapital: linha.ocultarCusteioCapital,
          }),
    width: 220,
  },
];
const agruparPrioridadesPorRecurso = prioridadesUtils.agruparPorRecurso;

export const VisualizarPlanoOrcamentario = () => {
  const navigate = useNavigate();
  const associacaoUuid = localStorage.getItem(ASSOCIACAO_UUID);
  const colunas = useMemo(montarColunas, []);
  const {
    data: receitas = [],
    isLoading: isCarregandoReceitas,
    isFetching: isBuscandoReceitas,
    isError: erroReceitas,
  } = useGetReceitasPrevistas();

  const {
    prioridades = [],
    isFetching: carregandoPrioridades,
    isError: erroPrioridades,
  } = useGetPrioridadesRelatorio();

  const {
    programas: programasPdde = [],
    isLoading: isCarregandoProgramasPdde,
    isError: erroProgramasPdde,
  } = useGetProgramasPddeTotais();
  const {
    data: totalRecursosPropriosData,
    isLoading: isCarregandoTotalRecursos,
    isError: erroTotalRecursos,
  } = useGetTotalizadorRecursoProprio(associacaoUuid);

  const totalRecursosPropriosValor = useMemo(() => {
    const total = totalRecursosPropriosData?.total;
    return total === undefined || total === null
      ? null
      : planoOrcamentarioUtils.numero(total);
  }, [totalRecursosPropriosData]);

  const prioridadesAgrupadas = useMemo(
    () => agruparPrioridadesPorRecurso(prioridades),
    [prioridades]
  );

  const secoes = useMemo(
    () =>
      construirSecoes(
        receitas,
        prioridadesAgrupadas,
        totalRecursosPropriosValor,
        programasPdde
      ),
    [
      receitas,
      prioridadesAgrupadas,
      totalRecursosPropriosValor,
      programasPdde,
    ]
  );

  const handleVoltar = () => {
    navigate("/elaborar-novo-paa", {
      state: {
        activeTab: "relatorios",
        expandedSections: {
          planoAnual: true,
          componentes: true,
        },
      },
    });
  };

  const handleIrParaReceitas = (destino) =>
    navigate("/elaborar-novo-paa", {
      state: {
        activeTab: "receitas",
        receitasDestino: destino,
        fromPlanoOrcamentario: true,
      },
    });

  const handleIrParaPrioridades = () =>
    navigate("/elaborar-novo-paa", {
      state: {
        activeTab: "prioridades-list",
        fromPlanoOrcamentario: true,
      },
    });

  const carregando =
    isCarregandoReceitas ||
    isBuscandoReceitas ||
    carregandoPrioridades ||
    isCarregandoProgramasPdde ||
    isCarregandoTotalRecursos;

  const erro =
    erroReceitas ||
    erroPrioridades ||
    erroProgramasPdde ||
    erroTotalRecursos;

  const secoesComAcoes = new Set(["ptrf", "pdde", "recurso_proprio"]);

  const destinosReceitasPorSecao = {
    ptrf: "ptrf",
    pdde: "pdde",
    recurso_proprio: "recursos-proprios",
  };

  const obterDestinoReceitaPorSecao = (secaoKey) => destinosReceitasPorSecao[secaoKey] || null;

  const conteudo = secoes.length ? (
    <div className="relatorio-visualizacao__sections">
      {secoes.map((secao) => {
        const destinoReceitas = obterDestinoReceitaPorSecao(secao.key);
        const possuiAcoes = secoesComAcoes.has(secao.key);

        return (
          <RelatorioTabelaGrupo
            key={secao.key}
            title={secao.titulo}
            dataSource={secao.linhas}
            columns={colunas}
            rowKey={(linha) => linha.key}
            headerExtra={
              !possuiAcoes
                ? null
                : (
                  <div className="relatorio-plano-orcamentario__actions">
                    {destinoReceitas && (
                      <Button
                        className="btn btn-success"
                        onClick={() => handleIrParaReceitas(destinoReceitas)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                        Editar receitas
                      </Button>
                    )}
                    <Button className="btn btn-success" onClick={handleIrParaPrioridades}>
                      Editar prioridades
                    </Button>
                  </div>
                )
            }
            tableProps={{
              className: "relatorio-plano-orcamentario__table",
              rowClassName: (linha) =>
                linha.isTotal
                  ? "relatorio-plano-orcamentario__table-total-row"
                  : "",
            }}
          />
        );
      })}
    </div>
  ) : null;

  return (
    <RelatorioVisualizacao
      title="Plano Orçamentário"
      onBack={handleVoltar}
      isLoading={carregando}
      error={erro}
      errorContent={
        <MsgImgCentralizada
          texto="Não foi possível carregar o plano Orçamentário."
          img={Img404}
          dataQa="plano-orcamentario-erro"
        />
      }
      isEmpty={!secoes.length}
      emptyContent={
        <MsgImgCentralizada
          texto="Nenhum resultado encontrado."
          img={Img404}
          dataQa="plano-orcamentario-vazio"
        />
      }
      className="relatorio-plano-orcamentario"
      contentClassName="relatorio-plano-orcamentario__content"
      titleClassName="relatorio-plano-orcamentario__title"
      backButtonClassName="relatorio-plano-orcamentario__back-button"
      heightDeps={[secoes, carregando, erro]}
    >
      {conteudo}
    </RelatorioVisualizacao>
  );
};


