import { memo } from "react";
import { Row, Modal, Button } from "antd";
import IconeAvisoVermelho from "../../../../../assets/img/icone-modal-aviso-vermelho.svg";

const ModalPeriodoFechado = ({ open, onClose }) => {
  return (
    <div>
      <Modal
        zIndex={1060}
        centered
        open={open}
        onCancel={onClose}
        wrapClassName={'modal-ant-design'}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              onClick={onClose}
              data-testid="botao-fechar-modal-periodo-fechado"
            >
              Fechar
            </Button>
          </div>
        }
      >
        <Row justify="center">
          <img src={IconeAvisoVermelho} alt="" className="img-fluid my-3" />
        </Row>
        <Row justify="center">
          <p className="title-modal-antdesign-aviso">Período Fechado</p>
        </Row>
        <Row justify="center">
          <div className="body-text-modal-antdesign-aviso my-3 text-center">
            Para inclusão do bem produzido é necessário reabrir ou selecionar despesas de períodos posteriores. 
            Se o caso for reabrir, por favor, entre em contato com sua Diretoria Regional de Educação - DRE.
          </div>
        </Row>
      </Modal>
    </div>
  );
};

export default memo(ModalPeriodoFechado);

