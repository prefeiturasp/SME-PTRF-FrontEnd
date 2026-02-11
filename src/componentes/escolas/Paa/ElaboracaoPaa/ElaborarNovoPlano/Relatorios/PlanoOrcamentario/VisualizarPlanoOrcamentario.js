import { Button } from "antd";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RelatorioTabelaGrupo } from "../components/RelatorioTabelaGrupo";
import { RelatorioVisualizacao } from "../components/RelatorioVisualizacao";
import { MsgImgCentralizada } from "../../../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../../../assets/img/img-404.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { formatMoneyBRL } from "../../../../../../../utils/money";
import "./styles.scss";
import { useGetPlanoOrcamentario } from "./hooks/useGetPlanoOrcamentario";

const formatResumo = (
  valores,
  classeBase,
  {
    useStrong = true,
    hideCusteioCapital = false,
    isDespesa = false,
    linha = null,
  } = {}
) => {
  if (!valores) return null;

  const Wrapper = useStrong ? "strong" : "span";

  const podeExibirCategoria = (categoria) => {
    if (!linha) return true;

    const mapaFlags = {
      custeio: "exibirCusteio",
      capital: "exibirCapital",
      livre: "exibirLivre",
    };

    const flagKey = mapaFlags[categoria];
    if (!flagKey) return true;

    const flag = linha[flagKey];
    if (flag === false) return false;
    return true;
  };

  const formatCategoria = (valor, categoria) => {
    if (!podeExibirCategoria(categoria)) {
      return null;
    }

    if (isDespesa) {
      return formatMoneyBRL(valor);
    }

    return hideCusteioCapital &&
      (categoria === "custeio" || categoria === "capital")
      ? "-"
      : formatMoneyBRL(valor);
  };

  const valorLivre =
    !podeExibirCategoria("livre")
      ? null
      : isDespesa
      ? "-"
      : formatMoneyBRL(valores.livre);

  const elementos = [];

  const valorCusteio = formatCategoria(valores.custeio, "custeio");
  if (valorCusteio !== null) {
    elementos.push(<Wrapper key="custeio">{valorCusteio}</Wrapper>);
  }

  const valorCapital = formatCategoria(valores.capital, "capital");
  if (valorCapital !== null) {
    elementos.push(<Wrapper key="capital">{valorCapital}</Wrapper>);
  }

  if (valorLivre !== null) {
    elementos.push(<Wrapper key="livre">{valorLivre}</Wrapper>);
  }

  if (!elementos.length) {
    return null;
  }

  return (
    <div className={classeBase}>
      {elementos}
    </div>
  );
};

const formatResumoTotal = (valores, classeBase) => {
  if (!valores) return null;

  return (
    <div className={`${classeBase} ${classeBase}--total`}>
      <span>{formatMoneyBRL(valores.total)}</span>
    </div>
  );
};

const montarColunas = () => [
  {
    title: "Recursos",
    dataIndex: "nome",
    key: "nome",
    render: (nome, linha) => (
      <span
        className={`relatorio-plano-orcamentario__recurso${
          linha?.isTotal ? " relatorio-plano-orcamentario__recurso--total" : ""
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
    render: (_, linha) => {
      if (linha?.isTotal) return null;

      const labels = [];

      const podeMostrar = (flagKey) => {
        const flag = linha?.[flagKey];
        return flag !== false;
      };

      if (podeMostrar("exibirCusteio")) {
        labels.push(<span key="custeio">Custeio (R$)</span>);
      }
      if (podeMostrar("exibirCapital")) {
        labels.push(<span key="capital">Capital (R$)</span>);
      }
      if (podeMostrar("exibirLivre")) {
        labels.push(<span key="livre">Livre Aplicação (R$)</span>);
      }

      if (!labels.length) return null;

      return (
        <div className="relatorio-plano-orcamentario__receitas-despesas-labels">
          {labels}
        </div>
      );
    },
    width: 180,
  },
  {
    title: "Receitas",
    dataIndex: "receitas",
    key: "receitas",
    align: "right",
    render: (receitas, linha) =>
      linha?.isTotal
        ? formatResumoTotal(receitas, "relatorio-plano-orcamentario__receitas")
        : formatResumo(receitas, "relatorio-plano-orcamentario__receitas", {
            useStrong: false,
            hideCusteioCapital: linha.ocultarCusteioCapital,
            linha,
          }),
    width: 220,
  },
  {
    title: "Despesas",
    dataIndex: "despesas",
    key: "despesas",
    align: "right",
    render: (despesas, linha) =>
      linha?.isTotal
        ? formatResumoTotal(despesas, "relatorio-plano-orcamentario__despesas")
        : formatResumo(despesas, "relatorio-plano-orcamentario__despesas", {
            useStrong: false,
            hideCusteioCapital: linha.ocultarCusteioCapital,
            isDespesa: true,
            linha,
          }),
    width: 220,
  },
  {
    title: "Saldo",
    dataIndex: "saldos",
    key: "saldo",
    align: "right",
    render: (saldos, linha) =>
      linha?.isTotal
        ? formatResumoTotal(saldos, "relatorio-plano-orcamentario__saldos")
        : formatResumo(saldos, "relatorio-plano-orcamentario__saldos", {
            hideCusteioCapital: linha.ocultarCusteioCapital,
            linha,
          }),
    width: 220,
  },
];

export const VisualizarPlanoOrcamentario = () => {
  const navigate = useNavigate();
  const paaUUID = localStorage.getItem("PAA");
  const colunas = useMemo(montarColunas, []);
  
  const { 
    data: planoOrcamentarioData = {}, 
    isLoading: isCarregandoPlanoOrcamentario, 
    isFetching: isBuscandoPlanoOrcamentario,
    isError: erroPlanoOrcamentario 
  } = useGetPlanoOrcamentario(paaUUID);

  // Extrai seções do plano orçamentário retornado pelo backend
  const secoes = useMemo(() => {
    return planoOrcamentarioData?.secoes || [];
  }, [planoOrcamentarioData]);

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

  const carregando = isCarregandoPlanoOrcamentario || isBuscandoPlanoOrcamentario;
  const erro = erroPlanoOrcamentario;

  const secoesComAcoes = new Set(["ptrf", "pdde", "outros_recursos"]);

  const destinosReceitasPorSecao = {
    ptrf: "ptrf",
    pdde: "pdde",
    outros_recursos: "recursos-proprios",
  };

  const obterDestinoReceitaPorSecao = (secaoKey) =>
    destinosReceitasPorSecao[secaoKey] || null;

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
            rowKey={(linha) => linha?.key}
            headerExtra={
              !possuiAcoes ? null : (
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
                  <Button
                    className="btn btn-success"
                    onClick={handleIrParaPrioridades}
                  >
                    Editar prioridades
                  </Button>
                </div>
              )
            }
            tableProps={{
              className: "relatorio-plano-orcamentario__table",
              rowClassName: (linha) =>
                linha?.isTotal
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
