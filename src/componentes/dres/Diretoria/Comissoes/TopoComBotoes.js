import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import { visoesService } from "../../../../services/visoes.service";

export const TopoComBotoes = ({handleOnShowModalAdicao}) => {
    return (
        <div className="row">
            <div className="col-8">
                <h4>Comissões Relativas ao PTRF</h4>
            </div>

            <div className="col-4">
                <button
                    disabled={!visoesService.getPermissoes(['change_comissoes_dre'])}
                    onClick={(e) => {handleOnShowModalAdicao()}}
                    type="button"
                    className="btn btn-success float-right"
                >
                    <FontAwesomeIcon
                        style={{fontSize: '15px', marginRight: "5px", color: '#FFFFFF'}}
                        icon={faPlus}
                    />
                    <strong>Adicionar novo membro</strong>
                </button>
            </div>
        </div>
    )
}