import React, {useState} from "react";
import "../associacao.scss"
import {exportarDadosAssociacao, exportarDadosAssociacaoPdf} from "../../../../services/escolas/Associacao.service";
import Loading from "../../../../utils/Loading";
import {visoesService} from "../../../../services/visoes.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";

export const ExportaDadosDaAsssociacao = () => {
    const [loading, setLoading] = useState(false);

    const exportarDados = async () => {
        setLoading(true);
        await exportarDadosAssociacao();
        setLoading(false);
    };

    const exportarDadosPdf = async () => {
        setLoading(true);
        await exportarDadosAssociacaoPdf();
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
                <div className="d-flex  justify-content-end pb-3">
                    <button
                        onClick={exportarDados}
                        className={`link-exportar`}
                    >
                        <FontAwesomeIcon
                            style={{marginRight:'3px'}}
                            icon={faDownload}
                        />
                        <strong>Exportar dados da associação</strong>
                    </button>
                    <span> | </span>
                    <button
                        onClick={exportarDadosPdf}
                        className={`link-exportar`}
                    >
                        <FontAwesomeIcon
                            style={{marginRight:'3px'}}
                            icon={faDownload}
                        />
                        <strong>Exportar ficha cadastral</strong>
                    </button>
                </div>
            }
        </>
    );
};