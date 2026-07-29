/* Checagem de período fechado (documento e impostos). */
import moment from "moment";
import {getPeriodoFechado} from "../../../../../services/escolas/Associacao.service";

export const periodoFechado = async (data, setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral) =>{
  data = moment(data, "YYYY-MM-DD").format("YYYY-MM-DD");
  try {
    let periodo_fechado = await getPeriodoFechado(data);

    if (!periodo_fechado.aceita_alteracoes){
      setReadOnlyBtnAcao(true);
      setShowPeriodoFechado(true);
      setReadOnlyCampos(true);
    }else {
      setReadOnlyBtnAcao(false);
      setShowPeriodoFechado(false);
      setReadOnlyCampos(false);
    }
  }
  catch (e) {
    setReadOnlyBtnAcao(true);
    setShowPeriodoFechado(true);
    setReadOnlyCampos(true);
    onShowErroGeral();
    console.log("Erro ao buscar perído ", e)
  }
}

export const periodoFechadoImposto = async (despesas_impostos, setReadOnlyBtnAcao, setShowPeriodoFechadoImposto, setReadOnlyCamposImposto, setDisableBtnAdicionarImposto, onShowErroGeral) =>{  
  for(let despesa_imposto = 0; despesa_imposto <= despesas_impostos.length-1; despesa_imposto++){
    if(despesas_impostos[despesa_imposto].data_transacao){
      let data = moment(despesas_impostos[despesa_imposto].data_transacao, "YYYY-MM-DD").format("YYYY-MM-DD");

      try{
        let periodo_fechado = await getPeriodoFechado(data);
        if (!periodo_fechado.aceita_alteracoes){
          setReadOnlyBtnAcao(true);
          setShowPeriodoFechadoImposto(true);
          setReadOnlyCamposImposto(prevState => ({...prevState, [despesa_imposto]: true}));
          setDisableBtnAdicionarImposto(true);
        }
        else{
          setReadOnlyBtnAcao(false);
          setShowPeriodoFechadoImposto(false);
          setReadOnlyCamposImposto(prevState => ({...prevState, [despesa_imposto]: false}));
          setDisableBtnAdicionarImposto(false);
        }
      }
      catch (e){
        setReadOnlyBtnAcao(true);
        setShowPeriodoFechadoImposto(true);
        setReadOnlyCamposImposto(prevState => ({...prevState, [despesa_imposto]: true}));
        setDisableBtnAdicionarImposto(true);
        onShowErroGeral();
        console.log("Erro ao buscar perído ", e)
      }
    }
  }
}

