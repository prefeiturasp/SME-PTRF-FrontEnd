import React from "react";

export const AnalisesDeContaDaPrestacao = ({infoAta, analisesDeContaDaPrestacao, handleChangeAnalisesDeContaDaPrestacao, handleSubmitAnalisesDeContaDaPrestacao, getObjetoIndexAnalise}) => {
    //console.log("XXXXXXXXXXXXXXXXXXXXXX ", analisesDeContaDaPrestacao[0])
    let index = getObjetoIndexAnalise().analise_index;
    return (
        <>
            {analisesDeContaDaPrestacao && analisesDeContaDaPrestacao.length > 0 &&
            <>


                <form method="post">

                    <div className="row">
                        <div className="col-sm-6">
                            <div className="card container-extrato">
                                <div className="card-body">
                                    <h5 className="card-title titulo">Extrato Bancário da Unidade</h5>
                                    <div className='row'>
                                        <div className="col">
                                            <label htmlFor="data_extrato">Data</label>
                                            <input
                                                value={analisesDeContaDaPrestacao[index].data_extrato ? analisesDeContaDaPrestacao[index].data_extrato : ''}
                                                onChange={(e) => handleChangeAnalisesDeContaDaPrestacao(e.target.name, e.target.value)}
                                                name='data_extrato'
                                                type="date"
                                                className="form-control"
                                            />

                                        </div>
                                        <div className="col">
                                            <label htmlFor="saldo_extrato">Saldo</label>
                                            <input
                                                value={analisesDeContaDaPrestacao[index].saldo_extrato ? analisesDeContaDaPrestacao[index].saldo_extrato : ''}
                                                onChange={(e) => handleChangeAnalisesDeContaDaPrestacao(e.target.name, e.target.value)}
                                                name='saldo_extrato'
                                                type="number"
                                                className="form-control"
                                            />

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="card container-diferenca">
                                <div className="card-body">
                                    <h5 className="card-title titulo">Diferença em relação a prestação de contas</h5>
                                    <div className='row'>
                                        <div className="col-12">
                                            <label htmlFor="data_extrato">Valor</label>
                                            <input
                                                value={analisesDeContaDaPrestacao[index].data_extrato ? analisesDeContaDaPrestacao[index].data_extrato : ''}
                                                onChange={(e) => handleChangeAnalisesDeContaDaPrestacao(e.target.name, e.target.value)}
                                                name='data_extrato'
                                                type="date"
                                                className="form-control"
                                            />

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>




                    <button
                        onClick={() => handleSubmitAnalisesDeContaDaPrestacao(infoAta && infoAta.conta_associacao && infoAta.conta_associacao.uuid ? infoAta.conta_associacao.uuid : '')}
                        type="button" className="btn btn-primary">Submit
                    </button>
                </form>


            </>
            }


        </>
    )
};