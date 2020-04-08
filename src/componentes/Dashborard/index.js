import React, {Fragment} from "react";
import {DashboardCard} from "./DashboardCard";

export const Dashboard = () => {
    const array = [1,2,3,4,5]
    return (

        <>
            <div className="row row-cols-1 row-cols-md-2">
            {array.map((item, index) =>
                <Fragment key={index}>
                    <DashboardCard/>
                </Fragment>
            )}
            </div>

        </>
    );
}