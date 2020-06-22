import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDown, faAngleUp, faEdit} from '@fortawesome/free-solid-svg-icons'

export const TabelaMembrosDiretoriaExecutiva = ({clickIconeToogle, setClickIconeToogle, setShowEditarMembro}) => {
    return(
        <>
            <p><strong>Diretoria Executiva</strong></p>
            <table className="table table-bordered tabela-membros">
                <thead>
                <tr className="cabecalho">
                    <th scope="col">Cargo na associação</th>
                    <th scope="col">Nome completo</th>
                    <th scope="col">Representação na associação</th>
                    <th scope="col"></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <div className="d-flex justify-content-start">
                            <a onClick={()=>setClickIconeToogle(!clickIconeToogle)} data-toggle="collapse" href="#collapseExample" role="button"
                               aria-expanded="false" aria-controls="collapseExample">
                                <FontAwesomeIcon
                                    style={{fontSize: '30px', marginRight:'5px'}}
                                    icon={clickIconeToogle ? faAngleUp : faAngleDown}
                                />
                            </a>
                            <span>Presidente</span>
                        </div>
                    </td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>
                        <div className="d-flex justify-content-center">
                            <button className="btn-editar-membro" onClick={()=>setShowEditarMembro(true)}>
                                <FontAwesomeIcon
                                    style={{fontSize: '20px', marginRight:"0"}}
                                    icon={faEdit}
                                />
                            </button>
                        </div>

                    </td>
                </tr>
                <tr className="collapse cabecalho" id="collapseExample">
                    <td colSpan="4" >
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
                        Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
                    </td>
                </tr>
                </tbody>
            </table>
        </>
    );
}