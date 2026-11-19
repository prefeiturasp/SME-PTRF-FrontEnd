import "./styles.css";

import chevronUp from "../../../../../../assets/img/icone-chevron-up.svg";
import chevronDown from "../../../../../../assets/img/icone-chevron-down.svg";

import { usePatchPaa } from "./hooks/usePatchPaa";
import { useNavigate } from "react-router-dom";
import { visoesService } from "../../../../../../services/visoes.service";

import { RelSecaoTextos } from "./RelSecaoTextos";
import { RelSecaoObjetivos } from "./RelSecaoObjetivos";
import { RelSecaoComponentes } from "./RelSecaoComponentes";

export const RenderSecao = ({
  secaoKey,
  config,
  isExpanded,
  toggleSection = () => {},
  textosPaa,
  isLoading,
  isError,
  isLoadingPaa,
  paaAtual,
  podeEditar = true,
}) => {
  const { patchPaa, isLoading: isSaving } = usePatchPaa();
  const navigate = useNavigate();
  const exibeAtividadesPrevistas = visoesService.featureFlagAtiva?.("paa-receitas-prevista");

  if (config.chave === "atividades-previstas" && !exibeAtividadesPrevistas) {
    return null;
  }

  const handleSalvarObjetivos = async (objetivos) => {
    if (!podeEditar || !paaAtual?.uuid) {
      return;
    }
    patchPaa({ uuid: paaAtual.uuid, payload: { objetivos } });
  };

  const handleSalvarTexto = async (campoPaa, texto) => {
    if (!podeEditar || !paaAtual?.uuid) {
      return;
    }

    const payload = {
      [campoPaa]: texto,
    };

    patchPaa({ uuid: paaAtual.uuid, payload });
  };

  const contentClassName = `expanded-item-content`;

  return (
    <div key={secaoKey} className={`subsecao-item ${isExpanded ? "subsecao-item-open" : ""}`}>
      <div className="subsecao-info">
        <div className="subsecao-header">
          <div className="subsecao-titulo">{config.titulo}</div>
          {config.tipo === "link" ? (
            <button
              type="button"
              onClick={() => navigate(config.rota)}
              className="btn btn-outline-success"
            >
              {config.acao}
            </button>
          ) : (
            <button className="btn-dropdown" onClick={() => toggleSection(secaoKey)}>
              <img
                src={isExpanded ? chevronUp : chevronDown}
                alt={isExpanded ? "Fechar" : "Abrir"}
                className="chevron-icon"
              />
            </button>
          )}
        </div>
        {/* Textos de introdução dentro do header */}
        {isExpanded && (
          <div className={contentClassName}>
            {isLoading && <div className="texto-loading">Carregando...</div>}

            {isError && <div className="texto-error">Erro ao carregar textos do PAA</div>}

            {isLoadingPaa && <div className="texto-loading">Carregando PAA vigente...</div>}

            {!isLoading && !isError && !isLoadingPaa && (
              <>
                {config.temEditor && (
                  <>
                    {["introducao", "conclusao"].includes(config.chave) && (
                      <RelSecaoTextos
                        secaoKey={secaoKey}
                        config={config}
                        textosPaa={textosPaa}
                        paaAtual={paaAtual}
                        handleSalvarTexto={handleSalvarTexto}
                        isSaving={isSaving}
                        podeEditar={podeEditar}
                      />
                    )}
                  </>
                )}

                {config.chave === "componentes" && <RelSecaoComponentes />}

                {config.chave === "objetivos" && (
                  <RelSecaoObjetivos
                    paaAtual={paaAtual}
                    onSalvarObjetivos={handleSalvarObjetivos}
                    isSaving={isSaving}
                    podeEditar={podeEditar}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
