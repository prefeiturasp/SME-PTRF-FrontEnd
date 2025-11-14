import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "antd";
import { RelatorioVisualizacao } from "../components/RelatorioVisualizacao";
import { RelatorioTabelaGrupo } from "../components/RelatorioTabelaGrupo";
import { MsgImgCentralizada } from "../../../../../../Globais/Mensagens/MsgImgCentralizada";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import Img404 from "../../../../../../../assets/img/img-404.svg";
import { useGetAtividadesEstatutarias } from "./hooks/useGetAtividadesEstatutarias";
import { useGetAtividadesEstatutariasTabelas } from "./hooks/useGetAtividadesEstatutariasTabelas";
import { useGetRecursosPropriosPrevistos } from "./hooks/useGetRecursosPropriosPrevistos";
import { IconButton } from "../../../../../../Globais/UI/Button/IconButton";
import { Icon } from "../../../../../../Globais/UI/Icon";
import {
  createAtividadeEstatutariaPaa,
  updateAtividadeEstatutariaPaa,
  deleteAtividadeEstatutariaPaa,
  deleteRecursoProprioPaa,
  linkAtividadeEstatutariaExistentePaa,
} from "../../../../../../../services/escolas/Paa.service";
import { ModalConfirmarExclusao } from "../../../../../../sme/Parametrizacoes/componentes/ModalConfirmarExclusao";
import "./styles.scss";

const formatarMesAno = (valor) => {
  if (!valor) {
    return "-";
  }
  // Parse da string YYYY-MM-DD para evitar problemas de fuso horário
  const partes = valor.split("-");
  if (partes.length !== 3) {
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) {
      return "-";
    }
    const mes = data.toLocaleDateString("pt-BR", { month: "long" });
    const ano = data.getFullYear();
    if (!mes) {
      return `${ano || ""}`;
    }
    return `${mes.charAt(0).toUpperCase()}${mes.slice(1)}/${ano}`;
  }
  
  const ano = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10);
  const dia = parseInt(partes[2], 10);
  
  if (Number.isNaN(ano) || Number.isNaN(mes) || Number.isNaN(dia)) {
    return "-";
  }
  
  // Criar data no fuso horário local para evitar problemas de UTC
  const data = new Date(ano, mes - 1, dia);
  const mesFormatado = data.toLocaleDateString("pt-BR", { month: "long" });
  const anoFormatado = data.getFullYear();
  
  if (!mesFormatado) {
    return `${anoFormatado || ""}`;
  }
  return `${mesFormatado.charAt(0).toUpperCase()}${mesFormatado.slice(1)}/${anoFormatado}`;
};

export const VisualizarAtividadesPrevistas = () => {
  const navigate = useNavigate();
  const { atividades, isLoading, isError, refetch } = useGetAtividadesEstatutarias();
  const { data: tabelasAtividades } = useGetAtividadesEstatutariasTabelas();
  const {
    data: recursosProprios = [],
    isLoading: isLoadingRecursos,
    refetch: refetchRecursos,
  } = useGetRecursosPropriosPrevistos();
  const [atividadesTabela, setAtividadesTabela] = useState([]);
  const [recursosPropriosTabela, setRecursosPropriosTabela] = useState([]);
  const carregouDadosIniciais = useRef(false);
  const carregouRecursosIniciais = useRef(false);
  const deveSincronizarTabela = useRef(false);
  const deveSincronizarRecursos = useRef(false);
  const [isSalvando, setIsSalvando] = useState(false);
  const [modalExcluir, setModalExcluir] = useState({ aberto: false, atividade: null });
  const [isExcluindoAtividade, setIsExcluindoAtividade] = useState(false);
  const [modalExcluirRecurso, setModalExcluirRecurso] = useState({
    aberto: false,
    recurso: null,
  });
  const [isExcluindoRecurso, setIsExcluindoRecurso] = useState(false);
  const paaUuid = localStorage.getItem("PAA");

  const tiposOptions = useMemo(() => {
    const tipos = tabelasAtividades?.tipo || [];
    return tipos.map((item) => ({
      value: item.key,
      label: item.value,
    }));
  }, [tabelasAtividades]);

  const handleVoltar = useCallback(() => {
    navigate("/elaborar-novo-paa", {
      state: {
        activeTab: "relatorios",
        expandedSections: {
          planoAnual: true,
          componentes: true,
        },
      },
    });
  }, [navigate]);

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

  const handleAdicionarAtividade = useCallback(() => {
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
  }, []);

  const handleEditarRecursosProprios = useCallback(() => {
    navigate("/elaborar-novo-paa", {
      state: {
        activeTab: "receitas",
        receitasDestino: "recursos-proprios",
        fromRecursosPropriosRelatorio: true,
      },
    });
  }, [navigate]);

  const handleChangeAtividade = useCallback((uuid, campo, valor, extra = {}) => {
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
          const dataObj = valor ? new Date(valor) : null;
          if (dataObj && !Number.isNaN(dataObj.getTime())) {
            updated.mesAno = formatarMesAno(valor);
          } else {
            updated.mesAno = "-";
          }

          if (!item.emEdicao) {
            updated.needsSync = Boolean(dataObj && !Number.isNaN(dataObj.getTime()));
          }
        }

        return updated;
      })
    );
  }, []);

  const handleEditarAtividade = useCallback((atividade) => {
    setAtividadesTabela((prev) =>
      prev.map((item) =>
        item.uuid === atividade.uuid ? { ...item, emEdicao: true } : item
      )
    );
  }, []);

  const handleSalvarLinha = useCallback(
    (atividade) => {
      if (!atividade.tipoAtividadeKey || !atividade.descricao || !atividade.data) {
        toastCustom.ToastCustomError(
          "Erro!",
          "Preencha todos os campos obrigatórios."
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
        })
      );
    },
    []
  );

  const handleSalvarAtividades = useCallback(async () => {
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
        "Preencha tipo, descrição e data para todas as atividades pendentes."
      );
      setAtividadesTabela((prev) =>
        prev.map((item) =>
          linhasComErro.includes(item.uuid) ? { ...item, emEdicao: true } : item
        )
      );
      return;
    }

    if (linhasAjustadas.length > 0) {
      setAtividadesTabela(atividadesPreparadas);
    }

    const atividadesPendentes = atividadesPreparadas.filter((item) => item.needsSync);
    const recursosPendentes = recursosPropriosTabela.filter((item) => item.needsSync);

    if (atividadesPendentes.length === 0 && recursosPendentes.length === 0) {
      return;
    }

    setIsSalvando(true);

    try {
      if (atividadesPendentes.length > 0) {
        for (const atividade of atividadesPendentes) {
          const atividadeEstatutariaUuid =
            atividade?.atividade_estatutaria?.uuid ||
            atividade?.atividade_estatutaria ||
            atividade?.atividadeEstatutariaUuid ||
            atividade?.uuid;

          if (atividade._destroy) {
            if (atividade.isNovo) {
              continue;
            }
            if (!atividadeEstatutariaUuid) {
              throw new Error("Identificador da atividade não encontrado.");
            }
            // eslint-disable-next-line no-await-in-loop
            await deleteAtividadeEstatutariaPaa(paaUuid, atividadeEstatutariaUuid);
            toastCustom.ToastCustomSuccess("Sucesso!", "Atividade excluída com sucesso.");
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
              "Atividade criada com sucesso."
            );
          } else if (atividade.isNovo) {
            // eslint-disable-next-line no-await-in-loop
            await createAtividadeEstatutariaPaa(paaUuid, payloadBase);
            toastCustom.ToastCustomSuccess("Sucesso!", "Atividade criada com sucesso.");
          } else {
            if (!atividadeEstatutariaUuid) {
              throw new Error("Identificador da atividade não encontrado.");
            }
            // eslint-disable-next-line no-await-in-loop
            await updateAtividadeEstatutariaPaa(paaUuid, {
              atividade_estatutaria: atividadeEstatutariaUuid,
              ...payloadBase,
            });
            toastCustom.ToastCustomSuccess("Sucesso!", "Atividade editada com sucesso.");
          }
        }

        deveSincronizarTabela.current = true;
        await refetch();

        const atividadesProcessadas = new Set(
          atividadesPendentes.map((item) => item.uuid)
        );
        setAtividadesTabela((prev) =>
          prev
            .filter(
              (item) =>
                !(atividadesProcessadas.has(item.uuid) && item._destroy)
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
                : item
            )
        );
      }

      if (recursosPendentes.length > 0) {
        for (const recurso of recursosPendentes) {
          if (recurso._destroy) {
            if (recurso.isNovo) {
              continue;
            }
            if (!recurso.uuid) {
              throw new Error("Identificador do recurso próprio não encontrado.");
            }
            // eslint-disable-next-line no-await-in-loop
            await deleteRecursoProprioPaa(recurso.uuid);
            toastCustom.ToastCustomSuccess("Sucesso!", "Recurso próprio excluído com sucesso.");
          }
        }

        deveSincronizarRecursos.current = true;
        await refetchRecursos();

        const recursosProcessados = new Set(
          recursosPendentes.map((item) => item.uuid)
        );
        setRecursosPropriosTabela((prev) =>
          prev
            .filter(
              (item) =>
                !(recursosProcessados.has(item.uuid) && item._destroy)
            )
            .map((item) =>
              recursosProcessados.has(item.uuid)
                ? {
                    ...item,
                    needsSync: false,
                    isNovo: false,
                    _destroy: false,
                  }
                : item
            )
        );
      }
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      toastCustom.ToastCustomError(
        "Erro!",
        "Não foi possível salvar as alterações. Tente novamente."
      );
    } finally {
      setIsSalvando(false);
    }
  }, [atividadesTabela, recursosPropriosTabela, paaUuid, refetch, refetchRecursos]);

  const handleEditarLinha = useCallback((atividade) => {
    setAtividadesTabela((prev) =>
      prev.map((item) =>
        item.uuid === atividade.uuid ? { ...item, emEdicao: true } : item
      )
    );
  }, []);

  const handleExcluirAtividade = useCallback((atividade) => {
    setModalExcluir({ aberto: true, atividade });
  }, []);

  const confirmarExclusaoAtividade = useCallback(async () => {
    if (isExcluindoAtividade) {
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
          prev.filter((item) => item.uuid !== atividade.uuid)
        );
      } else {
        const atividadeEstatutariaUuid =
          atividade?.atividade_estatutaria?.uuid ||
          atividade?.atividade_estatutaria ||
          atividade?.atividadeEstatutariaUuid ||
          atividade?.uuid;

        if (!atividadeEstatutariaUuid) {
          throw new Error("Identificador da atividade não encontrado.");
        }

        await deleteAtividadeEstatutariaPaa(paaUuid, atividadeEstatutariaUuid);
        toastCustom.ToastCustomSuccess("Sucesso!", "Atividade excluída com sucesso.");
        setAtividadesTabela((prev) =>
          prev.filter((item) => item.uuid !== atividade.uuid)
        );
        deveSincronizarTabela.current = true;
        await refetch();
      }
    } catch (error) {
      console.error("Erro ao excluir atividade:", error);
      toastCustom.ToastCustomError(
        "Erro!",
        "Não foi possível excluir a atividade. Tente novamente."
      );
    } finally {
      setIsExcluindoAtividade(false);
      setModalExcluir({ aberto: false, atividade: null });
    }
  }, [isExcluindoAtividade, modalExcluir.atividade, paaUuid, refetch]);

  const cancelarExclusaoAtividade = useCallback(() => {
    setModalExcluir({ aberto: false, atividade: null });
  }, []);

  const handleExcluirRecursoProprio = useCallback((recurso) => {
    setModalExcluirRecurso({ aberto: true, recurso });
  }, []);

  const confirmarExclusaoRecursoProprio = useCallback(async () => {
    if (isExcluindoRecurso) {
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
          prev.filter((item) => item.uuid !== recurso.uuid)
        );
        toastCustom.ToastCustomSuccess(
          "Sucesso!",
          "Recurso próprio excluído com sucesso."
        );
      } else {
        if (!recurso.uuid) {
          throw new Error("Identificador do recurso próprio não encontrado.");
        }

        await deleteRecursoProprioPaa(recurso.uuid);
        toastCustom.ToastCustomSuccess(
          "Sucesso!",
          "Recurso próprio excluído com sucesso."
        );

        deveSincronizarRecursos.current = true;
        await refetchRecursos();

        setRecursosPropriosTabela((prev) =>
          prev.filter((item) => item.uuid !== recurso.uuid)
        );
      }
    } catch (error) {
      console.error("Erro ao excluir recurso próprio:", error);
      toastCustom.ToastCustomError(
        "Erro!",
        "Não foi possível excluir o recurso próprio. Tente novamente."
      );
    } finally {
      setIsExcluindoRecurso(false);
      setModalExcluirRecurso({ aberto: false, recurso: null });
    }
  }, [isExcluindoRecurso, modalExcluirRecurso.recurso, refetchRecursos]);

  const cancelarExclusaoRecursoProprio = useCallback(() => {
    if (isExcluindoRecurso) {
      return;
    }

    setModalExcluirRecurso({ aberto: false, recurso: null });
  }, [isExcluindoRecurso]);

  const formatarData = (valor) => {
    if (!valor) return "-";
    const date = new Date(valor);
    return Number.isNaN(date.getTime())
      ? "-"
      : new Intl.DateTimeFormat("pt-BR").format(date);
  };

  const formatarValor = (valor) =>
    new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(valor) || 0);

  const atividadesVisiveis = useMemo(
    () => atividadesTabela.filter((item) => !item._destroy),
    [atividadesTabela]
  );

  const recursosPropriosVisiveis = useMemo(
    () => recursosPropriosTabela.filter((item) => !item._destroy),
    [recursosPropriosTabela]
  );

  const totalRecursosProprios = useMemo(
    () =>
      recursosPropriosVisiveis.reduce(
        (acc, item) => acc + (Number(item.valor) || 0),
        0
      ),
    [recursosPropriosVisiveis]
  );

  const temAlteracaoPendente = useMemo(
    () =>
      atividadesTabela.some((item) => item.needsSync) ||
      recursosPropriosTabela.some((item) => item.needsSync),
    [atividadesTabela, recursosPropriosTabela]
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
              disabled={tiposOptions.length === 0}
              onChange={(event) => {
                const valorSelecionado = event.target.value;
                const option = tiposOptions.find(
                  (opt) => String(opt.value) === valorSelecionado
                );
                handleChangeAtividade(record.uuid, "tipoAtividadeKey", valorSelecionado, {
                  tipoAtividadeLabel: option?.label || "",
                });
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
            record.tipoAtividade || "-"
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
              `input[data-calendar-picker='${record.uuid}']`
            );
            if (input && input.showPicker) {
              input.showPicker();
            } else if (input) {
              input.focus();
            }
          };

          const isDataEditable = record.isGlobal || record.emEdicao || Boolean(record.vinculoUuid);

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
              type="text"
              className="form-control form-control-sm atividades-previstas__input"
              value={record.descricao || ""}
              onChange={(event) =>
                handleChangeAtividade(record.uuid, "descricao", event.target.value)
              }
              placeholder="Descreva a atividade estatutária"
            />
          ) : (
            record.descricao || "-"
          ),
      },
      {
        title: "Mês/Ano",
        key: "mesAno",
        render: (_, record) => {
          const mesAnoBase = record.isGlobal && !record.vinculoUuid
            ? record.mesLabel || "-"
            : formatarMesAno(record.data);
          const mesAnoVisivel = record.emEdicao ? "" : mesAnoBase;

          return (
            <div className="atividades-previstas__data-wrapper">
              <span>{mesAnoVisivel}</span>
            {!record.isGlobal && (
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
                    <IconButton
                      className="p-0"
                      icon="faEdit"
                      tooltipMessage="Editar"
                      iconProps={{
                        style: { color: "#00585E" },
                      }}
                      aria-label="Editar"
                      onClick={() =>
                        record.isNovo
                          ? handleEditarLinha(record)
                          : handleEditarAtividade(record)
                      }
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
      handleChangeAtividade,
      handleEditarAtividade,
      handleEditarLinha,
      handleExcluirAtividade,
      handleSalvarLinha,
      tiposOptions,
      isSalvando,
    ]
  );

  const recursosColumns = useMemo(
    () => [
      {
        title: "Tipo de Atividades",
        dataIndex: "tipoAtividade",
        key: "tipoAtividade",
        render: (text) => text || "-",
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
        render: (_, record) => (
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
        ),
      },
    ],
    [handleExcluirRecursoProprio]
  );

  const botoesHeader = (
    <div className="atividades-previstas__header-actions">
      <button
        type="button"
        className="btn btn-success"
        onClick={handleAdicionarAtividade}
      >
        Adicionar Atividade Estatutária
      </button>
      <button
        type="button"
        className={`btn btn-success atividades-previstas__salvar-botao`}
        disabled={!temAlteracaoPendente || isSalvando}
        onClick={handleSalvarAtividades}
      >
        Salvar
      </button>
    </div>
  );

  const shouldShowEmpty =
    !isLoading &&
    !isLoadingRecursos &&
    !isError &&
    carregouDadosIniciais.current &&
    carregouRecursosIniciais.current &&
    atividadesVisiveis.length === 0 &&
    recursosPropriosVisiveis.length === 0;

  return (
    <>
      <RelatorioVisualizacao
      title="Atividades previstas"
      onBack={handleVoltar}
      isLoading={isLoading || isLoadingRecursos}
      error={isError}
      errorContent={
        <MsgImgCentralizada
          texto="Não foi possível carregar as atividades estatutárias."
          img={Img404}
          dataQa="atividades-previstas-erro"
        />
      }
      isEmpty={shouldShowEmpty}
      emptyContent={
        <MsgImgCentralizada
          texto="Utilize o registro de prioridades para manter as atividades previstas do PAA atualizadas."
          img={Img404}
          dataQa="atividades-previstas-sem-dados"
        />
      }
      showWatermark={true}
      heightDeps={[
        atividadesTabela,
        recursosPropriosTabela,
        isLoading,
        isLoadingRecursos,
        isError,
      ]}
    >
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
      </RelatorioVisualizacao>

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
    </>
  );
};

export default VisualizarAtividadesPrevistas;
