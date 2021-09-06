import React from "react";
import {DatePickerField} from "../../../../../Globais/DatePickerField";
import {visoesService} from "../../../../../../services/visoes.service";
import CurrencyInput from "react-currency-input";

export const FormularioAcertosDevolucaoAoTesouro = ({formikProps, acerto, index, tiposDevolucao}) => {

    return (
        <>
            <div className='col-12 col-md-9 mt-3'>

                <label htmlFor={`devolucao_tesouro[${index}]`}>Tipo de devolução</label>
                <select
                    value={acerto.devolucao_tesouro.tipo && acerto.devolucao_tesouro.tipo.uuid ? acerto.devolucao_tesouro.tipo.uuid : acerto.devolucao_tesouro.tipo}
                    name={`solicitacoes_acerto[${index}].devolucao_tesouro.tipo`}
                    id={`devolucao_tesouro[${index}.tipo]`}
                    onChange={(e) => {
                        formikProps.handleChange(e);
                    }}
                    className='form-control'
                >
                    <option value="">Selecione o tipo de devolução</option>
                    {tiposDevolucao && tiposDevolucao.map(item =>
                        <option key={item.id} value={item.uuid}>{item.nome}</option>
                    )}
                </select>
                {formikProps.errors.tipo && <span className="text-danger mt-1">{formikProps.errors.tipo}</span>}

            </div>
            <div className='col-12 col-md-3 mt-3'>

                <label htmlFor={`devolucao_tesouro[${index}.data]`}>Data da devolução</label>
                <DatePickerField
                    value={acerto.devolucao_tesouro.data}
                    name={`solicitacoes_acerto[${index}].devolucao_tesouro.data`}
                    id={`devolucao_tesouro[${index}.data]`}
                    placeholderText='Preenchimento pela UE.'
                    onChange={formikProps.setFieldValue}
                    disabled={visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'DRE'}
                />
                {formikProps.errors.data && <span className="text-danger mt-1">{formikProps.errors.data}</span>}

            </div>
            <div className='col-12 col-md-6 mt-3'>
                <label htmlFor={`devolucao_tesouro[${index}.devolucao_total]`}>Valor total ou parcial da despesa</label>
                <select
                    value={acerto.devolucao_tesouro.devolucao_total}
                    name={`solicitacoes_acerto[${index}].devolucao_tesouro.devolucao_total`}
                    id={`devolucao_tesouro[${index}.devolucao_total]`}
                    onChange={(e) => {
                        formikProps.handleChange(e);
                    }}
                    className='form-control'
                >
                    <option value="">Selecione o tipo</option>
                    <option value='true'>Valor total</option>
                    <option value='false'>Valor parcial</option>
                </select>
            </div>
            <div className='col-12 col-md-6 mt-3'>
                <label className='labels-filtros' htmlFor={`devolucao_tesouro[${index}.valor]`}>Valor</label>
                <CurrencyInput
                    value={acerto.devolucao_tesouro.valor}
                    name={`solicitacoes_acerto[${index}].devolucao_tesouro.valor`}
                    onChangeEvent={(e) => {
                        formikProps.handleChange(e);
                    }}
                    id={`devolucao_tesouro[${index}.valor]`}
                    allowNegative={false}
                    prefix='R$'
                    decimalSeparator=","
                    thousandSeparator="."
                    className={`form-control`}
                    selectAllOnFocus={true}
                    placeholder='Digite o valor'
                />
            </div>
        </>
    )
}