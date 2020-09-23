import React, {useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

export const TabelaDinamica = ({prestacaoDeContas}) => {

    console.log("TabelaDinamica ", prestacaoDeContas);

    const [columns, setColumns] = useState([
        {field: 'code', header: 'Code'},
        {field: 'name', header: 'Name'},
        {field: 'category', header: 'Category'},
        {field: 'quantity', header: 'Quantity'}
    ]);

    const dynamicColumns = columns.map((col,i) => {
        return <Column key={col.field} field={col.field} header={col.header} />;
    });

    return (
        <>
            <div>
                <div className="card">
                    <DataTable value={prestacaoDeContas}>
                        {dynamicColumns}
                    </DataTable>
                </div>
            </div>
        </>
    )
};