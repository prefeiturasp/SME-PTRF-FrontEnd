import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Table } from "antd";
import { RelatorioTabelaGrupo } from "../components/RelatorioTabelaGrupo";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { useGetRecursosPropriosPrevistos } from "./hooks/useGetRecursosPropriosPrevistos";
import { TagRetificacao } from "../../../../componentes/TagRetificacao";
import { IconButton } from "../../../../../../Globais/UI/Button";
import { Icon } from "../../../../../../Globais/UI/Icon";
import { deleteRecursoProprioPaa } from "../../../../../../../services/escolas/Paa.service";
import { ModalConfirmarExclusao } from "../../../../../../sme/Parametrizacoes/componentes/ModalConfirmarExclusao";
import { visoesService } from "../../../../../../../services/visoes.service";
import { getErrorMessage } from "../../../../../../../utils/obtemMsgErroAxios";
import "./styles.scss";


export const RecursosProprios = ({paa}) => {
  const navigate = useNavigate();

  const podeEditar = visoesService.getPermissoes(["custom_change_paa"]);

  const {
    data: recursosProprios = [],
    isLoading: isLoadingRecursos,
    refetch: refetchRecursos,
  } = useGetRecursosPropriosPrevistos();
  const [recursosPropriosTabela, setRecursosPropriosTabela] = useState([]);
  const carregouRecursosIniciais = useRef(false);
  const deveSincronizarRecursos = useRef(false);
  const [modalExcluirRecurso, setModalExcluirRecurso] = useState({
    aberto: false,
    recurso: null,
  });
  const [isExcluindoRecurso, setIsExcluindoRecurso] = useState(false);

  useEffect(() => {
    if (isLoadingRecursos) {
      return;
    }

    if (!carregouRecursosIniciais.current || deveSincronizarRecursos.current) {
      const lista = Array.isArray(recursosProprios) ? recursosProprios : [];
      const recursosFormatados = lista.map((item) => ({
        ...item,
        tipoAtividade: item?.fonte_recurso?.nome || "-",
        data: item?.data_prevista || "",
        valor: Number(item?.valor) || 0,
        emEdicao: false,
        isNovo: false,
        needsSync: false,
        _destroy: false,
      }));
      setRecursosPropriosTabela(recursosFormatados);
      carregouRecursosIniciais.current = true;
      deveSincronizarRecursos.current = false;
    }
  }, [recursosProprios, isLoadingRecursos]);

  const handleEditarRecursosProprios = useCallback(() => {
    let voltarRota = "/elaborar-novo-paa";

    if (paa?.status === "EM_RETIFICACAO") {
      voltarRota =`/retificacao-paa/${paa?.uuid}`;
    }
    navigate(voltarRota, {
      state: {
        activeTab: "receitas",
        receitasDestino: "recursos-proprios",
        fromRecursosPropriosRelatorio: true,
        fromAtividadesPrevistas: true,
      },
    });
  }, [navigate, paa?.uuid, paa?.status]);

  const handleExcluirRecursoProprio = useCallback(
    (recurso) => {
      if (!podeEditar) return;
      setModalExcluirRecurso({ aberto: true, recurso });
    },
    [podeEditar],
  );

  const confirmarExclusaoRecursoProprio = useCallback(async () => {
    if (!podeEditar || isExcluindoRecurso) {
      return;
    }

    const recurso = modalExcluirRecurso.recurso;
    if (!recurso) {
      return;
    }

    try {
      setIsExcluindoRecurso(true);

      if (recurso.isNovo) {
        setRecursosPropriosTabela((prev) =>
          prev.filter((item) => item.uuid !== recurso.uuid),
        );
        toastCustom.ToastCustomSuccess(
          "Sucesso!",
          "Recurso próprio excluído com sucesso.",
        );
      } else {
        if (!recurso.uuid) {
          throw new Error("Identificador do recurso próprio não encontrado.");
        }

        await deleteRecursoProprioPaa(recurso.uuid);
        toastCustom.ToastCustomSuccess(
          "Sucesso!",
          "Recurso próprio excluído com sucesso.",
        );

        deveSincronizarRecursos.current = true;
        await refetchRecursos();

        setRecursosPropriosTabela((prev) =>
          prev.filter((item) => item.uuid !== recurso.uuid),
        );
      }
    } catch (error) {
      console.error("Erro ao excluir recurso próprio:", error);
      const mensagemErro = getErrorMessage(error, "Não foi possível excluir o recurso próprio. Tente novamente.");
      toastCustom.ToastCustomError(mensagemErro);
    } finally {
      setIsExcluindoRecurso(false);
      setModalExcluirRecurso({ aberto: false, recurso: null });
    }
  }, [
    isExcluindoRecurso,
    modalExcluirRecurso.recurso,
    refetchRecursos,
    podeEditar,
  ]);

  const cancelarExclusaoRecursoProprio = useCallback(() => {
    if (isExcluindoRecurso) {
      return;
    }

    setModalExcluirRecurso({ aberto: false, recurso: null });
  }, [isExcluindoRecurso]);

  const formatarData = (valor) => {
    if (!valor) return "-";
    const date = new Date(valor + 'T00:00:00');
    return Number.isNaN(date.getTime())
      ? "-"
      : new Intl.DateTimeFormat("pt-BR").format(date);
  };

  const formatarValor = (valor) =>
    new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(valor) || 0);

  const recursosPropriosVisiveis = useMemo(
    () => recursosPropriosTabela.filter((item) => !item._destroy),
    [recursosPropriosTabela],
  );

  const totalRecursosProprios = useMemo(
    () =>
      recursosPropriosVisiveis.reduce(
        (acc, item) => acc + (Number(item.valor) || 0),
        0,
      ),
    [recursosPropriosVisiveis],
  );

  const recursosColumns = useMemo(
    () => [
      {
        title: "Tipo de Atividades",
        dataIndex: "tipoAtividade",
        key: "tipoAtividade",
        render: (_, record) => <>
          {record?.tipoAtividade || "-"}
          <div>{record?.alteracao && <TagRetificacao />}</div>
        </>
      },
      {
        title: "Data",
        dataIndex: "data",
        key: "data",
        render: (texto) => formatarData(texto),
        width: 150,
      },
      {
        title: "Descrição das Receitas e Atividades Previstas",
        dataIndex: "descricao",
        key: "descricao",
        render: (text) => text || "-",
      },
      {
        title: "Valor Estimado",
        dataIndex: "valor",
        key: "valor",
        align: "right",
        render: (valor) => formatarValor(valor),
      },
      {
        title: "Ações",
        key: "acoes",
        width: 80,
        render: (_, record) =>
          podeEditar ? (
            <div className="atividades-previstas__acoes-recursos">
              <IconButton
                className="p-0"
                icon="faTrashCan"
                tooltipMessage="Excluir"
                iconProps={{
                  style: { color: "#00585E" },
                }}
                aria-label="Excluir recurso próprio"
                onClick={() => handleExcluirRecursoProprio(record)}
              />
            </div>
          ) : null,
      },
    ],
    [handleExcluirRecursoProprio, podeEditar],
  );

  return (
    <div>
        <Spin spinning={isLoadingRecursos}>
            <RelatorioTabelaGrupo
            title="Recursos próprios"
            columns={recursosColumns}
            dataSource={recursosPropriosVisiveis}
            rowKey={(item) => item.uuid}
            headerExtra={
                <button
                type="button"
                className="atividades-previstas__btn-editar-recursos"
                onClick={handleEditarRecursosProprios}
                >
                <Icon
                    icon="faEdit"
                    iconProps={{ style: { marginRight: 8, color: "#FFFFFF" } }}
                />
                Editar receitas de recursos próprios
                </button>
            }
            containerClassName="relatorio-tabela-grupo atividades-previstas__tabela mt-4"
            tableProps={{
                summary: () => (
                <Table.Summary.Row className="atividades-previstas__tabela-resumo">
                    <Table.Summary.Cell index={0}>
                    <span className="atividades-previstas__resumo-label">
                        Tipo de Atividades
                    </span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} />
                    <Table.Summary.Cell index={2} />
                    <Table.Summary.Cell index={3} align="right">
                    <span className="atividades-previstas__resumo-valor">
                        {formatarValor(totalRecursosProprios)}
                    </span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4} />
                </Table.Summary.Row>
                ),
            }}
            />
        </Spin>

        <ModalConfirmarExclusao
            open={modalExcluirRecurso.aberto}
            onOk={confirmarExclusaoRecursoProprio}
            okText="Excluir"
            okButtonProps="btn-base-vermelho"
            onCancel={cancelarExclusaoRecursoProprio}
            cancelText="Voltar"
            cancelButtonProps="btn-base-verde-outline"
            titulo="Excluir recurso próprio"
            bodyText="Tem certeza que deseja excluir o recurso próprio selecionado?"
        />
    </div>
  );
};