import React from "react";

export const TextoDespesas = ({especificaoesDespesaCusteio, especificaoesDespesaCapital, despesasPeriodoCusteio, despesasPeriodoCapital, valorTemplate}) => {

    const divideArrayColunas = (array, cols) => {

        let indexAtual = 0;

        let ret = [];
        if (cols == 1 || array.length <= 5) {
            ret.push(array);
        } else {
            let size = Math.ceil(array.length / cols);
            for (let i = 0; i < cols; i++) {
                let start = i * size;
                ret.push(array.slice(start, start + size));
            }
        }

        return ret.map((item, index) => {
            return (
                <div key={index} className='col-3'>
                    {item.map((textoDespesa, textoDespesaIndex) => {
                        indexAtual = indexAtual + 1;
                        return (
                            <p key={textoDespesaIndex} className="mb-0">{indexAtual}-{textoDespesa}</p>
                        )
                    })}
                </div>
            );
        })
    }

    return (
        <>
            {especificaoesDespesaCusteio && especificaoesDespesaCusteio.length > 0 ? (
                <div className="mt-3 mb-3">
                    <p className="texto-despesas-titulo">Despesas de custeio: <span className="texto-despesas-valor">R${valorTemplate(despesasPeriodoCusteio)}</span></p>
                    <div id='contem' className='row'>
                        {divideArrayColunas(especificaoesDespesaCusteio, 3)}
                    </div>
                </div>
            ) :
                <p className="texto-despesas-titulo">Despesas de custeio: <span className='font-weight-normal'>Não foram realizadas despesas de Custeio no período.</span></p>
            }

            {especificaoesDespesaCapital && especificaoesDespesaCapital.length > 0 ? (
                    <>
                        <p className="texto-despesas-titulo">Despesas de capital: <span className="texto-despesas-valor">R${valorTemplate(despesasPeriodoCapital)}</span></p>
                        <div id='contem' className='row'>
                            {divideArrayColunas(especificaoesDespesaCapital, 3)}
                        </div>
                    </>
                ) :
                <p className="texto-despesas-titulo">Despesas de capital: <span className='font-weight-normal'>Não foram realizadas despesas de Capital no período. </span></p>
            }
        </>
    )
}