import React, {useEffect, useState} from "react";
import moment from "moment";
import {Link, useLocation} from "react-router-dom";
import {getPeriodos} from "../../../services/dres/Dashboard.service";


const TabelaAcertosEmExtratosBancarios = ({extratosBancariosAjustes, contaUuid}) => {
    const parametros = useLocation();
    const [uuidPeriodo, setUuidPeriodo] = useState('')
    const [expandedRows, setExpandedRows] = useState(null);

    useEffect(() => {
        async function getPeriodoPorUuid(){
            let periodos = await getPeriodos();
            const uuidPeriodo = await periodos.find(periodo => periodo.referencia === parametros.state?.periodoFormatado?.referencia)?.uuid
            setUuidPeriodo(uuidPeriodo)
        }
        getPeriodoPorUuid()
    }, [])

    useEffect(() => {
        localStorage.setItem('periodoConta', JSON.stringify({'periodo': uuidPeriodo, 'conta': contaUuid}))
    }, [uuidPeriodo, contaUuid])

    const formataValor = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        return valor_formatado;
    }

    return(
        <>
            {extratosBancariosAjustes ? (
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
            ):
                <p className='text-center fonte-18 mt-4'><strong>Não existem ajustes para serem exibidos</strong></p>
            }
        <Link
            to={{
                pathname: `/detalhe-das-prestacoes`,
            }}
            className="btn btn-outline-success"
        >
            Ir para conciliação bancária
        </Link>
        </>
    )
}
export default TabelaAcertosEmExtratosBancarios;