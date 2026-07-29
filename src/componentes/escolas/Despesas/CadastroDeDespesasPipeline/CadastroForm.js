import React from "react";
import "./cadastro-de-despesas.scss";
import Loading from "../../../../utils/Loading";
import {CadastroFormFormik} from "./CadastroFormFormik";
import {DespesaFormModais} from "./DespesaFormModais";
import {DespesaFormPipelineProvider} from "./context/DespesaFormPipelineContext";
import {useDespesaFormController} from "./hooks/useDespesaFormController";

/**
 * Orquestrador fino: controller → Provider + Formik + modais de shell.
 */
export const CadastroForm = ({verbo_http, veioDeSituacaoPatrimonial}) => {
    const {loading, tabelas, ui, fluxo, formik, modais} = useDespesaFormController({
        verbo_http,
        veioDeSituacaoPatrimonial,
    });

    return (
        <DespesaFormPipelineProvider tabelas={tabelas} ui={ui} fluxo={fluxo}>
            {loading ? (
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="50"
                    marginBottom="0"
                />
            ) : (
                <CadastroFormFormik
                    initialValues={formik.initialValues}
                    onSubmit={formik.onSubmit}
                    validateFormDespesas={formik.validateFormDespesas}
                />
            )}
            <DespesaFormModais {...modais} />
        </DespesaFormPipelineProvider>
    );
};
