import React, {useState} from "react";
import {Modal} from "react-bootstrap";
import {DatePickerField} from "../../../Globais/DatePickerField";
import moment from "moment";

// Regra definida para constante de D-1 para registro de saída de Membro
const D_N = 1

export const ModalInformarSaidaCargoVacancia = ({
    show = false,
    dataInicioNoCargo,
    dataFinalMandato,
    handleClose,
    handleConfirm,
}) => {
    const [dataSaida, setDataSaida] = useState("");

    const handleChange = (name, value) => {
        setDataSaida(value);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Informar saída do cargo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-inline mt-3 ModalInformarSaidaCargoVacancia">
                    <div className="form-group mb-2">
                        <label htmlFor="data_saida" className="mr-3">Data da saída *</label>
                        <DatePickerField
                            id="data_saida"
                            name="data_saida"
                            value={dataSaida}
                            autoComplete="off"
                            onChange={handleChange}
                            placeholderText={"DD/MM/AAAA"}
                            minDate={dataInicioNoCargo ? moment(dataInicioNoCargo).add(1, 'days').toDate() : ""}
                            maxDate={dataFinalMandato && new Date() < moment(dataFinalMandato).toDate() ? new Date() : (dataFinalMandato ? moment(dataFinalMandato).toDate() : "")}
                        />
                    </div>
                </div>
                {dataSaida && <div className="mt-3">
                    <strong>Atenção: </strong>
                    A data que será utilizada para fins de atribuição
                    do cargo será até dia {moment(dataSaida).subtract(D_N, 'days').format("DD/MM/YYYY")}
                </div>}
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