import React, {memo} from "react";
import {DatePickerField} from "../../../../Globais/DatePickerField";
import CurrencyInput from "react-currency-input";
import {trataNumericos} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import './data-saldo-bancario.scss'
import {visoesService} from "../../../../../services/visoes.service";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashAlt, faDownload} from '@fortawesome/free-solid-svg-icons'

const DataSaldoBancario = ({valoresPendentes, dataSaldoBancario, handleChangaDataSaldo, periodoFechado, nomeComprovanteExtrato, dataAtualizacaoComprovanteExtrato, exibeBtnDownload, msgErroExtensaoArquivo, changeUploadExtrato, reiniciaUploadExtrato, downloadComprovanteExtrato, uploadExtratoInputRef}) => {
    return(
        <>
            <form method="post" encType="multipart/form-data">
                <div className="row">
                    <div className="col-12">
                        <div className="card container-extrato">
                            <div className="card-body">
                                <h5 className="card-title titulo">Extrato Bancário da Unidade</h5>
                                <div className='row'>
                                    <div className='col-6'>
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
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label htmlFor="upload_extrato">Extrato bancário ou Demonstrativo do cartão</label>
                                            <div className='container-upload-extrato'>
                                                <input
                                                    type="file"
                                                    ref={uploadExtratoInputRef}
                                                    accept=".gif,.jpg,.jpeg,.png, .pdf"
                                                    name="upload_extrato"
                                                    id='upload_extrato'
                                                    onChange={changeUploadExtrato}
                                                    className="form-control-file"
                                                    disabled={periodoFechado || !visoesService.getPermissoes(['change_conciliacao_bancaria'])}
                                                />
                                                {nomeComprovanteExtrato &&
                                                    <>
                                                        <p className='mb-0 mt-2'>
                                                            <strong>Atualmente: </strong>{nomeComprovanteExtrato}
                                                            <button className='btn-editar-membro btn-apagar-comprovante-extrato ml-2' type='button' onClick={reiniciaUploadExtrato}>
                                                                <FontAwesomeIcon
                                                                style={{fontSize: '18px', marginRight: "3px", color: "#B40C02"}}
                                                                icon={faTrashAlt}
                                                            />
                                                            </button>
                                                            {exibeBtnDownload &&
                                                                <>
                                                                    <button className='btn-editar-membro' type='button' onClick={downloadComprovanteExtrato}>
                                                                        <FontAwesomeIcon
                                                                            style={{fontSize: '18px',}}
                                                                            icon={faDownload}
                                                                        />
                                                                    </button>
                                                                    <span className='exibe-data-comprovante-extrato'><i>(Envio dia {dataAtualizacaoComprovanteExtrato})</i></span>
                                                                </>
                                                            }
                                                        </p>
                                                    </>
                                                }
                                                {msgErroExtensaoArquivo &&
                                                    <p className='mt-2 mb-0'>{msgErroExtensaoArquivo}</p>
                                                }
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-12 mt-3">
                        <div className="card container-diferenca">
                            <div className="card-body">
                                <div className='row'>
                                    <div className='col-9 d-flex align-items-center'>
                                        <h5 className="card-title titulo mb-0">Diferença entre o saldo bancário declarado e o saldo atual do período calculado pelo sistema</h5>
                                    </div>
                                    <div className="col-3 d-flex align-items-center">
                                        <CurrencyInput
                                            allowNegative={true}
                                            prefix='R$ '
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            value={dataSaldoBancario.saldo_extrato ? valoresPendentes.saldo_posterior_total - trataNumericos(dataSaldoBancario.saldo_extrato) : valoresPendentes.saldo_posterior_total}
                                            id="diferenca_prestacao_de_conta"
                                            name="diferenca_prestacao_de_conta"
                                            className="form-control mb-0"
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