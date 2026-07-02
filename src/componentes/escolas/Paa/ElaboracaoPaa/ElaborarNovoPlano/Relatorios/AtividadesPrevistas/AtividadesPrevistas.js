import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MsgImgCentralizada } from "../../../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../../../assets/img/img-404.svg";
import { RelatorioTabelaGrupo } from "../components/RelatorioTabelaGrupo";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { useGetAtividadesEstatutarias } from "./hooks/useGetAtividadesEstatutarias";
import { useGetAtividadesEstatutariasTabelas } from "./hooks/useGetAtividadesEstatutariasTabelas";
import { getErrorMessage } from "../../../../../../../utils/obtemMsgErroAxios";
import { TagRetificacao } from "../../../../componentes/TagRetificacao";
import {
  IconButton,
  EditIconButton,
} from "../../../../../../Globais/UI/Button";
import { Icon } from "../../../../../../Globais/UI/Icon";
import {
  createAtividadeEstatutariaPaa,
  updateAtividadeEstatutariaPaa,
  deleteAtividadeEstatutariaPaa,
  linkAtividadeEstatutariaExistentePaa,
} from "../../../../../../../services/escolas/Paa.service";
import { ModalConfirmarExclusao } from "../../../../../../sme/Parametrizacoes/componentes/ModalConfirmarExclusao";
import { parseISO, getYear } from "date-fns";
import { visoesService } from "../../../../../../../services/visoes.service";
import "./styles.scss";
import { Spin } from "antd";

const formatarMesAno = (valor) => {
    if (!valor) return "-";

    const formatData = (data) => {
        if (Number.isNaN(data.getTime())) return "-";

        const mes = data.toLocaleDateString("pt-BR", { month: "long" });
        const ano = data.getFullYear();
        if (!mes) return `${ano || ""}`;
        return `${mes.charAt(0).toUpperCase()}${mes.slice(1)}/${ano}`;
    };

    // Parse da string YYYY-MM-DD para evitar problemas de fuso horário
    const partes = valor.split("-");

    if (partes.length !== 3) return formatData(new Date(valor));

    const [anoStr, mesStr, diaStr] = partes;
    const ano = Number.parseInt(anoStr, 10);
    const mes = Number.parseInt(mesStr, 10);
    const dia = Number.parseInt(diaStr, 10);

    if (Number.isNaN(ano) || Number.isNaN(mes) || Number.isNaN(dia)) return "-";

    // Criar data no fuso horário local para evitar problemas de UTC
    return formatData(new Date(ano, mes - 1, dia));
};

export const AtividadesPrevistas = () => {
  const podeEditar = visoesService.getPermissoes(["custom_change_paa"]);

  const [atividadesTabela, setAtividadesTabela] = useState([]);
  const carregouDadosIniciais = useRef(false);
  const deveSincronizarTabela = useRef(false);
  const [isSalvando, setIsSalvando] = useState(false);

  const { atividades, isFetching: isLoading, isError, refetch } = useGetAtividadesEstatutarias();
  const { data: tabelasAtividades } = useGetAtividadesEstatutariasTabelas();
  const [modalExcluir, setModalExcluir] = useState({ aberto: false, atividade: null });
  const [isExcluindoAtividade, setIsExcluindoAtividade] = useState(false);

  const paaUuid = localStorage.getItem("PAA");

  const tiposOptions = useMemo(() => {
    const tipos = tabelasAtividades?.tipo || [];
    return tipos.map((item) => ({
      value: item.key,
      label: item.value,
    }));
  }, [tabelasAtividades]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!carregouDadosIniciais.current || deveSincronizarTabela.current) {
      const atividadesFormatadas = atividades.map((item) => ({
        ...item,
        isNovo: Boolean(item.isNovo),
        emEdicao: false,
        needsSync: false,
        dirty: false,
      }));
      setAtividadesTabela(atividadesFormatadas);
      carregouDadosIniciais.current = true;
      deveSincronizarTabela.current = false;
    }
  }, [atividades, isLoading]);

  const handleAdicionarAtividade = useCallback(() => {
    if (!podeEditar) return;
    const novaAtividade = {
      uuid: `novo-${Date.now()}`,
      tipoAtividade: "",
      tipoAtividadeKey: "",
      data: "",
      descricao: "",
      isNovo: true,
      emEdicao: true,
      needsSync: false,
      dirty: false,
    };
    setAtividadesTabela((prev) => [...prev, novaAtividade]);
  }, [podeEditar]);

  const obterMesAno = useCallback((dados) => {
    let mesAnoLabel = dados?.mesLabel || "";

    if (!dados?.ano) {
      return mesAnoLabel;
    }

    const dadosPaaLocalStorage = JSON.parse(localStorage.getItem("DADOS_PAA"));

    if (dadosPaaLocalStorage) {
      const { periodo_paa_objeto } = dadosPaaLocalStorage;

      if (!periodo_paa_objeto) return mesAnoLabel;

      const dataInicial = parseISO(periodo_paa_objeto.data_inicial);
      const dataFinal = parseISO(periodo_paa_objeto.data_final);

      if (dados.ano === "VIGENTE") {
        const ano = getYear(dataInicial);
        mesAnoLabel += `/${ano}`;
      }

      if (dados.ano === "POSTERIOR") {
        const ano = getYear(dataFinal);
        mesAnoLabel += `/${ano}`;
      }
    }
    return mesAnoLabel;
  }, []);

  const handleChangeAtividade = useCallback((uuid, campo, valor, extra = {}) => {
      if (!podeEditar) return;
      setAtividadesTabela((prev) =>
        prev.map((item) => {
          if (item.uuid !== uuid) {
            return item;
          }

          const updated = {
            ...item,
            [campo]: valor,
            ...extra,
            dirty: true,
          };

          if (extra.tipoAtividadeLabel) {
            updated.tipoAtividade = extra.tipoAtividadeLabel;
          }

          if (campo === "data") {
            const mesAno = formatarMesAno(valor);
            updated.mesAno = mesAno;
            if (!item.emEdicao) {
              updated.needsSync = mesAno !== "-";
            }
          }

          return updated;
        }),
      );
    },
    [podeEditar],
  );

  const handleEditar = useCallback(
    (atividade) => {
      if (!podeEditar) return;
      setAtividadesTabela((prev) =>
        prev.map((item) =>
          item.uuid === atividade.uuid ? { ...item, emEdicao: true } : item,
        ),
      );
    },
    [podeEditar],
  );

  const handleSalvarLinha = useCallback(
    (atividade) => {
      if (!podeEditar) return;
      if (
        !atividade.tipoAtividadeKey ||
        !atividade.descricao ||
        !atividade.data
      ) {
        toastCustom.ToastCustomError(
          "Erro!",
          "Preencha todos os campos obrigatórios.",
        );
        return;
      }

      setAtividadesTabela((prev) =>
        prev.map((item) => {
          if (item.uuid !== atividade.uuid) {
            return item;
          }

          const shouldSync = item.isNovo || item.dirty || item._destroy;

          return {
            ...item,
            emEdicao: false,
            dirty: false,
            needsSync: shouldSync,
          };
        }),
      );
    },
    [podeEditar],
  );

  const getAtividadeEstatutariaUuid = (atividade => {
      return atividade?.atividade_estatutaria?.uuid ||
            atividade?.atividade_estatutaria ||
            atividade?.atividadeEstatutariaUuid ||
            atividade?.uuid;
  })

  const handleSalvarAtividades = useCallback(async () => {
    if (!podeEditar) return;
    if (!paaUuid) {
      toastCustom.ToastCustomError("Erro!", "PAA vigente não encontrado.");
      return;
    }

    const linhasAjustadas = [];
    const linhasComErro = [];

    const atividadesPreparadas = atividadesTabela.map((item) => {
      if (item.emEdicao && item.dirty) {
        if (!item.tipoAtividadeKey || !item.descricao || !item.data) {
          linhasComErro.push(item.uuid);
        }
        linhasAjustadas.push(item.uuid);
        return {
          ...item,
          emEdicao: false,
          dirty: false,
          needsSync: true,
        };
      }
      return item;
    });

    if (linhasComErro.length > 0) {
      toastCustom.ToastCustomError(
        "Erro!",
        "Preencha tipo, descrição e data para todas as atividades pendentes.",
      );
      setAtividadesTabela((prev) =>
        prev.map((item) =>
          linhasComErro.includes(item.uuid)
            ? { ...item, emEdicao: true }
            : item,
        ),
      );
      return;
    }

    if (linhasAjustadas.length > 0) {
      setAtividadesTabela(atividadesPreparadas);
    }

    const atividadesPendentes = atividadesPreparadas.filter(
      (item) => item.needsSync,
    );

    if (atividadesPendentes.length === 0) {
      return;
    }

    setIsSalvando(true);

    try {
        for (const atividade of atividadesPendentes) {
          const atividadeEstatutariaUuid = getAtividadeEstatutariaUuid(atividade);

          if (atividade._destroy) {
            if (atividade.isNovo) {
              continue;
            }
            if (!atividadeEstatutariaUuid) {
              throw new Error("Identificador da atividade não encontrado.");
            }
            // eslint-disable-next-line no-await-in-loop
            await deleteAtividadeEstatutariaPaa(
              paaUuid,
              atividadeEstatutariaUuid,
            );
            toastCustom.ToastCustomSuccess(
              "Sucesso!",
              "Atividade excluída com sucesso.",
            );
            continue;
          }

          const payloadBase = {
            nome: atividade.descricao,
            tipo: atividade.tipoAtividadeKey,
            data: atividade.data,
          };

          if (atividade.isGlobal && !atividade.vinculoUuid) {
            if (!atividadeEstatutariaUuid) {
              throw new Error("Identificador da atividade não encontrado.");
            }
            // eslint-disable-next-line no-await-in-loop
            await linkAtividadeEstatutariaExistentePaa(paaUuid, {
              atividade_estatutaria: atividadeEstatutariaUuid,
              data: atividade.data,
            });
            toastCustom.ToastCustomSuccess(
              "Sucesso!",
              "Atividade criada com sucesso.",
            );
          } else if (atividade.isNovo) {
            // eslint-disable-next-line no-await-in-loop
            await createAtividadeEstatutariaPaa(paaUuid, payloadBase);
            toastCustom.ToastCustomSuccess(
              "Sucesso!",
              "Atividade criada com sucesso.",
            );
          } else {
            if (!atividadeEstatutariaUuid) {
              throw new Error("Identificador da atividade não encontrado.");
            }
            // eslint-disable-next-line no-await-in-loop
            await updateAtividadeEstatutariaPaa(paaUuid, {
              atividade_estatutaria: atividadeEstatutariaUuid,
              ...payloadBase,
            });
            toastCustom.ToastCustomSuccess(
              "Sucesso!",
              "Atividade editada com sucesso.",
            );
          }
        }

        deveSincronizarTabela.current = true;
        await refetch();

        const atividadesProcessadas = new Set(
          atividadesPendentes.map((item) => item.uuid),
        );
        setAtividadesTabela((prev) =>
          prev
            .filter(
              (item) =>
                !(atividadesProcessadas.has(item.uuid) && item._destroy),
            )
            .map((item) =>
              atividadesProcessadas.has(item.uuid)
                ? {
                    ...item,
                    needsSync: false,
                    isNovo: false,
                    _destroy: false,
                    dirty: false,
                  }
                : item,
            ),
        );
    } catch (error) {
          console.error("Erro ao salvar alterações:", error);
          const mensagem = getErrorMessage(
            error,
            "Não foi possível salvar as alterações. Tente novamente.",
          );
          toastCustom.ToastCustomError("Erro!", mensagem);
        } finally {
          setIsSalvando(false);
        }
    }, [
        atividadesTabela,
        paaUuid,
        refetch,
        podeEditar,
    ]);

  const handleExcluirAtividade = useCallback(
    (atividade) => {
      if (!podeEditar) return;
      setModalExcluir({ aberto: true, atividade });
    },
    [podeEditar],
  );

  const confirmarExclusaoAtividade = useCallback(async () => {
    if (!podeEditar || isExcluindoAtividade) {
      return;
    }

    const atividade = modalExcluir.atividade;
    if (!atividade) {
      return;
    }

    try {
      setIsExcluindoAtividade(true);

      if (atividade.isNovo || (atividade.isGlobal && !atividade.vinculoUuid)) {
        setAtividadesTabela((prev) =>
          prev.filter((item) => item.uuid !== atividade.uuid),
        );
      } else {
        const atividadeEstatutariaUuid = getAtividadeEstatutariaUuid(atividade);

        if (!atividadeEstatutariaUuid) {
          throw new Error("Identificador da atividade não encontrado.");
        }

        await deleteAtividadeEstatutariaPaa(paaUuid, atividadeEstatutariaUuid);
        toastCustom.ToastCustomSuccess(
          "Sucesso!",
          "Atividade excluída com sucesso.",
        );
        setAtividadesTabela((prev) =>
          prev.filter((item) => item.uuid !== atividade.uuid),
        );
        deveSincronizarTabela.current = true;
        await refetch();
      }
    } catch (error) {
      console.error("Erro ao excluir atividade:", error);
      toastCustom.ToastCustomError(
        "Erro!",
        "Não foi possível excluir a atividade. Tente novamente.",
      );
    } finally {
      setIsExcluindoAtividade(false);
      setModalExcluir({ aberto: false, atividade: null });
    }
  }, [
    isExcluindoAtividade,
    modalExcluir.atividade,
    paaUuid,
    refetch,
    podeEditar,
  ]);

  const cancelarExclusaoAtividade = useCallback(() => {
    setModalExcluir({ aberto: false, atividade: null });
  }, []);


  const atividadesVisiveis = useMemo(
    () => atividadesTabela.filter((item) => !item._destroy),
    [atividadesTabela],
  );

  const temAlteracaoPendente = useMemo(
    () => atividadesTabela.some((item) => item.needsSync),
    [atividadesTabela],
  );

  const colunas = useMemo(
    () => [
      {
        title: "Tipo de Atividades",
        key: "tipoAtividade",
        render: (_, record) =>
          record.emEdicao ? (
            <select
              className="form-control form-control-sm atividades-previstas__input"
              value={record.tipoAtividadeKey || ""}
              disabled={tiposOptions.length === 0 || !podeEditar}
              onChange={(event) => {
                const valorSelecionado = event.target.value;
                const option = tiposOptions.find(
                  (opt) => String(opt.value) === valorSelecionado,
                );
                handleChangeAtividade(
                  record.uuid,
                  "tipoAtividadeKey",
                  valorSelecionado,
                  {
                    tipoAtividadeLabel: option?.label || "",
                  },
                );
              }}
            >
              <option value="">Selecione o tipo</option>
              {tiposOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <>
            {record.tipoAtividade || "-"}
            <div>{record?.alteracao && <TagRetificacao />}</div>
            </>
          ),
      },
      {
        title: "Data",
        dataIndex: "data",
        key: "data",
        render: (_, record) => {
          const handleDateChange = (event) => {
            handleChangeAtividade(record.uuid, "data", event.target.value);
          };

          const triggerNativePicker = () => {
            const input = document.querySelector(
              `input[data-calendar-picker='${record.uuid}']`,
            );
            if (input && input.showPicker) {
              input.showPicker();
            } else if (input) {
              input.focus();
            }
          };

          const isDataEditable =
            record.isGlobal || record.emEdicao || Boolean(record.vinculoUuid);

          if (isDataEditable) {
            return (
              <div className="atividades-previstas__input-date">
                <input
                  type="date"
                  data-calendar-picker={record.uuid}
                  className="form-control form-control-sm atividades-previstas__input"
                  value={record.data || ""}
                  placeholder="Selecione a data"
                  onChange={handleDateChange}
                  disabled={!podeEditar}
                />
                <button
                  type="button"
                  className="atividades-previstas__input-date-icon"
                  aria-label="Abrir calendário"
                  onClick={triggerNativePicker}
                >
                  <Icon
                    icon="faCalendarAlt"
                    iconProps={{ style: { color: "#A4A4A4" } }}
                  />
                </button>
              </div>
            );
          }

          return (
            <div className="atividades-previstas__input-date atividades-previstas__input-date--readonly">
              <input
                type="date"
                className="form-control form-control-sm atividades-previstas__input"
                value={record.data || ""}
                disabled
                readOnly
              />
              <span
                className="atividades-previstas__input-date-icon"
                aria-hidden="true"
              >
                <Icon
                  icon="faCalendarAlt"
                  iconProps={{ style: { color: "#A4A4A4" } }}
                />
              </span>
            </div>
          );
        },
        width: 150,
      },
      {
        title: "Atividades Estatutárias Previstas",
        dataIndex: "descricao",
        key: "descricao",
        render: (_, record) =>
          record.emEdicao ? (
            <input
              maxLength={160}
              type="text"
              className="form-control form-control-sm atividades-previstas__input"
              value={record.descricao || ""}
              onChange={(event) =>
                handleChangeAtividade(
                  record.uuid,
                  "descricao",
                  event.target.value,
                )
              }
              placeholder="Descreva a atividade estatutária"
              disabled={!podeEditar}
            />
          ) : (
            record.descricao || "-"
          ),
      },
      {
        title: "Mês/Ano",
        key: "mesAno",
        render: (_, record) => {
          const mesAnoBase = record.isGlobal
            ? obterMesAno(record) || "-"
            : formatarMesAno(record.data);
          const mesAnoVisivel = record.emEdicao ? "" : mesAnoBase;

          return (
            <div className="atividades-previstas__data-wrapper">
              <span>{mesAnoVisivel}</span>
              {!record.isGlobal && podeEditar && (
                <div className="atividades-previstas__data-actions">
                  {record.emEdicao ? (
                    <>
                      <IconButton
                        className="p-0"
                        icon="faSave"
                        tooltipMessage="Concluir edição"
                        iconProps={{
                          style: { color: "#00585E" },
                        }}
                        aria-label="Concluir edição"
                        disabled={isSalvando}
                        onClick={() => handleSalvarLinha(record)}
                      />
                      <IconButton
                        className="p-0"
                        icon="faTrashCan"
                        tooltipMessage="Excluir"
                        iconProps={{
                          style: { color: "#00585E" },
                        }}
                        aria-label="Excluir registro"
                        onClick={() => handleExcluirAtividade(record)}
                      />
                    </>
                  ) : (
                    <>
                      <EditIconButton
                        className="p-0"
                        onClick={() => handleEditar(record)}
                      />
                      <IconButton
                        className="p-0"
                        icon="faTrashCan"
                        tooltipMessage="Excluir"
                        iconProps={{
                          style: { color: "#00585E" },
                        }}
                        aria-label="Excluir"
                        onClick={() => handleExcluirAtividade(record)}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          );
        },
        width: 220,
      },
    ],
    [
        obterMesAno,
        handleChangeAtividade,
        handleEditar,
        handleExcluirAtividade,
        handleSalvarLinha,
        tiposOptions,
        isSalvando,
        podeEditar,
    ],
  );

  const botoesHeader = (
    <div className="atividades-previstas__header-actions">
      {podeEditar && (
        <>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleAdicionarAtividade}
          >
            Adicionar Atividade Estatutária
          </button>
          <button
            type="button"
            className="btn btn-success atividades-previstas__salvar-botao"
            disabled={!temAlteracaoPendente || isSalvando}
            onClick={handleSalvarAtividades}
          >
            Salvar
          </button>
        </>
      )}
    </div>
  );

  const shouldShowEmpty =
    !isLoading &&
    !isError &&
    carregouDadosIniciais.current &&
    atividadesVisiveis.length === 0

  return (
    <>
        <Spin spinning={isLoading || isSalvando} size="large">
            {isError && <MsgImgCentralizada
                texto="Não foi possível carregar as atividades estatutárias."
                img={Img404}
                dataQa="atividades-previstas-erro"
            />}
            {shouldShowEmpty && <MsgImgCentralizada
                texto="Utilize o registro de prioridades para manter as atividades previstas do PAA atualizadas."
                img={Img404}
                dataQa="atividades-previstas-sem-dados"
            />}
            {!shouldShowEmpty && !isError && (
            <RelatorioTabelaGrupo
                title="Atividades Estatutárias"
                columns={colunas}
                dataSource={atividadesVisiveis}
                rowKey={(item) => item.uuid}
                headerExtra={botoesHeader}
                containerClassName="relatorio-tabela-grupo atividades-previstas__tabela"
            />
            )}
        </Spin>

        <ModalConfirmarExclusao
            open={modalExcluir.aberto}
            onOk={confirmarExclusaoAtividade}
            okText="Excluir"
            okButtonProps="btn-base-vermelho"
            onCancel={cancelarExclusaoAtividade}
            cancelText="Voltar"
            cancelButtonProps="btn-base-verde-outline"
            titulo="Excluir atividade"
            bodyText="Tem certeza que deseja excluir a atividade selecionada?"
        />
    </>
  );
};
