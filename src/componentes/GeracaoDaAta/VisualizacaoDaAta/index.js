import React from "react";
import "../geracao-da-ata.scss"
import {TopoComBotoes} from "./TopoComBotoes";
import {TextoDinamicoSuperior} from "./TextoDinamicoSuperior";
import {TabelaDinamica} from "./TabelaDinamica";
import {TextoDinamicoInferior} from "./TextoDinamicoInferior";

export const VisualizacaoDaAta = () => {
    return(
        <div className="col-12 container-visualizacao-da-ata mb-5">
            <div className="col-12 mt-4">
                <TopoComBotoes/>
            </div>
            <div id="copiar" className="col-12">
                <TextoDinamicoSuperior/>
                <TabelaDinamica/>
                <TextoDinamicoInferior/>
            </div>
        </div>
    )
}