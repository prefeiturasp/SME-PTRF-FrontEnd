import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

import chevronUp from "../../../../../../assets/img/icone-chevron-up.svg";
import chevronDown from "../../../../../../assets/img/icone-chevron-down.svg";

import { useGetTextosPaa } from "./hooks/useGetTextosPaa";
import { useGetPaaVigente } from "./hooks/useGetPaaVigente";
import { useGetAtaPaaVigente } from "./hooks/useGetAtaPaaVigente";
import { ASSOCIACAO_UUID } from "../../../../../../services/auth.service";
import { RenderSecao } from "./RenderSecao";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import Loading from "../../../../../../utils/Loading";

const Relatorios = ({ initialExpandedSections }) => {
  const navigate = useNavigate();
  const defaultExpandedState = {
    planoAnual: false,
    introducao: false,
    objetivos: false,
    componentes: false,
    conclusao: false,
  };

  const [expandedSections, setExpandedSections] = useState(() => ({
    ...defaultExpandedState,
    ...(initialExpandedSections || {}),
  }));

  const associacaoUuid = localStorage.getItem(ASSOCIACAO_UUID);
  const { textosPaa, isLoading, isError } = useGetTextosPaa();
  const { paaVigente, isLoading: isLoadingPaa } = useGetPaaVigente(associacaoUuid);
  const { ataPaa, isLoading: isLoadingAtaPaa } = useGetAtaPaaVigente(paaVigente?.uuid);
  const apresentouToastErroPaaNaoEncontrado = useRef(false);
  const apresentouToastErroAtaNaoEncontrada = useRef(false);

  useEffect(() => {
    if (paaVigente?.uuid) {
      apresentouToastErroPaaNaoEncontrado.current = false;
      return;
    }

    if (!isLoadingPaa && !paaVigente?.uuid && !apresentouToastErroPaaNaoEncontrado.current) {
      toastCustom.ToastCustomError("Erro!", "PAA vigente não encontrado.");
      apresentouToastErroPaaNaoEncontrado.current = true;
    }
  }, [isLoadingPaa, paaVigente?.uuid]);
  useEffect(() => {
    if (!paaVigente?.uuid) {
      return;
    }

    if (ataPaa?.uuid) {
      apresentouToastErroAtaNaoEncontrada.current = false;
      return;
    }

    if (!isLoadingAtaPaa && !ataPaa?.uuid && !apresentouToastErroAtaNaoEncontrada.current) {
      toastCustom.ToastCustomError("Erro!", "Ata do PAA não encontrada.");
      apresentouToastErroAtaNaoEncontrada.current = true;
    }
  }, [isLoadingAtaPaa, ataPaa?.uuid, paaVigente?.uuid]);

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleVisualizarAta = () => {
    if (paaVigente?.uuid && ataPaa?.uuid) {
      navigate(`/relatorios-paa/visualizacao-da-ata-paa/${paaVigente.uuid}`);
    } else {
      toastCustom.ToastCustomError("Erro!", "Ata do PAA não encontrada.");
    }
  };

  const secoesConfig = {
    introducao: {
      titulo: "I. Introdução",
      chave: "introducao",
      campoPaa: "texto_introducao",
      textosPaa: ["introducao_do_paa_ue_1", "introducao_do_paa_ue_2"],
      temEditor: true,
    },
    objetivos: {
      titulo: "II. Objetivos",
      chave: "objetivos",
    },
    componentes: {
      titulo: "III. Componentes",
      chave: "componentes",
    },
    conclusao: {
      titulo: "IV. Conclusão",
      chave: "conclusao",
      campoPaa: "texto_conclusao",
      textosPaa: ["conclusao_do_paa_ue_1", "conclusao_do_paa_ue_2"],
      temEditor: true,
    },
  };

  const renderSecao = (secaoKey, config) => {
    const isExpanded = expandedSections[secaoKey];

    return (
      <div key={secaoKey} className={`render-secao-${secaoKey}`}>
        <RenderSecao
          secaoKey={secaoKey}
          config={config}
          isExpanded={isExpanded}
          toggleSection={toggleSection}
          textosPaa={textosPaa}
          isLoading={isLoading}
          isError={isError}
          isLoadingPaa={isLoadingPaa}
          paaVigente={paaVigente}
        />
      </div>
    );
  };

  return (
    <div className="relatorios-container">
      <div className="documentos-card">
        {/* Header */}
        <div className="documentos-header">
          <h3 className="documentos-title">Documentos</h3>
          <div className="documentos-buttons">
            <button className="btn btn-outline-success">Prévias</button>
            <button className="btn btn-success">Gerar</button>
          </div>
        </div>

        {/* Documentos List */}
        <div className="documentos-list">
          {/* Plano anual */}
          <div className="documento-item">
            <div className="documento-info">
              <div className="documento-nome">Plano Anual</div>
              <div className="documento-status">Documento pendente de geração</div>
            </div>
            <div className="documento-actions">
              <button className="btn-dropdown" onClick={() => toggleSection("planoAnual")}>
                <img
                  src={expandedSections.planoAnual ? chevronUp : chevronDown}
                  alt={expandedSections.planoAnual ? "Fechar" : "Abrir"}
                  className="chevron-icon"
                />
              </button>
            </div>
          </div>

          {/* Subseções do Plano anual */}
          {expandedSections.planoAnual && (
            <div className="plano-anual-subsecoes">
              {(isLoadingPaa || isLoadingAtaPaa) && (
                <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0" />
              )}

              {!isLoadingPaa && !paaVigente?.uuid && (
                <div className="texto-error">PAA vigente não encontrado.</div>
              )}

              {!isLoadingPaa && paaVigente?.uuid && Object.entries(secoesConfig).map(([secaoKey, config]) => renderSecao(secaoKey, config))}
            </div>
          )}

          {/* Ata */}
          <div className="documento-item">
            <div className="documento-info">
              <div className="documento-nome">Ata de Apresentação do PAA</div>
              <div className="documento-status">Documento pendente de geração</div>
            </div>
            <div className="documento-actions">
              <button className="btn btn-outline-success" onClick={handleVisualizarAta} disabled={!ataPaa?.uuid}>
                Visualizar prévia da ata
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
