import React, {useCallback, useState} from "react";
import {UrlsMenuInterno} from "../Associacao/UrlsMenuInterno";
import {MenuInterno} from "../../Globais/MenuInterno";
import {PaginaMandatoVigente} from "./pages/PaginaMandatoVigente";
import {PaginaMandatosAnteriores} from "./pages/PaginaMandatosAnteriores";
import {ExportaDadosDaAsssociacao} from "../Associacao/ExportaDadosAssociacao";
import {MembrosDaAssociacaoProvider} from "./context/MembrosDaAssociacao";
import "./membros-da-associacao.scss"

export const MembrosDaAssociacao = () => {

    const [isActiveMandatoVigente, setIsActiveMandatoVigente] = useState(true)
    const [isActiveMandatosAnteriores, setIsActiveMandatosAnteriores] = useState(false)

    // Faz o controle do carregamento dos componentes, evitando conflito na exibição das Composições,
    const isActive = useCallback(()=>{
        setIsActiveMandatoVigente(prevState => !prevState)
        setIsActiveMandatosAnteriores(prevState => !prevState)
    }, [])

    return (
        <MembrosDaAssociacaoProvider>
            <MenuInterno
                caminhos_menu_interno={UrlsMenuInterno}
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
                </div>
            </nav>
            <div className="tab-membros-associacao tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-mandato-vigente" role="tabpanel" aria-labelledby="nav-mandato-vigente-tab">
                    {isActiveMandatoVigente &&
                        <PaginaMandatoVigente/>
                    }
                </div>
                <div className="tab-pane fade" id="nav-mandatos-anteriores" role="tabpanel" aria-labelledby="nav-mandatos-anteriores-tab">
                    {isActiveMandatosAnteriores &&
                        <PaginaMandatosAnteriores/>
                    }
                </div>
            </div>
        </MembrosDaAssociacaoProvider>
    )
}