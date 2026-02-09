import React from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Loading from "../../../../../../utils/Loading";
import {Paginator} from 'primereact/paginator';
import "./style.scss"; 
import { Tag } from '../../../../../Globais/Tag';
import { useNavigate } from 'react-router-dom';
import { EditIconButton } from '../../../../../Globais/UI/Button';


export const Lista = ({isLoading, tiposDeCredito, count, firstPage, onPageChange}) => {
    const navigate = useNavigate();

    const handleEditFormModal = (rowData) => {
        
        navigate(`/edicao-tipo-de-credito/${rowData.uuid}`);
    };

    const acoesTemplate = (rowData) => {
        return (
            <EditIconButton
                onClick={() => handleEditFormModal(rowData)}
            />
        )
    };

    const bodyAceita = (rowData) => {
        const { aceita_capital, aceita_custeio, aceita_livre } = rowData;

        const capital = aceita_capital ? "Capital" : "";
        const custeio = aceita_custeio ? "Custeio" : "";
        const livre = aceita_livre ? "Livre Aplicação" : "";

        return [capital, custeio, livre].filter(Boolean).join("\n");
    };

    const bodyConta = (rowData) => {
        if (rowData.tipos_conta && rowData.tipos_conta.length > 0) {
            return rowData.tipos_conta.map(tipo => tipo.nome).join("\n");
        }
        return "";
    };

    const bodyUnidadeContempladas = (rowData) => {
        if (rowData.todas_unidades_selecionadas) {
            return <Tag label="Total" color="todas" />;
        }
        return <Tag label="Parcial" color="parcial" />;
    };

    const bodyTipo = (rowData) => {
        if (rowData.e_repasse) {
            return "Repasse";
        } else if (rowData.e_estorno) {
            return "Estorno";
        } else if (rowData.e_devolucao) {
            return "Devolução";
        } else if (rowData.e_recursos_proprios) {
            return "Recursos Próprios";
        } else if (rowData.e_rendimento) {
            return "Rendimento";
        }
        return "";
    };

    if (isLoading) {
        return (
            <Loading
                corGrafico="black"
                corFonte="dark"
                marginTop="0"
                marginBottom="0"
            />
        );
    }
    return (
        <>
            {!isLoading && tiposDeCredito && tiposDeCredito.length > 0 ? (
              <>
                  <p className='pl-2 mb-0'>Exibindo <span className='total'>{count}</span> tipos de crédito</p>
                  <div className="p-2">
                      <DataTable
                          value={tiposDeCredito}
                          className='tabela-lista-tipos-de-credito'
                      >
                          <Column
                              field="nome"
                              header="Nome"
                          />
                          <Column
                              body={bodyTipo}
                              header="Tipo"
                          />
                          <Column
                              body={bodyAceita}
                              header="Aceita"
                          />
                          <Column
                              body={bodyConta}
                              header="Conta"
                          />
                          <Column
                              body={bodyUnidadeContempladas}
                              header="Uso associação"
                          />
                          <Column
                              field="acao"
                              header="Ação"
                              body={acoesTemplate}
                              style={{width: '10%', textAlign: "center",}}
                          />
                      </DataTable>
                  </div>
                  <Paginator
                      first={firstPage}
                      rows={20}
                      totalRecords={count}
                      template="PrevPageLink PageLinks NextPageLink"
                      onPageChange={onPageChange}
                  />
                </>
                ) :
                <div className="p-2">
                    <p><strong>Nenhum resultado encontrado.</strong></p>
                </div>
            }
        </>
    )
}