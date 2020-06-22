import React, {Fragment} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDown, faAngleUp, faEdit} from '@fortawesome/free-solid-svg-icons'

export const TabelaMembrosDiretoriaExecutiva = ({clickIconeToogle, toggleIcon, setShowEditarMembro}) => {

    const cargos = [
        {0:"Presidente"},
        {1:"Vice Presidente"},
        {2:"Secretário"},
        {3:"Tesoureiro"},
        {4:"Vogal"},
        {5:"Vogal"},
        {6:"Vogal"},
        {7:"Vogal"},
        {8:"Vogal"},
    ]
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
                {cargos && cargos.map((item, index) => {
                    return (
                        <Fragment key={index}>
                            <tr>
                                <td>
                                    <div className="d-flex justify-content-start">
                                        <a onClick={()=>toggleIcon(index)} data-toggle="collapse" href={`#collapseExample_${index}`} role="button"aria-expanded="false" aria-controls="collapseExample">
                                            <FontAwesomeIcon
                                                style={{fontSize: '30px', marginRight:'5px'}}
                                                icon={clickIconeToogle[index] ? faAngleUp : faAngleDown}
                                            />
                                        </a>
                                        <span>{item[index]}</span>
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
}