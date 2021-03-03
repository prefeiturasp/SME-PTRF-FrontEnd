import React, {memo} from "react";
import {DatePickerField} from "../../../../Globais/DatePickerField";
import CurrencyInput from "react-currency-input";
import {trataNumericos} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import './data-saldo-bancario.scss'
import {visoesService} from "../../../../../services/visoes.service";

const DataSaldoBancario = ({valoresPendentes, dataSaldoBancario, handleChangaDataSaldo, periodoFechado}) => {
    return(
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
                                            value={dataSaldoBancario.data_extrato ? dataSaldoBancario.data_extrato : ''}
                                            onChange={handleChangaDataSaldo}
                                            name='data_extrato'
                                            type="date"
                                            className="form-control"
                                            disabled={periodoFechado || !visoesService.getPermissoes(['change_conciliacao_bancaria'])}
                                        />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="saldo_extrato">Saldo</label>
                                        <CurrencyInput
                                            allowNegative={false}
                                            prefix='R$'
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            value={dataSaldoBancario.saldo_extrato ? dataSaldoBancario.saldo_extrato : 0}
                                            id="saldo_extrato"
                                            name="saldo_extrato"
                                            className="form-control"
                                            onChangeEvent={(e) => handleChangaDataSaldo(e.target.name, e.target.value)}
                                            disabled={periodoFechado || !visoesService.getPermissoes(['change_conciliacao_bancaria'])}
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
                                        <label htmlFor="diferenca_prestacao_de_conta">Valor</label>
                                        <CurrencyInput
                                            allowNegative={true}
                                            prefix='R$'
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            value={dataSaldoBancario.saldo_extrato ? valoresPendentes.saldo_posterior_total - trataNumericos(dataSaldoBancario.saldo_extrato) : valoresPendentes.saldo_posterior_total}
                                            id="diferenca_prestacao_de_conta"
                                            name="diferenca_prestacao_de_conta"
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
    )
};
export default memo(DataSaldoBancario)