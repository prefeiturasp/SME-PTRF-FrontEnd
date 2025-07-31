import React, {memo} from "react";
import {DatePickerField} from "../../../../Globais/DatePickerField";
import { ReactNumberFormatInput as CurrencyInput } from "../../../../Globais/ReactNumberFormatInput";
import {trataNumericos} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import './data-saldo-bancario.scss'
import {visoesService} from "../../../../../services/visoes.service";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashAlt, faDownload, faUpload, faPaperclip, faCheck} from '@fortawesome/free-solid-svg-icons'
import 'antd/dist/reset.css';
import { Upload, Button } from 'antd';
import moment from "moment";

import {IconeDataSaldoBancarioPendentes} from "./IconeDataSaldoBancarioPendentes";
import {formataData} from "../../../../../utils/FormataData";

const DataSaldoBancario = ({
    valoresPendentes, dataSaldoBancario, handleChangaDataSaldo, periodoFechado,
    nomeComprovanteExtrato, exibeBtnDownload, msgErroExtensaoArquivo,
    changeUploadExtrato, reiniciaUploadExtrato, downloadComprovanteExtrato, salvarExtratoBancario,
    btnSalvarExtratoBancarioDisable, setBtnSalvarExtratoBancarioDisable, classBtnSalvarExtratoBancario,
    setClassBtnSalvarExtratoBancario, checkSalvarExtratoBancario, setCheckSalvarExtratoBancario, erroDataSaldo,
    dataAtualizacaoComprovanteExtrato, permiteEditarCamposExtrato,
    pendenciaSaldoBancario, dataSaldoBancarioSolicitacaoEncerramento, setShowModalSalvarDataSaldoExtrato
}) => {
    const handleOnClick = () => {
        let dispara_modal = false;

        if(dataSaldoBancarioSolicitacaoEncerramento && dataSaldoBancarioSolicitacaoEncerramento.possui_solicitacao_encerramento && dataSaldoBancario){
            let data_solicitacao_encerramento = dataSaldoBancarioSolicitacaoEncerramento.data_encerramento ? moment(dataSaldoBancarioSolicitacaoEncerramento.data_encerramento, "YYYY-MM-DD").format("YYYY-MM-DD"): null
            let saldo_solicitacao_encerramento = dataSaldoBancarioSolicitacaoEncerramento.saldo_encerramento ? trataNumericos(dataSaldoBancarioSolicitacaoEncerramento.saldo_encerramento) : 0

            let data_formulario = dataSaldoBancario.data_extrato ? moment(dataSaldoBancario.data_extrato, "YYYY-MM-DD").format("YYYY-MM-DD"): null
            let saldo_formulario = dataSaldoBancario.saldo_extrato ? trataNumericos(dataSaldoBancario.saldo_extrato) : 0

            console.log(data_solicitacao_encerramento, data_formulario, saldo_solicitacao_encerramento, saldo_formulario, dataSaldoBancarioSolicitacaoEncerramento.data_encerramento, dataSaldoBancarioSolicitacaoEncerramento.saldo_encerramento )
            if(dataSaldoBancarioSolicitacaoEncerramento.data_encerramento !== data_formulario || dataSaldoBancarioSolicitacaoEncerramento.saldo_encerramento !== saldo_formulario){
                dispara_modal = true;
            }
        }
        
        if(dispara_modal){
            setShowModalSalvarDataSaldoExtrato(true);
        }
        else{
            salvarExtratoBancario();
        }
    }

    const dataLimite = () => {
        if(dataSaldoBancarioSolicitacaoEncerramento && dataSaldoBancarioSolicitacaoEncerramento.data_extrato){
            let data_encerramento = dataSaldoBancarioSolicitacaoEncerramento.data_extrato;
            let objeto_data = new Date(data_encerramento);
            objeto_data.setDate(objeto_data.getDate() + 1);
            return objeto_data;
        }

        return new Date();
    }

    //  TODO códigos comentados propositalmente em função da história 102412 - Sprint 73 (Conciliação Bancária: Retirar validação e obrigatoriedade de preenchimento dos campos do Saldo bancário da conta ao concluir acerto/período) - que entrou como Hotfix
    return(
        <>
            <form method="post" encType="multipart/form-data">
                <div className="row">
                    <div className="col-12">
                        <div className="card container-extrato">
                            <div className="card-body">
                                <h5 className="card-title titulo">Saldo bancário da conta {pendenciaSaldoBancario ? IconeDataSaldoBancarioPendentes() :  null}</h5>
                                {/*<p className='text-right'><span className='font-weight-bold'>* Preenchimento obrigatório</span></p>*/}
                                <div className='row'>
                                    <div className='col-6'>
                                        <div className='row'>
                                            <div className="col">
                                                <label htmlFor="data_extrato">Data</label>
                                                {/*<label htmlFor="data_extrato">Data *</label>*/}
                                                <DatePickerField
                                                    value={dataSaldoBancario.data_extrato ? dataSaldoBancario.data_extrato : ''}
                                                    onChange={handleChangaDataSaldo}
                                                    name='data_extrato'
                                                    id='data_extrato'
                                                    type="date"
                                                    className="form-control"
                                                    disabled={!permiteEditarCamposExtrato || !visoesService.getPermissoes(['change_conciliacao_bancaria'])}
                                                    maxDate={dataLimite()}
                                                />
                                                {erroDataSaldo && <span className="span_erro text-danger mt-1"> {erroDataSaldo}</span>}
                                                {dataSaldoBancarioSolicitacaoEncerramento?.possui_solicitacao_encerramento === true &&
                                                  <span>
                                                    {`Data de encerramento da conta: ${formataData(dataSaldoBancarioSolicitacaoEncerramento.data_encerramento)}`}
                                                  </span>
                                                }
                                            </div>
                                        </div>

                                        <div className='row' style={{ paddingTop: '10px' }}>
                                            <div className="col">
                                                <label htmlFor="saldo_extrato">Saldo</label>
                                                {/*<label htmlFor="saldo_extrato">Saldo *</label>*/}
                                                <CurrencyInput
                                                    allowNegative={true}
                                                    prefix='R$'
                                                    decimalSeparator=","
                                                    thousandSeparator="."
                                                    value={dataSaldoBancario.saldo_extrato ? dataSaldoBancario.saldo_extrato : 0}
                                                    id="saldo_extrato"
                                                    name="saldo_extrato"
                                                    className="form-control"
                                                    onChangeEvent={(e) => handleChangaDataSaldo(e.target.name, e.target.value)}
                                                    disabled={!permiteEditarCamposExtrato || !visoesService.getPermissoes(['change_conciliacao_bancaria'])}
                                                />
                                                {dataSaldoBancarioSolicitacaoEncerramento?.possui_solicitacao_encerramento === true &&
                                                  <span>
                                                    {`Saldo do encerramento: R$${parseFloat(dataSaldoBancarioSolicitacaoEncerramento.saldo_encerramento).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                                  </span>
                                                }

                                            </div>
                                        </div>


                                    </div>
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label htmlFor="upload_extrato" className="ml-1">Comprovante do saldo da conta</label>
                                            {/*<label htmlFor="upload_extrato" className="ml-1">Comprovante do saldo da conta {dataSaldoBancario.saldo_extrato !== 0 && dataSaldoBancario.saldo_extrato !== "R$0,00" ? "*" : ""}</label>*/}
                                            <div className='container-upload-extrato'>
                                                <Upload
                                                    beforeUpload={() => false}
                                                    disabled={!permiteEditarCamposExtrato || !visoesService.getPermissoes(['change_conciliacao_bancaria'])}
                                                    className={`${!permiteEditarCamposExtrato || !visoesService.getPermissoes(['change_conciliacao_bancaria']) ? 'disabled_upload' : ''}`}
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
                                                            <button disabled={!permiteEditarCamposExtrato || !visoesService.getPermissoes(['change_conciliacao_bancaria'])} className='btn-editar-membro btn-apagar-comprovante-extrato ml-2' type='button' onClick={reiniciaUploadExtrato}>
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
                            <strong>Salvar saldo</strong>
                    </button>
                </div>
            }
        </>
    )
};
export default memo(DataSaldoBancario)