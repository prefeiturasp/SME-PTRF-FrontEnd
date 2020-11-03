import React from "react";

export const InfoAssociacoesEmAnalise = ({totalEmAnalise}) =>{
    return(
        <>
            {totalEmAnalise > 0 &&
                <div className='row'>
                    <div className='col-12'>
                        <p><strong>Associações com pendências nas prestações de contas</strong></p>
                        <p><strong>Existem {totalEmAnalise} associações ainda em análise nas prestações de contas</strong></p>
                    </div>
                </div>

            }
        </>
    )
};