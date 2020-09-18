import React from "react";

export const TextoDinamicoInferiorPorAcao = ({dadosAta, retornaDadosAtaFormatado, infoAta, valorTemplate})=>{
    return(
        <div className="row">
            <div className="col-12">
                <p>O(a) Senhor(a) {dadosAta.presidente_reuniao ? dadosAta.presidente_reuniao : "___"} esclareceu que as despesas atenderam às prioridades registradas na(s) ata(a) da(s) reunião(ões) da Associação e em seguida  informou que ao término do período de realização das despesas do {retornaDadosAtaFormatado("periodo.referencia")}, restaram na conta nº {dadosAta.conta_associacao.nome ? dadosAta.conta_associacao.nome : "___"}  os valores de R${valorTemplate(infoAta.totais.saldo_atual_custeio)} para despesas de custeio, R${valorTemplate(infoAta.totais.saldo_atual_capital)}, para despesas de capital e R${valorTemplate(infoAta.totais.saldo_atual_livre)} para despesas de livre aplicação, totalizando de R${valorTemplate(infoAta.totais.saldo_atual_total)}, valores estes que foram reprogramados.</p>
                {/*<p>O(a) Senhor(a) {dadosAta.presidente_reuniao ? dadosAta.presidente_reuniao : "___"} esclareceu que as despesas atenderam às prioridades registradas na(s) ata(a) da(s) reunião(ões) da Associação e em seguida  informou que ao término do período de realização das despesas do {retornaDadosAtaFormatado("periodo.referencia")}, restaram na conta nº {dadosAta.conta_associacao.numero_conta ? dadosAta.conta_associacao.numero_conta : "___"} do {dadosAta.conta_associacao.banco_nome ? dadosAta.conta_associacao.banco_nome : "___"}, agência {dadosAta.conta_associacao.agencia ? dadosAta.conta_associacao.agencia : "___"} os valores de R${valorTemplate(infoAta.totais.saldo_atual_custeio)} para despesas de custeio, R${valorTemplate(infoAta.totais.saldo_atual_capital)}, para despesas de capital e R${valorTemplate(infoAta.totais.saldo_atual_livre)} para despesas de livre aplicação, totalizando de R${valorTemplate(infoAta.totais.saldo_atual_total)}, valores estes que foram reprogramados.</p>*/}
            </div>

        </div>
    )
};
