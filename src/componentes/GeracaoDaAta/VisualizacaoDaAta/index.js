import React, {useEffect, useState} from "react";
import "../geracao-da-ata.scss"
import {TopoComBotoes} from "./TopoComBotoes";
import {TextoDinamicoSuperior} from "./TextoDinamicoSuperior";
import {TabelaDinamica} from "./TabelaDinamica";
import {TabelaTotais} from "./TabelaTotais";
import {TextoDinamicoInferior} from "./TextoDinamicoInferior";
import {EditarAta, TextoCopiado} from "../../../utils/Modais";
import {getInfoAta} from "../../../services/PrestacaoDeContas.service";
import {getTabelasAtas, atualizarInfoAta, getAtas} from "../../../services/AtasAssociacao.service";

export const VisualizacaoDaAta = () => {
    const [showEditarAta, setShowEditarAta] = useState(false);
    const [showTextoCopiado, setShowTextoCopiado] = useState(false);
    const [stateFormEditarAta, setStateFormEditarAta] = useState({
        comentarios:"",
        parecer_conselho:"",
        tipo_reuniao:"ORDINARIA",
        local_reuniao:"",
        presidente_reuniao:"",
        secretario_reuniao:"",
        data_reuniao:"",
        convocacao:"PRIMEIRA",
        cargo_presidente_reuniao:"",
        cargo_secretaria_reuniao:"",
    });

    const [infoAta, setInfoAta]= useState({})
    const [tabelas, setTabelas]= useState({})
    const [dadosAta, setDadosAta]= useState({})

    useEffect(()=>{
        const infoAta = async ()=>{
            let info_ata = await getInfoAta();
            console.log("Info Ata ", info_ata)
            setInfoAta(info_ata);

            let dados_ata = await getDadosAta()
            console.log("Dados Ata ", dados_ata)


        }

        const tabelasAta = async ()=>{
            let tabelas = await getTabelasAtas();
            console.log("Tabelas Ata ", tabelas)
            setTabelas(tabelas)
        }

        infoAta();
        tabelasAta();
    }, [])

    const getDadosAta = async () =>{

        let dados_ata = await getAtas();

        setStateFormEditarAta({
            comentarios:dados_ata.comentarios,
            parecer_conselho:dados_ata.parecer_conselho,
            tipo_reuniao:dados_ata.tipo_reuniao,
            local_reuniao:dados_ata.local_reuniao,
            presidente_reuniao:dados_ata.presidente_reuniao,
            secretario_reuniao:dados_ata.secretario_reuniao,
            data_reuniao:dados_ata.data_reuniao,
            convocacao:dados_ata.convocacao,
            cargo_presidente_reuniao:dados_ata.cargo_presidente_reuniao,
            cargo_secretaria_reuniao:dados_ata.cargo_secretaria_reuniao,
        })

        setDadosAta(dados_ata);

        return dados_ata
    }

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

    const onSubmitEditarAta = async () =>{
        console.log("onSubmitEditarAta ", stateFormEditarAta)

        const payload = {
            "tipo_reuniao": stateFormEditarAta.tipo_reuniao,
            "convocacao": stateFormEditarAta.convocacao,
            "data_reuniao": stateFormEditarAta.data_reuniao,
            "local_reuniao": stateFormEditarAta.local_reuniao,
            "presidente_reuniao": stateFormEditarAta.presidente_reuniao,
            "cargo_presidente_reuniao": stateFormEditarAta.cargo_presidente_reuniao,
            "secretario_reuniao": stateFormEditarAta.secretario_reuniao,
            "cargo_secretaria_reuniao": stateFormEditarAta.cargo_secretaria_reuniao,
            "parecer_conselho": stateFormEditarAta.parecer_conselho,
            "comentarios": stateFormEditarAta.comentarios,
        }

        try {
            let atualizar_dados = await atualizarInfoAta(payload);
            console.log("atualizar_dados ", atualizar_dados)
            getDadosAta();
            setShowEditarAta(false);
        }catch (e) {
            console.log("Erro ao atualizar a Ata ", e)
        }
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
                    tabelas={tabelas}
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