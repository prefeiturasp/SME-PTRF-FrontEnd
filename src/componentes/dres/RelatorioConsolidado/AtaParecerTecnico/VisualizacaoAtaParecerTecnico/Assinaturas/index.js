import React from "react";
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
            <p className="mt-5 titulo-assinaturas">
                Nada mais a ser tratado, os trabalhos foram encerrados, a Ata lida e achada conforme,
                vai assinada pelos membros da Comissão.
            </p>

            <p className="mt-5 mb-5 titulo-assinaturas">
                <strong>São Paulo, {moment().format('DD [de] MMMM [de] YYYY')},</strong>
            </p>

            {presentes_na_ata && presentes_na_ata.length > 0
            ?
                presentes_na_ata.map((presente, index) =>
                    <div key={index} className="row mt-3">
                        <div className="col-12">
                            <div className="row box-assinaturas ml-0 mr-0">
                                <div className="col-7 p-2 align-self-center">
                                    <p className="mb-0 ml-2"><strong>Nome: </strong>{presente.nome}</p>
                                    <p className="mb-0 ml-2"><strong>Cargo: </strong>{presente.cargo}</p>
                                    <p className="mb-0 ml-2"><strong>RF: </strong>{presente.rf}</p>
                                </div>

                                <div className="col-5 p-2 align-self-center text-center">
                                    <hr className="mb-1 linha-assinatura mr-2"/>
                                    <p className="mt-0 mr-2"><strong>Assinatura</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                
            :
                null
            }
            
        </>
        
    )
}