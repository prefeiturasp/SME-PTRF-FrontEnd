import {ModalBootstrapFormExcluirTecnicoDre} from "../../../Globais/ModalBootstrap";
import React from "react";

export const ConfirmaDeleteTecnico = ({show, onCancelDelete, onConfirmDelete, stateTecnicoForm, tecnicosList, stateSelectDeleteTecnico, handleChangeSelectDeleteTecnico, handleChangeCheckboxDeleteTecnico}) => {

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
                                value={stateSelectDeleteTecnico.selectTecnicoDelete}
                                onChange={(e) => handleChangeSelectDeleteTecnico(e.target.value)}
                                className="form-control"
                                name="selectTecnicoDelete"
                                id="selectTecnicoDelete"
                            >
                                <option value="">Selecione uma opção</option>
                                {tecnicosList && tecnicosList.length > 0 && tecnicosList.map((tecnico, index)=>
                                    <option key={index} value={tecnico.uuid}>{tecnico.nome}</option>
                                )}
                            </select>
                        </div>
                        <div className="form-check">
                            <input
                                type="checkbox"
                                onChange={(e)=>handleChangeCheckboxDeleteTecnico(e)}
                                name="checkboxTecnicoDelete"
                                id="checkboxTecnicoDelete"
                                className="form-check-input"
                            />
                            <label className="form-check-label" htmlFor="checkboxTecnicoDelete">Marcar como lida</label>
                        </div>
                    </form>
                    {/*<FormAlterarEmail
                        handleClose={onCancelDelete}
                    />*/}
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
