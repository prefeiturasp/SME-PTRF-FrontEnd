import React, {useState} from "react";

const TabelaAcertosEmExtratosBancarios = ({extratosBancariosAjustes}) => {

    const [expandedRows, setExpandedRows] = useState(null);

    const formataValor = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        return valor_formatado;
    }

    console.log('Ajustes: ===>', extratosBancariosAjustes)
    return(
        <>
            {extratosBancariosAjustes ? (
                <div>
                    <p>{extratosBancariosAjustes.data_extrato}</p>
                    <p>{extratosBancariosAjustes.saldo_extrato}</p>
                </div>
            // <div className="row mt-2">
            //     {data.novo_saldo_reprogramado_capital &&
            //         <div className="col-lg-4">
            //             <strong><p className="text-saldo-reprogramado">Saldo Reprogramado Capital</p></strong>
            //             <p>{formataValor(data.novo_saldo_reprogramado_capital)}</p>
            //         </div>
            //     }
            //
            //     {data.novo_saldo_reprogramado_custeio &&
            //         <div className="col-lg-4">
            //             <strong><p className="text-saldo-reprogramado">Saldo Reprogramado Custeio</p></strong>
            //             <p>{formataValor(data.novo_saldo_reprogramado_custeio)}</p>
            //         </div>
            //     }
            //
            //     {data.novo_saldo_reprogramado_livre &&
            //         <div className="col-lg-4">
            //             <strong><p className="text-saldo-reprogramado">Saldo Reprogramado Livre</p></strong>
            //             <p>{formataValor(data.novo_saldo_reprogramado_livre)}</p>
            //         </div>
            //     }
            // </div>
            ):
                <p className='text-center fonte-18 mt-4'><strong>Não existem ajustes para serem exibidos</strong></p>
            }
        </>
    )
}
export default TabelaAcertosEmExtratosBancarios;