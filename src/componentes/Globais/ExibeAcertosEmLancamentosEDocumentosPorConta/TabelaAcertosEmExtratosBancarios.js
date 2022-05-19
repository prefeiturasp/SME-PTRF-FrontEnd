import React, {useState} from "react";
import moment from "moment";

const TabelaAcertosEmExtratosBancarios = ({extratosBancariosAjustes}) => {

    const [expandedRows, setExpandedRows] = useState(null);

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
                        <strong><p className="text-saldo-reprogramado">Data Extrato</p></strong>
                        <p>{moment(extratosBancariosAjustes.data_extrato).format('DD/MM/YYYY')}</p>
                    </div>
                    }
                    {extratosBancariosAjustes.saldo_extrato &&
                    <div className="col-lg-4">
                        <strong><p className="text-saldo-reprogramado">Saldo Extrato</p></strong>
                        <p>{formataValor(extratosBancariosAjustes.saldo_extrato)}</p>
                    </div>
                    }
                </div>
            ):
                <p className='text-center fonte-18 mt-4'><strong>Não existem ajustes para serem exibidos</strong></p>
            }
        </>
    )
}
export default TabelaAcertosEmExtratosBancarios;