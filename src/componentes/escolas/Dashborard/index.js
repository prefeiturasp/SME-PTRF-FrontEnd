import React from "react";
import {DashboardCard} from "./DashboardCard";

export const Dashboard = ({acoesAssociacao, statusPeriodoAssociacao}) => {
    return (
        <DashboardCard
            acoesAssociacao={acoesAssociacao}
            statusPeriodoAssociacao={statusPeriodoAssociacao}
        />
    );
}