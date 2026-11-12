import React from "react";
import { barraMensagemCustom } from "../../Globais/BarraMensagem";


export const PresidenteAusente = ({statusPC}) => {
    const formataCargoSubstituto = (cargo) => {
        if (!cargo) {
            return "";
        }
        const semSufixo = cargo.replace(/\s+da diretoria executiva/i, "").trim();
        if (/^vogal(?:\s+\d+)?$/i.test(semSufixo)) {
            return "Vogal";
        }
        return semSufixo;
    }

    const statusPrestacao = statusPC && statusPC.prestacao_contas_status;
    const cargoValue = statusPrestacao && statusPrestacao.cargo_substituto_presidente_ausente_value;
    const mensagem = `O Presidente da Diretoria Executiva consta como ausente. O Demonstrativo Financeiro e a Relação de Bens serão gerados com os campos de assinatura habilitados para o ${formataCargoSubstituto(cargoValue)} da Diretoria Executiva.`

    const exibeBarraMensagem = () => {
        if (statusPrestacao && statusPrestacao.documentos_gerados && statusPrestacao.status_presidente === "AUSENTE") {
            return true;
        }
        return false;
    }

    return(
        <>
            { exibeBarraMensagem()
                ?
                    barraMensagemCustom.BarraMensagemSucessAzul(mensagem)

                :
                    null
            }
        </>
    )
};
