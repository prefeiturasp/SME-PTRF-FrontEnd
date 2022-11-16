import React, { useRef, useState, useContext, useMemo } from "react";
import {DatePickerField} from "../../../../../Globais/DatePickerField";
import {visoesService} from "../../../../../../services/visoes.service";
import CurrencyInput from "react-currency-input";
import {ValidarParcialTesouro} from "../../../../../../context/DetalharAcertos"

export const FormularioAcertosDevolucaoAoTesouro = ({formikProps, acerto, index, tiposDevolucao, valorDocumento}) => {
    const selectRef = useRef(null)
    const [showParcialError, setShowParcialError] = useState(null)
    const [isTotal, setIsTotal] = useState(acerto.devolucao_tesouro.devolucao_total === 'true')
    const {setIsValorParcialValido} = useContext(ValidarParcialTesouro)

    const verificaParcialError = (valorParcial) => {
        let valorParcialConvertido = valorParcial.slice(2).replace(/[\,\.]/g, '')
        valorParcialConvertido = Number(`${valorParcialConvertido.slice(0, -2).replace('.', '')}.${valorParcialConvertido.slice(-2)}`)
        if(valorParcialConvertido > valorDocumento){
            setShowParcialError('O valor parcial não pode ser maior que o valor do documento')
            setIsValorParcialValido(true)
        }else if (valorParcialConvertido == valorDocumento) {
            setShowParcialError('O valor parcial não pode ser igual ao valor do documento')
            setIsValorParcialValido(true)
        }else{
            setShowParcialError('')
            setIsValorParcialValido(false)
        }
    }

    let valorTesouro = selectRef.current?.value === "true" ? valorDocumento : acerto.devolucao_tesouro.valor;

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
                    required
                >
                    <option value="">Selecione o tipo de devolução</option>
                    {tiposDevolucao && tiposDevolucao.map(item =>
                        <option key={item.id} value={item.uuid}>{item.nome}</option>
                    )}
                </select>
                <p className='mt-1 mb-0'><span className="text-danger">{formikProps?.errors?.['solicitacoes_acerto']?.[index]?.devolucao_tesouro?.tipo}</span></p>
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
                    required
                />
                {formikProps.errors.data && <span className="text-danger mt-1">{formikProps.errors.data}</span>}

            </div>
            <div className='col-12 col-md-6 mt-3'>
                <label htmlFor={`devolucao_tesouro[${index}.devolucao_total]`}>Valor total ou parcial da despesa</label>
                <select
                    ref={selectRef}
                    value={acerto.devolucao_tesouro.devolucao_total}
                    name={`solicitacoes_acerto[${index}].devolucao_tesouro.devolucao_total`}
                    id={`devolucao_tesouro[${index}.devolucao_total]`}
                    onChange={(e) => {
                        const valorTesouro = e.target.value === 'true' ? valorDocumento : acerto.devolucao_tesouro.valor;
                        acerto.devolucao_tesouro.valor = e.target.value === 'true' ? valorDocumento : acerto.devolucao_tesouro.valor
                        formikProps.handleChange(e);
                        //verificaParcialError espera um valor formatado no formato R$40,00.
                        verificaParcialError(valorTesouro.toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL'
                        }).replace(/\s/g, ''))
                        setIsTotal(e.target.value === 'true')
                    }}
                    className='form-control'
                    required
                >
                    <option value="">Selecione o tipo</option>
                    <option value='true'>Valor total</option>
                    <option value='false'>Valor parcial</option>
                </select>
                <p className='mt-1 mb-0'><span className="text-danger">{formikProps?.errors?.['solicitacoes_acerto']?.[index]?.devolucao_tesouro?.devolucao_total}</span></p>
            </div>
            <div className='col-12 col-md-6 mt-3'>
                <label className='labels-filtros' htmlFor={`devolucao_tesouro[${index}.valor]`}>Valor</label>
                <CurrencyInput
                    value={valorTesouro}
                    name={`solicitacoes_acerto[${index}].devolucao_tesouro.valor`}
                    onChangeEvent={(e) => {
                        formikProps.handleChange(e);
                        verificaParcialError(e.target.value)
                    }}
                    id={`devolucao_tesouro[${index}.valor]`}
                    allowNegative={false}
                    prefix='R$'
                    decimalSeparator=","
                    thousandSeparator="."
                    className={`form-control`}
                    selectAllOnFocus={true}
                    placeholder='Digite o valor'
                    disabled={isTotal && selectRef.current?.value === "true"}
                    required
                />
                <p className='mt-1 mb-0'><span className="text-danger">{formikProps?.errors?.['solicitacoes_acerto']?.[index]?.devolucao_tesouro?.valor}</span></p>
                {showParcialError && !isTotal && <span className="span_erro text-danger mt-1">{showParcialError}</span>}
            </div>
        </>
    )
}