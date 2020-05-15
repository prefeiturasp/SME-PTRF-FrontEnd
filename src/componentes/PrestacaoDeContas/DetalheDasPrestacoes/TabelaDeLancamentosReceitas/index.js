import React, {useState} from "react";
import {useHistory} from 'react-router-dom';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import moment from "moment";
import {RedirectModalTabelaLancamentos} from "../../../../utils/Modais";

export const TabelaDeLancamentosReceitas = ({conciliados, receitas, checkboxReceitas, handleChangeCheckboxReceitas}) => {

    //console.log("TabelaDeLancamentosReceitas ", receitas);

    let history = useHistory();
    const rowsPerPage = 7;
    const [showModal, setShowModal] = useState(false);
    const [uuid, setUuid] = useState('');

    const onShowModal = () => {
        setShowModal(true);
    }

    const onHandleClose = () => {
        setShowModal(false);
    }

    const onCancelarTrue = () => {
        setShowModal(false);
        const url = '/edicao-de-receita/' + uuid + '/tabela-de-lancamentos-receitas'
        history.push(url);
    }

    const dataTemplate = (rowData, column) => {
        return (
            <div>
                {rowData['data']
                    ? moment(rowData['data']).format('DD/MM/YYYY')
                    : ''}
            </div>
        )
    }

    const valorTemplate = (rowData, column) => {
        const valorFormatado = rowData['valor']
            ? Number(rowData['valor']).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : ''
        return (<span>{valorFormatado}</span>)
    }

    const conferidoTemplate = (rowData) => {
        return (
            <div className="align-middle text-center">
                <input
                    checked={conciliados}
                    type="checkbox"
                    value={checkboxReceitas}
                    onChange={(e)=>handleChangeCheckboxReceitas(e, rowData.uuid)}
                    name="checkConferido"
                    id="checkConferido"
                />
            </div>
        )
    }

    const redirecionaDetalhe = value => {
        setUuid(value.uuid)
        onShowModal();
    }

    return (
        <div className="row mt-4">
            <div className="col-12">
                <p className="detalhe-das-prestacoes-titulo-lancamentos">Laçamentos {conciliados ? "conciliados" : "pendentes de conciliação"}</p>
                <div className="content-section implementation">
                    {receitas && receitas.length > 0 ? (
                        <DataTable
                            value={receitas}
                            className="mt-3 datatable-footer-coad tabela-lancamentos-receitas"
                            paginator={receitas.length > rowsPerPage}
                            rows={rowsPerPage}
                            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                            autoLayout={true}
                            selectionMode="single"
                            onRowClick={e => redirecionaDetalhe(e.data)}
                            //resizableColumns={false}
                            //columnResizeMode="fit"
                        >
                            <Column field='tipo_receita.nome' header='Tipo'/>
                            <Column field='conta_associacao.nome' header='Conta'/>
                            <Column field='acao_associacao.nome' header='Ação'/>
                            <Column
                                field='data'
                                header='Data'
                                body={dataTemplate}
                            />
                            <Column
                                field='valor'
                                header='Valor'
                                body={valorTemplate}
                            />
                            <Column
                                field='acao_associacao.status'
                                header='Demonstrado'
                                body={conferidoTemplate}
                            />
                        </DataTable>
                    ) : null
                    }
                </div>
            </div>
            <section>
                <RedirectModalTabelaLancamentos show={showModal} handleClose={onHandleClose} onCancelarTrue={onCancelarTrue}/>
            </section>
        </div>
    )
}