import React, {useState} from "react";
import {useHistory} from 'react-router-dom';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import moment from "moment";
import {RedirectModalTabelaLancamentos} from "../../../../../utils/Modais";
import IconeNaoDemonstrado from "../../../../../assets/img/icone-nao-demonstrado.svg";
import ReactTooltip from "react-tooltip";

export const TabelaDeLancamentosReceitas = ({conciliados, receitas, checkboxReceitas, handleChangeCheckboxReceitas}) => {

    let history = useHistory();
    const rowsPerPage = 7;
    const [showModal, setShowModal] = useState(false);
    const [uuid, setUuid] = useState('');

    const onShowModal = () => {
        setShowModal(true);
    };

    const onHandleClose = () => {
        setShowModal(false);
    };

    const onCancelarTrue = () => {
        setShowModal(false);
        const url = '/edicao-de-receita/' + uuid + '/tabela-de-lancamentos-receitas';
        history.push(url);
    };

    const notificarNaoConciliado = (notificarDiasNaoConferido) => {
        return notificarDiasNaoConferido > 0 ? {color: 'red', fontWeight: 'bold'} : {color: 'black'}
    };
    const dataTemplate = (rowData) => {
        return (
            <div style={notificarNaoConciliado(rowData['notificar_dias_nao_conferido'])}>
                {rowData['data']
                    ? moment(rowData['data']).format('DD/MM/YYYY')
                    : ''}
            </div>
        )
    };

    const valorTemplate = (rowData) => {
        const valorFormatado = rowData['valor']
            ? Number(rowData['valor']).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : '';
        return (<span style={notificarNaoConciliado(rowData['notificar_dias_nao_conferido'])}>{valorFormatado}</span>)
    };

    const conferidoTemplate = (rowData) => {
        return (
            <div className="align-middle text-center">
                <input
                    checked={conciliados}
                    type="checkbox"
                    value={checkboxReceitas}
                    onChange={(e) => handleChangeCheckboxReceitas(e, rowData.uuid)}
                    name="checkConferido"
                    id="checkConferido"
                />
            </div>
        )
    };

    const acaoTemplate = (rowData) => {
        return (<span
            style={notificarNaoConciliado(rowData['notificar_dias_nao_conferido'])}>{rowData['acao_associacao'].nome}</span>)
    };

    const contaTemplate = (rowData) => {
        return (<span
            style={notificarNaoConciliado(rowData['notificar_dias_nao_conferido'])}>{rowData['conta_associacao'].nome}</span>)
    };

    const tipoTemplate = (rowData) => {
        return (
            rowData['notificar_dias_nao_conferido'] > 0 ?
                <div data-tip={`Não demonstrado por ${Math.trunc(rowData['notificar_dias_nao_conferido']/30)} meses.`}>
                    <img
                        src={IconeNaoDemonstrado}
                        alt=""
                        className="img-fluid"
                    />
                    <span style={notificarNaoConciliado(rowData['notificar_dias_nao_conferido'])}>
                        {"  " + rowData['tipo_receita'].nome}
                    </span>
                    <ReactTooltip />
                </div>
                :
                <span style={notificarNaoConciliado(rowData['notificar_dias_nao_conferido'])}>
                    {rowData['tipo_receita'].nome}
                </span>
        )
    };

    const redirecionaDetalhe = value => {
        setUuid(value.uuid);
        onShowModal();
    };

    return (
        <div className="row mt-4">
            <div className="col-12">
                <p className="detalhe-das-prestacoes-titulo-lancamentos">Lançamentos {conciliados ? "conciliados" : "pendentes de conciliação"}</p>
                <div className="datatable-responsive-demo">

                    {receitas && receitas.length > 0 ? (
                        <DataTable
                            value={receitas}
                            className="mt-3 datatable-footer-coad tabela-lancamentos-receitas p-datatable-responsive-demo"
                            paginator={receitas.length > rowsPerPage}
                            rows={rowsPerPage}
                            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                            autoLayout={true}
                            selectionMode="single"
                            onRowClick={e => redirecionaDetalhe(e.data)}
                        >
                            <Column field='tipo_receita.nome' header='Tipo' body={tipoTemplate}/>
                            <Column field='conta_associacao.nome' header='Conta' body={contaTemplate}/>
                            <Column field='acao_associacao.nome' header='Ação' body={acaoTemplate}/>
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
                <RedirectModalTabelaLancamentos
                    show={showModal}
                    handleClose={onHandleClose}
                    onCancelarTrue={onCancelarTrue}
                />
            </section>
        </div>
    )
};