import React, {useState} from "react";
import {Modal} from "react-bootstrap";
import {DatePickerField} from "../../../Globais/DatePickerField";
import moment from "moment";

export const ModalInformarSaidaDoCargo = ({
    show=false,
    composicaoAtual, 
    handleClose, 
    handleConfirm
}) => {
    const [dataSaida, setDataSaida] = useState("");

    const handleChange = (name, value) => {
        setDataSaida(value);
    };

    if (!composicaoAtual){
        return null;
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Informar saída do cargo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-inline mt-3">
                    <div className="form-group mb-2">
                        <label className="mr-3">Data da saída *</label>
                        <DatePickerField
                            name="data_saida"
                            value={dataSaida}
                            onChange={handleChange}
                            placeholderText={"DD/MM/AAAA"}
                            minDate={composicaoAtual && composicaoAtual.info_composicao_anterior ? moment(composicaoAtual.info_composicao_anterior.data_final).toDate() : ""}
                            maxDate={new Date() < moment(composicaoAtual.data_final).toDate() ? new Date() : moment(composicaoAtual.data_final).toDate()}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={handleClose} className="btn btn-outline-success">
                    Cancelar
                </button>
                <button 
                    onClick={() => handleConfirm(dataSaida)}
                    className={`btn btn-success mt-2`}
                    disabled={!dataSaida}
                >
                    Confirmar
                </button>
            </Modal.Footer>
        </Modal>
    )
}
