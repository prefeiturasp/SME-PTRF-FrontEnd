import React, {memo} from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faDownload, faEdit} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "react-bootstrap/Dropdown";
import Loading from "../../../../../utils/Loading";

const TabelaConferenciaDeDocumentosRelatorios = ({carregaListaDeDocumentosRelatorio, setListaDeDocumentosRelatorio, listaDeDocumentosRelatorio: listaDeDocumentosRelatorio, rowsPerPage, loadingDocumentosParaConferencia}) => {

    const selecionarHeader = () => {
        return (
            <div className="align-middle">
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                        <input
                            checked={false}
                            type="checkbox"
                            value=""
                            onChange={(e) => e}
                            name="checkHeaderDocumentos"
                            id="checkHeaderDocumentos"
                            disabled={false}
                        />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={(e) => console.log(e)}>Selecionar todos corretos</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => console.log(e)}>Selecionar todos corretos 1</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => console.log(e)}>Selecionar todos corretos 2</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => console.log(e)}>Desmarcar todos</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        )
    }

    const selecionarTemplate = (rowData) => {
        return (
            <div className="align-middle pl-2 mr-1">
                <input
                    checked={''}
                    type="checkbox"
                    value=""
                    onChange={(e) => console.log(e)}
                    name="checkAtribuidoDocumento"
                    id="checkAtribuidoDocumento"
                    disabled={false}
                />
            </div>
        )
    }

    const conferidoTemplate = () => {
        return '-'
    }

    const acoesTemplate = (rowData) => {
        if(!rowData.exibe_acoes){
            return null
        }
        return (
            <>
            <button disabled={true} className="btn btn-link fonte-14" type="button">
                <FontAwesomeIcon
                    style={{fontSize: '18px', marginRight: "5px", color: "#00585E"}}
                    icon={faEye}
                />
            </button>
            <button disabled={true} className="btn btn-link fonte-14" type="button">
                <FontAwesomeIcon
                    style={{fontSize: '18px', marginRight: "5px", color: "#00585E"}}
                    icon={faDownload}/>
            </button>
            </>
        )

    };

    const nomeDocumento = (rowData) => {
        return rowData.nome
    }

    const adicionarAcertos = (rowData) => {
        return (
            <button disabled={true} className="btn btn-link fonte-14" type="button">
                <FontAwesomeIcon
                    style={{fontSize: '18px', marginRight: "5px", color: "#00585E"}}
                    icon={faEdit}
                />
            </button>
        )
    };

    return(
        <>
            {loadingDocumentosParaConferencia ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                <>
                    <DataTable
                        value={listaDeDocumentosRelatorio}
                        paginator={listaDeDocumentosRelatorio.length > rowsPerPage}
                        rows={rowsPerPage}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        stripedRows
                        autoLayout={true}
                    >
                        <Column
                            header={selecionarHeader()}
                            body={selecionarTemplate}
                            style={{borderRight: 'none', width: '1%'}}
                        />
                        <Column
                            header={'Nome do Documento'}
                            field='nome'
                            body={nomeDocumento}
                            style={{borderLeft: 'none', width: '200px',}}
                        />
                        <Column
                            header={'Conferido'}
                            body={conferidoTemplate}
                            style={{borderRight: 'none', width: '10%'}}
                        />
                        <Column
                            field='acoes'
                            header='Ações'
                            body={acoesTemplate}
                            style={{borderRight: 'none', width: '12%'}}
                        />
                        <Column
                            field='adicionar_acertos'
                            header='Adicionar Acerto'
                            body={adicionarAcertos}
                            style={{width: '1%'}}
                        />
                    </DataTable>
                </>
            }
        </>
    )
}
export default memo(TabelaConferenciaDeDocumentosRelatorios)