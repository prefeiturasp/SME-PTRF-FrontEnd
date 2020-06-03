import React from "react";
import "../geracao-da-ata.scss"
import {TopoComBotoes} from "./TopoComBotoes";
import {TextoDinamicoSuperior} from "./TextoDinamicoSuperior";

export const VisualizacaoDaAta = () => {
    return(
        <div className="col-12 container-visualizacao-da-ata">
            <div className="col-12 mt-4">
                <TopoComBotoes/>
            </div>
            <div id="copiar" className="col-12">
                <TextoDinamicoSuperior/>
            </div>
        </div>
    )
}