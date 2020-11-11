import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";

export const BoxConsultarDados = () =>{
    return(
        <>
            <div className="card">
                <div className="card-body py-2 container-box-consultar-dados">
                    <div className="d-flex bd-highlight">
                        <div className="flex-grow-1 bd-highlight">
                            <h5 className='mb-0 mt-3'>Consulte os dados de todas as unidades educacionais</h5>
                        </div>
                        <div className="py-2 bd-highlight">
                            <button className="btn btn-success">
                                <FontAwesomeIcon
                                    style={{color: '#fff', marginRight:'3px'}}
                                    icon={faArrowRight}
                                />
                                Consultar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};