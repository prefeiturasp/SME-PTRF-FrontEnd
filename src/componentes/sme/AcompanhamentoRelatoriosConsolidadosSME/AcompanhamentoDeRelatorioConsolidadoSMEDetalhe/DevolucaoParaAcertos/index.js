import React, {useCallback, useState} from "react"
import {DatePickerField} from "../../../../Globais/DatePickerField";
import {Link} from "react-router-dom";
import {ModalConfirmaDevolverParaAcerto} from "./ModalConfirmaDevolverParaAcerto";
import moment from "moment";
import {devolverConsolidado} from '../../../../../services/dres/RelatorioConsolidado.service'
import {toastCustom} from "../../../../Globais/ToastCustom";

const DevolucaoParaAcertos = ({relatorioConsolidado, refreshConsolidado, disableBtnVerResumo}) => {
    const [dataLimiteDevolucao, setDataLimiteDevolucao] = useState('')
    const [showModalConfirmaDevolverParaAcerto, setShowModalConfirmaDevolverParaAcerto] = useState(false)
    const [botaoDevolverParaAcertoDisabled, setBotaoDevolverParaAcertoDisabled] = useState(false)

    const handleChangeDataLimiteDevolucao = (name, value) => {
        setDataLimiteDevolucao(value)
    }

    const devolverParaAcertos = useCallback(async () =>{
        setBotaoDevolverParaAcertoDisabled(true)
        setShowModalConfirmaDevolverParaAcerto(false)
        await devolverConsolidado(relatorioConsolidado.uuid)
        setBotaoDevolverParaAcertoDisabled(false)
        toastCustom.ToastCustomSuccess('Status alterado com sucesso', 'O relatório foi alterado para "devolvido para acertos".')
        refreshConsolidado()
    }, [dataLimiteDevolucao, relatorioConsolidado])

    return (
        <>
            <hr id='devolucao_para_acertos' className='mt-4 mb-3'/>
            <h4 className='mb-4'>Devolução para acertos</h4>
            <p className='mt-4'>Para enviar os apontamentos à DRE, selecione o prazo e clique em "Devolver para a DRE".</p>
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
                        disabled={!relatorioConsolidado.permite_edicao || botaoDevolverParaAcertoDisabled}
                        minDate={new Date(moment())}
                    />
                </div>
                <div>
                    <Link
                        onClick={ null }
                        to={{}}
                        className="btn btn-outline-success mr-2"
                        disabled={disableBtnVerResumo()}
                        readOnly={disableBtnVerResumo()}
                    >
                        Ver resumo
                    </Link>
                </div>
                <div>
                    <button
                        disabled={!dataLimiteDevolucao || !relatorioConsolidado.permite_edicao || botaoDevolverParaAcertoDisabled}
                        onClick={() => setShowModalConfirmaDevolverParaAcerto(true)}
                        className="btn btn-success"
                    >
                        Devolver para DRE
                    </button>
                </div>
            </div>
            <section>
                <ModalConfirmaDevolverParaAcerto
                    show={showModalConfirmaDevolverParaAcerto}
                    handleClose={() => setShowModalConfirmaDevolverParaAcerto(false)}
                    onDevolverParaAcertoTrue={devolverParaAcertos}
                    titulo="Devolver para acertos"
                    texto='<p>O relatório consolidado será movido para o status de ”Relatórios devolvidos para acertos” e ficará nesse status até que seja retornado para em análise.</p> <p>A DRE será notificada sobre a "Devolução para acertos" desse relatório consolidado.</p><p> Deseja continuar?</p>'
                    primeiroBotaoTexto="Cancelar"
                    primeiroBotaoCss="outline-success"
                    segundoBotaoCss="success"
                    segundoBotaoTexto="Devolver para a DRE"
                />
            </section>
        </>
    )
}

export default DevolucaoParaAcertos
