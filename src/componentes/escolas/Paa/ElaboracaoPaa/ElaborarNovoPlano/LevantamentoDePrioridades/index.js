import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faSearch, faDownload} from "@fortawesome/free-solid-svg-icons";

const LevantamentoDePrioridades = () => {
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
        <button className="btn btn-success" onClick={() => {}}>
          <FontAwesomeIcon
            style={{fontSize: '15px', color: 'white', paddingRight: '5px'}}
            icon={faDownload}
          />
          Faça download da planilha
        </button>
      </div>
    </div>
  );
};

export default LevantamentoDePrioridades;
