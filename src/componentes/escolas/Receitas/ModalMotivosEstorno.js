import React, {memo} from "react";
import {ModalFormBodyText} from "../../Globais/ModalBootstrap";
import {MultiSelect} from "primereact/multiselect";

const ModalMotivosEstorno = ({
                                 show,
                                 handleClose,
                                 listaMotivosEstorno,
                                 selectMotivosEstorno,
                                 setSelectMotivosEstorno,
                                 checkBoxOutrosMotivosEstorno,
                                 txtOutrosMotivosEstorno,
                                 handleChangeCheckBoxOutrosMotivosEstorno,
                                 handleChangeTxtOutrosMotivosEstorno,
                                 setShowModalMotivoEstorno,
                                 onSubmit,
                                 setFieldValue,
                                 values,
                                 errors
                             }) => {

    const selectedItemsLabel = (motivos) => {
        if (motivos && motivos.length > 0) {
            if (motivos.length === 1) {
                return "1 selecionado"
            } else {
                return `${motivos.length} selecionados`
            }
        }
    }

    const bodyTextarea = () => {
        return (
            <form>
                <div className='row'>
                    <div className="col-12 mt-2">
                        <p>Motivos para a existência do estorno</p>
                        <label htmlFor="ressalvas">Motivo(s)</label>
                        <br/>
                        <div className="multiselect-demo">
                            <div className="">
                                <MultiSelect
                                    value={selectMotivosEstorno}
                                    options={listaMotivosEstorno}
                                    onChange={(e) => {
                                        setSelectMotivosEstorno(e.value);
                                    }}
                                    optionLabel="motivo"
                                    placeholder="Selecione o(s) motivo(s)"
                                    maxSelectedLabels={0}
                                    selectedItemsLabel={selectedItemsLabel(selectMotivosEstorno)}
                                />
                            </div>
                        </div>

                        <div className="mt-2 ml-2">
                            {selectMotivosEstorno && selectMotivosEstorno.length > 0 && selectMotivosEstorno.map((motivo, index) => (
                                <strong key={motivo.id}><p
                                    className="lista-motivos mb-0">{index + 1}. {motivo.motivo}</p></strong>
                            ))}
                        </div>

                        <div className="form-check mt-3 pl-0">
                            <input
                                name="check_box_outros_motivos"
                                id="check_box_outros_motivos"
                                type="checkbox"
                                checked={checkBoxOutrosMotivosEstorno}
                                onChange={(e) => handleChangeCheckBoxOutrosMotivosEstorno(e)}
                            />
                            <label className="form-check-label ml-2" htmlFor="check_box_outros_motivos">
                                Outros motivos
                            </label>
                        </div>
                        {checkBoxOutrosMotivosEstorno &&
                            <textarea
                                name='outros_motivos_reprovacao'
                                value={txtOutrosMotivosEstorno}
                                onChange={(e) => handleChangeTxtOutrosMotivosEstorno(e)}
                                className="form-control"
                            />
                        }

                    </div>

                    <div className='col-12'>
                        <div className="d-flex  justify-content-end pb-3 mt-3">
                            <button onClick={handleClose} type="reset"
                                    className="btn btn btn-outline-success mt-2 mr-2">Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    setShowModalMotivoEstorno(false)
                                    onSubmit(values, errors)
                                }}
                                type="button"
                                className="btn btn-success mt-2"
                                disabled={selectMotivosEstorno.length <= 0 && !txtOutrosMotivosEstorno.trim()}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>

                </div>
            </form>
        )
    }

    return (
        <ModalFormBodyText
            show={show}
            titulo="Motivos Estorno"
            onHide={handleClose}
            bodyText={bodyTextarea()}
        />
    )
}

export default memo(ModalMotivosEstorno)