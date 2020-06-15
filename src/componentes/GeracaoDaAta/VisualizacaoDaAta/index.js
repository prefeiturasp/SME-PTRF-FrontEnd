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
import moment from "moment";
moment.updateLocale('pt', {
    months : [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
        "agosto", "setembro", "outubro", "novembro", "dezembro"
    ]
});

const numero = require('numero-por-extenso');

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

    const [infoAta, setInfoAta]= useState({});
    const [tabelas, setTabelas]= useState({});
    const [dadosAta, setDadosAta]= useState({});

    useEffect(()=>{
        const infoAta = async ()=>{
            let info_ata = await getInfoAta();
            setInfoAta(info_ata);

            await getDadosAta()
        };

        const tabelasAta = async ()=>{
            let tabelas = await getTabelasAtas();
            setTabelas(tabelas)
        };

        infoAta();
        tabelasAta();
    }, []);

    const getDadosAta = async () =>{

        let dados_ata = await getAtas();

        let data_da_reuniao = dados_ata.data_reuniao ? dados_ata.data_reuniao : "";

        setStateFormEditarAta({
            comentarios:dados_ata.comentarios,
            parecer_conselho:dados_ata.parecer_conselho,
            tipo_reuniao:dados_ata.tipo_reuniao,
            local_reuniao:dados_ata.local_reuniao,
            presidente_reuniao:dados_ata.presidente_reuniao,
            secretario_reuniao:dados_ata.secretario_reuniao,
            data_reuniao:data_da_reuniao,
            convocacao:dados_ata.convocacao,
            cargo_presidente_reuniao:dados_ata.cargo_presidente_reuniao,
            cargo_secretaria_reuniao:dados_ata.cargo_secretaria_reuniao,
        });

        setDadosAta(dados_ata);
    };

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
        let data_da_reuniao = stateFormEditarAta.data_reuniao ? moment(stateFormEditarAta.data_reuniao).format("YYYY-MM-DD") : null;
        const payload = {
            "tipo_reuniao": stateFormEditarAta.tipo_reuniao,
            "convocacao": stateFormEditarAta.convocacao,
            "data_reuniao": data_da_reuniao,
            "local_reuniao": stateFormEditarAta.local_reuniao,
            "presidente_reuniao": stateFormEditarAta.presidente_reuniao,
            "cargo_presidente_reuniao": stateFormEditarAta.cargo_presidente_reuniao,
            "secretario_reuniao": stateFormEditarAta.secretario_reuniao,
            "cargo_secretaria_reuniao": stateFormEditarAta.cargo_secretaria_reuniao,
            "parecer_conselho": stateFormEditarAta.parecer_conselho,
            "comentarios": stateFormEditarAta.comentarios,
        };

        try {
            await atualizarInfoAta(payload);
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
    };

    const dataPorExtenso = (data)=>{
        if (!data){
            return "___ dias do mês de ___ de ___"
        }else {
            let dia_por_extenso = numero.porExtenso(moment(new Date(data), "YYYY-MM-DD").add(1, 'days').format("DD"));
            let mes_por_extenso = moment(new Date(data), "YYYY-MM-DD").add(1, 'days').format("MMMM");
            let ano_por_extenso = numero.porExtenso(moment(new Date(data),"DD/MM/YYYY").add(1, 'days').year());
            let data_por_extenso =  dia_por_extenso +" dias do mes de "+ mes_por_extenso +" de "+ ano_por_extenso;
            return data_por_extenso;
        }
    };

    const retornaDadosAtaFormatado = (campo) => {
        if (campo === "tipo_reuniao"){
            let tipo_de_reuniao = tabelas.tipos_reuniao ? tabelas.tipos_reuniao.find(element => element.id === dadosAta.tipo_reuniao) : "";
            return tipo_de_reuniao.nome ? tipo_de_reuniao.nome : "___";

        }else if (campo === "data_reuniao"){
            return dataPorExtenso(dadosAta.data_reuniao);

        }else if (campo === "data_reuniao_texto_inferior"){
            let data = dadosAta.data_reuniao ? "São Paulo, dia "+moment(new Date(dadosAta.data_reuniao), "YYYY-MM-DD").add(1, 'days').format("DD [de] MMMM [de] YYYY") : "";
            return data;

        }else if (campo === "periodo.data_inicio_realizacao_despesas") {
            return dadosAta.periodo.data_inicio_realizacao_despesas ? moment(new Date(dadosAta.periodo.data_inicio_realizacao_despesas), "YYYY-MM-DD").add(1, 'days').format("DD/MM/YYYY") : "";

        }else if(campo === "periodo.data_fim_realizacao_despesas"){
            return dadosAta.periodo.data_fim_realizacao_despesas ? moment(new Date(dadosAta.periodo.data_fim_realizacao_despesas), "YYYY-MM-DD").add(1, 'days').format("DD/MM/YYYY") : "";

        }else if(campo === "periodo.referencia"){
            let periodo_referencia = dadosAta.periodo.referencia ? dadosAta.periodo.referencia.split(".") : "";
            let string = periodo_referencia[1]+"° repasse de "+periodo_referencia[0];
            return string;

        }else if (campo === "convocacao"){
            let convocacao =  tabelas.convocacoes ? tabelas.convocacoes.find(element => element.id === dadosAta.convocacao): "";
            return convocacao.nome ? convocacao.nome : "___";

        }else if (campo === "parecer_conselho"){
            let parecer_conselho =  tabelas.pareceres ? tabelas.pareceres.find(element => element.id === dadosAta.parecer_conselho) : "";
            if (parecer_conselho.id === "APROVADA"){
                return "Os membros do Conselho Fiscal, à vista dos registros contábeis e verificando nos documentos apresentados a exatidão das despesas realizadas, julgaram exata a presente prestação de contas considerando-a em condições de ser aprovada e emitindo parecer favorável à sua aprovação."
            }else if (parecer_conselho.id === "REJEITADA"){
                return "Os membros do Conselho Fiscal, à vista dos registros contábeis e verificando nos documentos apresentados,  não consideram a presente prestação de contas em condições de ser aprovada emitindo parecer contrário à sua aprovação."
            }else if (parecer_conselho.id === "RESSALVAS"){
                return "Os membros do Conselho Fiscal, à vista dos registros contábeis e verificando nos documentos apresentados,  consideram a presente prestação de contas em condições de ser aprovada com ressalvas emitindo parecer favorável à sua aprovação com ressalvas."
            }

        }

    };

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
                {dadosAta && Object.entries(dadosAta).length > 0 &&
                    <TextoDinamicoSuperior
                        dadosAta={dadosAta}
                        retornaDadosAtaFormatado={retornaDadosAtaFormatado}
                    />
                }

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
                {dadosAta && Object.entries(dadosAta).length > 0 &&
                    <TextoDinamicoInferior
                        dadosAta={dadosAta}
                        retornaDadosAtaFormatado={retornaDadosAtaFormatado}
                        infoAta={infoAta}
                        valorTemplate={valorTemplate}
                    />
                }
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