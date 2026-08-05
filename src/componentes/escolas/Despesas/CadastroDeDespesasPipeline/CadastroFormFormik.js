import React, {useEffect, useState} from "react";
import {Formik, useFormikContext} from "formik";
import {visoesService} from "../../../../services/visoes.service";
import {useDespesaTabelasCtx, useDespesaUiCtx} from "./context/DespesaFormPipelineContext";
import {DocumentoSection} from "./sections/DocumentoSection";
import {ImpostosSection} from "./sections/ImpostosSection";
import {RateiosSection} from "./sections/RateiosSection";
import {AcoesSection} from "./sections/AcoesSection";

const FormStatusBanner = () => {
    const {values} = useFormikContext();
    const {despesaContext} = useDespesaTabelasCtx();

    if (values.status === "COMPLETO") return null;
    if (!(values.qtde_erros_form_despesa > 0 && despesaContext.verboHttp === "PUT")) return null;

    return (
        <div className="col-12 barra-status-erros pt-1 pb-1">
            <p data-qa="cadastro-edicao-despesa-erro-campos-nao-preenchidos" className="titulo-status pt-1 pb-1 mb-0">
                O cadastro possui {values.qtde_erros_form_despesa} campos não preenchidos, você pode completá-los agora ou terminar depois.
            </p>
        </div>
    );
};

const FormBody = ({podeHabilitar}) => {
    const {handleSubmit} = useFormikContext();
    return (
        <form onSubmit={handleSubmit}>
            <DocumentoSection />
            <ImpostosSection />
            <RateiosSection />
            <AcoesSection podeHabilitar={podeHabilitar} />
        </form>
    );
};

export const CadastroFormFormik = ({
    initialValues,
    onSubmit,
    validateFormDespesas,
}) => {
    const {readOnlyBtnAcao} = useDespesaUiCtx();
    const [podeHabilitar, setPodeHabilitar] = useState(false);

    useEffect(() => {
        const valoresIniciais = initialValues();
        let timeoutId;

        if (
            valoresIniciais &&
            typeof valoresIniciais.despesa_anterior_ao_uso_do_sistema_editavel !== "undefined"
        ) {
            const desabilita =
                readOnlyBtnAcao ||
                !visoesService.getPermissoes(["delete_despesa"]) ||
                !valoresIniciais.despesa_anterior_ao_uso_do_sistema_editavel;

            if (!desabilita) {
                setPodeHabilitar(false);
                timeoutId = setTimeout(() => {
                    setPodeHabilitar(true);
                }, 1000);
            } else {
                setPodeHabilitar(false);
            }
        } else {
            setPodeHabilitar(false);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [readOnlyBtnAcao, initialValues]);

    return (
        <Formik
            initialValues={initialValues()}
            validateOnBlur={true}
            onSubmit={onSubmit}
            enableReinitialize={true}
            validateOnMount={true}
            validate={validateFormDespesas}
        >
            <>
                <FormStatusBanner />
                <FormBody podeHabilitar={podeHabilitar} />
            </>
        </Formik>
    );
};
