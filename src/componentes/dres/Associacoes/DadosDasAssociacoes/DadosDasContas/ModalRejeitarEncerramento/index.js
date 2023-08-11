import {ModalMotivosRejeicaoEncerramentoConta} from "../../../../../Globais/ModalBootstrap";
import React, { useState } from "react";

export const ModalRejeitarEncerramento = (props) => {
    const [motivosRejeicao, setMotivosRejeicao] = useState(props.motivosRejeicao);
    const [outrosMotivosRejeicao, setOutrosMotivosRejeicao] = useState("");

    const handleCheckboxChange = (uuid) => {
        const updatedMotivos = motivosRejeicao.map(motivo => {
            if (motivo.uuid === uuid) {
                return { ...motivo, selected: !motivo.selected };
            }
            return motivo;
        });
        setMotivosRejeicao(updatedMotivos);
    };

    const handleOutrosMotivosChange = (event) => {
        setOutrosMotivosRejeicao(event.target.value);
    };

    const bodyMotivos = () => {
        return (
            <div>
                <p><strong>Selecione o(s) motivo(s):</strong></p>
                {motivosRejeicao.map((motivo) => (
                    <div className="p-2 flex-grow-1" key={motivo.uuid}>
                        <input
                            type='checkbox'
                            onChange={() => handleCheckboxChange(motivo.uuid)}
                            checked={motivo.selected}
                            className="checkbox-comentario-de-analise"
                        />
                        {motivo.nome}
                    </div>
                ))}
                <div>
                    <br/>
                    <label htmlFor="motivo-rejeicao">Outros:</label>
                    <textarea
                        name='motivo-rejeicao'
                        value={outrosMotivosRejeicao}
                        onChange={handleOutrosMotivosChange}
                        className="form-control"
                    />
                </div>
            </div>
        );
    }

    return (
        <ModalMotivosRejeicaoEncerramentoConta
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={bodyMotivos()}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto={props.primeiroBotaoTexto}
            primeiroBotaoCss={props.primeiroBotaoCss}
            segundoBotaoOnclick={() => props.onRejeitarEncerramento(motivosRejeicao, outrosMotivosRejeicao)}
            segundoBotaoTexto={props.segundoBotaoTexto}
            segundoBotaoCss={props.segundoBotaoCss}
        />
    )
};
