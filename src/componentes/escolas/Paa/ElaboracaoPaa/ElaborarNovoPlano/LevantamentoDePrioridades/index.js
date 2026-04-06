import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { downloadPdfLevantamentoPrioridades, getTextosPaaUe } from '../../../../../../services/escolas/Paa.service';
import { ASSOCIACAO_UUID } from "../../../../../../services/auth.service";

const LevantamentoDePrioridades = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [textosLevantamentoPrioridades, setTextosLevantamentoPrioridades] = useState();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const associacao_uuid = localStorage.getItem(ASSOCIACAO_UUID);
      await downloadPdfLevantamentoPrioridades(associacao_uuid);
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const carregaTextos = (async () => {
      let textosPaaResponse = await getTextosPaaUe();

      setTextosLevantamentoPrioridades({
          texto_levantamento_prioridades: textosPaaResponse.texto_levantamento_prioridades,
      });
    });

    carregaTextos();
  }, []);

  return (
    <div className="container-fluid">
      <br />

      <div className="text-break">
        <div dangerouslySetInnerHTML={{__html:textosLevantamentoPrioridades?.texto_levantamento_prioridades}}></div>
      </div>
      
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
