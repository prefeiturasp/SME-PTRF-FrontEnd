import React, {Fragment} from "react";
import {DashboardCard} from "./DashboardCard";

export const Dashboard = ({acoesAssociacao}) => {
    return (
        <>
            <div className="row row-cols-1 row-cols-md-2">
                <DashboardCard
                    acoesAssociacao={acoesAssociacao}
                />
            </div>
        </>
    );
}