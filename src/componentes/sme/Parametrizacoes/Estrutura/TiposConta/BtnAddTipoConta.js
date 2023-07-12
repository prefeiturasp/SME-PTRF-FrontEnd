import React from "react";

export const BtnAddTipoConta = ({FontAwesomeIcon, faPlus, setShowModalForm, initialStateFormModal, setStateFormModal}) =>{
    return(
        <div className="d-flex  justify-content-end pb-4 mt-2">
            <button onClick={()=>{
                setStateFormModal(initialStateFormModal);
                setShowModalForm(true);
            }
            } type="button" className="btn btn-base-verde mt-2">
                <FontAwesomeIcon
                    style={{marginRight: "5", color:"#fff"}}
                    icon={faPlus}
                />
                Adicionar tipo de conta
            </button>
        </div>
    );
};