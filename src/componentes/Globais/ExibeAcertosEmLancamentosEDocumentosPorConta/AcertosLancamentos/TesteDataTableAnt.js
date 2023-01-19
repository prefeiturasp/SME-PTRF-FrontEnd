import { Space, Switch, Table } from 'antd';
import React, { useState } from 'react';
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import Dropdown from "react-bootstrap/Dropdown";
const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: '12%',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        width: '30%',
        key: 'address',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
];
const data = [
    {
        key: 1,
        name: 'John Brown sr.',
        age: 60,
        address: 'New York No. 1 Lake Park',
        status: 'conferido',
        children: [
            {
                key: 2,
                name: 'John Brown key: 2',
                age: 42,
                address: 'New York No. 2 Lake Park',
                status: 'nao_conferido',
            },
            {
                key: 3,
                name: 'John Brown 2 - ALTERADO key: 3',
                age: 42,
                address: 'New York No. 2 Lake Park',
                status: 'conferido',
            },
            {
                key: 4,
                name: 'John Brown 3 - ALTERADO key: 4',
                age: 42,
                address: 'New York No. 2 Lake Park',
                status: 'nao_conferido',
            },

        ],
    },
    {
        key: 5,
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        status: 'nao_conferido',
        children: []
    },
];

const selecionarPorStatus = (event, statusId) => {
    event.preventDefault()
    //setStatus(statusId)

    let lancamentos = data.filter(lanc =>
        lanc.status === statusId
    )

    //setLancamentosSelecionados(lancamentos)
}

// rowSelection objects indicates the need for row selection
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`Cliquei no onChange | selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
        console.log(`Cliquei no onSelect | `,  record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(`Cliquei no onSelectAll | `, selected, selectedRows, changeRows);
        // debugger
        // selectedRows = data.filter((lancamento) => lancamento.status === 'conferido')
        // let selecionadosChildren = data.children.filter((lancamento) => lancamento.status === 'conferido')
        // console.log(`Cliquei no onSelectAll selectedRows DEPOIS | `,selectedRows);
        // console.log(`Cliquei no onSelectAll selecionadosChildren DEPOIS | `,selecionadosChildren);


    },
};
const TesteDataTableAnt = () => {
    const checkStrictly =false;

    const toppings = [
        {
            name: "Capsicum",
            price: 1.2
        },
        {
            name: "Paneer",
            price: 2.0
        },
        {
            name: "Red Paprika",
            price: 2.5
        },
        {
            name: "Onions",
            price: 3.0
        },
        {
            name: "Extra Cheese",
            price: 3.5
        },
        {
            name: "Baby Corns",
            price: 3.0
        },
        {
            name: "Mushroom",
            price: 2.0
        }
    ];

    const [checkedState, setCheckedState] = useState(
        new Array(toppings.length).fill(false)
    );

    const handleOnChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );

        setCheckedState(updatedCheckedState);
    };



    return (
        <>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Devolução ao tesouro</h1>
                <div className="page-content-inner">

                    <div className="App">
                        <h3>Select Toppings</h3>
                        <ul className="toppings-list">
                            {toppings.map(({ name, price }, index) => {
                                return (
                                    <li key={index}>
                                        <div className="toppings-list-item">
                                            <div className="left-section">
                                                <input
                                                    type="checkbox"
                                                    id={`custom-checkbox-${index}`}
                                                    name={name}
                                                    value={name}
                                                    checked={checkedState[index]}
                                                    onChange={() => handleOnChange(index)}
                                                />
                                                <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

            <Table
                columns={columns}
                rowSelection={{
                    ...rowSelection,
                    checkStrictly,
                }}
                dataSource={data}
            />
                </div>
            </PaginasContainer>
        </>
    );
};
export default TesteDataTableAnt;