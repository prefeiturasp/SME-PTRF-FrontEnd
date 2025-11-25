import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { getAtaPaa, getTabelasAtasPaa } from "../../../../../../services/escolas/AtasPaa.service";
import { getListaPresentesPaa } from "../../../../../../services/escolas/PresentesAtaPaa.service";
import { useGetAtaPaaVigente } from "../../../../Paa/ElaboracaoPaa/ElaborarNovoPlano/Relatorios/hooks/useGetAtaPaaVigente";
import { ASSOCIACAO_NOME_ESCOLA, ASSOCIACAO_TIPO_ESCOLA } from "../../../../../../services/auth.service";
import { useGetPrioridadesAtaPaa } from "./useGetPrioridadesAtaPaa";
import { useGetAtividadesEstatutarias } from "../../../../Paa/ElaboracaoPaa/ElaborarNovoPlano/Relatorios/AtividadesPrevistas/hooks/useGetAtividadesEstatutarias";

const numero = require('numero-por-extenso');

moment.updateLocale('pt', {
    months: [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
        "agosto", "setembro", "outubro", "novembro", "dezembro"
    ]
});

export const useVisualizacaoAtaPaa = () => {
    const { uuid_paa } = useParams();
    const { ataPaa } = useGetAtaPaaVigente(uuid_paa);
    const ataUuid = ataPaa?.uuid;
    const [dadosAta, setDadosAta] = useState({});
    const [tabelas, setTabelas] = useState({});
    const [listaPresentes, setListaPresentes] = useState([]);
    const [listaCompletaParticipantes, setListaCompletaParticipantes] = useState([]);
    const [alturaDocumento, setAlturaDocumento] = useState(0);
    const referenciaDocumento = useRef(null);
    const { prioridadesAgrupadas, isLoading: isLoadingPrioridades } = useGetPrioridadesAtaPaa(uuid_paa);
    const { atividades, isLoading: isLoadingAtividades } = useGetAtividadesEstatutarias();

    useEffect(() => {
        if (!ataUuid) {
            return;
        }
        getDadosAta(ataUuid);
    }, [ataUuid]);

    useEffect(() => {
        const carregarTabelas = async () => {
            const tabelasData = await getTabelasAtasPaa();
            setTabelas(tabelasData || {});
        };
        carregarTabelas();
    }, []);

    useEffect(() => {
        const carregarListaPresentes = async () => {
            if (!ataUuid) {
                return;
            }
            try {
                const lista = await getListaPresentesPaa(ataUuid);
                const listaArray = Array.isArray(lista) ? lista : [];
                setListaCompletaParticipantes(listaArray);
                const presentes = listaArray.filter(p => p.presente === true);
                setListaPresentes(presentes);
            } catch (error) {
                console.error("Erro ao carregar lista de presentes:", error);
                setListaPresentes([]);
                setListaCompletaParticipantes([]);
            }
        };
        carregarListaPresentes();
    }, [ataUuid]);

    const getDadosAta = async (ata_uuid) => {
        let dados_ata = await getAtaPaa(ata_uuid);
        setDadosAta(dados_ata);
    };

    const handleClickFecharAta = () => {
        let path = `/elaborar-novo-paa`;
        window.location.assign(path);
    };

    const handleClickEditarAta = () => {
        let path = `/relatorios-paa/edicao-ata/${uuid_paa}`;
        window.location.assign(path);
    };

    const getNomeUnidadeEducacional = () => {
        const tipoUnidade = localStorage.getItem(ASSOCIACAO_TIPO_ESCOLA) || "";
        const nomeUnidade = localStorage.getItem(ASSOCIACAO_NOME_ESCOLA) || "";
        
        if (tipoUnidade && nomeUnidade) {
            return `${tipoUnidade} ${nomeUnidade}`;
        }
        return nomeUnidade || tipoUnidade || "";
    };

    const getDiaPorExtenso = () => {
        if (!dadosAta.data_reuniao) {
            return "__";
        }
        const dia = moment(new Date(dadosAta.data_reuniao), "YYYY-MM-DD").add(1, 'days').format("DD");
        const diaExtenso = numero.porExtenso(dia);
        return diaExtenso === 'um' ? 'primeiro' : diaExtenso;
    };

    const getMesPorExtenso = () => {
        if (!dadosAta.data_reuniao) {
            return "__";
        }
        return moment(new Date(dadosAta.data_reuniao), "YYYY-MM-DD").add(1, 'days').format("MMMM");
    };

    const getAnoPorExtenso = () => {
        if (!dadosAta.data_reuniao) {
            return "dois mil e vinte e cinco";
        }
        const ano = moment(new Date(dadosAta.data_reuniao), "YYYY-MM-DD").add(1, 'days').year();
        return numero.porExtenso(ano);
    };

    const getLocalReuniao = () => {
        return dadosAta.local_reuniao || "______";
    };

    const getNomeUnidade = () => {
        return getNomeUnidadeEducacional() || "_____";
    };

    const getHoraInicio = () => {
        if (!dadosAta.hora_reuniao) {
            return "____";
        }
        const [hora, minuto] = dadosAta.hora_reuniao.split(":");
        const horaExtenso = numero.porExtenso(hora).replace("um", "uma").replace("dois", "duas");
        const minutoExtenso = numero.porExtenso(minuto);
        
        if (minuto === "00") {
            return `${horaExtenso} horas`;
        }
        return `${horaExtenso} horas e ${minutoExtenso} minutos`;
    };

    const getTipoReuniao = () => {
        if (!dadosAta.tipo_reuniao) {
            return "__";
        }
        if (dadosAta.tipo_reuniao === "ORDINARIA") {
            return "ordinária";
        } else if (dadosAta.tipo_reuniao === "EXTRAORDINARIA") {
            return "extraordinária";
        }
        return "__";
    };

    const getTipoUnidadeComNome = () => {
        const tipoUnidade = localStorage.getItem(ASSOCIACAO_TIPO_ESCOLA) || "";
        const nomeUnidade = localStorage.getItem(ASSOCIACAO_NOME_ESCOLA) || "";
        
        if (tipoUnidade && nomeUnidade) {
            return `${tipoUnidade} ${nomeUnidade}`;
        }
        return nomeUnidade || tipoUnidade || "_____";
    };

    const getPeriodoPaaFormatado = () => {
        if (!ataPaa?.periodo_paa_objeto?.data_inicial || !ataPaa?.periodo_paa_objeto?.data_final) {
            return "1º de maio de 2025 a 30 de abril de 2026";
        }

        const dataInicial = moment(ataPaa.periodo_paa_objeto.data_inicial);
        const diaInicial = "1º";
        const mesInicial = dataInicial.format("MMMM");
        const anoInicial = dataInicial.year();

        const dataFinal = moment(ataPaa.periodo_paa_objeto.data_final);
        const ultimoDia = dataFinal.daysInMonth();
        const diaFinal = ultimoDia;
        const mesFinal = dataFinal.format("MMMM");
        const anoFinal = dataFinal.year();

        return `${diaInicial} de ${mesInicial} de ${anoInicial} a ${diaFinal} de ${mesFinal} de ${anoFinal}`;
    };

    const formatarMesAno = (valor) => {
        if (!valor) {
            return "-";
        }
        const partes = valor.split("-");
        if (partes.length !== 3) {
            const data = new Date(valor);
            if (Number.isNaN(data.getTime())) {
                return "-";
            }
            const mes = data.toLocaleDateString("pt-BR", { month: "long" });
            const ano = data.getFullYear();
            if (!mes) {
                return `${ano || ""}`;
            }
            return `${mes.charAt(0).toUpperCase()}${mes.slice(1)}/${ano}`;
        }
        
        const ano = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10);
        const dia = parseInt(partes[2], 10);
        
        if (Number.isNaN(ano) || Number.isNaN(mes) || Number.isNaN(dia)) {
            return "-";
        }
        
        const data = new Date(ano, mes - 1, dia);
        const mesFormatado = data.toLocaleDateString("pt-BR", { month: "long" });
        const anoFormatado = data.getFullYear();
        
        if (!mesFormatado) {
            return `${anoFormatado || ""}`;
        }
        return `${mesFormatado.charAt(0).toUpperCase()}${mesFormatado.slice(1)}/${anoFormatado}`;
    };

    const formatarData = (valor) => {
        if (!valor) return "-";
        const date = new Date(valor);
        return Number.isNaN(date.getTime())
            ? "-"
            : new Intl.DateTimeFormat("pt-BR").format(date);
    };

    const getNomeSecretario = () => {
        const secretario = listaCompletaParticipantes.find(p => 
            p.cargo && (
                p.cargo.toLowerCase().includes("secretário") || 
                p.cargo.toLowerCase().includes("secretaria")
            )
        );
        return secretario && secretario.nome ? secretario.nome : "_____";
    };

    const atualizarAlturaDocumento = useCallback(() => {
        if (referenciaDocumento.current) {
            setAlturaDocumento(referenciaDocumento.current.clientHeight);
        }
    }, []);

    useEffect(() => {
        atualizarAlturaDocumento();
        window.addEventListener("resize", atualizarAlturaDocumento);
        return () => window.removeEventListener("resize", atualizarAlturaDocumento);
    }, [atualizarAlturaDocumento]);

    useEffect(() => {
        atualizarAlturaDocumento();
    }, [atualizarAlturaDocumento, dadosAta, prioridadesAgrupadas, atividades, listaPresentes]);

    return {
        dadosAta,
        tabelas,
        listaPresentes,
        listaCompletaParticipantes,
        alturaDocumento,
        referenciaDocumento,
        prioridadesAgrupadas,
        isLoadingPrioridades,
        atividades,
        isLoadingAtividades,
        handleClickFecharAta,
        handleClickEditarAta,
        getNomeUnidadeEducacional,
        getDiaPorExtenso,
        getMesPorExtenso,
        getAnoPorExtenso,
        getLocalReuniao,
        getNomeUnidade,
        getHoraInicio,
        getTipoReuniao,
        getTipoUnidadeComNome,
        getPeriodoPaaFormatado,
        formatarMesAno,
        formatarData,
        getNomeSecretario,
    };
};

