import { Tag, Typography } from "antd";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatMoneyBRL } from "../../../../../../../utils/money";
import { useGetPrioridadesRelatorio } from "./hooks/useGetPrioridadesRelatorio";
import { MsgImgCentralizada } from "../../../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../../../assets/img/img-404.svg";
import { RelatorioTabelaGrupo } from "../components/RelatorioTabelaGrupo";
import { RelatorioVisualizacao } from "../components/RelatorioVisualizacao";
import "./styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
const { Text } = Typography;

const columnsDefinition = () => [
  {
    title: "Ação",
    dataIndex: "acao",
    key: "acao",
    render: (_, record) => (
      <Text>{record.isTotal ? "TOTAL" : record.acao || "-"}</Text>
    ),
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
  },
  {
    title: "Valor Total",
    dataIndex: "valor_total",
    key: "valor_total",
    render: (valor, record) =>
      valor || valor === 0
        ? formatMoneyBRL(valor)
        : record.isTotal
        ? formatMoneyBRL(0)
        : "-",
    align: "center",
    width: 160,
  },
];

export const VisualizarPlanoAplicacao = () => {
  const navigate = useNavigate();
  const { isFetching, prioridades, isError } = useGetPrioridadesRelatorio();

  const columns = useMemo(() => columnsDefinition(), []);

  const grupos = useMemo(() => {
    const configuracoes = [
      {
        key: "prioridades-ptrf",
        titulo: "Prioridades PTRF",
        filtro: (item) => item.prioridade && item.recurso === "PTRF",
      },
      {
        key: "prioridades-pdde",
        titulo: "Prioridades PDDE",
        filtro: (item) => item.prioridade && item.recurso === "PDDE",
      },
      {
        key: "prioridades-recurso-proprio",
        titulo: "Prioridades Recursos próprios",
        filtro: (item) => item.prioridade && item.recurso === "RECURSO_PROPRIO",
      },
      {
        key: "nao-prioridades-ptrf",
        titulo: "Não Prioridades PTRF",
        filtro: (item) => !item.prioridade && item.recurso === "PTRF",
      },
      {
        key: "nao-prioridades-pdde",
        titulo: "Não Prioridades PDDE",
        filtro: (item) => !item.prioridade && item.recurso === "PDDE",
      },
      {
        key: "nao-prioridades-recurso-proprio",
        titulo: "Não Prioridades Recursos próprios",
        filtro: (item) => !item.prioridade && item.recurso === "RECURSO_PROPRIO",
      },
    ];

    return configuracoes.map((config) => {
      const itens = prioridades.filter(config.filtro);
      if (!itens.length) {
        return null;
      }
      const total = itens.reduce(
        (acc, item) => acc + (item.valor_total ? Number(item.valor_total) : 0),
        0
      );

      const dados = [
        ...itens,
        {
          key: `${config.key}-total`,
          isTotal: true,
          prioridade: true,
          valor_total: total,
        },
      ];

      return {
        ...config,
        dados,
      };
    }).filter(Boolean);
  }, [prioridades]);

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

  const handleEditarInformacoes = () => {
    navigate("/elaborar-novo-paa", {
      state: {
        activeTab: "prioridades-list",
        fromPlanoAplicacao: true,
      },
    });
  };

  const shouldShowError = !isFetching && isError;
  const shouldShowEmpty = !isFetching && !isError && !grupos.length;

  const conteudo = grupos.length ? (
    <div className="relatorio-visualizacao__sections">
      {grupos.map((grupo) => (
        <RelatorioTabelaGrupo
          key={grupo.key}
          title={grupo.titulo}
          columns={columns}
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
      isLoading={isFetching}
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
          <FontAwesomeIcon icon={faEdit} className="relatorio-plano-aplicacao__edit-icon" />
          Editar informações
        </button>
      }
      heightDeps={[grupos, isFetching, isError]}
    >
      {conteudo}
    </RelatorioVisualizacao>
  );
};

