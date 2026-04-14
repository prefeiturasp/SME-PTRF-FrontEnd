import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { visoesService } from "../../../../../../services/visoes.service";
import { postGerarAtaPaa } from "../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { ModalConfirmaGeracaoAta } from "../ModalConfirmaGeracaoAta/ModalConfirmaGeracaoAta";
import "./PaaAtaAcoes.scss";

export const PaaAtaAcoes = ({ paaUuid, ata, documentoPlano, onDepoisDeGerar }) => {
  const navigate = useNavigate();
  const podeEditar = visoesService.getPermissoes(["custom_change_paa"]);
  const [modalGerarAberto, setModalGerarAberto] = useState(false);

  const gerarDesabilitado =
    !podeEditar || !paaUuid || !ata?.pode_gerar_ata;

  const documentoFinalGerado =
    documentoPlano?.status?.status_geracao === "CONCLUIDO";

  const tooltipGerarId = `tooltip-gerar-ata-${paaUuid || "x"}`;

  const mensagemTooltipGerar = !podeEditar
    ? "Sem permissão para gerar ata."
    : gerarDesabilitado
      ? "Quando todos os dados estiverem preenchidos, a opção fica habilitada."
      : "";

  const handleVisualizarAtaEditor = useCallback(() => {
    if (!paaUuid) return;
    navigate(`/relatorios-paa/visualizacao-da-ata-paa/${paaUuid}`, {
      state: { origem: "paa-vigente-e-anteriores" },
    });
  }, [navigate, paaUuid]);

  const handleConfirmarGeracaoAta = useCallback(async () => {
    setModalGerarAberto(false);
    if (!paaUuid) {
      toastCustom.ToastCustomError("Erro!", "PAA não identificado.");
      return;
    }
    try {
      await postGerarAtaPaa(paaUuid, { confirmar: 1 });
      toastCustom.ToastCustomSuccess(
        "Sucesso!",
        "Geração da ata iniciada. Aguarde o processamento."
      );
      onDepoisDeGerar?.();
    } catch (error) {
      const mensagem =
        error?.response?.data?.mensagem || "Erro ao iniciar geração da ata.";
      toastCustom.ToastCustomError("Erro!", mensagem);
    }
  }, [paaUuid, onDepoisDeGerar]);

  const abrirModalGerar = useCallback(() => {
    if (gerarDesabilitado) return;
    setModalGerarAberto(true);
  }, [gerarDesabilitado]);

  return (
    <div className="d-flex mt-3 mt-md-0 align-items-start flex-wrap gap-2">
      <button
        type="button"
        className="btn btn-success paa-ata-acoes__btn"
        disabled={gerarDesabilitado}
        onClick={abrirModalGerar}
        {...(gerarDesabilitado && mensagemTooltipGerar
          ? {
              "data-tooltip-content": mensagemTooltipGerar,
              "data-tooltip-id": tooltipGerarId,
            }
          : {})}
      >
        Gerar ata
      </button>
      {gerarDesabilitado && mensagemTooltipGerar ? (
        <ReactTooltip id={tooltipGerarId} place="top" />
      ) : null}
      {documentoFinalGerado ? (
        <button
          type="button"
          className="btn btn-outline-success ml-3 paa-ata-acoes__btn"
          disabled={!paaUuid}
          onClick={handleVisualizarAtaEditor}
        >
          Visualizar ata
        </button>
      ) : null}

      <ModalConfirmaGeracaoAta
        open={modalGerarAberto}
        onClose={() => setModalGerarAberto(false)}
        onConfirm={handleConfirmarGeracaoAta}
      />
    </div>
  );
};
