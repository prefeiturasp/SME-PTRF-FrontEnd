import {getPeriodos} from "../../../services/dres/Dashboard.service";
import {exibeDataPT_BR} from "../../../utils/ValidacoesAdicionaisFormularios";
import {getTiposConta} from "../../../services/dres/RelatorioConsolidado.service";

const nomePeriodo = async (periodo_uuid) =>{
    if (periodo_uuid){
        let periodos = await getPeriodos();
        if (periodos.length > 0 ){
            let periodo_obj = periodos.find(element => element.uuid === periodo_uuid);
            let periodo_nome;
            periodo_nome = periodo_obj.referencia + " - ";
            periodo_nome += periodo_obj.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo_obj.data_inicio_realizacao_despesas) : "-";
            periodo_nome += " até ";
            periodo_nome += periodo_obj.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo_obj.data_fim_realizacao_despesas) : "-";
            return periodo_nome
        }
    }
};

const nomeConta = async (conta_uuid)=>{
    try {
        let tipo_contas = await getTiposConta();
        if (tipo_contas && tipo_contas.length > 0){
            let tipo_conta_obj = tipo_contas.find(element => element.uuid === conta_uuid);
            return tipo_conta_obj.nome
        }
    }catch (e) {
        console.log("Erro ao trazer os tipos de contas ", e);
    }
};

export const auxGetNomes = {
    nomePeriodo,
    nomeConta,
};