import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload, faDownload} from "@fortawesome/free-solid-svg-icons";

export const BotoesTopo = () =>{
    return(
        <>
            <div className="d-flex  justify-content-end pb-3">
                <button type="reset" className="btn btn btn-success mt-2">
                    <FontAwesomeIcon
                        style={{fontSize: '15px', marginRight: "3px", color:"#fff"}}
                        icon={faUpload}
                    />
                    Adicionar carga
                </button>
                <button type="submit" className="btn btn-outline-success mt-2 ml-2">
                    <FontAwesomeIcon
                        style={{fontSize: '15px', marginRight: "3px"}}
                        icon={faDownload}
                    />
                    Baixar modelo de planilha
                </button>
            </div>
        </>
    );
};