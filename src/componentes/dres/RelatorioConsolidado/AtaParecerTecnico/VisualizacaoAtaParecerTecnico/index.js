import React, {useState, useEffect, useCallback} from "react";
import {useParams} from "react-router-dom";
import { TopoComBotoes } from "./TopoComBotoes";
import { TextoDinamicoSuperior } from "./TextoDinamicoSuperior";
import { TabelaAprovadas } from "./TabelaAprovadas";
import { Assinaturas } from "./Assinaturas";
import {getAtaParecerTecnico, getInfoContas, getDownloadAtaParecerTecnico} from "../../../../../services/dres/AtasParecerTecnico.service";
import moment from "moment";
import Loading from "../../../../../utils/Loading"
import {getConsolidadoDrePorUuidAtaDeParecerTecnico} from "../../../../../services/dres/RelatorioConsolidado.service"

moment.updateLocale('pt', {
    months: [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
        "agosto", "setembro", "outubro", "novembro", "dezembro"
    ]
});

const numero = require('numero-por-extenso');

export const VisualizacaoDaAtaParecerTecnico = () => {
    let {uuid_ata, ja_publicado} = useParams();

    // Para bloquear as edições quando for de um Consolidado DRE incremental publicacoes_anteriores
    // eslint-disable-next-line no-eval
    const jaPublicado = eval(ja_publicado)

    const [dadosAta, setDadosAta] = useState({});
    const [infoContas, setInfoContas] = useState([])
    const [loading, setLoading] = useState(true);

    // Consolidado DRE
    const [consolidadoDre, setConsolidadoDre] = useState(false);

    useEffect(() => {
        getDadosAta();
    }, []);

    useEffect(() => {
        consultaInfoContas();
    }, [dadosAta]);

    const getDadosAta = async () => {
        let dados_ata = await getAtaParecerTecnico(uuid_ata);
        setDadosAta(dados_ata);
    }

    const consultaInfoContas = async () => {
        if(dadosAta && Object.entries(dadosAta).length > 0){
            let info = await getInfoContas(dadosAta.dre.uuid, dadosAta.periodo.uuid)
            setInfoContas(info)
            setLoading(false);
        }

    }

    const carregaConsolidadoDrePorUuidDaAtaDeParecerTecnico = useCallback(async () => {
        if (uuid_ata){
            let consolidado_dre = await getConsolidadoDrePorUuidAtaDeParecerTecnico(uuid_ata)
            setConsolidadoDre(consolidado_dre)
        }
    }, [uuid_ata])

    useEffect(() => {
        carregaConsolidadoDrePorUuidDaAtaDeParecerTecnico()
    }, [carregaConsolidadoDrePorUuidDaAtaDeParecerTecnico])

    const dataPorExtenso = (data) => {
        if (!data) {
            return "___ dias do mês de ___ de ___"
        } else {
            let dia_por_extenso = numero.porExtenso(moment(new Date(data), "YYYY-MM-DD").add(1, 'days').format("DD"));
            let mes_por_extenso = moment(new Date(data), "YYYY-MM-DD").add(1, 'days').format("MMMM");
            let ano_por_extenso = numero.porExtenso(moment(new Date(data), "DD/MM/YYYY").add(1, 'days').year());
            let data_por_extenso
            if (dia_por_extenso === 'um'){
                data_por_extenso = "No primeiro dia do mês de " + mes_por_extenso + " de " + ano_por_extenso;
            }else {
                data_por_extenso = "Aos " + dia_por_extenso + " dias do mês de " + mes_por_extenso + " de " + ano_por_extenso;
            }
            return data_por_extenso;
        }
    };

    const horaPorExtenso = (hora_reuniao) => {
        let hora = hora_reuniao.split(":")[0];
        let minuto = hora_reuniao.split(":")[1];
        let texto_hora = "";
        let texto_minuto = "";
        let hora_extenso = "";

        // Corrigindo os plurais de hora e minuto
        if (hora === "01" || hora === "00"){
            texto_hora = "hora"
        }
        else{
            texto_hora = "horas"
        }

        if (minuto === "01" || minuto === "00"){
            texto_minuto = "minuto"
        }
        else{
            texto_minuto = "minutos"
        }
        // Corrigindo o genero de hora
        let hora_genero = numero.porExtenso(hora).replace("um", "uma").replace("dois", "duas")

        if(numero.porExtenso(minuto) === "zero"){
            hora_extenso = `${hora_genero} ${texto_hora}`
        }
        else{
            hora_extenso = `${hora_genero} ${texto_hora} e ${numero.porExtenso(minuto)} ${texto_minuto}`;
        }

        return hora_extenso;

    }

    const retornaDadosAtaFormatado = (campo) => {
        if (campo === "periodo.data_inicio_realizacao_despesas") {
            return dadosAta.periodo.data_inicio_realizacao_despesas ? moment(new Date(
                dadosAta.periodo.data_inicio_realizacao_despesas), "YYYY-MM-DD").add(1, 'days').format("DD/MM/YYYY") : "";
        }
        else if (campo === "periodo.data_fim_realizacao_despesas") {
            return dadosAta.periodo.data_fim_realizacao_despesas ? moment(new Date(
                dadosAta.periodo.data_fim_realizacao_despesas), "YYYY-MM-DD").add(1, 'days').format("DD/MM/YYYY") : "";
        }
        else if (campo === "data_reuniao") {
            return dataPorExtenso(dadosAta.data_reuniao);
        }
        else if (campo === "numero_ata") {
            let numero_ata = dadosAta.numero_ata ? dadosAta.numero_ata : "";
            let ano = dadosAta.data_reuniao ? moment(new Date(dadosAta.data_reuniao), "YYYY-MM-DD").format("YYYY") : ""
            return numero_ata && ano ? `${numero_ata}/${ano}` : ""
        }
        else if(campo === "numero_portaria") {
            let numero_portaria = dadosAta.numero_portaria ? dadosAta.numero_portaria : "";
            let ano = dadosAta.data_portaria ? moment(new Date(dadosAta.data_portaria), "YYYY-MM-DD").format("YYYY") : ""
            if(numero_portaria && ano){
                return `${numero_portaria}/${ano}`;
            }
            else{
                return "_______"
            }
        }
        else if(campo === "data_portaria") {
            if(dadosAta.data_portaria){
                return moment(new Date(
                    dadosAta.data_portaria), "YYYY-MM-DD").add(1, 'days').format("DD/MM/YYYY");
            }
            else{
                return "__________";
            }
        }
        else if(campo === "hora_reuniao"){
            return horaPorExtenso(dadosAta.hora_reuniao);
        }
        else if(campo === "nome_dre"){
            let nome_dre = dadosAta.dre.nome.toUpperCase();
            if(nome_dre.indexOf("DIRETORIA REGIONAL DE EDUCACAO") !== -1){
                nome_dre = nome_dre.replace("DIRETORIA REGIONAL DE EDUCACAO", "")
                nome_dre = nome_dre.trim();
            }

            return nome_dre;
        }
    };

    const retornaTituloCabecalhoAta = () => {
        if(ehPrevia()){
            return "Visualização da prévia da ata"
        }

        return "Visualização da ata"
    }

    const retornaTituloCorpoAta = () => {
        if(ehPrevia()){
            return "PRÉVIA DA ATA DE PARECER TÉCNICO CONCLUSIVO"
        }
        return "ATA DE PARECER TÉCNICO CONCLUSIVO"
    }

    const ehPrevia = () => {
        if(!consolidadoDre.uuid){
            return true;
        }
        else if(consolidadoDre.uuid && consolidadoDre.versao === "PREVIA"){
            return true;
        }
        return false;
    }

    const handleClickFecharAtaParecerTecnico = () => {
        window.location.assign("/dre-relatorio-consolidado")
    };

    const handleClickEditarAta = () => {
        let path = `/edicao-da-ata-parecer-tecnico/${uuid_ata}/`;
        window.location.assign(path)
    }

    const downloadAtaParecerTecnico = async () =>{
        await getDownloadAtaParecerTecnico(dadosAta.uuid);
    };

    return (
        <div className="col-12 container-visualizacao-da-ata-parecer-tecnico mb-5">
            {loading ? (
                    <div className="mt-5">
                        <Loading
                            corGrafico="black"
                            corFonte="dark"
                            marginTop="0"
                            marginBottom="0"
                        />
                    </div>
                ) :

                <>
                    <div className="col-12 mt-4">
                        {dadosAta && Object.entries(dadosAta).length > 0 &&
                            <TopoComBotoes
                                dadosAta={dadosAta}
                                retornaDadosAtaFormatado={retornaDadosAtaFormatado}
                                handleClickFecharAtaParecerTecnico={handleClickFecharAtaParecerTecnico}
                                handleClickEditarAta={handleClickEditarAta}
                                downloadAtaParecerTecnico={downloadAtaParecerTecnico}
                                retornaTituloCabecalhoAta={retornaTituloCabecalhoAta}
                                jaPublicado={jaPublicado}
                            />
                        }
                    </div>

                    <div className="col-12">
                        {dadosAta && Object.entries(dadosAta).length > 0 &&
                            <TextoDinamicoSuperior
                                retornaDadosAtaFormatado={retornaDadosAtaFormatado}
                                retornaTituloCorpoAta={retornaTituloCorpoAta}
                                ehPrevia={ehPrevia}
                            />
                        }

                        {dadosAta && Object.entries(dadosAta).length > 0 && infoContas && infoContas.aprovadas &&
                            <TabelaAprovadas
                                infoContas={infoContas.aprovadas}
                                status="aprovadas"
                                exibirUltimoItem={false}
                            />
                        }

                        {dadosAta && Object.entries(dadosAta).length > 0 && infoContas && infoContas.aprovadas_ressalva &&
                            <TabelaAprovadas
                                infoContas={infoContas.aprovadas_ressalva}
                                status="aprovadas_ressalva"
                                exibirUltimoItem={false}
                            />
                        }

                        {dadosAta && Object.entries(dadosAta).length > 0 && infoContas && infoContas.reprovadas &&
                            <TabelaAprovadas
                                infoContas={infoContas.reprovadas}
                                status="reprovadas"
                                exibirUltimoItem={true}
                            />
                        }

                        {dadosAta && Object.entries(dadosAta).length > 0 && dadosAta.presentes_na_ata &&
                            <Assinaturas
                                presentes_na_ata={dadosAta.presentes_na_ata}
                            />
                        }
                    </div>
                </>
            }
        </div>
    )
}