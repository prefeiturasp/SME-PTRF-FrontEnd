import React from "react";

export const AnalisesDeContaDaPrestacao = ({infoAta, analisesDeContaDaPrestacao, handleChangeAnalisesDeContaDaPrestacao, handleSubmitAnalisesDeContaDaPrestacao, getObjetoIndexAnalise}) => {
    //console.log("XXXXXXXXXXXXXXXXXXXXXX ", analisesDeContaDaPrestacao[0])
    let index = getObjetoIndexAnalise().analise_index;
    return (
        <>
            {analisesDeContaDaPrestacao && analisesDeContaDaPrestacao.length > 0 &&
                <>
                    <h1>AnalisesDeContaDaPrestacao</h1>
                    <div className='row'>
                        <div className='col-12 col-md-6'>
                            <form method="post">
                                <div className="form-group">
                                    <label htmlFor="data_extrato">Data</label>
                                    <input
                                        value={analisesDeContaDaPrestacao[index].data_extrato ? analisesDeContaDaPrestacao[index].data_extrato : ''}
                                        onChange={(e) => handleChangeAnalisesDeContaDaPrestacao(e.target.name, e.target.value)}
                                        name='data_extrato'
                                        type="date"
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="saldo_extrato">Password</label>
                                    <input
                                        value={analisesDeContaDaPrestacao[index].saldo_extrato ? analisesDeContaDaPrestacao[index].saldo_extrato : ''}
                                        onChange={(e) => handleChangeAnalisesDeContaDaPrestacao(e.target.name, e.target.value)}
                                        name='saldo_extrato'
                                        type="number"
                                        className="form-control"
                                    />
                                </div>

                                <button onClick={()=>handleSubmitAnalisesDeContaDaPrestacao(infoAta && infoAta.conta_associacao &&  infoAta.conta_associacao.uuid ? infoAta.conta_associacao.uuid : '')} type="button" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </>
            }


        </>
    )
};