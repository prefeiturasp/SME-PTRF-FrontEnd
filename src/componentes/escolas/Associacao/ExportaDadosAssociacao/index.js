import React, {useState} from "react";
import "../associacao.scss"
import {exportarDadosAssociacao} from "../../../../services/escolas/Associacao.service";
import Loading from "../../../../utils/Loading";
import IconeExportarDados from "../../../../assets/img/icone-exportar-dados.svg";

export const ExportaDadosDaAsssociacao = () => {
    const [loading, setLoading] = useState(false);

    const exportarDados = async () => {
        setLoading(true);
        await exportarDadosAssociacao();
        setLoading(false);
    };

    return (
        <>
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                <div className="d-flex  justify-content-end pb-3 mt-3">
                    <a onClick={exportarDados} className="link-exportar">
                        <img
                            src={IconeExportarDados}
                            alt=""
                            className="img-fluid"
                        /> <strong>Exportar</strong>
                    </a>
                </div>


            }
        </>
    );
};