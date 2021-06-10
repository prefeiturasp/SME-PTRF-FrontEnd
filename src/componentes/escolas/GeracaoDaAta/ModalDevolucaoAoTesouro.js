import React from "react";
import {InformacoesDevolucaoAoTesouro} from "../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/InformacoesDevolucaoAoTesouro";
import {ModalBootstrapDevolucaoAoTesouroAta} from "../../Globais/ModalBootstrap";

export const ModalDevolucaoAoTesouro = ({show, handleClose, onSubmitModalDevolucoesAoTesouro, informacoesPrestacaoDeContas, initialValues, formRef, despesas, buscaDespesaPorFiltros, buscaDespesa, valorTemplate, despesasTabelas, tiposDevolucao, validateFormDevolucaoAoTesouro, camposObrigatorios}) => {

    const bodyTextarea = () => {
        return (
            <>
                <InformacoesDevolucaoAoTesouro
                    informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                    initialValues={initialValues}
                    formRef={formRef}
                    despesas={despesas}
                    buscaDespesaPorFiltros={buscaDespesaPorFiltros}
                    buscaDespesa={buscaDespesa}
                    valorTemplate={valorTemplate}
                    despesasTabelas={despesasTabelas}
                    tiposDevolucao={tiposDevolucao}
                    validateFormDevolucaoAoTesouro={validateFormDevolucaoAoTesouro}
                />
                <div className="d-flex  justify-content-end pb-3 mt-3">
                    <button onClick={handleClose} type="button" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                    <button disabled={camposObrigatorios} onClick={onSubmitModalDevolucoesAoTesouro} type="button" className="btn btn-success mt-2">Salvar</button>
                </div>
            </>
        );
    };

        return (
            <ModalBootstrapDevolucaoAoTesouroAta
                show={show}
                onHide={handleClose}
                titulo="Devoluções ao Tesouro"
                bodyText={bodyTextarea()}
                primeiroBotaoOnclick={handleClose}
                primeiroBotaoTexto="Cancelar"
                primeiroBotaoCss="outline-success"
                segundoBotaoOnclick={onSubmitModalDevolucoesAoTesouro}
                segundoBotaoTexto="Salvar"
                segundoBotaoCss="success"
            />
        )
};