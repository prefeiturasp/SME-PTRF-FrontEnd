import React, { useContext } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {ValidarParcialTesouro} from '../../../../../../context/DetalharAcertos'

export const TopoComBotoes = ({onSubmitFormAcertos, onClickBtnVoltar}) =>{
    const {isValorParcialValido} = useContext(ValidarParcialTesouro)

    return(
        <div className="d-flex bd-highlight align-items-center">
            <div className="p-2 flex-grow-1 bd-highlight">
                <h5 className="titulo-itens-painel mb-0">Lançamentos selecionados</h5>
            </div>
            <div className="p-2 bd-highlight">
                <button onClick={onClickBtnVoltar} className="btn btn btn-outline-success mr-2">
                    <FontAwesomeIcon
                        style={{color: "#00585E", fontSize: '15px', marginRight: "3px"}}
                        icon={faArrowLeft}
                    />
                    Voltar
                </button>
                <button onClick={onSubmitFormAcertos} disabled={isValorParcialValido} className="btn btn btn-success">Salvar</button>
            </div>
        </div>
    )
}