import React, {memo, useCallback, useState} from "react";
import {DatePickerField} from "../../../../Globais/DatePickerField";
import './devolucao-para-acertos.scss'
import moment from "moment";
import {getConcluirAnalise} from "../../../../../services/dres/PrestacaoDeContas.service";
import {trataNumericos} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../../../utils/Loading";
import {ModalErroDevolverParaAcerto} from "./ModalErroDevolverParaAcerto";

const DevolucaoParaAcertos = ({prestacaoDeContas, analisesDeContaDaPrestacao, carregaPrestacaoDeContas}) => {
    const [dataLimiteDevolucao, setDataLimiteDevolucao] = useState('')
    const [showModalErroDevolverParaAcerto, setShowModalErroDevolverParaAcerto] = useState(false)
    const [textoErroDevolverParaAcerto, setTextoErroDevolverParaAcerto] = useState('')

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
        }

    }, [dataLimiteDevolucao, carregaPrestacaoDeContas, prestacaoDeContas, trataAnalisesDeContaDaPrestacao])


    return(
        <>
            <hr id='devolucao_para_acerto' className='mt-4 mb-3'/>
            <h4 className='mb-4'>Devolução para acertos</h4>
                {analisesDeContaDaPrestacao && analisesDeContaDaPrestacao.length > 0 ? (
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
                                    <button className="btn btn-outline-success mr-2">Ver resumo</button>
                                </div>
                                <div>
                                    <button disabled={!dataLimiteDevolucao} onClick={devolverParaAcertos}  className="btn btn-success">Devolver para Associação</button>
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