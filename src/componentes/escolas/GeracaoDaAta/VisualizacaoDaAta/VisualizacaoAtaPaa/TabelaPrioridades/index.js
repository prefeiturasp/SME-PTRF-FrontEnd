import React from 'react';
import { formatMoneyBRL } from '../../../../../../utils/money';

export const TabelaPrioridades = ({ titulo, prioridades, total }) => {
  if (!prioridades || prioridades.length === 0) {
    return null;
  }

  const getRecurso = (prioridade) => {
    console.log('prioridade: ', prioridade)

    // Para PTRF
    if (prioridade?.acao_associacao_objeto?.nome) {
      return prioridade.acao_associacao_objeto.nome;
    }
    // Para PDDE - pode ter programa e ação
    if (prioridade?.recurso === "PDDE" || prioridade?.recurso_tipo === "PDDE") {
      if (prioridade?.programa_pdde_objeto?.nome && prioridade?.acao_pdde_objeto?.nome) {
        return `${prioridade.programa_pdde_objeto.nome} - ${prioridade.acao_pdde_objeto.nome}`;
      }
      if (prioridade?.programa_pdde_objeto?.nome) {
        return prioridade.programa_pdde_objeto.nome;
      }
      if (prioridade?.acao_pdde_objeto?.nome) {
        return prioridade.acao_pdde_objeto.nome;
      }
    }
    //Outros recursos
    if(prioridade?.recurso === "OUTRO_RECURSO" || prioridade?.recurso_tipo === "OUTRO_RECURSO") {        
        return prioridade?.outro_recurso_objeto?.nome;
    }
    
    // Para Recursos Próprios
    if (prioridade?.recurso === "RECURSO_PROPRIO" || prioridade?.recurso_tipo === "RECURSO_PROPRIO") {
      return "Recursos Próprios";
    }

    
    
    return "-";
  };

  const getTipoAplicacao = (prioridade) => {
    return prioridade?.tipo_aplicacao_objeto?.value || "-";
  };

  const getTipoDespesa = (prioridade) => {
    return prioridade?.tipo_despesa_custeio_objeto?.nome || "-";
  };

  const getEspecificacao = (prioridade) => {
    return prioridade?.especificacao_material_objeto?.nome || "-";
  };

  const getValorTotal = (prioridade) => {
    return prioridade?.valor_total ? formatMoneyBRL(prioridade.valor_total) : "-";
  };

  return (
    <div className="col-12 mt-4">
      <h4 className="mb-3" style={{ fontWeight: 'bold', color: '#42474A' }}>
        {titulo}
      </h4>
      <table className="table table-bordered" style={{ width: '100%' }}>
        <thead style={{ backgroundColor: '#dadada' }}>
          <tr>
            <th style={{ width: '20%' }}>Recursos</th>
            <th style={{ width: '20%' }}>Tipo de aplicação</th>
            <th style={{ width: '20%' }}>Tipo de despesa</th>
            <th style={{ width: '30%' }}>Especificação do bem, material ou serviço</th>
            <th style={{ width: '10%', textAlign: 'right' }}>Valor Total</th>
          </tr>
        </thead>
        <tbody>
          {prioridades.map((prioridade, index) => (
            <tr key={prioridade.uuid || index}>
              <td>{getRecurso(prioridade)}</td>
              <td>{getTipoAplicacao(prioridade)}</td>
              <td>{getTipoDespesa(prioridade)}</td>
              <td>{getEspecificacao(prioridade)}</td>
              <td style={{ textAlign: 'right' }}>{getValorTotal(prioridade)}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
            <td>TOTAL</td>
            <td></td>
            <td></td>
            <td></td>
            <td style={{ textAlign: 'right' }}>{formatMoneyBRL(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

