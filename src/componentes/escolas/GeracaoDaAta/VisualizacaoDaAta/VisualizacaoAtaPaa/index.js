import React from "react";
import "../../geracao-da-ata.scss"
import {TopoComBotoes} from "./TopoComBotoes";
import {TabelaPrioridades} from "./TabelaPrioridades";
import WatermarkPrevia from "../../../../Globais/WatermarkPrevia/WatermarkPrevia";
import {useVisualizacaoAtaPaa} from "./hooks/useVisualizacaoAtaPaa";

export const VisualizacaoAtaPaa = () => {
    const {
        dadosAta,
        tabelas,
        listaPresentes,
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
        getHoraFim,
        getTipoReuniao,
        getTipoUnidadeComNome,
        getPeriodoPaaFormatado,
        formatarMesAno,
        formatarData,
        getNomeSecretario,
    } = useVisualizacaoAtaPaa();

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

