import React, {useEffect, useState} from "react";
import {getFiqueDeOlho} from "../../../services/dres/RelatorioConsolidado.service";

export const RelatorioConsolidado = () => {
    const [fiqueDeOlho, setFiqueDeOlho] = useState("");

    useEffect(() => {
        buscaFiqueDeOlho();
    }, []);

    const buscaFiqueDeOlho = async () => {
        let fique_de_olho = await getFiqueDeOlho();
        console.log('Fuca aslnlas ', fique_de_olho)
        setFiqueDeOlho(fique_de_olho.detail);
    };

    return (
        <>
            <div className="col-12 container-texto-introdutorio mb-4 mt-3">
                <div dangerouslySetInnerHTML={{__html: fiqueDeOlho}}/>
            </div>

            <div className="page-content-inner">
            </div>
        </>
    )
}