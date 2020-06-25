import React, {Fragment} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDown, faAngleUp, faEdit} from '@fortawesome/free-solid-svg-icons'

export const TabelaMembros = ({clickIconeToogle, toggleIcon, setShowEditarMembro, cargos, titulo}) => {

    //console.log("Tabela Membros ", cargos)
    return(
        <>
            <p><strong>{titulo}</strong></p>
            <table className="table table-bordered tabela-membros">
                <thead>
                <tr className="cabecalho">
                    <th scope="col">Cargo na associação</th>
                    <th scope="col">Nome completo</th>
                    <th scope="col">Representação na associação</th>
                    <th scope="col">&nbsp;</th>
                </tr>
                </thead>
                <tbody>
                {cargos && cargos.length> 0 && cargos.map((item, index) => {
                    console.log("ITEM ", item)
                    return (
                        <Fragment key={index}>
                            <tr>
                                <td>
                                    <div className="d-flex justify-content-start">
                                        <a onClick={()=>toggleIcon(index)} data-toggle="collapse" href={`#collapseExample_${index}`} role="button" aria-expanded="false" aria-controls="collapseExample">
                                            <FontAwesomeIcon
                                                style={{fontSize: '30px', marginRight:'5px'}}
                                                icon={clickIconeToogle[index] ? faAngleUp : faAngleDown}
                                            />
                                        </a>
                                        <span>{item.cargo}</span>
                                    </div>
                                </td>
                                <td><span>{item.infos && item.infos.nome ? item.infos.nome : ""}</span></td>
                                <td></td>
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
                            <tr className="collapse cabecalho" id={`collapseExample_${index}`}>
                                <td colSpan="4" >
                                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
                                    Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
                                </td>
                            </tr>
                        </Fragment>
                    )
                })}
                </tbody>
            </table>
        </>
    );
};