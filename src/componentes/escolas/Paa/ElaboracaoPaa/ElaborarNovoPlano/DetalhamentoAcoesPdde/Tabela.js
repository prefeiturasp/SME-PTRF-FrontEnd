import React, {memo, useState} from "react";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {Paginacao} from "./Paginacao";
import { formatMoneyBRL } from '../../../../../../utils/money';
import ModalEdicaoReceitaPrevistaPDDE from './ModalEdicaoReceitaPrevistaPdde';

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
                <button onClick={() => handleOpenModalForm(rowData)} className="btn-editar-membro" data-testid="botao-editar" aria-label="Editar ação">
                    <div data-tooltip-content="Editar ação" data-tooltip-id={`tooltip-id-${rowData.uuid}`}>
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

    const moneyTemplate = (previsao, saldo, acceptsField) => {
        if (!acceptsField) {
            return (
                <div className="cell-desativada"> - </div>
            );
        }

        const value = previsao + saldo;
        
        return (
            <div style={{ textAlign: 'right' }}>
                {isNaN(value) ? '0,00' : formatMoneyBRL(value)}
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
            <Column field="programa_objeto.nome" header="Programa"/>
            <Column 
                header="Custeio (R$)"
                body={(rowData) => moneyTemplate(
                    rowData.receitas_previstas_pdde_valores?.previsao_valor_custeio,
                    rowData.receitas_previstas_pdde_valores?.saldo_custeio,
                    rowData.aceita_custeio)}
                align="right"
                style={{ position: 'relative', overflow: 'hidden' }}
            />
            <Column 
                header="Capital (R$)"
                body={(rowData) => moneyTemplate(
                    rowData.receitas_previstas_pdde_valores?.previsao_valor_capital,
                    rowData.receitas_previstas_pdde_valores?.saldo_capital,
                    rowData.aceita_capital)}
                align="right"
                style={{ position: 'relative', overflow: 'hidden' }}
            />
            <Column 
                header="Livre aplicação (R$)"
                body={(rowData) => moneyTemplate(
                    rowData.receitas_previstas_pdde_valores?.previsao_valor_livre,
                    rowData.receitas_previstas_pdde_valores?.saldo_livre,
                    rowData.aceita_livre_aplicacao)}
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

        <ModalEdicaoReceitaPrevistaPDDE
            open={showModalForm}
            onClose={() => setShowModalForm(false)}
            receitaPrevistaPDDE={modalFormData}
        />
        </>
    );
};

export default memo(Tabela);