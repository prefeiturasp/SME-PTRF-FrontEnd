import React, {useEffect, useState, useRef, useCallback} from "react";
import {useParams} from "react-router-dom";
import "../../geracao-da-ata.scss"
import {TopoComBotoes} from "./TopoComBotoes";
import {getAtaPaa, getTabelasAtasPaa} from "../../../../../services/escolas/AtasPaa.service";
import {getListaPresentesPaa} from "../../../../../services/escolas/PresentesAtaPaa.service";
import {useGetAtaPaaVigente} from "../../../Paa/ElaboracaoPaa/ElaborarNovoPlano/Relatorios/hooks/useGetAtaPaaVigente";
import {ASSOCIACAO_NOME_ESCOLA, ASSOCIACAO_TIPO_ESCOLA} from "../../../../../services/auth.service";
import moment from "moment";
import {useGetPrioridadesAtaPaa} from "./hooks/useGetPrioridadesAtaPaa";
import {TabelaPrioridades} from "./TabelaPrioridades";
import {useGetAtividadesEstatutarias} from "../../../Paa/ElaboracaoPaa/ElaborarNovoPlano/Relatorios/AtividadesPrevistas/hooks/useGetAtividadesEstatutarias";
import WatermarkPrevia from "../../../../Globais/WatermarkPrevia/WatermarkPrevia";
const numero = require('numero-por-extenso');

moment.updateLocale('pt', {
    months: [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
        "agosto", "setembro", "outubro", "novembro", "dezembro"
    ]
});

export const VisualizacaoAtaPaa = () => {
    const {uuid_paa} = useParams();
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
                // Salvar lista completa para buscar o secretário
                setListaCompletaParticipantes(listaArray);
                // Filtrar apenas os presentes (presente = true) para a tabela
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
        window.location.assign(path)
    };

    const handleClickEditarAta = () => {
        let path = `/relatorios-paa/edicao-ata/${uuid_paa}`;
        window.location.assign(path)
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
        // hora_reuniao está no formato HH:mm
        const [hora, minuto] = dadosAta.hora_reuniao.split(":");
        const horaExtenso = numero.porExtenso(hora).replace("um", "uma").replace("dois", "duas");
        const minutoExtenso = numero.porExtenso(minuto);
        
        if (minuto === "00") {
            return `${horaExtenso} horas`;
        }
        return `${horaExtenso} horas e ${minutoExtenso} minutos`;
    };

    const getHoraFim = () => {
        // Como não temos hora fim na ata, vou deixar como "____"
        return "____";
    };

    const getTipoReuniao = () => {
        if (!dadosAta.tipo_reuniao) {
            return "__";
        }
        // tipo_reuniao pode ser "ORDINARIA" ou "EXTRAORDINARIA"
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

        // Data inicial: primeiro dia do mês
        const dataInicial = moment(ataPaa.periodo_paa_objeto.data_inicial);
        const diaInicial = "1º";
        const mesInicial = dataInicial.format("MMMM");
        const anoInicial = dataInicial.year();

        // Data final: último dia do mês
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
        // Parse da string YYYY-MM-DD para evitar problemas de fuso horário
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
        
        // Criar data no fuso horário local para evitar problemas de UTC
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
        // Busca o secretário na lista completa de participantes pelo cargo
        const secretario = listaCompletaParticipantes.find(p => 
            p.cargo && p.cargo.toLowerCase().includes("secretário") || 
            p.cargo && p.cargo.toLowerCase().includes("secretaria")
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

    return (
        <>
            <div className="col-12 container-visualizacao-da-ata mb-5" ref={referenciaDocumento}>
                {alturaDocumento > 0 && <WatermarkPrevia alturaDocumento={alturaDocumento} icon="rascunho"/>}
                <div className="col-12 mt-4">
                    {dadosAta && Object.entries(dadosAta).length > 0 &&
                        <TopoComBotoes
                            dadosAta={dadosAta}
                            handleClickEditarAta={handleClickEditarAta}
                            handleClickFecharAta={handleClickFecharAta}
                        />
                    }
                </div>
                <div className="col-12 mt-3">
                    <p style={{color: '#42474A', fontWeight: 400, fontSize: '18px', textTransform: 'uppercase'}}>
                        Ata de Reunião Conjunta Ordinária/Extraordinária do Conselho de Escola e da Associação de Pais e Mestres da(o) {getNomeUnidadeEducacional()}
                    </p>
                </div>
                <div className="col-12 mt-3">
                    <p style={{textAlign: 'center'}}>
                        Plano Anual de Atividades – PAA
                    </p>
                </div>
                <div className="col-12 mt-4">
                    <p>
                        Aos <strong>{getDiaPorExtenso()}</strong> do mês de <strong>{getMesPorExtenso()}</strong> de <strong>{getAnoPorExtenso()}</strong>, no (a) <strong>{getLocalReuniao()}</strong>, da Unidade Educacional <strong>{getNomeUnidade()}</strong>, das <strong>{getHoraInicio()}</strong> às <strong>{getHoraFim()}</strong>, realizou-se a reunião <strong>{getTipoReuniao()}</strong> da Diretoria Executiva e Conselho Fiscal da Associação de Pais e Mestres do(a) <strong>{getTipoUnidadeComNome()}</strong>, com a participação dos membros do Conselho de Escola, em atendimento ao <span style={{color: '#B40C02'}}>inciso XIII do artigo 118, da Lei nº 14.660/2007</span>.
                    </p>
                </div>
                <div className="col-12 mt-4">
                    <p>
                        Dando atendimento à pauta, houve explanação sobre o Projeto Pedagógico da Unidade, o qual serviu de base para a elaboração do Plano acima citado, que conterá as atividades previstas as Atividades Previstas, Plano de Aplicação de Recursos e Plano Orçamentário. A seguir, foi apresentado o PAA, o qual contempla o levantamento das prioridades/atividades sugeridas pelos diferentes segmentos da comunidade escolar, procedendo-se à análise para consolidação das mesmas.
                    </p>
                </div>
                <div className="col-12 mt-4">
                    <p>
                        O (A) Presidente da Diretoria Executiva explicou que a Associação recebe a verba do PTRF e conforme art. 3º, da Lei Municipal nº 13.991/2005, os recursos transferidos pelo Programa devem ser aplicados: I – na aquisição de material permanente; II – na aquisição de material de consumo necessário ao funcionamento da Unidade Educacional; III – na manutenção, conservação e pequenos reparos da Unidade Educacional; IV – no desenvolvimento de atividades educacionais; V – na implementação de Projetos Pedagógicos na Unidade Educacional; VI – na contratação de serviços e VII – nos programas e projetos de inserção de tecnologias na educação.
                    </p>
                </div>
                <div className="col-12 mt-4">
                    <p>
                        Após análise e discussão, foram estabelecidos pelos presentes as seguintes prioridades para os recursos relacionados abaixo:
                    </p>
                </div>
                
                {!isLoadingPrioridades && prioridadesAgrupadas && (
                    <>
                        <TabelaPrioridades
                            titulo="Prioridades PTRF"
                            prioridades={prioridadesAgrupadas.PTRF.prioridades}
                            total={prioridadesAgrupadas.PTRF.total}
                        />
                        <TabelaPrioridades
                            titulo="Prioridades PDDE"
                            prioridades={prioridadesAgrupadas.PDDE.prioridades}
                            total={prioridadesAgrupadas.PDDE.total}
                        />
                        <TabelaPrioridades
                            titulo="Prioridades Recursos próprios"
                            prioridades={prioridadesAgrupadas.RECURSO_PROPRIO.prioridades}
                            total={prioridadesAgrupadas.RECURSO_PROPRIO.total}
                        />
                    </>
                )}
                <div className="col-12 mt-4">
                    <p>
                        Foi apresentado o seguinte cronograma para as atividades de {getPeriodoPaaFormatado()}:
                    </p>
                </div>
                
                {!isLoadingAtividades && atividades && atividades.length > 0 && (
                    <div className="col-12 mt-4">
                        <h4 className="mb-3" style={{ fontWeight: 'bold', color: '#42474A' }}>
                            Atividades Estatutárias
                        </h4>
                        <table className="table table-bordered" style={{ width: '100%' }}>
                            <thead style={{ backgroundColor: '#dadada' }}>
                                <tr>
                                    <th style={{ width: '20%' }}>Tipo de Atividades</th>
                                    <th style={{ width: '15%' }}>Data</th>
                                    <th style={{ width: '45%' }}>Atividades Estatutárias Previstas</th>
                                    <th style={{ width: '20%' }}>Mês/Ano</th>
                                </tr>
                            </thead>
                            <tbody>
                                {atividades.map((atividade, index) => {
                                    const mesAnoBase = atividade.isGlobal && !atividade.vinculoUuid
                                        ? atividade.mesLabel || "-"
                                        : formatarMesAno(atividade.data);
                                    return (
                                        <tr key={atividade.uuid || index}>
                                            <td>{atividade.tipoAtividade || "-"}</td>
                                            <td>{formatarData(atividade.data)}</td>
                                            <td>{atividade.descricao || "-"}</td>
                                            <td>{mesAnoBase || "-"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                
                <div className="col-12 mt-4">
                    <h4 style={{ fontWeight: 'bold', fontSize: '20px', color: '#42474A' }}>
                        Manifestações
                    </h4>
                    {dadosAta.comentarios && (
                        <p className="mt-3">
                            {dadosAta.comentarios}
                        </p>
                    )}
                </div>
                
                <div className="col-12 mt-4">
                    {(() => {
                        if (!dadosAta.parecer_conselho || !tabelas.pareceres) {
                            return null;
                        }
                        const parecer = tabelas.pareceres.find(p => p.id === dadosAta.parecer_conselho);
                        if (!parecer) {
                            return null;
                        }
                        const parecerId = (parecer.id || "").toUpperCase();
                        
                        if (parecerId === "APROVADA" || parecerId.includes("APROV")) {
                            return (
                                <p style={{ fontWeight: 'bold' }}>
                                    Diante ao exposto, o Plano Anual de Atividades foi aprovado.
                                </p>
                            );
                        }
                        if (parecerId === "REJEITADA" || parecerId.includes("REJEIT") || parecerId.includes("REPROV")) {
                            return (
                                <>
                                    <p style={{ fontWeight: 'bold' }}>
                                        Diante ao exposto, o Plano Anual de Atividades foi rejeitado.
                                    </p>
                                    {dadosAta.justificativa && (
                                        <p className="mt-3">
                                            {dadosAta.justificativa}
                                        </p>
                                    )}
                                </>
                            );
                        }
                        return null;
                    })()}
                </div>
                
                <div className="col-12 mt-4">
                    <p>
                        Esgotados os assuntos, o (a) senhor (a) presidente ofereceu a palavra a quem dela desejasse fazer uso e, como não houve manifestação, agradeceu a presença de todos e considerou encerrada a reunião, a qual eu, <strong>{getNomeSecretario()}</strong> lavrei a presente ata, que vai por mim assinada.
                    </p>
                </div>
                
                {listaPresentes && listaPresentes.length > 0 && (
                    <div className="col-12 mt-4">
                        <h4 className="mb-3" style={{ fontWeight: 'bold', color: '#42474A' }}>
                            Lista de presentes
                        </h4>
                        <table className="table table-bordered" style={{ width: '100%' }}>
                            <thead style={{ backgroundColor: '#dadada' }}>
                                <tr>
                                    <th style={{ width: '70%' }}>Nome e cargo</th>
                                    <th style={{ width: '30%' }}>Assinatura</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaPresentes.map((presente, index) => (
                                    <tr key={presente.uuid || presente.identificacao || index}>
                                        <td>
                                            <div>
                                                <strong style={{ textTransform: 'uppercase' }}>
                                                    {presente.nome || "-"}
                                                </strong>
                                                {presente.cargo && (
                                                    <div style={{ marginTop: '4px' }}>
                                                        {presente.cargo}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    )
};

