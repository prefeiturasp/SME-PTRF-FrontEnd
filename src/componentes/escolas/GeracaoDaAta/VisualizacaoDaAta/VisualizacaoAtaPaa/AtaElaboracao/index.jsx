import { memo } from "react"

export const AtaElaboracao = memo((
    {
        getNomeUnidadeEducacional, 
        getDiaPorExtenso, 
        getMesPorExtenso, 
        getAnoPorExtenso, 
        getLocalReuniao, 
        getNomeUnidade, 
        getHoraInicio, 
        getTipoReuniao, 
        getTipoUnidadeComNome
    }) => {
        return (
            <>
                <div className="col-12 mt-3">
                    <p style={{ color: "#42474A", fontWeight: 400, fontSize: "18px", textTransform: "uppercase" }}>
                    Ata de Reunião Conjunta {getTipoReuniao()} do Conselho de Escola e da Associação de Pais e Mestres
                    da(o) {getNomeUnidadeEducacional()}
                    </p>
                </div>

                <div className="col-12 mt-3">
                    <p style={{ textAlign: "center" }}>Plano Anual de Atividades – PAA</p>
                </div>

                <div className="col-12 mt-4">
                    <p>
                    Aos {getDiaPorExtenso()} do mês de {getMesPorExtenso()} de {getAnoPorExtenso()}, no (a) {getLocalReuniao()},
                    da Unidade Educacional {getNomeUnidade()}, às {getHoraInicio()}, realizou-se a reunião {getTipoReuniao()} da
                    Diretoria Executiva e Conselho Fiscal da Associação de Pais e Mestres do(a) {getTipoUnidadeComNome()}, com a
                    participação dos membros do Conselho de Escola, em atendimento ao{" "}
                    inciso XIII do artigo 118, da Lei nº 14.660/2007.
                    </p>
                </div>

                <div className="col-12 mt-4">
                    <p>
                    Dando atendimento à pauta, houve explanação sobre o Projeto Pedagógico da Unidade, o qual serviu de base
                    para a elaboração do Plano acima citado, que conterá as Atividades Previstas, Plano de Aplicação de Recursos
                    e Plano Orçamentário. A seguir, foi apresentado o PAA, o qual contempla o levantamento das
                    prioridades/atividades sugeridas pelos diferentes segmentos da comunidade escolar, procedendo-se à análise
                    para consolidação das mesmas.
                    </p>
                </div>

                <div className="col-12 mt-4">
                    <p>
                    O (A) Presidente da Diretoria Executiva explicou que a Associação recebe a verba do PTRF e conforme art. 3º,
                    da Lei Municipal nº 13.991/2005, os recursos transferidos pelo Programa devem ser aplicados: I – na
                    aquisição de material permanente; II – na aquisição de material de consumo necessário ao funcionamento da
                    Unidade Educacional; III – na manutenção, conservação e pequenos reparos da Unidade Educacional; IV – no
                    desenvolvimento de atividades educacionais; V – na implementação de Projetos Pedagógicos na Unidade
                    Educacional; VI – na contratação de serviços e VII – nos programas e projetos de inserção de tecnologias na
                    educação.
                    </p>
                </div>

                <div className="col-12 mt-4">
                    <p>
                    Após análise e discussão, foram estabelecidos pelos presentes as seguintes prioridades para os recursos
                    relacionados abaixo:
                    </p>
                </div>             
            </>
        )
});