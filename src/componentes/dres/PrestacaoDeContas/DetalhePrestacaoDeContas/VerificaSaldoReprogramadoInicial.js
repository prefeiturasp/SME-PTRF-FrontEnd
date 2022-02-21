import React, {useState, useEffect} from "react";
import {Formik} from "formik";
import { getUltimaAnalisePc, getAnaliseValorReprogramadoPorAcao, patchAnaliseValorReprogramadoPorAcao, postAnaliseValorReprogramadoPorAcao, getSaldosIniciasAjustes } from "../../../../services/dres/PrestacaoDeContas.service";
import CurrencyInput from "react-currency-input";
import { trataNumericos } from "../../../../utils/ValidacoesAdicionaisFormularios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";

export const VerificaSaldoReprogramadoInicial = ({setValoresReprogramadosAjustes, conta_associacao_uuid, acao_associacao_uuid, prestacaoDeContas}) => {

    const [dadosUuid, setDadosUuid] = useState({});
    const [initialState, setInitialState] = useState({
        acao_associacao: "",
        analise_prestacao_conta: "",
        conta_associacao: "",
        novo_saldo_reprogramado_capital: null,
        novo_saldo_reprogramado_custeio: null,
        novo_saldo_reprogramado_livre: null,
        uuid: "",
        valor_saldo_reprogramado_correto: true
    });
    const [showBtnConfirmarSuperior, setShowBtnConfirmarSuperior] = useState(false)
    const [onClickBtnConfirmarSuperior, setOnClickBtnConfirmarSuperior] = useState(false);
    const [disableBtnConfirmarSuperior, setDisableBtnConfirmarSuperior] = useState(false);

    const [showBtnConfirmarInferior, setShowBtnConfirmarInferior] = useState(true);
    const [onClickBtnConfirmarInferior, setOnClickBtnConfirmarInferior] = useState(false);
    const [disableBtnConfirmarInferior, setDisableBtnConfirmarInferior] = useState(true);

    useEffect(() => {
        const verificaSeTemAnaliseAtual = async () => {
            let uuid_analise;

            if(prestacaoDeContas && prestacaoDeContas.analise_atual && prestacaoDeContas.analise_atual.uuid){
                uuid_analise = prestacaoDeContas.analise_atual.uuid
            }
            else{
                let ultima_analise =  await getUltimaAnalisePc(prestacaoDeContas.uuid)
                uuid_analise = ultima_analise.uuid
            }

            let objeto = {
                uuid_analise: uuid_analise,
                uuid_conta_associacao: conta_associacao_uuid,
                uuid_acao_associacao: acao_associacao_uuid
            }

            setDadosUuid(objeto)
        }

        verificaSeTemAnaliseAtual();

    }, [prestacaoDeContas, conta_associacao_uuid, acao_associacao_uuid])

    const recebeAnaliseValorReprogramado = async() => {
        if(dadosUuid.uuid_analise && dadosUuid.uuid_conta_associacao && dadosUuid.uuid_acao_associacao){
            let analise = await getAnaliseValorReprogramadoPorAcao(dadosUuid.uuid_analise, dadosUuid.uuid_conta_associacao, dadosUuid.uuid_acao_associacao)
            analise = analise[0]
            
            if(analise && analise.uuid){
                
                let objeto = {
                    uuid: analise.uuid,
                    acao_associacao: analise.acao_associacao,
                    analise_prestacao_conta: analise.analise_prestacao_conta,
                    conta_associacao: analise.conta_associacao,
                    novo_saldo_reprogramado_capital: analise.novo_saldo_reprogramado_capital ? parseFloat(analise.novo_saldo_reprogramado_capital) : analise.novo_saldo_reprogramado_capital,
                    novo_saldo_reprogramado_custeio: analise.novo_saldo_reprogramado_custeio ? parseFloat(analise.novo_saldo_reprogramado_custeio) : analise.novo_saldo_reprogramado_custeio,
                    novo_saldo_reprogramado_livre: analise.novo_saldo_reprogramado_livre ? parseFloat(analise.novo_saldo_reprogramado_livre) : analise.novo_saldo_reprogramado_livre,
                    valor_saldo_reprogramado_correto: analise.valor_saldo_reprogramado_correto
                }

                setInitialState(objeto)

                if(analise.valor_saldo_reprogramado_correto){
                    setShowBtnConfirmarSuperior(true);
                    setShowBtnConfirmarInferior(false);
                }
                else{
                    setShowBtnConfirmarSuperior(false);
                    setShowBtnConfirmarInferior(true);
                }
            }
            else{
                let objeto = {
                    acao_associacao: dadosUuid.uuid_acao_associacao,
                    analise_prestacao_conta: dadosUuid.uuid_analise,
                    conta_associacao: dadosUuid.uuid_conta_associacao,
                    novo_saldo_reprogramado_capital: null,
                    novo_saldo_reprogramado_custeio: null,
                    novo_saldo_reprogramado_livre: null,
                    valor_saldo_reprogramado_correto: true
                }

                setInitialState(objeto);

                setShowBtnConfirmarSuperior(true);
                setShowBtnConfirmarInferior(false);
            }
        }
    }

    useEffect(() => {
        recebeAnaliseValorReprogramado();
    }, [dadosUuid])

    const onSubmitForm = async (values) => {
        if(values.uuid){
            let payload = {}
            if(values.valor_saldo_reprogramado_correto){
                payload =   {
                    valor_saldo_reprogramado_correto: values.valor_saldo_reprogramado_correto,
                    novo_saldo_reprogramado_custeio: null,
                    novo_saldo_reprogramado_capital: null,
                    novo_saldo_reprogramado_livre: null
                }
            }
            else{
                payload =   {
                    valor_saldo_reprogramado_correto: values.valor_saldo_reprogramado_correto,
                    novo_saldo_reprogramado_custeio: trataNumericos(values.novo_saldo_reprogramado_custeio),
                    novo_saldo_reprogramado_capital: trataNumericos(values.novo_saldo_reprogramado_capital),
                    novo_saldo_reprogramado_livre: trataNumericos(values.novo_saldo_reprogramado_livre)
                }
            }
            
            try {
                await patchAnaliseValorReprogramadoPorAcao(values.uuid, payload);
                recebeAnaliseValorReprogramado();
                let valores_reprogramados_ajustes = await getSaldosIniciasAjustes(dadosUuid.uuid_analise, dadosUuid.uuid_conta_associacao);
                setValoresReprogramadosAjustes([...valores_reprogramados_ajustes])
                console.log("Edição realizada com sucesso!")
            } catch (e) {
                console.log("Erro ao fazer edição", e.response)
            }
        }
        else{
            let payload = {}
            if(values.valor_saldo_reprogramado_correto){
                payload =   {
                    analise_prestacao_conta: values.analise_prestacao_conta,
                    conta_associacao: values.conta_associacao,
                    acao_associacao: values.acao_associacao,
                    valor_saldo_reprogramado_correto: values.valor_saldo_reprogramado_correto,
                    novo_saldo_reprogramado_custeio: null,
                    novo_saldo_reprogramado_capital: null,
                    novo_saldo_reprogramado_livre: null
                }
            }
            else{
                payload =   {
                    analise_prestacao_conta: values.analise_prestacao_conta,
                    conta_associacao: values.conta_associacao,
                    acao_associacao: values.acao_associacao,
                    valor_saldo_reprogramado_correto: values.valor_saldo_reprogramado_correto,
                    novo_saldo_reprogramado_custeio: trataNumericos(values.novo_saldo_reprogramado_custeio),
                    novo_saldo_reprogramado_capital: trataNumericos(values.novo_saldo_reprogramado_capital),
                    novo_saldo_reprogramado_livre: trataNumericos(values.novo_saldo_reprogramado_livre)
                }
            }

            try {
                await postAnaliseValorReprogramadoPorAcao(payload);
                recebeAnaliseValorReprogramado();
                let valores_reprogramados_ajustes = await getSaldosIniciasAjustes(dadosUuid.uuid_analise, dadosUuid.uuid_conta_associacao);
                setValoresReprogramadosAjustes([...valores_reprogramados_ajustes])
                console.log("Criação realizada com sucesso!")
            } catch (e) {
                console.log("Erro ao fazer criação", e.response)
            }
        }
    }

    const handleOnClickConfirmarSuperior = (values) => {
        setDisableBtnConfirmarSuperior(true);
        setOnClickBtnConfirmarSuperior(true);
        setOnClickBtnConfirmarInferior(false);
        onSubmitForm(values);
    }

    const handleOnClickConfirmarInferior = (values) => {
        setDisableBtnConfirmarInferior(true);
        setOnClickBtnConfirmarInferior(true);
        setOnClickBtnConfirmarSuperior(false);
        onSubmitForm(values);
    }

    const handleOnChangeSaldoReprogramadoCorreto = (setFieldValue, ) => {
        setFieldValue(`valor_saldo_reprogramado_correto`, true)
        setShowBtnConfirmarSuperior(true);
        setShowBtnConfirmarInferior(false);
    }

    const handleOnChangeSaldoReprogramadoIncorreto = (setFieldValue, values) => {
        setFieldValue(`valor_saldo_reprogramado_correto`, false)
        setShowBtnConfirmarSuperior(false);
        setShowBtnConfirmarInferior(true);

        setDisableBtnConfirmarSuperior(false);
        setOnClickBtnConfirmarSuperior(false);

        
        setFieldValue(`novo_saldo_reprogramado_custeio`, initialState.novo_saldo_reprogramado_custeio)
        setFieldValue(`novo_saldo_reprogramado_capital`, initialState.novo_saldo_reprogramado_capital)
        setFieldValue(`novo_saldo_reprogramado_livre`, initialState.novo_saldo_reprogramado_livre)
        

        setDisableBtnConfirmarInferior(true);
    }

    const handleOnKeyDownCusteio = (setFieldValue, e, values) => {
        /* Função necessária para que o usuário consiga apagar a máscara do input */
        let backspace = 8
        let teclaPressionada = e.keyCode

        if(teclaPressionada === backspace){
            if(values.novo_saldo_reprogramado_custeio === 0 || values.novo_saldo_reprogramado_custeio === "R$0,00"){
                setFieldValue(`novo_saldo_reprogramado_custeio`, null);
                setDisableBtnConfirmarInferior(false);
                setOnClickBtnConfirmarInferior(false);
            }
        }
    }

    const handleOnKeyDownCapital = (setFieldValue, e, values) => {
        /* Função necessária para que o usuário consiga apagar a máscara do input */
        let backspace = 8
        let teclaPressionada = e.keyCode

        if(teclaPressionada === backspace){
            if(values.novo_saldo_reprogramado_capital === 0 || values.novo_saldo_reprogramado_capital === "R$0,00"){
                setFieldValue(`novo_saldo_reprogramado_capital`, null);
                setDisableBtnConfirmarInferior(false);
                setOnClickBtnConfirmarInferior(false);
            }
        }
    }

    const handleOnKeyDownLivreAplicacao = (setFieldValue, e, values) => {
        /* Função necessária para que o usuário consiga apagar a máscara do input */
        let backspace = 8
        let teclaPressionada = e.keyCode

        if(teclaPressionada === backspace){
            if(values.novo_saldo_reprogramado_livre === 0 || values.novo_saldo_reprogramado_livre === "R$0,00"){
                setFieldValue(`novo_saldo_reprogramado_livre`, null);
                setDisableBtnConfirmarInferior(false);
                setOnClickBtnConfirmarInferior(false);
            }
        }
    }

    const handleOnChangeNovoSaldoReprogramado = (values) => {
        setDisableBtnConfirmarInferior(false);
        setOnClickBtnConfirmarInferior(false);
    }

    const apenasLeitura = () => {
        if(prestacaoDeContas){
            if(prestacaoDeContas.status === "EM_ANALISE"){
                return false;
            }
        }
        return true;
    }

    return (
        <div> 
            <Formik
                initialValues={initialState}
                enableReinitialize={true}
                validateOnBlur={true}
                validateOnChange={true}
            >
                {props => {
                    const {
                        values,
                        errors,
                        setFieldValue
                    } = props;

                    return (
                        <>
                            <form onSubmit={props.handleSubmit}>
                                <div className="d-flex justify-content-start">
                                    <span className="ml-2 mt-2">O valor de saldo reprogramado inicial declarado pela unidade está correto?</span>
                                </div>

                                <div className="d-flex justify-content-end">
                                    <div className="form-check form-check-inline p-2 mr-auto">
                                        <input
                                            name="valor_saldo_reprogramado_correto"
                                            className={`form-check-input`}
                                            type="radio"
                                            id="valor_saldo_reprogramado_correto"
                                            value={true}
                                            checked={values.valor_saldo_reprogramado_correto}
                                            onChange={(e) => {
                                                handleOnChangeSaldoReprogramadoCorreto(setFieldValue)
                                            }}
                                            disabled={apenasLeitura()}
                                        />
                                        <label className="form-check-label" htmlFor={`valor_saldo_reprogramado_correto`}>Sim</label>

                                        <input
                                            name="valor_saldo_reprogramado_correto"
                                            className={`form-check-input ml-2`}
                                            type="radio"
                                            id="valor_saldo_reprogramado_incorreto"
                                            value={false}
                                            checked={!values.valor_saldo_reprogramado_correto}
                                            onChange={(e) => {
                                                handleOnChangeSaldoReprogramadoIncorreto(setFieldValue, values)
                                            }}
                                            disabled={apenasLeitura()}
                                        />
                                        <label className="form-check-label" htmlFor={`valor_saldo_reprogramado_incorreto`}>Não</label>
                                    </div>

                                    {showBtnConfirmarSuperior && !apenasLeitura()
                                        ?
                                            <div className="p-2">
                                                {onClickBtnConfirmarSuperior &&
                                                    <span className="mr-2">
                                                        <FontAwesomeIcon
                                                            style={{
                                                                fontSize: '17px',
                                                                marginRight: "0",
                                                                paddingRight: "4px",
                                                                color: 'green'
                                                            }}
                                                            icon={faCheck}
                                                        />
                                                        Confirmado
                                                    </span>
                                                }
                                                
                                                <button 
                                                    className="btn btn-outline-success" 
                                                    onClick={(e) => {
                                                        handleOnClickConfirmarSuperior(values)
                                                    }}
                                                    disabled={disableBtnConfirmarSuperior}
                                                >
                                                    Confirmar
                                                </button>
                                            </div>
                                        :
                                            null
                                    }
                                    
                                </div>

                                {!values.valor_saldo_reprogramado_correto
                                    ?
                                        <>
                                            <strong><span className="ml-2 texto-realize-ajuste">Insira o valor correto para que a Associação realize o ajuste.</span></strong>
                                            <table className="table table-bordered tabela-novos-valores-reprogramados border-0 mb-0 mt-2">
                                                <thead>
                                                    <tr className="tr-titulo-valores">
                                                        <th scope="col">Custeio (R$)</th>
                                                        <th scope="col">Capital (R$)</th>
                                                        <th scope="col">Livre aplicação (R$)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <CurrencyInput
                                                                allowNegative={false}
                                                                prefix='R$'
                                                                decimalSeparator=","
                                                                thousandSeparator="."
                                                                value={values.novo_saldo_reprogramado_custeio}
                                                                name="novo_saldo_reprogramado_custeio"
                                                                id="novo_saldo_reprogramado_custeio"
                                                                className="form-control"
                                                                selectAllOnFocus={true}
                                                                onChangeEvent={(e) => {
                                                                    props.handleChange(e);
                                                                    handleOnChangeNovoSaldoReprogramado();
                                                                }}
                                                                onKeyDown={(e) => handleOnKeyDownCusteio(setFieldValue, e, values)}
                                                                placeholder=' '
                                                                allowEmpty={true}
                                                                disabled={apenasLeitura()}
                                                            />
                                                        </td>

                                                        <td>
                                                            <CurrencyInput
                                                                allowNegative={false}
                                                                prefix='R$'
                                                                decimalSeparator=","
                                                                thousandSeparator="."
                                                                value={values.novo_saldo_reprogramado_capital}
                                                                name="novo_saldo_reprogramado_capital"
                                                                id="novo_saldo_reprogramado_capital"
                                                                className="form-control"
                                                                selectAllOnFocus={true}
                                                                onChangeEvent={(e) => {
                                                                    props.handleChange(e);
                                                                    handleOnChangeNovoSaldoReprogramado();
                                                                }}
                                                                onKeyDown={(e) => handleOnKeyDownCapital(setFieldValue, e, values)}
                                                                placeholder=' '
                                                                allowEmpty={true}
                                                                disabled={apenasLeitura()}
                                                            />
                                                        </td>

                                                        <td>
                                                            <CurrencyInput
                                                                allowNegative={false}
                                                                prefix='R$'
                                                                decimalSeparator=","
                                                                thousandSeparator="."
                                                                value={values.novo_saldo_reprogramado_livre}
                                                                name="novo_saldo_reprogramado_livre"
                                                                id="novo_saldo_reprogramado_livre"
                                                                className="form-control"
                                                                selectAllOnFocus={true}
                                                                onChangeEvent={(e) => {
                                                                    props.handleChange(e);
                                                                    handleOnChangeNovoSaldoReprogramado();
                                                                }}
                                                                onKeyDown={(e) => handleOnKeyDownLivreAplicacao(setFieldValue, e, values)}
                                                                placeholder=' '
                                                                allowEmpty={true}
                                                                disabled={apenasLeitura()}
                                                            />
                                                        </td>
                                                    </tr>
                                                    
                                                </tbody>
                                            </table>

                                            {showBtnConfirmarInferior && !apenasLeitura()
                                                ?
                                                    <div className="d-flex justify-content-end">
                                                        <div className="p-2 ">
                                                            {onClickBtnConfirmarInferior &&
                                                                <span className="mr-2">
                                                                    <FontAwesomeIcon
                                                                        style={{
                                                                            fontSize: '17px',
                                                                            marginRight: "0",
                                                                            paddingRight: "4px",
                                                                            color: 'green'
                                                                        }}
                                                                        icon={faCheck}
                                                                    />
                                                                    Confirmado
                                                                </span>
                                                            }
                                                            <button 
                                                                type="button" 
                                                                onClick={e => handleOnClickConfirmarInferior(values)} 
                                                                className="btn btn-outline-success"
                                                                disabled={disableBtnConfirmarInferior}
                                                            >
                                                                Confirmar
                                                            </button>
                                                        </div>
                                                    </div>
                                                :
                                                    null
                                            }
                                            
                                        </>
                                    :
                                        null
                                }
                                
                            </form>
                        </>
                    )
                }}

            </Formik>
        </div>
    )
};