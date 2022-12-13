import React, {useEffect, useState, useContext} from "react";
import moment from "moment";
import {Link, useLocation} from "react-router-dom";
import {visoesService} from "../../../services/visoes.service";
import {getPeriodos} from "../../../services/dres/Dashboard.service";
import { SidebarLeftService } from "../../../services/SideBarLeft.service";
import { SidebarContext } from "../../../context/Sidebar";
import { useCarregaPrestacaoDeContasPorUuid } from "../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";


const TabelaAcertosEmExtratosBancarios = ({extratosBancariosAjustes, contaUuidAjustesExtratosBancarios, prestacaoDeContasUuid}) => {
    const contextSideBar = useContext(SidebarContext);
    const parametros = useLocation();
    const [uuidPeriodo, setUuidPeriodo] = useState('')
    const [expandedRows, setExpandedRows] = useState(null);
    const prestacaoDeContas = useCarregaPrestacaoDeContasPorUuid(prestacaoDeContasUuid)

    useEffect(() => {
        if(parametros && parametros.state && parametros.state.periodoFormatado){
            async function getPeriodoPorUuid(){
                let periodos = await getPeriodos();
                const uuidPeriodo = await periodos.find(periodo => periodo.referencia === parametros.state?.periodoFormatado?.referencia)?.uuid
                setUuidPeriodo(uuidPeriodo)
            }

            getPeriodoPorUuid()
        }
        else if(prestacaoDeContas && prestacaoDeContas.periodo_uuid){
            setUuidPeriodo(prestacaoDeContas.periodo_uuid)
        }
    }, [parametros, prestacaoDeContas])

    useEffect(() => {
        localStorage.setItem('periodoContaAcertosEmExtratosBancarios', JSON.stringify({'periodo': uuidPeriodo, 'conta': contaUuidAjustesExtratosBancarios}))
        localStorage.setItem('periodoConta', JSON.stringify({'periodo': uuidPeriodo, 'conta': contaUuidAjustesExtratosBancarios}))
    }, [uuidPeriodo, contaUuidAjustesExtratosBancarios])

    const formataValor = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        return valor_formatado;
    }

    const irParaConciliacaoBancaria = async() => {
        // Ao setar para false, quando a função a seguir setar o click do item do menu
        // a pagina não ira automaticamente para a url do item

        await contextSideBar.setIrParaUrl(false)
        SidebarLeftService.setItemActive("detalhe_das_prestacoes")

        // Necessário voltar o estado para true, para clicks nos itens do menu continuarem funcionando corretamente
        contextSideBar.setIrParaUrl(true)
    }

    return(
        <>
            {extratosBancariosAjustes ? (
                <>
                <div className="row mt-2">
                    {extratosBancariosAjustes.data_extrato &&
                    <div className="col-lg-4">
                        <strong><p className="text-saldo-reprogramado">Ajuste da data do extrato</p></strong>
                        <p>{moment(extratosBancariosAjustes.data_extrato).format('DD/MM/YYYY')}</p>
                    </div>
                    }
                    {extratosBancariosAjustes.saldo_extrato &&
                    <div className="col-lg-4">
                        <strong><p className="text-saldo-reprogramado">Ajuste no saldo do extrato</p></strong>
                        <p>{formataValor(extratosBancariosAjustes.saldo_extrato)}</p>
                    </div>
                    }
                </div>
                {visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'UE' &&
                    <Link
                        to={{pathname: `/detalhe-das-prestacoes`,
                        state: {
                            origem: 'ir_para_conciliacao_bancaria',
                            periodoFormatado: parametros && parametros.state && parametros.state.periodoFormatado ? parametros.state.periodoFormatado : "",
                            prestacaoDeContasUuid: prestacaoDeContasUuid
                        }
                        }}
                    className="btn btn-outline-success mr-2"
                    onClick={irParaConciliacaoBancaria}
                    >
                        Ir para conciliação bancária
                    </Link>
                }
            </>
            ):
                <p className='text-center fonte-18 mt-4'><strong>Não existem acertos para serem exibidos</strong></p>
            }
        </>
    )
}
export default TabelaAcertosEmExtratosBancarios;