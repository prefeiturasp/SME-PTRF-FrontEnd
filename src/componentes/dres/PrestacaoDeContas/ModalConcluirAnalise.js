import React from "react";
import {ModalBootstrapFormConcluirAnalise} from "../../Globais/ModalBootstrap";

export const ModalConcluirAnalise = (props) => {
    const bodyTextarea = () => {
        return (
            <form>
                <div className='row'>
                    <div className="col-12">
                        <p>Como você deseja concluir a análise?</p>
                        <label htmlFor="status">Filtrar por status</label>
                        <select
                            value={props.stateConcluirAnalise.status}
                            onChange={(e) => props.handleChangeConcluirAnalise(e.target.name, e.target.value)}
                            name="status"
                            id="status"
                            className="form-control"
                        >
                            <option value="">Selecione um status</option>
                            {props.tabelaPrestacoes.status && props.tabelaPrestacoes.status.length > 0 && props.tabelaPrestacoes.status.filter(element => element.id !== 'DOCS_PENDENTES' && element.id !== 'NAO_RECEBIDA' && element.id !== 'RECEBIDA' && element.id !== 'EM_ANALISE').map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>

                    {props.stateConcluirAnalise.status === 'APROVADA_RESSALVA' &&
                        <div className="col-12 mt-2">
                            <label htmlFor="resalvas">Motivos:</label>
                            <textarea
                                name='resalvas'
                                value={props.stateConcluirAnalise.resalvas}
                                onChange={(e) => props.handleChangeConcluirAnalise(e.target.name, e.target.value)}
                                className="form-control"
                            />
                        </div>
                    }
                </div>
            </form>
        )
    };
    return (
        <>
            <ModalBootstrapFormConcluirAnalise
                show={props.show}
                onHide={props.handleClose}
                titulo={props.titulo}
                bodyText={bodyTextarea()}
                primeiroBotaoOnclick={props.handleClose}
                primeiroBotaoTexto={props.primeiroBotaoTexto}
                primeiroBotaoCss={props.primeiroBotaoCss}
                segundoBotaoOnclick={props.onConcluirAnalise}
                segundoBotaoCss={props.segundoBotaoCss}
                segundoBotaoTexto={props.segundoBotaoTexto}
            />
        </>
    );
}