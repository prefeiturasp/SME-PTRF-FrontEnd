import React, {useState} from "react";

export const TextoDespesas = () => {

    const [itensDespesas, setItensDespesas] = useState([
        "Assessoria Contábil ",
        "Tarifa Fornec Cheque",
        "Tarifa Processamento Cheque",
        "Tarifa Pacote de Serviço ",
        "Placa Eletrônica Principal",
        "Manutenção de Aparelho de Ar Condicionado",
        "Materiais Pedagógicos Diversos",
        "Tarifa Adic. Cheque ",
        "Refil de Tinta Ecotank ",
        "Tarifa Renovação Cadastro",
        "Assessoria Contábil ",
        "Tarifa Fornec Cheque",
        "Tarifa Processamento Cheque",
        "Tarifa Pacote de Serviço ",
    ]);


    const divideArrayColunas = (array, cols) => {

        let indexAtual = 0;

        let ret = [];
        if (cols == 1 || array.length === 1) {
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
            <p className="texto-despesas-titulo">Despesas de custeio: <span className="texto-despesas-valor">R$ 12.072,28</span>
            </p>
            <div id='contem' className='row'>
                {divideArrayColunas(itensDespesas, 3)}
            </div>
        </>
    )
}