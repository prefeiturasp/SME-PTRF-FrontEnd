import React from "react";
import {DatePickerField} from "../../../Globais/DatePickerField";
import {trataNumericos} from "../../../../utils/ValidacoesAdicionaisFormularios";
import CurrencyInput from "react-currency-input";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faExclamationCircle, faCheck, faTrash} from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from "react-tooltip";
import moment from "moment";


export const AnalisesDeContaDaPrestacao = ({infoAta, analisesDeContaDaPrestacao, handleChangeAnalisesDeContaDaPrestacao, getObjetoIndexAnalise, editavel, prestacaoDeContas, adicaoAjusteSaldo, setAdicaoAjusteSaldo, onClickAdicionarAcertoSaldo, onClickDescartarAcerto, formErrosAjusteSaldo, validaAjustesSaldo, handleOnKeyDownAjusteSaldo, onClickSalvarAcertoSaldo, ajusteSaldoSalvoComSucesso, onClickDeletarAcertoSaldo}) => {
    let index = getObjetoIndexAnalise().analise_index;
    const tooltip_1 = 'A diferença entre o saldo bancário e o saldo reprogramado <br/> pode ocorrer em virtude de cheques não compensados, <br/> despesas/créditos não lançados ou lançados com erro ou <br/> estornos ainda não realizados.'
    

    const informacoes_conciliacao_ue = () => {
        let info = prestacaoDeContas.informacoes_conciliacao_ue.find(element => element.conta_uuid === infoAta.conta_associacao.uuid);

        let dados = {
            saldo_extrato: '-',
            data_extrato: '-'
        }

        if (info){
            dados.saldo_extrato = info.saldo_extrato ? info.saldo_extrato : '-';
            dados.data_extrato = info.data_extrato ? moment(info.data_extrato).format('DD/MM/YYYY') : '-'
        }

        return dados;
    }

    const formataValor = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        return valor_formatado;
    }

    const calculaDiferencaUe = () => {
        if(informacoes_conciliacao_ue().saldo_extrato !== '-'){
            let diferenca = infoAta.totais.saldo_atual_total - trataNumericos(informacoes_conciliacao_ue().saldo_extrato)
            let formatado = formataValor(diferenca);
            return formatado;
        }
        else{
            return formataValor(infoAta.totais.saldo_atual_total)
        }
    }

    const calculaDiferencaDre = () => {
        if(index > -1){
            if(trataNumericos(analisesDeContaDaPrestacao[index].saldo_extrato) || trataNumericos(analisesDeContaDaPrestacao[index].saldo_extrato) === 0){
                let diferenca = infoAta.totais.saldo_atual_total - trataNumericos(analisesDeContaDaPrestacao[index].saldo_extrato);
                let formatado = formataValor(diferenca);
                return formatado;
            }
            else{
                return "-"
            }
        }

        return "-"
    }

    const temDiferencaUe = () => {
        let diferenca = infoAta.totais.saldo_atual_total - trataNumericos(informacoes_conciliacao_ue().saldo_extrato)

        if(diferenca === 0){
            return false;
        }

        return true;
    }

    const temDiferencaAjusteDre = () => {
        if(index > -1){
            if(trataNumericos(analisesDeContaDaPrestacao[index].saldo_extrato) || trataNumericos(analisesDeContaDaPrestacao[index].saldo_extrato) === 0){
                let diferenca = infoAta.totais.saldo_atual_total - trataNumericos(analisesDeContaDaPrestacao[index].saldo_extrato)
            
                if(diferenca === 0){
                    return false;
                }

                return true;
            }
            else{
                return false;
            }
        }

        return false;
    }

    const permiteSalvar = () => {
        let permite = true;

        if(index > -1){
            if(!analisesDeContaDaPrestacao[index].saldo_extrato && !analisesDeContaDaPrestacao[index].data_extrato){
                permite = false;
            }

            if(formErrosAjusteSaldo && formErrosAjusteSaldo[index] && formErrosAjusteSaldo[index].data){
                permite = false;
            }

            if(formErrosAjusteSaldo && formErrosAjusteSaldo[index] && formErrosAjusteSaldo[index].saldo){
                permite = false;
            }
        }
        else{
            permite = false;
        }

        return permite;
    }
    
    return (
        <>
            <>
                <form method="post">
                    <div className="row">
                        <div className="col-12">
                            <div className="row container-titulo-extrato-bancario ml-0 mr-0">
                                <div className="col-12 align-self-center">
                                    <span className="titulo-extrato-bancario">Extrato Bancário da Unidade</span>
                                </div>
                            </div>

                            <div className="row container-extrato-bancario ml-0 mr-0">
                                <div className="col-3 mt-3">
                                    <span className=''>
                                        <strong>Data</strong>
                                    </span>
                                    <p className="dados-extrato-bancario mt-3">
                                        {informacoes_conciliacao_ue().data_extrato}
                                    </p>
                                    
                                </div>

                                <div className="col-4 mt-3">
                                    <span className=''>
                                        <strong>Saldo</strong>
                                    </span>
                                    <p className="dados-extrato-bancario mt-3">
                                        {informacoes_conciliacao_ue().saldo_extrato !== '-' ?  formataValor(informacoes_conciliacao_ue().saldo_extrato): '-'}
                                    </p>
                                </div>

                                <div className="col-5 mt-3">
                                    <span className=''>
                                        <strong>Diferença em relação à prestação de contas</strong>
                                    </span>
                                    
                                    {temDiferencaUe() &&
                                        <>
                                            <span data-html={true} data-tip={tooltip_1}>
                                                <FontAwesomeIcon
                                                    style={{marginLeft: "10px", color: '#2B7D83'}}
                                                    icon={faExclamationCircle}
                                                />
                                            </span>
                                            <ReactTooltip html={true}/>
                                        </>
                                    }
                                    
                                    
                                    <p className={`dados-extrato-bancario mt-3 ${temDiferencaUe() ? 'tem-diferenca' : ''}`}>
                                        {!temDiferencaUe() &&
                                            <FontAwesomeIcon
                                                style={{marginRight: "10px", color: '#009640'}}
                                                icon={faCheck}
                                            />
                                        }
                                        
                                        {calculaDiferencaUe()}
                                    </p>

                                </div>
                            </div>

                            {(adicaoAjusteSaldo || (index >-1 && analisesDeContaDaPrestacao[index] && analisesDeContaDaPrestacao[index].uuid)) &&
                                <div id="correcao_extrato_bancario">
                                    <div className="row container-extrato-bancario ml-0 mr-0">
                                        <div className="col-12 mt-4">
                                            <p className="titulo-acerto-saldo mb-0">
                                                <strong>Acerto de Saldo</strong>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="row container-extrato-bancario ml-0 mr-0">
                                        <div className="col-3 mt-2 mb-4">
                                            <label htmlFor="data_extrato"><strong>Data corrigida</strong></label>
                                            <DatePickerField
                                                disabled={!editavel || !adicaoAjusteSaldo}
                                                value={index > -1 && analisesDeContaDaPrestacao[index].data_extrato ? analisesDeContaDaPrestacao[index].data_extrato : ''}
                                                onChange={(name, value) => handleChangeAnalisesDeContaDaPrestacao(name, value)}
                                                name='data_extrato'
                                                type="date"
                                                className="form-control"
                                                onCalendarClose={() => {
                                                    validaAjustesSaldo(informacoes_conciliacao_ue(), index, analisesDeContaDaPrestacao[index], "data");
                                                }}
                                            />
                                            {formErrosAjusteSaldo[index] && formErrosAjusteSaldo[index].data && <span className="span_erro text-danger mt-1"> {formErrosAjusteSaldo[index].data}</span>}
                                            
                                        </div>
                                        <div className="col-4 mt-2 mb-4">
                                            <label htmlFor="saldo_extrato"><strong>Saldo corrigido</strong></label>
                                            <CurrencyInput
                                                disabled={!editavel || !adicaoAjusteSaldo}
                                                allowNegative={false}
                                                prefix='R$'
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                value={index > -1 && analisesDeContaDaPrestacao[index].saldo_extrato !== null ? trataNumericos(analisesDeContaDaPrestacao[index].saldo_extrato) : null}
                                                id="saldo_extrato"
                                                name="saldo_extrato"
                                                className="form-control"
                                                onChangeEvent={(e) => {
                                                    handleChangeAnalisesDeContaDaPrestacao(e.target.name, e.target.value)
                                                    validaAjustesSaldo(informacoes_conciliacao_ue(), index, analisesDeContaDaPrestacao[index], "saldo")
                                                }}
                                                allowEmpty={true}
                                                selectAllOnFocus={true}
                                                placeholder=' '
                                                onKeyDown={(e) => handleOnKeyDownAjusteSaldo(e, analisesDeContaDaPrestacao[index].saldo_extrato)}
                                            />
                                            {formErrosAjusteSaldo[index] && formErrosAjusteSaldo[index].saldo && <span className="span_erro text-danger mt-1"> {formErrosAjusteSaldo[index].saldo}</span>}
                                        </div>

                                        <div className="col-5 mt-2 mb-4">
                                            <span className=''>
                                                <strong>Diferença em relação à prestação de contas</strong>
                                            </span>
                                            
                                            {temDiferencaAjusteDre() &&
                                                <>
                                                    <span data-html={true} data-tip={tooltip_1}>
                                                        <FontAwesomeIcon
                                                            style={{marginLeft: "10px", color: '#2B7D83'}}
                                                            icon={faExclamationCircle}
                                                        />
                                                    </span>
                                                    <ReactTooltip html={true}/>
                                                </>
                                            }
                                            
                                            <div className="d-flex bd-highlight dados-extrato-bancario-correcao">
                                                <div className="flex-grow-1 bd-highlight mt-3">
                                                    <span className={` ${temDiferencaAjusteDre() ? 'tem-diferenca' : ''}`}>
                                                        {!temDiferencaAjusteDre() && calculaDiferencaDre() !== "-" &&
                                                            <FontAwesomeIcon
                                                                style={{marginRight: "10px", color: '#009640'}}
                                                                icon={faCheck}
                                                            />
                                                        }
                                                        
                                                        {calculaDiferencaDre()}
                                                    </span>
                                                </div>

                                                {index > -1 && !adicaoAjusteSaldo && editavel &&
                                                    <div className="bd-highlight mt-3">
                                                        <span onClick={() => {
                                                            onClickDeletarAcertoSaldo()
                                                        }}>
                                                            <FontAwesomeIcon
                                                                style={{color: '#B40C02', cursor: 'pointer'}}
                                                                icon={faTrash}
                                                            />
                                                        </span>
                                                    </div>
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            }

                            
                            <div className="row container-botoes-extrato-bancario ml-0 mr-0">
                                {!adicaoAjusteSaldo 
                                    ?
                                        <div className="col-12">

                                            <div className="d-flex bd-highlight">
                                                <div className="flex-grow-1 bd-highlight">
                                                    {ajusteSaldoSalvoComSucesso[index] && editavel &&
                                                        <span className="mr-2 salvo-com-sucesso">
                                                            <FontAwesomeIcon
                                                                style={{
                                                                    fontSize: '15px',
                                                                    marginRight: "0px",
                                                                    marginTop: "25px",
                                                                    paddingRight: "4px",
                                                                    color: '#297805'
                                                                }}
                                                                icon={faCheck}
                                                            />
                                                            Salvo com sucesso
                                                        </span>
                                                    }
                                                </div>

                                                <div className="bd-highlight">
                                                    <button
                                                        disabled={!editavel || (index > -1 && analisesDeContaDaPrestacao[index].uuid)}
                                                        type="button"
                                                        className="btn btn btn-success mt-3 mb-3 mr-2"
                                                        onClick={() => {
                                                            onClickAdicionarAcertoSaldo(infoAta.conta_associacao)
                                                        }}
                                                    >
                                                        Adicionar acerto
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    :
                                        <div className="col-12">
                                            <div className="d-flex justify-content-end">
                                                <button
                                                    disabled={!editavel}
                                                    type="button"
                                                    className="btn btn-outline-success mt-3 mb-3 mr-4"
                                                    onClick={() => {
                                                        onClickDescartarAcerto()
                                                    }}
                                                >
                                                    Descartar acerto
                                                </button>

                                                <button
                                                    disabled={!editavel || !permiteSalvar()}
                                                    type="button"
                                                    className="btn btn btn-success mt-3 mb-3 mr-2"
                                                    onClick={() => {
                                                        onClickSalvarAcertoSaldo(infoAta.conta_associacao, analisesDeContaDaPrestacao[index], index);
                                                    }}
                                                >
                                                    Salvar
                                                </button>
                                            </div>
                                        </div>
                                }
                            </div>
                            

                        </div>
                    </div>
                </form>
            </>
        </>
    )
};