import React from 'react';
import { ModalRemovelAcessoUsuario } from '../../ModalAntDesign/modalRemoverAcessoUsuario';

export const ModalConfirmacaoRemoverAcesso = ({
  visao,
  show,
  botaoCancelarHandle,
  botaoConfirmarHandle,
}) => {
  const mensagens = {
    UE: 'Tem certeza que deseja remover o acesso deste usuário nessa unidade?',
    DRE: 'Tem certeza que deseja remover o acesso deste usuário nesta DRE e em suas unidades, se houver?',
    SME: 'Tem certeza que deseja remover o acesso deste usuário em todas as unidades?'
  };

  const observacoes = {
    UE: '',
    DRE: 'Para remover o acesso a apenas uma de suas unidades, basta desabilitá-lo na referida unidade.',
    SME: 'Para remover o acesso a apenas uma de suas unidades, basta desabilitá-lo na referida unidade.'
  }

  const mensagem = mensagens[visao] || 'Mensagem não disponível para a visão selecionada.';

  const observacao = observacoes[visao] || ''


  return (
    <ModalRemovelAcessoUsuario
      handleShow={show}
      onHide={botaoCancelarHandle}
      titulo="Remover acesso"
      bodyText={mensagem}
      cancelText="Cancelar"
      primeiroBotaoCss="outline-success"
      handleCancel={botaoCancelarHandle}
      okText="Remover acesso"
      segundoBotaoCss="danger"
      handleOk={botaoConfirmarHandle}
      okButton={true}
      observacao={observacao}
    />
  );
};
