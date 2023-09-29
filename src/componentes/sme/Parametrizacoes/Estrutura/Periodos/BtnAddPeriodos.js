import React from "react";

export const BtnAddPeriodos = ({FontAwesomeIcon, faPlus, setShowModalForm, initialStateFormModal, setStateFormModal}) =>{
    return(
        <div className="d-flex  justify-content-end pb-4 mt-2">
            <button data-qa="btn-add-periodo" onClick={()=>{
                setStateFormModal(initialStateFormModal);
                setShowModalForm(true);
            }
            } type="button" className="btn btn-success mt-2">
                <FontAwesomeIcon
                    style={{fontSize: '15px', marginRight: "5", color:"#fff"}}
                    icon={faPlus}
                />
                Adicionar período
            </button>
        </div>
    );
};