import React from "react";

export const TextoDinamicoInferiorPorAcao = ({dadosAta, retornaDadosAtaFormatado, infoAta, valorTemplate})=>{
    return(
        <>
            {dadosAta && infoAta &&
                <div className="row">
                    <div className="col-12">
                        <p>O(a) Senhor(a) {dadosAta.presidente_reuniao ? dadosAta.presidente_reuniao : "___"} esclareceu que as despesas atenderam às prioridades registradas na(s) ata(a) da(s) reunião(ões) da Associação e em seguida  informou que ao término do período de realização das despesas do {dadosAta.periodo && dadosAta.periodo.referencia ? retornaDadosAtaFormatado("periodo.referencia") : ''}, restaram na conta nº {infoAta.conta_associacao.numero_conta ? infoAta.conta_associacao.numero_conta : "___"} do {infoAta.conta_associacao.banco_nome ? infoAta.conta_associacao.banco_nome : "___"}, agência {infoAta.conta_associacao.agencia ? infoAta.conta_associacao.agencia : "___"} os valores de R${infoAta.totais && infoAta.totais.saldo_atual_custeio ? valorTemplate(infoAta.totais.saldo_atual_custeio) : " 0,00"} para despesas de custeio, R${infoAta.totais && infoAta.totais.saldo_atual_capital ? valorTemplate(infoAta.totais.saldo_atual_capital) : " 0,00"}, para despesas de capital e R${infoAta.totais && infoAta.totais.saldo_atual_livre ? valorTemplate(infoAta.totais.saldo_atual_livre) : " 0,00"} para despesas de livre aplicação, totalizando de R${infoAta.totais && infoAta.totais.saldo_atual_total ? valorTemplate(infoAta.totais.saldo_atual_total) : "0,00"}, valores estes que foram reprogramados.</p>
                    </div>
                </div>
            }
        </>
    )
};
