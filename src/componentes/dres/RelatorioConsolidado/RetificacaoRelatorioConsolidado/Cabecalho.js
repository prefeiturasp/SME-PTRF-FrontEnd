import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRecursoSelecionadoContext } from "../../../../context/RecursoSelecionado";
import { TextoDocumentoConsolidadoPC } from "../../../../utils/TextoDocumentoConsolidadoPC";

export const Cabecalho = ({ referenciaPublicacao, onClickVoltar, formataPeriodo }) => {
  const { recursoSelecionado } = useRecursoSelecionadoContext();

  const texto_documento_consolidado_pc = new TextoDocumentoConsolidadoPC(recursoSelecionado?.habilita_exibicao_lauda)
  const text_possessive = texto_documento_consolidado_pc.possessivo();

  return (
    <div className="row pt-2">
      <div className="col-5">
        <span className="referencia-e-periodo-relatorio">Referência {text_possessive}:</span>
        <br />
        <span className="texto.referencia-e-periodo-relatorio">{referenciaPublicacao}</span>
      </div>

      <div className="col-5">
        <span className="referencia-e-periodo-relatorio">Período:</span>
        <br />
        <span className="texto.referencia-e-periodo-relatorio">{formataPeriodo()}</span>
      </div>

      <div className="col-2 d-flex justify-content-end p-2">
        <button className="btn btn-outline-success btn-ir-para-listagem ml-2" onClick={onClickVoltar}>
          <FontAwesomeIcon style={{ marginRight: "5px" }} icon={faArrowLeft} />
          Voltar
        </button>
      </div>
    </div>
  );
};
