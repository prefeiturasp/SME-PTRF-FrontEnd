import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faTrash, faCopy } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from "../../../../../Globais/UI/Button/IconButton";
import { useState } from 'react';
import { Flex } from 'antd';    
import { formatMoneyBRL } from "../../../../../../utils/money";


export const Tabela = ({ data }) => {
    const [selectedItems, setSelectedItems] = useState([]);

    const handleEditar = (rowData) => {
        // Implementar lógica de edição
    }
    const handleExcluir = (rowData) => {
        // Implementar lógica de exclusão
    }
    const handleDuplicar = (rowData) => {
        // Implementar lógica de duplicação
    }

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(data.map(item => item.uuid));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (uuid, checked) => {
        if (checked) {
            setSelectedItems(prev => [...prev, uuid]);
        } else {
            setSelectedItems(prev => prev.filter(id => id !== uuid));
        }
    };

    const isAllSelected = data && data.length > 0 && selectedItems.length === data.length;
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length < data.length;

    return (
        <DataTable
            value={data}
            autoLayout={true}
            dataKey="uuid"
            className="no-stripe mt-3"
            >
            <Column 
                header={
                    <input 
                        type="checkbox" 
                        checked={isAllSelected}
                        ref={(input) => {
                            if (input) input.indeterminate = isIndeterminate;
                        }}
                        onChange={handleSelectAll}
                        style={{ cursor: 'pointer' }}
                    />
                }
                style={{ width: "50px", textAlign: 'center' }}
                body={(rowData) => (
                    <input 
                        type="checkbox" 
                        checked={selectedItems.includes(rowData.uuid)}
                        onChange={(e) => handleSelectItem(rowData.uuid, e.target.checked)}
                        style={{ cursor: 'pointer' }}
                    />
                )}
            />
            <Column 
                header="Ação" 
                field="acao"
                sortable
            />
            <Column 
                field="tipo_aplicacao.value" 
                header="Tipo de aplicação"
                sortable
                style={{ width: "200px" }}
            />
            <Column 
                field="tipo_despesa_custeio.nome" 
                header="Tipo de despesa"
                sortable
                style={{ width: "180px" }}
            />
            <Column 
                field="especificacao_material.nome" 
                header="Especificação do material, bem ou serviço"
                sortable
            />
            <Column 
                field="valor_total" 
                header="Valor total"
                sortable
                style={{ width: "200px", textAlign: "center" }}
                bodyStyle={{ textAlign: 'center' }}
                body={(rowData) => formatMoneyBRL(rowData.valor_total)}
            />
            <Column
                header="Ação"
                style={{ width: "75px", borderLeft: "none", textAlign: 'center' }}
                body={rowData => {
                    return (
                        <Flex justify="center">
                        <IconButton
                            icon="faEdit"
                            tooltipMessage="Editar"
                            iconProps={{
                            style: { fontSize: "20px", marginRight: "0", color: "#00585E" },
                            }}
                            aria-label="Editar"
                            onClick={() => handleEditar(rowData)}
                        />
                        <IconButton
                            icon="faTrashCan"
                            tooltipMessage="Excluir"
                            iconProps={{
                            style: { fontSize: "20px", marginRight: "0", color: "#B40C02" },
                            }}
                            aria-label="Excluir"
                            onClick={() => handleExcluir(rowData)}
                        />
                        <IconButton
                            icon="faCopy"
                            tooltipMessage="Duplicar"
                            iconProps={{
                            style: { fontSize: "20px", marginRight: "0", color: "#00585E" },
                            }}
                            aria-label="Duplicar"
                            onClick={() => handleDuplicar(rowData)}
                        />
                        </Flex>
                    );
                 }}
            />
        </DataTable>
    )
}