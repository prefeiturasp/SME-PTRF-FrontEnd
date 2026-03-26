import { useEffect, useState } from "react";
import { getTextosPaaUe } from "../../../../../../../services/escolas/Paa.service.js";

 
export const TextoParametroPaa  = ({campo})=>{
    const [textosPaa, setTextosPaa] = useState();

    useEffect(() => {
        const carregaTextos = async () => {
            let responseTextoPaa = await getTextosPaaUe();
            setTextosPaa(responseTextoPaa)
            console.log(responseTextoPaa)
        }
        carregaTextos()
        console.log(textosPaa)
    }, [campo]);


    return (
        <div className="text-break">
            <div dangerouslySetInnerHTML={{__html: textosPaa?.[campo]}}></div>            
        </div>
    )
}