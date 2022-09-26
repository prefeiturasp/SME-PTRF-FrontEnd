import React from "react";
import {ModalBootstrapFormConcluirPeriodo} from "../../Globais/ModalBootstrap";

export const ModalConcluirPeriodoComPendencias = (props) => {

    const bodyTextarea = () => {
        return (
            <form>
                <div className='row'>

                    <div className="col-12 mt-2">
                        <p>Ao concluir a Prestação de Contas, o sistema <strong>bloqueará</strong> o cadastro e a edição de qualquer crédito ou despesa nesse período.
                            Para conferir as informações cadastradas, sem bloqueio do sistema nesse período, gere um
                            documento prévio.</p>
                        <p>Nem todos os acertos solicitados pela DRE foram realizados ou justificados. É necessário que
                            você informe uma justificativa.</p>

                        <label htmlFor="justificativa">Justificativa:</label>
                        <textarea
                            name='justificativa'
                            value={props.txtJustificativa}
                            onChange={(e) => props.handleChangeTxtJustificativa(e)}
                            className="form-control"
                            placeholder="Informe a justificativa (campo obrigatório)"
                            rows="3"
                        />
                        <br/>
                        <p>Você confirma a conclusão dessa Prestação de Contas?</p>
                    </div>

                    <div className='col-12'>
                        <div className="d-flex justify-content-end pb-3 mt-3">
                            <button
                                onClick={props.onConcluir}
                                type="button"
                                className="btn btn-success mt-2 mr-2"
                                disabled={!props.txtJustificativa}
                            >
                                Confirmar
                            </button>
                            <button onClick={props.handleClose} type="reset"
                                    className="btn btn btn-danger mt-2 mr-2">Cancelar
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