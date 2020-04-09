import React, {useEffect, useState} from "react";
import {getDespesasTabelas, getEspecificacoesCusteio} from "../../../services/Despesas.service";

export const FormFiltrosAvancados = () =>{
    const [despesasTabelas, setDespesasTabelas] = useState([])
    useEffect(() => {
        const carregaTabelasDespesas = async () => {
            const resp = await getDespesasTabelas();
            setDespesasTabelas(resp);
        };
        carregaTabelasDespesas();

    }, [])
    return (
      <>
          <form>
              <div className="form-row">
                  <div className="form-group col-md-6">
                      <label htmlFor="filtrar_por_termo">Filtrar por um termo</label>
                      <input name="filtrar_por_termo" id="filtrar_por_termo" type="text" className="form-control" placeholder="Escreva o termo que deseja filtrar"/>
                  </div>
                  <div className="form-group col-md-6">
                      <label htmlFor="acao_associacao">Filtrar por ação</label>
                      <select name="acao_associacao" id="acao_associacao" className="form-control">
                          <option key={0} value="">Selecione uma ação</option>
                          {despesasTabelas.acoes_associacao && despesasTabelas.acoes_associacao.map(item => (
                              <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                          ))}
                      </select>
                  </div>
                  <div className="form-group col-md-6">
                      <label htmlFor="acao_associacao">Filtrar por tipo de aplicação</label>
                      <select name="aplicacao_recurso" id="aplicacao_recurso" className="form-control">
                          <option key={0} value="">Selecione um tipo</option>
                          {despesasTabelas.tipos_aplicacao_recurso && despesasTabelas.tipos_aplicacao_recurso.map(item => (
                              <option key={item.id} value={item.id}>{item.nome}</option>
                          ))}
                      </select>
                  </div>
                  <div className="form-group col-md-6">
                      <label htmlFor="despesa_status">Filtrar por status</label>
                      <select name="despesa_status" id="despesa_status" className="form-control">
                          <option key={0} value="">Selecione status</option>
                          <option key="COMPLETO" value="COMPLETO">Completo</option>
                          <option key="INCOMPLETO" value="INCOMPLETO">Incompleto</option>
                      </select>
                  </div>
              </div>

          </form>
      </>
    );
}