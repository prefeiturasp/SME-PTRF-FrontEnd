import React, {useState, useEffect} from "react";
import { ASSOCIACAO_UUID } from "../../../services/auth.service";
import { getStatusPresidente } from "../../../services/escolas/PrestacaoDeContas.service";
import { barraMensagemCustom } from "../../Globais/BarraMensagem";


export const PresidenteAusente = ({statusPC}) => {
    const [statusPresidente, setStatusPresidente] = useState("");
    
    const formataCargoSubstituto = (cargo) => {
        if(cargo){
            let index = cargo.indexOf(" da diretoria executiva");
            if(index === -1){
                return cargo;
            }
            else{
                let cargo_formatado = cargo.substring(0, index)
                return cargo_formatado;
            }
        }
        return ""        
    }

    let mensagem = `O presidente da Diretoria Executiva consta como ausente. O Demonstrativo Financeiro e a Relação de Bens serão gerados com os campos de assinatura habilitados para o ${formataCargoSubstituto(statusPresidente.cargo_substituto_presidente_ausente_value)} da Diretoria Executiva. Caso o presidente esteja presente, altere o status de ocupação do cargo na tela dos membros da Associação.`
    let uuid_associacao = localStorage.getItem(ASSOCIACAO_UUID);


    useEffect(() => {
        getStatusPresidenteAssociacao();
    }, []);


    const getStatusPresidenteAssociacao = async () => {
        let dados = await getStatusPresidente(uuid_associacao);
        setStatusPresidente(dados)
    };

    const exibeBarraMensagem = () => {
        if(statusPC && statusPC.prestacao_contas_status && !statusPC.prestacao_contas_status.documentos_gerados){
            if(statusPresidente && statusPresidente.status_presidente === "AUSENTE"){
                return true;
            }
            return false;
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