import React from "react";
import {DatePickerField} from "../../../Globais/DatePickerField";
import {trataNumericos} from "../../../../utils/ValidacoesAdicionaisFormularios";
import CurrencyInput from "react-currency-input";

export const AnalisesDeContaDaPrestacao = ({infoAta, analisesDeContaDaPrestacao, handleChangeAnalisesDeContaDaPrestacao, getObjetoIndexAnalise}) => {
    let index = getObjetoIndexAnalise().analise_index;
    return (
        <>
            {analisesDeContaDaPrestacao && analisesDeContaDaPrestacao.length > 0 && index > -1 &&
            <>
                <form method="post">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="card container-extrato">
                                <div className="card-body">
                                    <h5 className="card-title titulo">Extrato Bancário da Unidade</h5>
                                    <div className='row'>
                                        <div className="col">
                                            <label htmlFor="data_extrato">Data</label>
                                            <DatePickerField
                                                value={analisesDeContaDaPrestacao[index].data_extrato ? analisesDeContaDaPrestacao[index].data_extrato : ''}
                                                onChange={handleChangeAnalisesDeContaDaPrestacao}
                                                name='data_extrato'
                                                type="date"
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="saldo_extrato">Saldo</label>
                                            <CurrencyInput
                                                allowNegative={false}
                                                prefix='R$'
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                value={analisesDeContaDaPrestacao[index].saldo_extrato ? analisesDeContaDaPrestacao[index].saldo_extrato : ''}
                                                id="saldo_extrato"
                                                name="saldo_extrato"
                                                className="form-control"
                                                onChangeEvent={(e) => handleChangeAnalisesDeContaDaPrestacao(e.target.name, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="card container-diferenca">
                                <div className="card-body">
                                    <h5 className="card-title titulo">Diferença em relação a prestação de contas</h5>
                                    <div className='row'>
                                        <div className="col-12">
                                            <label htmlFor="diferenca">Valor</label>
                                            <CurrencyInput
                                                allowNegative={false}
                                                prefix='R$'
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                value={infoAta.totais.saldo_atual_total - trataNumericos(analisesDeContaDaPrestacao[index].saldo_extrato)}
                                                id="diferenca"
                                                name="diferenca"
                                                className="form-control"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </>
            }
        </>
    )
};