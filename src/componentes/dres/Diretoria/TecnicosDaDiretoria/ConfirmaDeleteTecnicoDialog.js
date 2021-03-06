import {ModalBootstrapFormExcluirTecnicoDre} from "../../../Globais/ModalBootstrap";
import React from "react";

export const ConfirmaDeleteTecnico = ({show, onCancelDelete, onConfirmDelete, stateTecnicoForm, tecnicosList, stateSelectDeleteTecnico, stateCheckboxDeleteTecnico, handleChangeSelectDeleteTecnico, handleChangeCheckboxDeleteTecnico}) => {
    const bodyTextarea = () => {
        return (
            <>
                <div className="col-12">
                    <p>Você está prestes a excluir o técnico abaixo.</p>
                    <p><strong>{stateTecnicoForm.nome} — Registro Funcional: {stateTecnicoForm.rf}</strong></p>
                    <p>Deseja transfirir todas as escolas para outro técnico?</p>
                    <form>
                        <div className="form-group">
                            <select
                                value={stateCheckboxDeleteTecnico ? "" : stateSelectDeleteTecnico ? stateSelectDeleteTecnico : ""}
                                onChange={(e) => handleChangeSelectDeleteTecnico(e.target.value)}
                                className="form-control"
                                name="selectTecnicoDelete"
                                id="selectTecnicoDelete"
                            >
                                <option value="">Selecione uma opção</option>
                                {tecnicosList && tecnicosList.length > 0 && tecnicosList.filter(tecnico => tecnico.uuid !== stateTecnicoForm.uuid).map((tec, index)=>
                                    <option key={index} value={tec.uuid}>{tec.nome}</option>
                                )}
                            </select>
                        </div>
                        <div className="form-check">
                            <input
                                type="checkbox"
                                onChange={(e)=>handleChangeCheckboxDeleteTecnico(e)}
                                defaultChecked={stateCheckboxDeleteTecnico}
                                name="checkboxTecnicoDelete"
                                id="checkboxTecnicoDelete"
                                className="form-check-input"
                            />
                            <label className="form-check-label" htmlFor="checkboxTecnicoDelete">Não transferir no momento e deixar unidades escolares sem atribuição</label>
                        </div>
                        <div className="d-flex  justify-content-end pb-3 mt-3">
                            <button onClick={()=>onCancelDelete()} type="reset" className="btn btn-outline-success mt-2 mr-2">Cancelar</button>
                            <button onClick={()=>onConfirmDelete()} disabled={!stateSelectDeleteTecnico && !stateCheckboxDeleteTecnico} type="button" className="btn btn-success mt-2">Excluir</button>
                        </div>
                    </form>
                </div>
            </>
        )
    };

    return (
        <ModalBootstrapFormExcluirTecnicoDre
            show={show}
            onHide={onCancelDelete}
            titulo="Excluir um técnico"
            bodyText={bodyTextarea()}
        />
    )
};
