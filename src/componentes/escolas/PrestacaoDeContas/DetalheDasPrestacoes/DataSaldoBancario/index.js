import React, {memo} from "react";
import {DatePickerField} from "../../../../Globais/DatePickerField";
import CurrencyInput from "react-currency-input";
import {trataNumericos} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import './data-saldo-bancario.scss'
import {visoesService} from "../../../../../services/visoes.service";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashAlt, faDownload, faUpload, faPaperclip, faCheck} from '@fortawesome/free-solid-svg-icons'

import 'antd/dist/antd.css';
import { Upload, Button } from 'antd';

const DataSaldoBancario = ({
    valoresPendentes, dataSaldoBancario, handleChangaDataSaldo, periodoFechado,
    nomeComprovanteExtrato, exibeBtnDownload, msgErroExtensaoArquivo,
    changeUploadExtrato, reiniciaUploadExtrato, downloadComprovanteExtrato, salvarExtratoBancario,
    btnSalvarExtratoBancarioDisable, setBtnSalvarExtratoBancarioDisable, classBtnSalvarExtratoBancario,
    setClassBtnSalvarExtratoBancario, checkSalvarExtratoBancario, setCheckSalvarExtratoBancario, erroDataSaldo,
    dataAtualizacaoComprovanteExtrato
}) => {

    const handleOnClick = () => {
        setBtnSalvarExtratoBancarioDisable(true);
        setCheckSalvarExtratoBancario(true);
        setClassBtnSalvarExtratoBancario("secondary");
        salvarExtratoBancario();
    }

    return(
        <>
            <form method="post" encType="multipart/form-data">
                <div className="row">
                    <div className="col-12">
                        <div className="card container-extrato">
                            <div className="card-body">
                                <h5 className="card-title titulo">Saldo bancário da conta</h5>
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
                                                    maxDate={new Date()}
                                                />
                                                {erroDataSaldo && <span className="span_erro text-danger mt-1"> {erroDataSaldo}</span>}
                                            </div>
                                        </div>

                                        <div className='row'>
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
                                            <label htmlFor="upload_extrato" className="ml-1">Comprovante do saldo da conta</label>
                                            <div className='container-upload-extrato'>
                                                <Upload
                                                    beforeUpload={() => false}
                                                    disabled={periodoFechado || !visoesService.getPermissoes(['change_conciliacao_bancaria'])}
                                                    className={`${periodoFechado || !visoesService.getPermissoes(['change_conciliacao_bancaria']) ? 'disabled_upload' : ''}`}
                                                    {...{

                                                        name: 'file',
                                                        accept: ".gif,.jpg,.jpeg,.png, .pdf",
                                                        onChange:changeUploadExtrato,
                                                        showUploadList: false

                                                    }}>
                                                    <Button icon={
                                                        <i className="glyphicon mr-2">
                                                        <FontAwesomeIcon
                                                            icon={faUpload}
                                                        />
                                                    </i>
                                                    } className="button-upload">Escolher arquivo</Button>
                                                </Upload>
                                                <p>Selecione um arquivo jpeg, png ou pdf de no máximo 500kb</p>

                                                {msgErroExtensaoArquivo &&
                                                    <p className='mt-2 mb-0'>{msgErroExtensaoArquivo}</p>
                                                }

                                                <div className="container-upload-item mt-n1">
                                                    <div className="row">
                                                        <div className="col-lg-8 mt-2">
                                                            <p>
                                                                <span className="mr-1 ml-1">
                                                                    <FontAwesomeIcon
                                                                    style={{color:'#000000'}}
                                                                    icon={faPaperclip}/>
                                                                </span>{nomeComprovanteExtrato}
                                                            </p>
                                                            { exibeBtnDownload &&
                                                                <p>
                                                                    <span>Atualizado em: {dataAtualizacaoComprovanteExtrato}</span>
                                                                </p>
                                                            }
                                                        </div>

                                                        <div className="col-lg-4 mt-2 text-right">
                                                            <button disabled={periodoFechado || !visoesService.getPermissoes(['change_conciliacao_bancaria'])} className='btn-editar-membro btn-apagar-comprovante-extrato ml-2' type='button' onClick={reiniciaUploadExtrato}>
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
                                                            </>
                                                    }
                                                        </div>
                                                    </div>



                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card container-diferenca">
                                <div className="card-body">
                                    <div className='row'>
                                        <div className='col-6 d-flex align-items-center'>
                                            <h5 className="card-title titulo mb-0">Diferença em relação a prestação de contas</h5>
                                        </div>
                                        <div className="col-6 d-flex align-items-center">
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
                </div>
            </form>

            {visoesService.getPermissoes(['change_conciliacao_bancaria']) &&
                <div className="bd-highlight d-flex justify-content-end">
                    {checkSalvarExtratoBancario &&
                        <div className="">
                            <p className="mr-2 mt-3">
                                <span className="mr-1">
                                <FontAwesomeIcon
                                    style={{fontSize: '16px', color:'#297805'}}
                                    icon={faCheck}
                                />
                                </span>Salvo
                            </p>
                        </div>
                    }

                    <button
                        disabled={btnSalvarExtratoBancarioDisable}
                        type="button"
                        className={`btn btn-${classBtnSalvarExtratoBancario} mt-2`}
                        onClick={handleOnClick}
                        >
                            <strong>Salvar Extrato</strong>
                    </button>
                </div>
            }
        </>
    )
};
export default memo(DataSaldoBancario)