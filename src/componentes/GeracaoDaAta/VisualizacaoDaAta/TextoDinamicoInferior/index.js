import React from "react";

export const TextoDinamicoInferior = ({dadosAta, retornaDadosAtaFormatado, infoAta, valorTemplate})=>{
    return(
        <div className="row">
            <div className="col-12">
                <p>O(a) Senhor(a) {dadosAta.presidente_reuniao ? dadosAta.presidente_reuniao : "___"} esclareceu que as despesas atenderam às prioridades registradas na(s) ata(a) da(s) reunião(ões) da Associação e em seguida  informou que ao término do período de realização das despesas do {retornaDadosAtaFormatado("periodo.referencia")}, restaram na conta nº {dadosAta.conta_associacao.numero_conta ? dadosAta.conta_associacao.numero_conta : "___"} do {dadosAta.conta_associacao.banco_nome ? dadosAta.conta_associacao.banco_nome : "___"}, agência {dadosAta.conta_associacao.agencia ? dadosAta.conta_associacao.agencia : "___"} os valores de R${valorTemplate(infoAta.totais.saldo_atual_custeio)} para despesas de custeio e R${valorTemplate(infoAta.totais.saldo_atual_capital)}, para despesas de capital, totalizando de R${valorTemplate(infoAta.totais.saldo_atual_total)}, valores estes que foram reprogramados.</p>
                <p>{dadosAta.comentarios ? dadosAta.comentarios : ""}</p>
                <p>{retornaDadosAtaFormatado("parecer_conselho")} Esgotados os assuntos o(a) senhor(a) presidente ofereceu a palavra a quem dela desejasse fazer uso e, como não houve manifestação agradeceu a presença de todos, considerando encerrada a reunião, a qual eu, {dadosAta.secretario_reuniao ? dadosAta.secretario_reuniao : "___"} lavrei-a na presente ata, que vai por mim assinada e pelos demais presentes.</p>
                <p>{retornaDadosAtaFormatado("data_reuniao_texto_inferior")}</p>
            </div>

            <div className='col-12 col-md-6 mt-5'>
                <div className='row'>
                    <div className="col-12 col-md-5">
                        <p className="mb-0 text-center">_____________________________________________</p>
                        <p className="mb-0 text-center"><strong>{dadosAta.presidente_reuniao ? dadosAta.presidente_reuniao : "___"}</strong></p>
                        <p className="mb-0 text-center">{dadosAta.cargo_presidente_reuniao ? dadosAta.cargo_presidente_reuniao : "___"}</p>
                    </div>
                </div>
            </div>

            <div className='col-12 col-md-6 mt-5'>
                <div className='row'>
                    <div className="col-12 col-md-5">
                        <p className="mb-0 text-center">_____________________________________________</p>
                        <p className="mb-0 text-center"><strong>{dadosAta.secretario_reuniao ? dadosAta.secretario_reuniao : "___"}</strong></p>
                        <p className="mb-0 text-center">{dadosAta.cargo_secretaria_reuniao ? dadosAta.cargo_secretaria_reuniao : "___"}</p>
                    </div>
                </div>
            </div>

        </div>
    )
};
