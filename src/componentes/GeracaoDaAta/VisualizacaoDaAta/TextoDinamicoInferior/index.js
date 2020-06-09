import React from "react";

export const TextoDinamicoInferior = ()=>{
    return(
        <div className="row">
            <div className="col-12">
                <p>O(a) Senhor(a) [presidente_reuniao] esclareceu que as despesas atenderam às prioridades registradas na(s) ata(a) da(s) reunião(ões) da Associação e em seguida  informou que ao término do período de realização das despesas do [periodo.referencia] 1°] repasse de 2019, restaram na conta nº [conta_associacao.numero_conta] do [conta_associacao.banco_nome], agência [conta_associacao.agencia] os valores de [despesas_no_periodo_custeio] para despesas de custeio e [despesas_no_periodo_capital], para despesas de capital, totalizando de [despesas_no_periodo], valores estes que foram reprogramados.</p>
                <p>[comentarios]</p>
                <p>Os membros do Conselho Fiscal, à vista dos registros contábeis e verificando nos documentos apresentados a exatidão das despesas realizadas, julgaram exata a presente prestação de contas considerando-a em condições de ser [parecer_conselho] e emitindo parecer [parecer_conselho] favorável] à sua aprovação. Esgotados os assuntos o(a) senhor(a) presidente ofereceu a palavra a quem dela desejasse fazer uso e, como não houve manifestação agradeceu a presença de todos, considerando encerrada a reunião, a qual eu, [secretario_reuniao] lavrei-a na presente ata, que vai por mim assinada e pelos demais presentes.</p>
                <p>[data_reuniao] São Paulo, dia 10 de maio de 2020</p>
            </div>

            <div className='col-12 col-md-6 mt-5'>
                <p className="mb-0">_____________________________________________</p>
                <p className="mb-0">[presidente_reuniao] (nome do Presidente da reunião)</p>
                <p className="mb-0">[cargo_presidente_reuniao] (cargo)</p>
            </div>

            <div className='col-12 col-md-6 mt-5'>

                <p className="mb-0">_____________________________________________</p>
                <p className="mb-0">[secretario_reuniao] (nome de quem lavrou a ata)</p>
                <p className="mb-0">[cargo_secretaria_reuniao] (cargo)</p>
            </div>

        </div>
    )
}
