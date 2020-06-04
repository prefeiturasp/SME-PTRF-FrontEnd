import React, {useState} from "react";
import "../geracao-da-ata.scss"
import {TopoComBotoes} from "./TopoComBotoes";
import {TextoDinamicoSuperior} from "./TextoDinamicoSuperior";
import {TabelaDinamica} from "./TabelaDinamica";
import {TabelaTotais} from "./TabelaTotais";
import {TextoDinamicoInferior} from "./TextoDinamicoInferior";
import {EditarAta} from "../../../utils/Modais";

export const VisualizacaoDaAta = () => {
    const [showEditarAta, setShowEditarAta] = useState(false);

    const onHandleClose = () => {
        setShowEditarAta(false);
    }

    const handleClickEditarAta = () => {
        setShowEditarAta(true);
    }

    const onSubmitEditarAta = () =>{

        console.log("onSubmitEditarAta")

    }

    return(
        <div className="col-12 container-visualizacao-da-ata mb-5">
            <div className="col-12 mt-4">
                <TopoComBotoes
                    handleClickEditarAta={handleClickEditarAta}
                />
            </div>
            <div id="copiar" className="col-12">
                <TextoDinamicoSuperior/>
                <TabelaDinamica/>
                <TabelaTotais/>
                <TextoDinamicoInferior/>
            </div>

            <section>
                <EditarAta
                    show={showEditarAta}
                    handleClose={onHandleClose}
                    onSubmitEditarAta={onSubmitEditarAta}
                    //textareaModalReverConciliacao={textareaModalReverConciliacao}
                    //handleChangeModalReverConciliacao={handleChangeModalReverConciliacao}
                />
            </section>
        </div>
    )
}