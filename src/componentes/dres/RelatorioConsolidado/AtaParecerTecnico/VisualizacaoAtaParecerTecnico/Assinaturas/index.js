import React, { Fragment } from "react";
import moment from "moment";

moment.updateLocale('pt', {
    months: [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
        "agosto", "setembro", "outubro", "novembro", "dezembro"
    ]
});

export const Assinaturas = ({presentes_na_ata}) => {
    return (
        <>
            <p className="mt-3 titulo-assinaturas">
                Nada mais a ser tratado, os trabalhos foram encerrados, a Ata lida e achada conforme,
                vai assinada pelos membros da Comissão.
            </p>

            <p className="mt-5 mb-5 titulo-assinaturas">
                <strong>São Paulo, {moment().format('DD [de] MMMM [de] YYYY')}.</strong>
            </p>


            <div className="titulo-tabelas-conta mb-3">
                <p className='mb-1 font-weight-bold'>
                    <strong>Presentes</strong>
                </p>
            </div>

            {presentes_na_ata && presentes_na_ata.length > 0
            ?
                <Fragment>
                    <table key={`table-0`} className="table table-bordered tabela-status-pc">
                        <thead>
                            <tr>
                                <th scope="col" style={{width: '40%'}}>Nome</th>
                                <th scope="col" style={{width: '40%'}}>Cargo</th>
                                <th scope="col" style={{width: '20%'}}>RF</th>
                            </tr>
                        </thead>


                        {presentes_na_ata.map((presente, index) => 
                            <tbody key={`tbody-${index}`}>
                                <tr>
                                    <td>{presente.nome}</td>
                                    <td>{presente.cargo}</td>
                                    <td>{presente.rf}</td>
                                </tr>
                            </tbody>

                        )}

                    </table>
                </Fragment>    
            :
                null
            }
            
        </>
        
    )
}