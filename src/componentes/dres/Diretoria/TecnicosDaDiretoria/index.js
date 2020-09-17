import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";
import {MenuInterno} from "../../../Globais/MenuInterno";
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import {CadastroTecnicosDre} from "./CadastroTecnicosDre";
import {DADOS_DA_ASSOCIACAO} from "../../../../services/auth.service";
import {getUnidade} from "../../../../services/dres/Unidades.service";
import Loading from "../../../../utils/Loading";

export const TecnicosDaDiretoria = () => {
    const [loading, setLoading] = useState(true);
    const [dadosDiretoria, setDadosDiretoria] = useState(null);

    const buscaDiretoria = async () => {
        let diretoria = await getUnidade();
        setDadosDiretoria(diretoria);
        setLoading(false)
    };
    useEffect(() => {
        buscaDiretoria()
    }, []);


    let dadosDaAssociacao = JSON.parse(localStorage.getItem(DADOS_DA_ASSOCIACAO));
    return (
        <>
            {loading ? (
                    <div className="mt-5">
                        <Loading
                            corGrafico="black"
                            corFonte="dark"
                            marginTop="0"
                            marginBottom="0"
                        />
                    </div>
                ) :
                dadosDiretoria ? (
                        <>
                            <div className="d-flex bd-highlight">
                                <div className="p-2 flex-grow-1 bd-highlight">
                                    <h1 className="titulo-itens-painel mt-5">Técnicos da diretoria {dadosDiretoria.nome}</h1>
                                </div>
                            </div>
                            <div className="page-content-inner">
                                <MenuInterno
                                    caminhos_menu_interno={UrlsMenuInterno}
                                />
                                <CadastroTecnicosDre
                                    dadosDaDre={dadosDiretoria}
                                />
                            </div>
                        </>
                    ) :
                    null
            }
        </>
    );
};