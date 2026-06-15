import { memo } from "react";

export const AtaRetificacao = memo(({
    getNomeUnidadeEducacional,
    getAnoPorExtenso,
    getDiaPorExtenso,
    getMesPorExtenso,
    getLocalReuniao,
    getNomeUnidade,
    getHoraInicio,
    getPeriodoPaaFormatado,
    getDataFormatada,
    getTipoReuniao,
    dataReuniaoElaboracao,
    getNomePresidente,
    getTipoUnidadeComNome
}) => {
    return (
        <>
            <div className="col-12 mt-3">
                <p style={{ color: "#42474A", fontWeight: 400, fontSize: "18px", textTransform: "uppercase" }}>
                    Ata da Reunião conjunta {getTipoReuniao()} da Associação de {getNomeUnidadeEducacional()} para retificação
                    do Plano  Anual de Atividades da Associação.
                </p>
                </div>

                <div className="col-12 mt-4">
                <p> {/**Alterar as datas para a data da reunião de retificação */}
                    Aos {getDiaPorExtenso()} do mês de {getMesPorExtenso()} de {getAnoPorExtenso()}, na(o) {getLocalReuniao()},
                    da Unidade Educacional {getNomeUnidade()}, às {getHoraInicio()}, realizou-se Reunião {getTipoReuniao()} conjunta dos
                    membros da Associação de {getTipoUnidadeComNome()} e Conselho de Escola, como determina o
                    inciso XIII do artigo 118, da Lei nº 14.660/2007.
                </p>
                </div>

                <div className="col-12 mt-3">
                <p>
                    Aberta a sessão, em convocação pelo(a) Senhor(a) {getNomePresidente()}, Presidente da Diretoria  Executiva e verificada a
                    existência de número legal de participantes, os presentes  analisaram as prioridades elencadas no Plano
                    Anual de Atividades da Associação,  para o período de {getPeriodoPaaFormatado()}, aprovado
                    através da Ata da Assembleia Geral de {getDataFormatada(dataReuniaoElaboracao)}.
                </p>
                </div>

                <div className="col-12 mt-3">
                <p>
                    O(A) Senhor(a) Presidente informou todas as prioridades contempladas até o  momento, e as que não foram
                    executadas, mas que ainda poderão ser atendidas e  propôs rever se há necessidade de estabelecimento de
                    novas prioridades.
                </p>
                </div>

                <div className="col-12 mt-3">
                <p>
                    Dada a palavra, os presentes sugeriram retificar os seguintes itens para aquisição e/ou serviços que serão
                    realizados com recursos reprogramados e transferidos pelo PTRF, PDDE, Prêmio de Excelência Educacional e
                    outros recursos, de acordo  com as mudanças, atualizando o atual PAA.
                </p>
            </div>        
        </>
       
    )
});