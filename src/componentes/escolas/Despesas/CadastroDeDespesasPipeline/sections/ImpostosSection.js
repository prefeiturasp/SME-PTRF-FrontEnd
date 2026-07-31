import React from "react";
import {FieldArray, useFormikContext} from "formik";
import {visoesService} from "../../../../../services/visoes.service";
import {ASSOCIACAO_UUID} from "../../../../../services/auth.service";
import {RetemImposto} from "../../RetemImposto";
import {DespesaImposto} from "../impostos/DespesaImposto";
import {
    useDespesaUiCtx,
    useDespesaFluxoCtx,
} from "../context/DespesaFormPipelineContext";

export const ImpostosSection = () => {
    const props = useFormikContext();
    const {values} = props;

    const {
        readOnlyCampos,
        showRetencaoImposto,
        eh_despesa_com_retencao_imposto,
        disableBtnAdicionarImposto,
    } = useDespesaUiCtx();

    const {mostraModalExcluirImposto} = useDespesaFluxoCtx();

return (
        <>
                                {showRetencaoImposto &&
                                    <div className="container-retencao-imposto mt-2">
                                        <div className="form-row mt-4">
                                            <div className="col-12">
                                                <RetemImposto
                                                    formikProps={props}
                                                    eh_despesa_com_retencao_imposto={eh_despesa_com_retencao_imposto}
                                                    disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !values.despesa_anterior_ao_uso_do_sistema_editavel}
                                                    mostraModalExcluirImposto={mostraModalExcluirImposto}
                                                />
                                                
                                                <FieldArray
                                                    name="despesas_impostos"
                                                    render={({remove, push}) => (
                                                        <>
                                                            {values.despesas_impostos.length > 0 && values.despesas_impostos.map((despesa_imposto, index) => {
                                                                return (
                                                                    <div key={index}>
                                                                        <DespesaImposto
                                                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                                                            index={index}
                                                                            despesa_imposto={despesa_imposto}
                                                                            remove={remove}
                                                                        />
                                                                    </div>
                                                                )
                                                            })}

                                                            {eh_despesa_com_retencao_imposto(values) &&
                                                                <div className="d-flex  justify-content-start mt-3 mb-3">
                                                                    <button
                                                                        data-qa="cadastro-edicao-despesa-btn-adicionar-imposto"
                                                                        type="button"
                                                                        className="btn btn btn-outline-success mt-2 mr-2"
                                                                        disabled={disableBtnAdicionarImposto || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                                                        onChange={(e) => {
                                                                            props.handleChange(e);
                                                                        }}
                                                                        onClick={() => {
                                                                            push(
                                                                                {
                                                                                    associacao: localStorage.getItem(ASSOCIACAO_UUID),
                                                                                    tipo_documento: "",
                                                                                    numero_documento: "",
                                                                                    tipo_transacao: "",
                                                                                    documento_transacao: "",
                                                                                    data_transacao: "",
                                                                                    despesas_impostos: [],
                                                                                    motivos_pagamento_antecipado: [],
                                                                                    rateios: [
                                                                                        {
                                                                                            tipo_custeio: "",
                                                                                            especificacao_material_servico: "",
                                                                                            acao_associacao: "",
                                                                                            aplicacao_recurso: "CUSTEIO",
                                                                                            associacao: localStorage.getItem(ASSOCIACAO_UUID),
                                                                                            conta_associacao: "",
                                                                                            escolha_tags:"",
                                                                                            tag: "",
                                                                                            numero_processo_incorporacao_capital: "",
                                                                                            quantidade_itens_capital: 0,
                                                                                            valor_item_capital: 0,
                                                                                            valor_original: "",
                                                                                            valor_rateio: ""
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            )
                                                                        }}
                                                                    >
                                                                        + Adicionar imposto
                                                                    </button>
                                                                </div>
                                                            }
                                                        </>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }


        </>
    );
};
