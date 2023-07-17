import React from "react";

export const AcertoComprovanteSaldoDaConta = ({extratosBancariosAjustes}) => {
    return (
        <>
            {extratosBancariosAjustes && extratosBancariosAjustes.solicitar_envio_do_comprovante_do_saldo_da_conta ? (
                    <div className='row'>
                        <div className='col-12'>
                            <p className="text-saldo-reprogramado" id='p_enviar_arquivo_do_comprovante'><strong>Enviar arquivo de Comprovante do saldo da conta</strong></p>
                            {extratosBancariosAjustes && extratosBancariosAjustes.observacao_solicitar_envio_do_comprovante_do_saldo_da_conta && extratosBancariosAjustes.observacao_solicitar_envio_do_comprovante_do_saldo_da_conta.trim() !== "" &&
                                <>
                                    <label id='lbl_enviar_arquivo_do_comprovant' htmlFor="texto-enviar-arquivo-do-comprovante"><strong>Observação</strong></label>
                                    <textarea
                                        rows="3"
                                        defaultValue={extratosBancariosAjustes.observacao_solicitar_envio_do_comprovante_do_saldo_da_conta}
                                        name="texto-enviar-arquivo-do-comprovante"
                                        className="form-control mb-3"
                                        disabled={true}
                                        id='texto_enviar_arquivo_do_comprovante'
                                        style={{backgroundColor: "#fff"}}
                                    />
                                </>
                            }
                        </div>
                    </div>
                ) :
                <></>
            }
        </>
    )
}