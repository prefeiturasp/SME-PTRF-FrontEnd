import React, {memo, useCallback, useEffect, useState, useMemo} from "react";
import {Link} from "react-router-dom";
import {DatePickerField} from "../../../../Globais/DatePickerField";
import './devolucao-para-acertos.scss'
import moment from "moment";
import {getConcluirAnalise, getLancamentosAjustes, getDocumentosAjustes} from "../../../../../services/dres/PrestacaoDeContas.service";
import {trataNumericos} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../../../utils/Loading";
import {ModalErroDevolverParaAcerto} from "./ModalErroDevolverParaAcerto";

const DevolucaoParaAcertos = ({prestacaoDeContas, analisesDeContaDaPrestacao, carregaPrestacaoDeContas, infoAta}) => {

    const [dataLimiteDevolucao, setDataLimiteDevolucao] = useState('')
    const [showModalErroDevolverParaAcerto, setShowModalErroDevolverParaAcerto] = useState(false)
    const [textoErroDevolverParaAcerto, setTextoErroDevolverParaAcerto] = useState('')
    const [lancamentosAjustes, setLancamentosAjustes] = useState([])
    const [documentosAjustes, setDocumentosAjustes] = useState([])
    const [loading, setLoading] = useState(true)
    const [btnDevolverParaAcertoDisabled, setBtnDevolverParaAcertoDisabled] = useState(false)

    // Quando a state de listaDeFornecedores sofrer alteração
    const totalLancamentosAjustes = useMemo(() => lancamentosAjustes.length, [lancamentosAjustes]);
    const totalDocumentosAjustes = useMemo(() => documentosAjustes.length, [documentosAjustes]);

    useEffect(()=>{

        let mounted = true;

        const verificaSeTemSolicitacaoAcertos = async () =>{
            if (prestacaoDeContas && prestacaoDeContas.analise_atual && prestacaoDeContas.analise_atual.uuid && infoAta && infoAta.contas && infoAta.contas.length > 0){
                let analise_atual_uuid = prestacaoDeContas.analise_atual.uuid
                if (mounted) {
                    return await infoAta.contas.map(async (conta) => {
                        let lancamentos_ajustes = await getLancamentosAjustes(analise_atual_uuid, conta.conta_associacao.uuid)
                        setLancamentosAjustes(prevState => ([...prevState, ...lancamentos_ajustes]))
                        let documentos_ajustes = await getDocumentosAjustes(analise_atual_uuid, conta.conta_associacao.uuid)
                        setDocumentosAjustes([...documentos_ajustes])
                    })
                }
            }
        }
        verificaSeTemSolicitacaoAcertos()
        setLoading(false)

        return () =>{
            mounted = false;
        }

    }, [infoAta, prestacaoDeContas])

    const handleChangeDataLimiteDevolucao = useCallback((name, value) => {
        setDataLimiteDevolucao(value)
    }, [])

    const trataAnalisesDeContaDaPrestacao = useCallback(() => {
        let analises = [...analisesDeContaDaPrestacao]

        analises.forEach(item => {
            item.data_extrato = item.data_extrato ?  moment(item.data_extrato).format("YYYY-MM-DD") : null;
            item.saldo_extrato = item.saldo_extrato ? trataNumericos(item.saldo_extrato) : 0;

        })
        return analises
    }, [analisesDeContaDaPrestacao])

    const devolverParaAcertos = useCallback(async () =>{
        setBtnDevolverParaAcertoDisabled(true)
        let analises = trataAnalisesDeContaDaPrestacao()
        let payload={
            devolucao_tesouro: false,
            analises_de_conta_da_prestacao: analises,
            resultado_analise: "DEVOLVIDA",
            data_limite_ue: moment(dataLimiteDevolucao).format("YYYY-MM-DD"),
            devolucoes_ao_tesouro_da_prestacao:[]
        }
        try {
            await getConcluirAnalise(prestacaoDeContas.uuid, payload);
            console.log("Devolução para acertos concluída com sucesso!")
            await carregaPrestacaoDeContas();
        }catch (e){
            console.log("Erro ao Devolver para Acerto ", e.response)
            if (e.response.data.mensagem){
                setTextoErroDevolverParaAcerto(e.response.data.mensagem)
            }else {
                setTextoErroDevolverParaAcerto('Erro ao devolver para acerto!')
            }
            setShowModalErroDevolverParaAcerto(true)
            setBtnDevolverParaAcertoDisabled(false)
        }

    }, [dataLimiteDevolucao, carregaPrestacaoDeContas, prestacaoDeContas, trataAnalisesDeContaDaPrestacao])

    return(
        <>
            <hr className='mt-4 mb-3'/>
            <h4  id='devolucao_para_acerto' className='mb-4'>Devolução para acertos</h4>
                {analisesDeContaDaPrestacao && analisesDeContaDaPrestacao.length > 0 && !loading  ? (
                        <>
                            <p className='mt-4'>Caso deseje enviar todos esses apontamentos a Associação, determine o prazo e clique em "Devolver para a Associação".</p>
                            <div className="d-flex mt-4">
                                <div className="flex-grow-1">
                                    <span className='mr-2'>Prazo para reenvio:</span>
                                    <DatePickerField
                                        value={dataLimiteDevolucao}
                                        onChange={handleChangeDataLimiteDevolucao}
                                        name='data_limite_devolucao'
                                        type="date"
                                        className="form-control datepicker-devolucao-para-acertos"
                                        wrapperClassName="container-datepicker-devolucao-para-acertos"
                                    />
                                </div>
                                <div>
                                    <Link onClick={ totalLancamentosAjustes <= 0 && totalDocumentosAjustes <= 0 ? (event) => event.preventDefault() : null }
                                        to={{
                                            pathname: `/dre-detalhe-prestacao-de-contas-resumo-acertos/${prestacaoDeContas.uuid}`,
                                            state: {
                                                analisesDeContaDaPrestacao: analisesDeContaDaPrestacao,
                                                totalLancamentosAjustes: totalLancamentosAjustes,
                                                totalDocumentosAjustes: totalDocumentosAjustes,
                                            }
                                        }}
                                        className="btn btn-outline-success mr-2"
                                        disabled={totalLancamentosAjustes <= 0 && totalDocumentosAjustes <= 0}
                                        readOnly={totalLancamentosAjustes <= 0 && totalDocumentosAjustes <= 0}
                                    >
                                        Ver resumo
                                    </Link>
                                </div>
                                <div>
                                    <button
                                        disabled={!dataLimiteDevolucao || btnDevolverParaAcertoDisabled}
                                        onClick={devolverParaAcertos}
                                        className="btn btn-success"
                                    >
                                        Devolver para Associação
                                    </button>
                                </div>
                            </div>
                            <section>
                                <ModalErroDevolverParaAcerto
                                    show={showModalErroDevolverParaAcerto}
                                    handleClose={() => setShowModalErroDevolverParaAcerto(false)}
                                    titulo='Devolução para acerto não permitida'
                                    texto={textoErroDevolverParaAcerto}
                                    primeiroBotaoTexto="Fechar"
                                    primeiroBotaoCss="success"
                                />
                            </section>
                        </>
                    ):
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                }
        </>
    )
}

export default memo(DevolucaoParaAcertos)