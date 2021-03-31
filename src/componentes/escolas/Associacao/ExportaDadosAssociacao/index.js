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
                <div className="d-flex  justify-content-end pb-3 mt-3">
                    <button
                        disabled={!visoesService.getPermissoes(['change_associacao'])}
                        onClick={exportarDados}
                        className={`link-exportar ${!visoesService.getPermissoes(['change_associacao']) ? 'link-exportar-disabled' : ''}`}
                    >
                        <FontAwesomeIcon
                            style={{color: `${!visoesService.getPermissoes(['change_associacao']) ? '#7D7D7D' : '#00585E'}`, marginRight:'3px'}}
                            icon={faDownload}
                        />
                        <strong>Exportar dados da associação</strong>
                    </button>
                    <span> | </span>
                    <button
                        disabled={!visoesService.getPermissoes(['change_associacao'])}
                        onClick={exportarDadosPdf}
                        className={`link-exportar ${!visoesService.getPermissoes(['change_associacao']) ? 'link-exportar-disabled' : ''}`}
                    >
                        <FontAwesomeIcon
                            style={{color: `${!visoesService.getPermissoes(['change_associacao']) ? '#7D7D7D' : '#00585E'}`, marginRight:'3px'}}
                            icon={faDownload}
                        />
                        <strong>Exportar ficha cadastral</strong>
                    </button>
                </div>
            }
        </>
    );
};