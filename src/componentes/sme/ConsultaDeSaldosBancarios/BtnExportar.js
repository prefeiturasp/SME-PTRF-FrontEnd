import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";

export const BtnExportar = ({handleOnClickExportar}) => {
    return(
        <>
            
            <button
                onClick={handleOnClickExportar}
                type="button"
                className="btn btn btn-outline-success float-right"
                style={{marginTop: "1.9em"}}
            >
                <FontAwesomeIcon
                    style={{marginRight: "5px", color: '#2B7D83'}}
                    icon={faDownload}
                />
                Exportar planilha
            </button>

            
        </>
    )
};