import React from "react";

export const TextoDespesas = ()=> {
    let arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];

    const itensDespesas = () => {


        arr.map((item)=>

            (
                <p>Item: {item}</p>
            )
        )


    }
    return(
        <>
            <p className="texto-despesas-titulo">Despesas de custeio: <span className="texto-despesas-valor">R$ 12.072,28</span></p>
            <div>
                {itensDespesas()}
            </div>
        </>
    )
}