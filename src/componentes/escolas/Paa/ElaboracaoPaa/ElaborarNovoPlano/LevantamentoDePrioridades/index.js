import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { downloadPdfLevantamentoPrioridades } from '../../../../../../services/escolas/Paa.service';
import { ASSOCIACAO_UUID } from "../../../../../../services/auth.service";

const LevantamentoDePrioridades = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const associacao_uuid = localStorage.getItem(ASSOCIACAO_UUID);
      await downloadPdfLevantamentoPrioridades(associacao_uuid);
    } catch (error) {
      console.log("Erro ao baixar PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="container-fluid">
      <br />
      <p>
        A etapa do levantamento de atividades e prioridades é um momento em que todos os segmentos das Unidades Educacionais realizam uma escuta junto às equipes técnicas, de apoio e corpo docente sobre aquisições e serviços considerados fundamentais para a melhoria das condições de trabalho durante o próximo ano letivo.
      </p>

      <p>
        Após esta etapa, a APM realiza um trabalho de previsão de atividades e receitas e constrói um Plano Anual de Atividades, que priorizará as aquisições e serviços listados a partir de uma análise das necessidades da unidade e dos recursos previstos.
      </p>
      
      <div className="d-flex justify-content-end w-100">
        <button
          className="btn btn-success d-flex align-items-center"
          onClick={handleDownload}
          disabled={isDownloading}
          style={{ minWidth: '180px', justifyContent: 'center' }}
        >
          <div style={{ width: '20px', height: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FontAwesomeIcon
              style={{ fontSize: '15px', color: 'white' }}
              icon={isDownloading ? faCircleNotch : faDownload}
              spin={isDownloading}
            />
          </div>
          <span style={{ marginLeft: '8px' }}>Faça download do PDF</span>
        </button>
      </div>
    </div>
  );
};

export default LevantamentoDePrioridades;
