import React from "react";
import { FormularioEditaAta } from "./FormularioEditarAta";
import { TopoComBotoes } from "./TopoComBotoes";
import {useEffect, useState, useRef} from "react";
import {useParams} from "react-router-dom";
import { getListaPresentesPadrao, getAtaParecerTecnico, postEdicaoAtaParecerTecnico } from "../../../../../../services/dres/AtasParecerTecnico.service";
import moment from "moment";
import {toastCustom} from "../../../../../Globais/ToastCustom"

moment.updateLocale('pt', {
    months: [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
        "agosto", "setembro", "outubro", "novembro", "dezembro"
    ]
});

export const EdicaoAtaParecerTecnico = () => {
    const formRef = useRef();
    let {uuid_ata} = useParams();

    const [listaPresentesPadrao, setListaPresentesPadrao] = useState([]);
    const [listaPresentes, setListaPresentes] = useState([]);
    const [stateFormEditarAta, setStateFormEditarAta] = useState({
        numero_ata: "",
        data_reuniao: "",
        hora_reuniao: "",
        local_reuniao: "",
        comentarios: "",
    });
    const [disableBtnSalvar, setDisableBtnSalvar] = useState(false)
    const [dadosAta, setDadosAta] = useState({});


    const getDadosAta = async () => {
        let dados_ata = await getAtaParecerTecnico(uuid_ata);
        let data_da_reuniao = dados_ata.data_reuniao ? dados_ata.data_reuniao : "";
        setStateFormEditarAta({
            numero_ata: dados_ata.numero_ata,
            data_reuniao: data_da_reuniao,
            hora_reuniao: dados_ata.hora_reuniao,
            local_reuniao: dados_ata.local_reuniao,
            comentarios: dados_ata.comentarios,
        });
        setDadosAta(dados_ata);
        setListaPresentes(dados_ata.presentes_na_ata)
    };

    const consultaListaPresentesPadraoAta = async () => {
        if(dadosAta && dadosAta.dre){
            let lista_presentes_padrao = await getListaPresentesPadrao(dadosAta.dre.uuid, uuid_ata);
            setListaPresentesPadrao(lista_presentes_padrao);
        }
        
    }

    const onSubmitFormEdicaoAta = async () => {
        let dadosForm = formRef.current.values

        let data_da_reuniao = dadosForm.stateFormEditarAta.data_reuniao ? moment(dadosForm.stateFormEditarAta.data_reuniao).format("YYYY-MM-DD") : null;
        let hora_reuniao = dadosForm.stateFormEditarAta.hora_reuniao ? moment(dadosForm.stateFormEditarAta.hora_reuniao, 'HHmm').format('HH:mm') : "00:00" 

        let payload = {
            numero_ata : dadosForm.stateFormEditarAta.numero_ata,
            data_reuniao: data_da_reuniao,
            hora_reuniao: hora_reuniao,
            local_reuniao: dadosForm.stateFormEditarAta.local_reuniao,
            presentes_na_ata: dadosForm.listaPresentes,
            comentarios: dadosForm.stateFormEditarAta.comentarios,
        }

        try {
            await postEdicaoAtaParecerTecnico(uuid_ata, payload)
            toastCustom.ToastCustomSuccess('Ata salva com sucesso', `As edições da ata de parecer técnico foram salvas com sucesso.`)
        } catch (e) {
            console.log("Erro ao fazer edição da Ata ", e.response)
        }
    }

    const handleClickFecharAta = () => {
        let path = `/visualizacao-da-ata-parecer-tecnico/${uuid_ata}/`;
        window.location.assign(path)
    };

    useEffect(() => {
        getDadosAta();
    }, []);

    useEffect(() => {
        consultaListaPresentesPadraoAta();
    }, [dadosAta]);

    return (
        <>
            <div className="col-12 container-visualizacao-da-ata-parecer-tecnico mb-5">
                <div className="col-12 mt-4">
                    {dadosAta && Object.entries(dadosAta).length > 0 &&
                        <TopoComBotoes
                            onSubmitFormEdicaoAta={onSubmitFormEdicaoAta}
                            handleClickFecharAta={handleClickFecharAta}
                            disableBtnSalvar={disableBtnSalvar}
                            formRef={formRef}
                        />
                    }
                </div>

                <div className="col-12">
                    {dadosAta && listaPresentesPadrao && listaPresentes &&
                        <FormularioEditaAta
                            listaPresentesPadrao={listaPresentesPadrao}
                            listaPresentes={listaPresentes}
                            stateFormEditarAta={stateFormEditarAta}
                            uuid_ata={uuid_ata}
                            formRef={formRef}
                            onSubmitFormEdicaoAta={onSubmitFormEdicaoAta}
                            setDisableBtnSalvar={setDisableBtnSalvar}
                        />
                    }
                </div>
            </div>
        </>
    )

}