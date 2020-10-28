import React from "react";
import {InformacoesDevolucaoAoTesouro} from "../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/InformacoesDevolucaoAoTesouro";
import {ModalBootstrapDevolucaoAoTesouroAta} from "../../Globais/ModalBootstrap";

export const ModalDevolucaoAoTesouro = ({show, handleClose, onSubmitModalDevolucoesAoTesouro,
                                            informacoesPrestacaoDeContas,
                                            initialValues,
                                            formRef,
                                            despesas,
                                            buscaDespesaPorFiltros,
                                            buscaDespesa,
                                            valorTemplate,
                                            despesasTabelas,
                                            tiposDevolucao,
                                            validateFormDevolucaoAoTesouro,
                                        }) => {
    console.log("InformacoesDevolucaoAoTesouro ", initialValues)
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
            <button onClick={handleClose} type='button'>Cancelar</button>
            <button onClick={onSubmitModalDevolucoesAoTesouro} type='button'>Salvar</button>
            </>


        );
    };

        return (
            <ModalBootstrapDevolucaoAoTesouroAta
                show={show}
                onHide={handleClose}
                titulo="Devouluções ao Tesouro"
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