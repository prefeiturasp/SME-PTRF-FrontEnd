import React, { useState } from "react";
import { PaaCardBarraTitulo } from "../PaaCardBarraTitulo/PaaCardBarraTitulo";
import "./PaaCard.scss";

const MAPA_COR_MENSAGEM = {
    green: "#0F7A6C",
    red: "#C22D2D",
    orange: "#D06D12",
    grey: "#60686A",
};

const corMensagemParaHex = (corMensagem) =>
    MAPA_COR_MENSAGEM[corMensagem] || MAPA_COR_MENSAGEM.grey;

const RetificacaoAnterior = ({ tituloSecao, documento, ata }) => {
    return (
        <div className="ret-item">
            <h4>{tituloSecao}</h4>
            <div className="linha">
                <strong>Plano Anual</strong>
                <span
                    style={{
                        color: corMensagemParaHex(documento?.cor_mensagem),
                    }}
                >
                    {documento?.mensagem}
                </span>
            </div>
            <div className="linha">
                <strong>Ata de retificaçao do PAA</strong>
                <span style={{ color: corMensagemParaHex(ata?.cor_mensagem) }}>
                    {ata?.mensagem}
                </span>
            </div>
            <div className="linha">
                <p className="mb-0 resumo-assembleia">
                    {ata?.resumo_assembleia}
                </p>
            </div>
        </div>
    );
};

const RetificacoesAnteriores = ({ retificacoesAnteriores = [] }) => {
    const [ehAberto, setEhAberto] = useState(false);

    return retificacoesAnteriores && retificacoesAnteriores.length > 0 ? (
        <div className="retificacoes-anteriores">
            <PaaCardBarraTitulo
                titulo={"PAA Retificações anteriores"}
                isAberto={ehAberto}
                onToggle={() => setEhAberto(!ehAberto)}
            />

            {ehAberto ? (
                <div className="ret-container">
                    {retificacoesAnteriores.map((ret_anterior) => (
                        <RetificacaoAnterior
                            key={ret_anterior?.secao_titulo}
                            tituloSecao={ret_anterior?.secao_titulo}
                            documento={ret_anterior?.documento}
                            ata={ret_anterior?.ata}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    ) : (
        <></>
    );
};

export default RetificacoesAnteriores;
