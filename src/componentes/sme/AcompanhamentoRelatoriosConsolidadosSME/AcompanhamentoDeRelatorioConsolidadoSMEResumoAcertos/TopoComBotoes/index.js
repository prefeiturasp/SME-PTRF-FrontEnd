import React, {useState, useCallback, useEffect} from 'react';
import {Button} from 'react-bootstrap';
import {useHistory} from 'react-router-dom'
import {ModalConfirmaDevolverParaAcerto} from "../../.././../../componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/DevolucaoParaAcertos/ModalConfirmaDevolverParaAcerto";
import {devolverConsolidado} from '../../../../../services/dres/RelatorioConsolidado.service'
import { toastCustom } from "../../../../Globais/ToastCustom";
import './styles.scss'

export const TopoComBotoes = ({relatorioConsolidado, dataLimiteDevolucao}) => {
    const [showModalConfirmaDevolverParaAcerto, setShowModalConfirmaDevolverParaAcerto] = useState(false)
    const [loading, setLoading] = useState(null);

    const devolverParaAcertos = useCallback(async () =>{
        setLoading(true);
        setShowModalConfirmaDevolverParaAcerto(false)
        await devolverConsolidado(relatorioConsolidado.uuid, dataLimiteDevolucao)
        toastCustom.ToastCustomSuccess('Status alterado com sucesso', 'O relatório foi alterado para "devolvido para acertos".')
        setLoading(false)
        document.location.reload()
    }, [dataLimiteDevolucao, relatorioConsolidado, setLoading])

    let history = useHistory();

    return (
        <>
            <div className='d-flex justify-content-between'>
                <h2 className='text-resumo'>
                    Resumo de acertos
                </h2>
                <div className="container-botoes">
                    <Button variant="outline-success"
                        onClick={
                            () => history.push('/analises-relatorios-consolidados-dre/')
                    }>
                        Voltar
                    </Button>
                    <Button variant="success"
                        onClick={
                            e => setShowModalConfirmaDevolverParaAcerto(true)
                        }
                        disabled={
                            relatorioConsolidado ?. status_sme !== 'EM_ANALISE' || !dataLimiteDevolucao
                    }>
                        Devolver para DRE
                    </Button>
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
