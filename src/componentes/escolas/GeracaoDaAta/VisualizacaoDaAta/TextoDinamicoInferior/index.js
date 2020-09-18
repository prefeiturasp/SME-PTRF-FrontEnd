import React from "react";

export const TextoDinamicoInferior = ({dadosAta, retornaDadosAtaFormatado})=>{
    return(
        <div className="row">
            <div className="col-12">
                <p>{dadosAta.comentarios ? dadosAta.comentarios : ""}</p>
                <p>{retornaDadosAtaFormatado("parecer_conselho")} Esgotados os assuntos o(a) senhor(a) presidente ofereceu a palavra a quem dela desejasse fazer uso e, como não houve manifestação agradeceu a presença de todos, considerando encerrada a reunião, a qual eu, {dadosAta.secretario_reuniao ? dadosAta.secretario_reuniao : "___"} lavrei a presente ata, que vai por mim assinada e pelos demais presentes.</p>
                <p>{retornaDadosAtaFormatado("data_reuniao_texto_inferior")}</p>
            </div>
            <div className='row mt-5'>
                <div className="col ml-3">
                    <p className="mb-0 text-center">_____________________________________________</p>
                    <p className="mb-0 text-center"><strong>{dadosAta.presidente_reuniao ? dadosAta.presidente_reuniao : "___"}</strong></p>
                    <p className="mb-0 text-center">{dadosAta.cargo_presidente_reuniao ? dadosAta.cargo_presidente_reuniao : "___"}</p>
                </div>
                <div className="col">
                    <p className="mb-0 text-center">_____________________________________________</p>
                    <p className="mb-0 text-center"><strong>{dadosAta.secretario_reuniao ? dadosAta.secretario_reuniao : "___"}</strong></p>
                    <p className="mb-0 text-center">{dadosAta.cargo_secretaria_reuniao ? dadosAta.cargo_secretaria_reuniao : "___"}</p>
                </div>
            </div>
        </div>
    )
};
