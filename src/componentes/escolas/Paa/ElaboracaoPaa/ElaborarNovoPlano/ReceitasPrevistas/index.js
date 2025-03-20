import React, { Fragment, useCallback, useState } from 'react';
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import { Checkbox, Flex, Form, Spin, Tooltip } from 'antd';
import { IconButton } from '../../../../../Globais/UI';
import { useGetTabelasReceitas } from './hooks/useGetTabelasReceitas';
import "./style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const ReceitasPrevistas = () => {
  const [activeTab, setActiveTab] = useState("Receitas Previstas");
  const { data, isLoading } = useGetTabelasReceitas()

  const tabs = ["Receitas Previstas", "Detalhamento de recursos próprios"]

  const dataTemplate = useCallback((rowData, column) => {
      return (
          <div className='text-right'>
              __
          </div>
      )
  }, []);

  const nomeTemplate = useCallback((rowData, column) => {
    return (
        <span style={{color: '#00585E'}} className='font-weight-bold'>{rowData.nome}</span>
    )
  }, []);

  const acoesTemplate = (rowData) => {
      return (
          !rowData["fixed"] === true ? (
            <IconButton
              icon="faEdit"
              iconProps={{style: {fontSize: '20px', marginRight: "0", color: "#00585E"}}}
              aria-label="Editar"
          />
          ) : null
      )
  }
   
  const rowClassName = (rowData) => {
    return 'inactive-row';
  };

  return (
    <div>
      <nav className="nav mb-4 mt-4 menu-interno">
          {tabs.map((tab, index) =>
              <Fragment key={index}>
                  <li className="nav-item">
                      <button
                          className={`nav-link btn-escolhe-acao mr-3 ${activeTab === tab && 'btn-escolhe-acao-active'}`}
                          onClick={() => setActiveTab(tab)}
                      >
                          {tab}
                      </button>
                  </li>
              </Fragment>
          )}
      </nav>
      {
        activeTab === tabs[0] ? (
          <Spin spinning={isLoading}>
            <Flex gutter={8} justify="space-between" className='mb-4'>
             <h4 className='mb-0'>Receitas Previstas</h4>
             <Flex align='center'>
              <Checkbox>
                Parar atualizações do saldo
              </Checkbox>
              <Tooltip title="Ao selecionar esta opção os valores dos recursos não serão atualizados e serão mantidos os valores da última atualização automática ou da edição realizada.">
                <FontAwesomeIcon
                      style={{
                          fontSize: '16px', 
                          marginLeft: 4, 
                          color: "#086397"
                      }}
                      icon={faExclamationCircle}
                />
              </Tooltip> 
              </Flex>
            </Flex>
            
            <DataTable value={[...data.acoes_associacao, {nome: "Total do PTRF", fixed: true}]} rowClassName={rowClassName}>
                <Column
                    field="nome"
                    header="Recursos"
                    body={nomeTemplate}
                />
                <Column
                    field="valor_custeio"
                    header="Custeio (R$)"
                    body={dataTemplate}
                />
                <Column
                    field="valor_capital"
                    header="Capital (R$)"
                    body={dataTemplate}
                />
                <Column
                    field="valor_livre"
                    header="Livre Aplicação (R$)"
                    body={dataTemplate}
                />  
                <Column
                    field="total"
                    header="Total (R$)"
                    body={dataTemplate}
                />       
                <Column
                    field="acoes"
                    header="Ações"
                    body={acoesTemplate}
                />                                                 
            </DataTable>
          </Spin>
        ) : null
      }
    </div>
  );
};

export default ReceitasPrevistas;