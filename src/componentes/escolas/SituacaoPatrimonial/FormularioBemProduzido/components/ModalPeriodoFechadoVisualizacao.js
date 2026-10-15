import { memo } from "react";
import { ModalBootstrap } from "../../../../Globais/ModalBootstrap";

const TEXTO_PERIODO_FECHADO =
  "Este período está fechado. Para inclusão ou edição de bens produzidos é necessário reabrir o processo de prestação de contas. Se for esse o caso, por favor, entre em contato com sua Diretoria Regional de Educação - DRE.";

const ModalPeriodoFechadoVisualizacao = ({ show, handleClose }) => {
  return (
    <ModalBootstrap
      dataQa="modal-periodo-fechado-bem-produzido"
      show={show}
      onHide={handleClose}
      titulo="Período Fechado"
      bodyText={TEXTO_PERIODO_FECHADO}
      primeiroBotaoOnclick={handleClose}
      primeiroBotaoTexto="Fechar"
      primeiroBotaoCss="success"
    />
  );
};

export default memo(ModalPeriodoFechadoVisualizacao);
