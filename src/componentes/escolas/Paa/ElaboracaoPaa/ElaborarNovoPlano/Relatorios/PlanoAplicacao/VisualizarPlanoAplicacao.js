import { Typography } from "antd";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { formatMoneyBRL } from "../../../../../../../utils/money";
import { useGetPlanoAplicacao } from "./hooks/useGetPlanoAplicacao";
import { MsgImgCentralizada } from "../../../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../../../assets/img/img-404.svg";
import { RelatorioTabelaGrupo } from "../components/RelatorioTabelaGrupo";
import { RelatorioVisualizacao } from "../components/RelatorioVisualizacao";
import "./styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useGetPaa } from "../../../../componentes/hooks/useGetPaa";
import { PaaContext, usePaaContext } from "../../../../componentes/PaaContext";
import { TagRetificacao } from "../../../../componentes/TagRetificacao";
const { Text } = Typography;

const columnsDefinition = (ehOutrosRecursos = false) => [
  {
    title: ehOutrosRecursos ? "Recursos" : "Ação",
    dataIndex: "acao",
    key: "acao",
    render: (_, record) => (
      <Text>
        {record.isTotal ? "TOTAL" : record.acao || "-"}
        {record?.alteracao && <div><TagRetificacao /></div>}
      </Text>
    ),
    width: 200,
  },
  {
    title: "Tipo de aplicação",
    dataIndex: ["tipo_aplicacao_objeto", "value"],
    key: "tipo_aplicacao",
    render: (_, record) =>
      record.isTotal ? "" : record?.tipo_aplicacao_objeto?.value || "-",
    width: 180,
  },
  {
    title: "Tipo de despesa",
    dataIndex: ["tipo_despesa_custeio_objeto", "nome"],
    key: "tipo_despesa",
    render: (_, record) =>
      record.isTotal ? "" : record?.tipo_despesa_custeio_objeto?.nome || "-",
    width: 220,
  },
  {
    title: "Especificação do bem, material ou serviço",
    dataIndex: ["especificacao_material_objeto", "nome"],
    key: "especificacao_material",
    render: (_, record) =>
      record.isTotal ? "" : record?.especificacao_material_objeto?.nome || "-",
    width: 300,
  },
  {
    title: "Valor Total",
    dataIndex: "valor_total",
    key: "valor_total",
    render: (valor, record) => {
      if (valor || valor === 0) return formatMoneyBRL(valor);
      return record.isTotal ? formatMoneyBRL(0) : "-";
    },
    align: "end",
    width: 160,
  },
];

const VisualizarPlanoAplicacaoContent = () => {
  const navigate = useNavigate();
  const { paa, isFetching: isLoadingPaa } = usePaaContext();

  const { isFetching, data: grupos, isError } = useGetPlanoAplicacao(paa?.uuid);

  const columns = useCallback(
    (grupo) => columnsDefinition(grupo.ehOutrosRecursos),
    []
  );

  const handleVoltar = () => {
    let voltarRota = "/elaborar-novo-paa";

    if (paa?.status === "EM_RETIFICACAO") {
      voltarRota =`/retificacao-paa/${paa?.uuid}`;
    }
    navigate(voltarRota, {
      state: {
        activeTab: "relatorios",
        expandedSections: {
          planoAnual: true,
          componentes: true,
        },
      },
    });
  };

  const handleEditarInformacoes = () => {
    let voltarRota = "/elaborar-novo-paa";

    if (paa?.status === "EM_RETIFICACAO") {
      voltarRota =`/retificacao-paa/${paa?.uuid}`;
    }
    navigate(voltarRota, {
      state: {
        activeTab: "prioridades-list",
        fromPlanoAplicacao: true,
      },
    });
  };

  const shouldShowError = !isFetching && isError;
  const shouldShowEmpty = !isFetching && !isError && !grupos?.length;

  const conteudo = grupos?.length ? (
    <div className="relatorio-visualizacao__sections">
      {grupos.map((grupo) => (
        <RelatorioTabelaGrupo
          key={grupo.key}
          title={grupo.titulo}
          columns={columns(grupo)}
          dataSource={grupo.dados}
          rowKey={(record) => record.uuid || record.key}
          tableProps={{
            className: "relatorio-plano-aplicacao__table",
            rowClassName: (record) =>
              record.isTotal
                ? "relatorio-plano-aplicacao__table-total-row"
                : "",
          }}
        />
      ))}
    </div>
  ) : null;

  return (
    <RelatorioVisualizacao
      title="Plano de Aplicação"
      onBack={handleVoltar}
      isLoading={isFetching || isLoadingPaa}
      error={shouldShowError}
      errorContent={
        <MsgImgCentralizada
          texto="Não foi possível carregar as prioridades."
          img={Img404}
          dataQa="plano-aplicacao-erro"
        />
      }
      isEmpty={shouldShowEmpty}
      emptyContent={
        <MsgImgCentralizada
          texto="Nenhum resultado encontrado."
          img={Img404}
          dataQa="plano-aplicacao-sem-resultados"
        />
      }
      className="relatorio-plano-aplicacao"
      contentClassName="relatorio-plano-aplicacao__content"
      titleClassName="relatorio-plano-aplicacao__title"
      backButtonClassName="relatorio-plano-aplicacao__back-button"
      headerActions={
        <button
          type="button"
          className="btn btn-success relatorio-plano-aplicacao__edit-button"
          onClick={handleEditarInformacoes}
        >
          <FontAwesomeIcon
            icon={faEdit}
            className="relatorio-plano-aplicacao__edit-icon"
          />
          Editar informações
        </button>
      }
      heightDeps={[grupos, isFetching, isError]}
    >
      {conteudo}
    </RelatorioVisualizacao>
  );
};

export const VisualizarPlanoAplicacao = () => {
  const paa_uuid_storage = localStorage.getItem('PAA');
  
  const { data: paa, refetch, isFetching } = useGetPaa(paa_uuid_storage);

  const renderizar = useCallback(() => {
    if (!paa) return <></>;

    return (
      <PaaContext.Provider value={{ paa, refetch, isFetching }}>
        <VisualizarPlanoAplicacaoContent />
      </PaaContext.Provider>
    )
  }, [paa, refetch, isFetching]);

  return renderizar();
};