import React, {useState} from "react";
import {ModalFormParametrizacoesAcoesDaAssociacao} from "../../../../Globais/ModalBootstrap";
import AutoCompleteAssociacoes from "./AutoCompleteAssociacoes";
export const ModalFormAcoesDaAssociacao = (props) => {

    const [associacaoAutocomplete, setAssociacaoAutocomplete] = useState(null);

    const recebeAcaoAutoComplete = (selectAcao) =>{
        setAssociacaoAutocomplete(selectAcao)
    };

    console.log('associacaoAutocomplete ', associacaoAutocomplete)

    const bodyTextarea = () => {
        return (
            <>
                <AutoCompleteAssociacoes
                    todasAsAcoesAutoComplete={props.todasAsAcoesAutoComplete}
                    recebeAcaoAutoComplete={recebeAcaoAutoComplete}
                />
                <div className="p-Y bd-highlight">
                    <button onClick={props.handleClose} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                    <button onClick={props.handleSubmitModalFormAcoesDasAssociacoes} type="reset" className="btn btn btn-success mt-2">Enviar</button>
                </div>

            </>
        )
    };

    return (
        <ModalFormParametrizacoesAcoesDaAssociacao
            show={props.show}
            onHide={props.handleClose}
            bodyText={bodyTextarea()}
            primeiroBotaoOnclick={props.handleClose}
        />
    )
};