import React from "react";

export const AcertoCorrecaoDataSaldoConta = ({ extratosBancariosAjustes }) => {
  return (
    <>
      {extratosBancariosAjustes && extratosBancariosAjustes.solicitar_correcao_da_data_do_saldo_da_conta ? (
        <div className="row">
          <div className="col-12">
            <p className="text-saldo-reprogramado" id="p_enviar_arquivo_do_comprovante">
              <strong>Solicitar correção da data do saldo da conta</strong>
            </p>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
