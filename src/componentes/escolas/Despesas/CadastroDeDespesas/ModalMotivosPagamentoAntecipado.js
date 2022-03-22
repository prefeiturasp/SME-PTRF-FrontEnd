import React, {memo} from "react";
import {ModalFormBodyText} from "../../../Globais/ModalBootstrap";
import {MultiSelect} from "primereact/multiselect";

const ModalMotivosPagamentoAntecipado = ({
                                                    show,
                                                    handleClose,
                                                    listaDemotivosPagamentoAntecipado,
                                                    selectMotivosPagamentoAntecipado,
                                                    setSelectMotivosPagamentoAntecipado,
                                                    checkBoxOutrosMotivosPagamentoAntecipado,
                                                    txtOutrosMotivosPagamentoAntecipado,
                                                    handleChangeCheckBoxOutrosMotivosPagamentoAntecipado,
                                                    handleChangeTxtOutrosMotivosPagamentoAntecipado,
                                                    onSubmit,
                                                    setFieldValue,
                                                    values
                                                }) => {

    const selectedItemsLabel = (motivos) => {
        if (motivos && motivos.length > 0){
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
                        <p>A data do documento é posterior à data cadastrada para o pagamento. Confirma o lançamento?</p>
                        <label htmlFor="ressalvas">Motivo(s)</label>
                        <br/>
                        <div className="multiselect-demo">
                            <div className="">
                                <MultiSelect
                                    value={selectMotivosPagamentoAntecipado}
                                    options={listaDemotivosPagamentoAntecipado}
                                    onChange={(e) => {
                                        setSelectMotivosPagamentoAntecipado(e.value);
                                    }}
                                    optionLabel="motivo"
                                    placeholder="Selecione o(s) motivo(s)"
                                    maxSelectedLabels={0}
                                    selectedItemsLabel={selectedItemsLabel(selectMotivosPagamentoAntecipado)}
                                />
                            </div>
                        </div>

                        <div className="mt-2 ml-2">
                            {selectMotivosPagamentoAntecipado && selectMotivosPagamentoAntecipado.length > 0 && selectMotivosPagamentoAntecipado.map((motivo, index) => (
                                <strong key={motivo.id}><p
                                    className="lista-motivos mb-0">{index + 1}. {motivo.motivo}</p></strong>
                            ))}
                        </div>

                        <div className="form-check mt-3 pl-0">
                            <input
                                name="check_box_outros_motivos"
                                id="check_box_outros_motivos"
                                type="checkbox"
                                checked={checkBoxOutrosMotivosPagamentoAntecipado}
                                onChange={(e) => handleChangeCheckBoxOutrosMotivosPagamentoAntecipado(e)}
                            />
                            <label className="form-check-label ml-2" htmlFor="check_box_outros_motivos">
                                Outros motivos
                            </label>
                        </div>
                        {checkBoxOutrosMotivosPagamentoAntecipado &&
                            <textarea
                                name='outros_motivos_reprovacao'
                                value={txtOutrosMotivosPagamentoAntecipado}
                                onChange={(e) => handleChangeTxtOutrosMotivosPagamentoAntecipado(e)}
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
                                onClick={() => onSubmit(values, setFieldValue)}
                                type="button"
                                className="btn btn-success mt-2"
                                disabled={selectMotivosPagamentoAntecipado.length <= 0 && !txtOutrosMotivosPagamentoAntecipado.trim()}
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
            titulo="Motivos de pagamento antecipado"
            onHide={handleClose}
            bodyText={bodyTextarea()}
        />
    )
}

export default memo(ModalMotivosPagamentoAntecipado)