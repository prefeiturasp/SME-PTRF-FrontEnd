import "./styles.css";

import chevronUp from "../../../../../../assets/img/icone-chevron-up.svg";
import chevronDown from "../../../../../../assets/img/icone-chevron-down.svg";

import { usePatchPaa } from "./hooks/usePatchPaa";

import { RelSecaoTextos as RelIntroducaoPaa } from "./RelSecaoTextos";
import { RelSecaoTextos as RelConclusaoPaa } from "./RelSecaoTextos";
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
  paaVigente,
}) => {
  const { patchPaa, isLoading: isSaving } = usePatchPaa();

  const handleSalvarObjetivos = async (objetivos) => {
    if (!paaVigente?.uuid) {
      return;
    }
    patchPaa({ uuid: paaVigente.uuid, payload: { objetivos } });
  };

  const handleSalvarTexto = async (campoPaa, texto) => {
    if (!paaVigente?.uuid) {
      return;
    }

    const payload = {
      [campoPaa]: texto !== "" ? texto : "Comece a digitar aqui...",
    };

    patchPaa({ uuid: paaVigente.uuid, payload });
  };

  const contentClassName = `expanded-item-content`;

  return (
    <div key={secaoKey} className={`subsecao-item ${isExpanded ? "subsecao-item-open" : ""}`}>
      <div className="subsecao-info">
        <div className="subsecao-header">
          <div className="subsecao-titulo">{config.titulo}</div>
          <button className="btn-dropdown" onClick={() => toggleSection(secaoKey)}>
            <img
              src={isExpanded ? chevronUp : chevronDown}
              alt={isExpanded ? "Fechar" : "Abrir"}
              className="chevron-icon"
            />
          </button>
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
                    {config.chave === "introducao" && (
                      <RelIntroducaoPaa
                        secaoKey={secaoKey}
                        config={config}
                        textosPaa={textosPaa}
                        paaVigente={paaVigente}
                        handleSalvarTexto={handleSalvarTexto}
                        isSaving={isSaving}
                      />
                    )}

                    {config.chave === "conclusao" && (
                      <RelConclusaoPaa
                        secaoKey={secaoKey}
                        config={config}
                        textosPaa={textosPaa}
                        paaVigente={paaVigente}
                        handleSalvarTexto={handleSalvarTexto}
                        isSaving={isSaving}
                      />
                    )}
                  </>
                )}

                {config.chave === "componentes" && <RelSecaoComponentes />}

                {config.chave === "objetivos" && (
                  <RelSecaoObjetivos
                    paaVigente={paaVigente}
                    onSalvarObjetivos={handleSalvarObjetivos}
                    isSaving={isSaving}
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
