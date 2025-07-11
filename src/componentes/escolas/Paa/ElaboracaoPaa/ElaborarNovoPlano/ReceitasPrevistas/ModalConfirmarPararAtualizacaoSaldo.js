import { memo } from "react";
import { Row, Spin, Modal } from "antd";
import { useAtivarSaldoPAA, useDesativarSaldoPAA } from './hooks/usePararAtualizacaoSaldoPaa';
import IconeAvisoVermelho from "../../../../../../assets/img/icone-modal-aviso-vermelho.svg"


const ModalConfirmaPararAtualizacaoSaldo = ({ open, onClose, check, paa, onSubmitParadaSaldo}) => {

  const onSuccess = (data) => {
    // Disparar o Submit para o index somente se o request for sucesso
    onSubmitParadaSaldo()
    onClose()
  }

  const onError = (e) => {
    onClose()
    console.error('onError Data', e)
  }

  const { mutationPost: mutationPostAtivar } = useAtivarSaldoPAA(onSuccess, onError);
  const { mutationPost: mutationPostDesativar } = useDesativarSaldoPAA(onSuccess, onError);

  const onSubmit = () => {
    if (check) {
      mutationPostDesativar.mutate({ uuid: paa.uuid });
    } else {
      mutationPostAtivar.mutate({ uuid: paa.uuid });
    }
  };

  return (
    <div>
        <Modal
            zIndex={1060}
            centered
            open={open}
            onOk={onSubmit}
            okText="Confirmar"
            okButtonProps={
              {
                "data-testid": "botao-confirmar-congelamento",
                disabled: mutationPostAtivar.isLoading ||
                          mutationPostDesativar.isLoading
              }}
            onCancel={onClose}
            cancelText="Cancelar"
            cancelButtonProps={
              {
                "data-testid": "botao-cancelar-confirmar-congelamento",
                disabled: mutationPostAtivar.isLoading ||
                          mutationPostDesativar.isLoading
              }}
            wrapClassName={'modal-ant-design'}
        >
          <Spin spinning={mutationPostAtivar.isLoading || mutationPostDesativar.isLoading }>
            <Row justify="center">
              <img src={IconeAvisoVermelho} alt="" className="img-fluid my-3"/>
            </Row>
            <Row justify="center">
                <p className="title-modal-antdesign-aviso">{`${check ? 'Parar' : 'Desbloquear'} atualização do saldo`}</p>
            </Row>
            <Row justify="center">
                <div className="body-text-modal-antdesign-aviso my-3 text-center">
                  {check ? 
                    <>O saldo reprogramado do PTRF será bloqueado na data e hora atual para a realização do cálculo das receitas previstas no PAA.</>
                    :
                    <>O saldo reprogramado do PTRF será desbloqueado e atualizado  para a realização do cálculo das receitas previstas no PAA.</>
                  }
                </div>
            </Row>
          </Spin>
        </Modal>
    </div>
  );
  
};

export default memo(ModalConfirmaPararAtualizacaoSaldo);