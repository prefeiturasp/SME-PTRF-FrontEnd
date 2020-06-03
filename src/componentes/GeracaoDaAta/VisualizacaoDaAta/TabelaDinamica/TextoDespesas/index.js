import React, {useState} from "react";

export const TextoDespesas = ()=> {

    const [itensDespesas, setItensDespesas] = useState([1,2,3,4,5,6,7,8,9,10,11,12,13,14]);

    function split(array, cols) {
        var ret = [];
        if (cols==1 || array.length === 1){
            ret.push(array);
        }else{
            var size = Math.ceil(array.length / cols);
            for (var i = 0; i < cols; i++) {
                var start = i*size;
                ret.push(array.slice(start, start+size));
            }
        }
        console.log("Retorno ", ret)
        return ret.map((item, index)=>{
            return(
                <div key={index} className='col-4'>
                    {`Item: ${index} - ${item}`}
                </div>
            ) ;
        })

    }

    const exibeItensDespesas = () =>{

        let qtde_itens =  itensDespesas.length;
        let qtde_itens_por_coluna = qtde_itens/4;
        console.log("Quantidade de itens ", qtde_itens);
        console.log("Quantidade de itens Por Coluna ", qtde_itens_por_coluna);


        return itensDespesas.map((item, index)=> {
            return (

                <div key={item} className="col-md-1">
                    {item}
                </div>


            )
        })
    }
    return(
        <>
            <p className="texto-despesas-titulo">Despesas de custeio: <span className="texto-despesas-valor">R$ 12.072,28</span></p>

            <div className='row'>
                {/*{exibeItensDespesas()}*/}

                    {split(itensDespesas, 3)}

            </div>

        </>
    )
}