import React from "react";

export const TextoDinamicoInferior = ({dadosAta, retornaDadosAtaFormatado})=>{
    return(
        <div className="row">
            <div className="col-12">
                <p>{dadosAta.comentarios ? dadosAta.comentarios : ""}</p>
                <p>Esgotados os assuntos o(a) senhor(a) presidente ofereceu a palavra a quem dela desejasse fazer uso e, como não houve manifestação agradeceu a presença de todos, considerando encerrada a reunião, a qual eu, {dadosAta.secretario_reuniao ? dadosAta.secretario_reuniao : "___"} lavrei a presente ata, que vai por mim assinada e pelos demais presentes.</p>
                <p className="mt-5">{retornaDadosAtaFormatado("data_reuniao_texto_inferior")}</p>
            </div>
        </div>
    )
};
