import React from "react";
import {UrlsMenuInterno} from "../Associacao/UrlsMenuInterno";
import {MenuInterno} from "../../Globais/MenuInterno";
import {PaginaMandatoVigente} from "./pages/PaginaMandatoVigente";
import {MandatosAnteriores} from "./pages/MandatosAnteriores";
import {ExportaDadosDaAsssociacao} from "../Associacao/ExportaDadosAssociacao";
import {MembrosDaAssociacaoProvider} from "./context/MembrosDaAssociacao";
import "./membros-da-associacao.scss"

export const MembrosDaAssociacao = () => {
    return (
        <MembrosDaAssociacaoProvider>
            <MenuInterno
                caminhos_menu_interno={UrlsMenuInterno}
            />
            <ExportaDadosDaAsssociacao/>
            <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <button className="nav-link active" id="nav-mandato-vigente-tab" data-toggle="tab" data-target="#nav-mandato-vigente" type="button" role="tab" aria-controls="nav-mandato-vigente" aria-selected="true">Mandato vigente</button>
                    <button className="nav-link" id="nav-mandatos-anteriores-tab" data-toggle="tab" data-target="#nav-mandatos-anteriores" type="button" role="tab" aria-controls="nav-mandatos-anteriores" aria-selected="false">Mandatos anteriores</button>
                </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-mandato-vigente" role="tabpanel" aria-labelledby="nav-mandato-vigente-tab">
                    <PaginaMandatoVigente/>
                </div>
                <div className="tab-pane fade" id="nav-mandatos-anteriores" role="tabpanel" aria-labelledby="nav-mandatos-anteriores-tab">
                    <MandatosAnteriores/>
                </div>
            </div>
        </MembrosDaAssociacaoProvider>
    )
}