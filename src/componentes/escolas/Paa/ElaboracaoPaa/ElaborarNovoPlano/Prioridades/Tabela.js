import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { IconButton } from "../../../../../Globais/UI/Button/IconButton";
import { useState } from 'react';
import { Button, Space } from 'antd';
import { formatMoneyBRL } from "../../../../../../utils/money";


export const Tabela = ({ data, handleEditar }) => {
    const [selectedItems, setSelectedItems] = useState([]);

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
            className="no-stripe mt-3 no-hover"
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
                body={(rowData) => (
                    <>
                        <div>{rowData.acao}</div>
                        {!rowData.prioridade &&
                            <Button
                                variant="solid"
                                size="small"
                                style={
                                    {
                                        backgroundColor:'#a4a4a4',
                                        borderColor:'transparent',
                                        color:'white',
                                        fontSize: '11px',
                                        height: 'auto'
                                    }
                                }>Não priorizado</Button>
                        }
                    </>
                )}
            />
            <Column 
                field="tipo_aplicacao_objeto.value"
                header="Tipo de aplicação"
                sortable
                style={{ width: "120px" }}
            />
            <Column 
                field="tipo_despesa_custeio_objeto.nome"
                header="Tipo de despesa"
                sortable
                style={{ width: "180px" }}
            />
            <Column 
                field="especificacao_material_objeto.nome"
                header="Especificação do material, bem ou serviço"
                sortable
            />
            <Column 
                field="valor_total"
                header="Valor total"
                sortable
                style={{ width: "120px", textAlign: "center" }}
                bodyStyle={{ textAlign: 'center' }}
                body={(rowData) => (
                    <>{formatMoneyBRL(rowData.valor_total)}</>
                )}
            />
            <Column
                header="Ações"
                style={{ width: "75px", borderLeft: "none", textAlign: 'center' }}
                body={rowData => {
                    return (
                        <Space direction="horizontal" size={0}>
                            <IconButton
                                className='p-2'
                                icon="faEdit"
                                tooltipMessage="Editar"
                                iconProps={{
                                style: { color: "#00585E" },
                                }}
                                aria-label="Editar"
                                onClick={() => handleEditar(rowData, false)}
                            />
                            <IconButton
                                className='p-2'
                                icon="faTrashCan"
                                tooltipMessage="Excluir"
                                iconProps={{
                                style: { color: "#B40C02" },
                                }}
                                aria-label="Excluir"
                                onClick={() => handleExcluir(rowData)}
                            />
                            <IconButton
                                className='p-2'
                                icon="faCopy"
                                tooltipMessage="Duplicar"
                                iconProps={{
                                style: { color: "#00585E" },
                                }}
                                aria-label="Duplicar"
                                onClick={() => handleDuplicar(rowData)}
                            />
                        </Space>
                    );
                 }}
            />
        </DataTable>
    )
}