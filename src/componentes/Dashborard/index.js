import React, {Fragment} from "react";
import {DashboardCard} from "./DashboardCard";

export const Dashboard = ({acoesAssociacao}) => {
    return (
        <DashboardCard
            acoesAssociacao={acoesAssociacao}
        />
    );
}