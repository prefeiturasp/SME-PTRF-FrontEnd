import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tooltip, Button } from "antd";
import { IconButton } from "../../../../Globais/UI";
import moment from "moment";
import Loading from "../../../../../utils/Loading";
import { useGet } from "./hooks/useGet";
import {MsgImgCentralizada} from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg";
import { useNavigate } from 'react-router-dom';

export const Tabela = () => {
    const navigate = useNavigate();

  const { isLoading, data, total, count } = useGet()

  // Necessária pela paginação
  const {results} = data;

  const acoesTemplate = (rowData) => {
      return (
          rowData?.editavel ? (
            <Tooltip title="Editar período do PAA">
                <IconButton
                    icon="faEdit"
                    iconProps={{style: {fontSize: '20px', marginRight: "0", color: "#00585E"}}}
                    onClick={() => handleEditFormModal(rowData)}
                    aria-label="Editar"
                    className="btn-Editar-periodo"
                />
            </Tooltip>
        ) : (
            <Tooltip title="Visualizar período do PAA">
                <IconButton
                    icon="faEye"
                    iconProps={{style: {fontSize: '20px', marginRight: "0", color: "#00585E"}}}
                    onClick={() => handleEditFormModal(rowData)}
                    aria-label="Visualizar"
                    className="btn-visualizar-periodo"
                />
            </Tooltip>
        )
      )
  };

  const handleEditFormModal = (rowData) => {
    navigate(`/edicao-periodo-paa/${rowData.uuid}`);
  };

  const dataTemplate = (rowData, column) => {
        return (
            <div>
                {rowData[column.field] ? moment(rowData[column.field]).format('MM/YYYY') : ''}
            </div>
        )
    };

  const outrosRecurosTemplate = (rowData, column) => {
    const qtde = rowData[column.field]
    // Cor de fundo
    const corBg = qtde > 0 ? '#EDFFF3' : '#F3F4F6'
    // cor de texto
    const corTxt = qtde > 0 ? '#00585D' : '#42474A'
    // legenda
    const label = qtde === 1 ? `${qtde} habilitado` : `${qtde} habilitados`
    return (
      <Button
          color="default"
          variant="filled"
          size="small"
          shape="round"
          style={{backgroundColor: corBg, color: corTxt, fontWeight: 600, fontSize: '12px'}}>
          {label}
      </Button>
    )
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
        {results && results.length > 0 ? (
            <div>
                {!isLoading && total ? (
                        <p className='pt-2 pb-0 mb-0'>
                            Exibindo 
                            <span className='total'> {total} </span> 
                            de
                            <span className='total'> {count} </span> 
                            período{total === 1 ? '' : 's'} do PAA</p>
                    ) :
                    null
                }
                <DataTable
                    value={results}
                    className='tabela-lista-periodos-paa'
                    data-qa='tabela-lista-periodos-paa'>
                    <Column field="referencia" header="Referência"/>
                    <Column
                        field="data_inicial"
                        header="Data Inicial"
                        body={dataTemplate}/>
                    <Column
                        field="data_final"
                        header="Data Final"
                        body={dataTemplate}/>
                    <Column
                        field="qtd_outros_recursos_habilitados"
                        header="Outros Recursos"
                        body={outrosRecurosTemplate}/>
                    <Column
                        field="acao"
                        header="Ações"
                        body={acoesTemplate}
                        style={{width: '10%', textAlign: "center",}}/>
                </DataTable>
            </div>
        ) :
        <MsgImgCentralizada
                data-qa="imagem-lista-sem-periodos-paa"
                texto='Nenhum resultado encontrado.'
                img={Img404}
            />
        }
    </>
  )
}