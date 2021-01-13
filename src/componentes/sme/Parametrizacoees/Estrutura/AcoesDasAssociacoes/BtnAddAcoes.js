import React from "react";

export const BtnAddAcoes = ({FontAwesomeIcon, faPlus}) =>{

    return(
        <div className="d-flex  justify-content-end pb-4 mt-n5">
            <button type="button" className="btn btn-success mt-2">
                <FontAwesomeIcon
                    style={{fontSize: '15px', marginRight: "5", color:"#fff"}}
                    icon={faPlus}
                />
                Adicionar ação de associação
            </button>
        </div>
    );

};