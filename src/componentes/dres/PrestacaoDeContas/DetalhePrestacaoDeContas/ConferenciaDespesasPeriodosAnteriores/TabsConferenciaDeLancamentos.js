import React from "react";
import TabelaConferenciaDeLancamentos from "./TabelaConferenciaDeLancamentos";
import Tabs from "../../../../Globais/UI/Tabs";
import { useConferenciaDespesasPeriodosAnteriores } from "./context/ConferenciaDespesasPeriodosAnteriores";

export const TabsConferenciaDeLancamentos = () => {
    const { contasAssociacao, componentState, onTabClick } = useConferenciaDespesasPeriodosAnteriores();

    return (
        <>
            <Tabs 
                tabs={contasAssociacao.map((conta) => {return {...conta, label: `Conta ${conta.tipo_conta.nome}`}})} 
                initialActiveTab={componentState?.conta_uuid} 
                onTabClick={(tabId) => onTabClick(tabId)} 
                identifier='nav-conferencia-de-despesas-periodos-anteriores'
            />
            <div className="tab-content" id="nav-conferencia-de-lancamentos-tabContent">
                <div
                    className="tab-pane fade show active"
                    role="tabpanel"
                >
                    <TabelaConferenciaDeLancamentos />
                </div>
            </div>
        </>

    )
}