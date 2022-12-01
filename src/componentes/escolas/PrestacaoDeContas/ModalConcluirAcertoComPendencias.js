import React from "react";
import {ModalBootstrapFormConcluirPeriodo} from "../../Globais/ModalBootstrap";

export const ModalConcluirAcertoComPendencias = (props) => {

    const bodyTextarea = () => {
        return (
            <form>
                <div className='row'>

                    <div className="col-12 mt-2">
                        <p>
                            Não é possível concluir o acerto da prestação de contas pois nem todos os acertos 
                            solicitados pela DRE foram realizados ou justificados. É necessário que 
                            você verifique os itens de acerto nos lançamentos/documentos não conferidos ou 
                            que estão conferidos parcialmente.
                        </p>
                    </div>

                    <div className='col-12'>
                        <div className="d-flex justify-content-end pb-3 mt-3">
                            <button
                                onClick={props.onIrParaAnaliseDre}
                                type="button"
                                className="btn btn-success mt-2 mr-2"
                            >
                                Ir para Análise DRE
                            </button>
                            <button onClick={props.handleClose} type="reset"
                                    className="btn btn btn-danger mt-2 mr-2">Fechar
                            </button>
                        </div>
                    </div>

                </div>
            </form>
        )
    };
    return (
            <ModalBootstrapFormConcluirPeriodo
                show={props.show}
                onHide={props.handleClose}
                titulo={props.titulo}
                bodyText={bodyTextarea()}
        />
    );
};