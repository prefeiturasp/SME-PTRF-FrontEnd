import React, {useEffect, useState} from "react";
import "../geracao-da-ata.scss"
import {TopoComBotoes} from "./TopoComBotoes";
import {TextoDinamicoSuperior} from "./TextoDinamicoSuperior";
import {TabelaDinamica} from "./TabelaDinamica";
import {TabelaTotais} from "./TabelaTotais";
import {TextoDinamicoInferior} from "./TextoDinamicoInferior";
import {EditarAta, TextoCopiado} from "../../../utils/Modais";
import {getInfoAta} from "../../../services/PrestacaoDeContas.service";

export const VisualizacaoDaAta = () => {
    const [showEditarAta, setShowEditarAta] = useState(false);
    const [showTextoCopiado, setShowTextoCopiado] = useState(false);
    const [stateFormEditarAta, setStateFormEditarAta] = useState({
        comentarios_ata:"Valor inicial comentário ata",
        posicionamento:"3",
        tipo_reuniao:"",
        local_reuniao:"",
        presidente_reuniao:"",
        secretario_reuniao:"",
        data_reuniao:"",
        abertura_reuniao:"",
        cargo_presidente_reuniao:"",
        cargo_secretario_reuniao:"",
    });

    const [infoAta, setInfoAta]= useState({})

    useEffect(()=>{
        const infoAta = async ()=>{
            let info_ata = await getInfoAta();
            console.log("Info Ata ", info_ata)
            setInfoAta(info_ata)
        }
        infoAta();
    }, [])

    const onHandleClose = () => {
        setShowEditarAta(false);
        setShowTextoCopiado(false)
    };

    const handleClickEditarAta = () => {
        setShowEditarAta(true);
    };

    const handleChangeEditarAta = (name, value) => {
        setStateFormEditarAta({
            ...stateFormEditarAta,
            [name]: value
        });
    };

    const handleClickFecharAta = () => {
        window.location.assign("/prestacao-de-contas")
    };

    const handleClickCopiarAta = ()=> {

        let  doc = document, text = doc.getElementById("copiar");
        let range, selection;

        if(doc.body.createTextRange){
            range = document.body.createTextRange();
            range.moveToElementText(text);
            range.select();
        }
        else if(window.getSelection){
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        document.execCommand('copy');
        if (range){
            setShowTextoCopiado(true)
        }
    };

    const onSubmitEditarAta = () =>{
        console.log("onSubmitEditarAta ", stateFormEditarAta)
    };

    const valorTemplate = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    }

    return(
        <div className="col-12 container-visualizacao-da-ata mb-5">
            <div className="col-12 mt-4">
                <TopoComBotoes
                    handleClickEditarAta={handleClickEditarAta}
                    handleClickFecharAta={handleClickFecharAta}
                    handleClickCopiarAta={handleClickCopiarAta}
                />
            </div>

            <div id="copiar" className="col-12">
                <TextoDinamicoSuperior/>
                {infoAta &&
                    <>
                    <TabelaDinamica
                        infoAta={infoAta}
                        valorTemplate={valorTemplate}
                    />

                    <TabelaTotais
                        infoAta={infoAta}
                        valorTemplate={valorTemplate}
                        />
                    </>
                }
                <br/>
                <TextoDinamicoInferior/>
            </div>

            <section>
                <EditarAta
                    show={showEditarAta}
                    handleClose={onHandleClose}
                    onSubmitEditarAta={onSubmitEditarAta}
                    onChange={handleChangeEditarAta}
                    stateFormEditarAta={stateFormEditarAta}
                />
            </section>

            <section>
                <TextoCopiado
                    show={showTextoCopiado}
                    handleClose={onHandleClose}
                />
            </section>
        </div>
    )
};