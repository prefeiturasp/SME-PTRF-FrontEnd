import React, {memo, useState} from "react";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";
import {Paginacao} from "./Paginacao";
import { formatMoneyBRL } from '../../../../../../../utils/money';
import ModalEdicaoAcaoPdde from './ModalEdicaoAcaoPdde';

const Tabela = ({
    rowsPerPage, 
    data,
    isLoading = false,
    setCurrentPage,
    firstPage,
    setFirstPage,
    count
}) => {
    const [showModalForm, setShowModalForm] = useState(false);
    const [modalFormData, setModalFormData] = useState(null);
    const handleOpenModalForm = (rowData) => {
        setModalFormData(rowData);
        setShowModalForm(true);
    }

    const acoesTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={() => handleOpenModalForm(rowData)} className="btn-editar-membro">
                    <div data-tip="Editar ação" data-for={`tooltip-id-${rowData.uuid}`}>
                        <ReactTooltip id={`tooltip-id-${rowData.uuid}`}/>
                        <FontAwesomeIcon
                            style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                            icon={faEdit}
                        />
                    </div>
                </button>
            </div>
        )
    }

    const cleanMoneyString = (value) => {
        if (!value) return 0;
        return parseFloat(value.toString()
            .replace('.', '')
            .replace(',', '.'));
    };
    
    const moneyTemplate = (previsao, saldo, acceptsField) => (rowData) => {        
        if (!rowData[acceptsField]) {
            return (
                <div style={{
                    backgroundColor: '#DADADA',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    margin: '-0.5rem -1rem'
                }} />
            );
        }
        
        const previsaoValue = cleanMoneyString(rowData[previsao]);
        const saldoValue = cleanMoneyString(rowData[saldo]);
        const value = (previsaoValue + saldoValue)/100;
        
        return (
            <div style={{ textAlign: 'right' }}>
                {isNaN(value) ? '00,00' : formatMoneyBRL(value)}
            </div>
        );
    }

    return(
        <>
        <h4 className="mb-4">Ações PDDE</h4>
        <DataTable
            value={data.results}
            id={'tabela-acoes-pdde'}
        >
            <Column field="nome" header="Ação PDDE"/>
            <Column field="categoria_objeto.nome" header="Programa"/>
            <Column 
                field="saldo_valor_custeio" 
                header="Custeio (R$)"
                body={moneyTemplate('previsao_valor_custeio','saldo_valor_custeio', 'aceita_custeio')}
                align="right"
                style={{ position: 'relative', overflow: 'hidden' }}
            />
            <Column 
                field="saldo_valor_capital" 
                header="Capital (R$)"
                body={moneyTemplate('previsao_valor_capital','saldo_valor_capital', 'aceita_capital')}
                align="right"
                style={{ position: 'relative', overflow: 'hidden' }}
            />
            <Column 
                field="saldo_valor_livre_aplicacao" 
                header="Livre aplicação (R$)"
                body={moneyTemplate('previsao_valor_livre_aplicacao','saldo_valor_livre_aplicacao', 'aceita_livre_aplicacao')}
                align="right"
                style={{ position: 'relative', overflow: 'hidden' }}
            />
            <Column
                field="acoes"
                header="Ações"
                body={acoesTemplate}
            />
        </DataTable>

        <Paginacao
            acoes={data.results}
            setCurrentPage={setCurrentPage}
            firstPage={firstPage}
            setFirstPage={setFirstPage}
            isLoading={isLoading}
            count={count}
        />

        <ModalEdicaoAcaoPdde
            open={showModalForm}
            onClose={() => setShowModalForm(false)}
            acaoPdde={modalFormData}
        />
        </>
    );
};

export default memo(Tabela);