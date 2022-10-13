import React from 'react'

export const ResponsavelAnalise = ({responsaveis}) => {
    return(
        <>
        <div className='row'>
            <div className="col-md-4">
                <label htmlFor='responsavel'><strong>Responsável pela análise:</strong></label>
                <select
                    value={''}
                    onChange={(e) => console.log(e.target.value)}
                    name="responsavel"
                    id="responsavel"
                    className="form-control"
                    disabled={true}
                >
                    <option value="">Selecione</option>
                </select>
            </div>
            <div className="col-md-3">
                <label htmlFor="data_analise"><strong>Início da análise</strong></label>
                <p>00/00/0000</p>
            </div>
        </div>
        </>
    )
};