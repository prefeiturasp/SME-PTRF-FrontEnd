import React from "react";

export const TrilhaDeStatus = ({
    trilhaStatus,
    filtraStatus,
    retornaClasseCirculoTrilhaStatus,
    formataNumero,
    retornaCorCirculoTrilhaStatus,
    eh_circulo_duplo
}) => {

    return (
        <>
            <div className='row mt-3 mb-3'>
                <div className='col-12'>
                    <h5>Prestações de contas das {trilhaStatus.total_associacoes_dre} Associações</h5>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div id="timeline">&nbsp;</div>
                    <div className="d-flex justify-content-between mb-3">
                        {filtraStatus().map((item, index) => 
                            <div className='container-circulo-relatorio-consolidado' key={`circulo-${index}`}>
                                {eh_circulo_duplo(item.estilo_css)
                                    ?
                                        <>
                                            <span className="circulo-duplo">
                                                <span className={`circulo ${retornaClasseCirculoTrilhaStatus(item.status)} ${retornaCorCirculoTrilhaStatus(item.estilo_css)}`}>
                                                    {formataNumero(item.status)}
                                                </span>
                                            </span>
                                            <p className='mt-3'><strong dangerouslySetInnerHTML={{__html: item.titulo}}></strong></p>
                                        </>
                                    :
                                        <>
                                            <span className={`circulo ${retornaClasseCirculoTrilhaStatus(item.status)} ${retornaCorCirculoTrilhaStatus(item.estilo_css)}`}>
                                                {formataNumero(item.status)}
                                            </span>
                                            <p className='mt-3'><strong dangerouslySetInnerHTML={{__html: item.titulo}}></strong></p>
                                        </>
                                }
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    )
}