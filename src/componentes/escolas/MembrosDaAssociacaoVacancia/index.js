import React, {useCallback, useEffect, useState} from "react";
import {retornaMenuAtualizadoPorStatusCadastro, UrlsMenuInterno} from "../Associacao/UrlsMenuInterno";
import {MenuInterno} from "../../Globais/MenuInterno";
import {ExportaDadosDaAsssociacao} from "../Associacao/ExportaDadosAssociacao";
import {useGetStatusCadastroAssociacao} from "./hooks/useGetStatusCadastroAssociacao";
import {PaginaMandatoVigenteVacancia} from "./pages/PaginaMandatoVigenteVacancia";
import {PaginaMandatoAnteriorVacancia} from "./pages/PaginaMandatoAnteriorVacancia";
import {useGetMandatosAnterioresVacancia} from "./hooks/useGetMandatosAnterioresVacancia";
import "./membros-da-associacao.scss"

// Módulo v2 (ComposicaoVacancia/CargoComposicaoVacancia), isolado de
// componentes/escolas/MembrosDaAssociacao (v1)

export const MembrosDaAssociacaoVacancia = () => {
    const {data: mandatosAnteriores} = useGetMandatosAnterioresVacancia()
    const count_mandatos_anteriores = mandatosAnteriores?.length || 0
    const {data_status_cadastro_associacao} = useGetStatusCadastroAssociacao()
    const [menuUrls, setMenuUrls] = useState(UrlsMenuInterno);
    const [isActiveMandatoVigente, setIsActiveMandatoVigente] = useState(true)
    const [isActiveMandatosAnteriores, setIsActiveMandatosAnteriores] = useState(false)
    const isActive = useCallback(()=>{
            setIsActiveMandatoVigente(prevState => !prevState)
            setIsActiveMandatosAnteriores(prevState => !prevState)
        }, [])

    const atualizaMenu = useCallback(() => {
        let urls = retornaMenuAtualizadoPorStatusCadastro(data_status_cadastro_associacao);
        setMenuUrls(urls);
    }, [data_status_cadastro_associacao]);

    useEffect(() => {
        atualizaMenu()
    }, [atualizaMenu])

    return (
        <span className="MembrosDaAssociacaoVacancia">
            <MenuInterno
                caminhos_menu_interno={menuUrls}
            />
            <ExportaDadosDaAsssociacao/>

            <nav>
                <div className="nav nav-tabs nav-mandatos" id="nav-tab" role="tablist">
                    <button
                        disabled={isActiveMandatoVigente}
                        onClick={isActive}
                        className={`nav-link ${isActiveMandatoVigente && 'active'}`}
                        id="nav-mandato-vigente-tab"
                        data-toggle="tab"
                        data-target="#nav-mandato-vigente"
                        type="button"
                        role="tab"
                        aria-controls="nav-mandato-vigente"
                        aria-selected="true"
                    >
                        Mandato vigente
                    </button>
                    {count_mandatos_anteriores > 0 &&
                        <button
                            disabled={isActiveMandatosAnteriores}
                            onClick={isActive}
                            className={`nav-link ${isActiveMandatosAnteriores && 'active'}`}
                            id="nav-mandatos-anteriores-tab"
                            data-toggle="tab"
                            data-target="#nav-mandatos-anteriores"
                            type="button"
                            role="tab"
                            aria-controls="nav-mandatos-anteriores"
                            aria-selected="false"
                        >
                            Mandatos anteriores
                        </button>
                    }
                </div>
            </nav>
            <div className="tab-membros-associacao tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-mandato-vigente" role="tabpanel"
                        aria-labelledby="nav-mandato-vigente-tab">
                    {isActiveMandatoVigente &&
                        <PaginaMandatoVigenteVacancia/>
                    }
                </div>
                <div className="tab-pane fade" id="nav-mandatos-anteriores" role="tabpanel"
                        aria-labelledby="nav-mandatos-anteriores-tab">
                    {isActiveMandatosAnteriores &&
                        <PaginaMandatoAnteriorVacancia/>
                    }
                </div>
            </div>
        </span>
    )
}