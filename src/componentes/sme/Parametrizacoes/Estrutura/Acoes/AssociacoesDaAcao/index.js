import React, {useEffect, useState} from "react";
import Toast from 'react-bootstrap/Toast'
import Dropdown from 'react-bootstrap/Dropdown';
import "../../../../../Globais/ModalBootstrap/modal-bootstrap.scss"
import Img404 from "../../../../../../assets/img/img-404.svg";
import Loading from "../../../../../../utils/Loading";
import {Filtros} from "./FormFiltros";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {MsgImgCentralizada} from  "../../../../../Globais/Mensagens/MsgImgCentralizada";
import {MsgImgLadoDireito} from "../../../../../Globais/Mensagens/MsgImgLadoDireito";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faPlus, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {ModalDesvincularLote} from "./Modais";
import "./associacoes.scss";
import {Link, useParams} from 'react-router-dom';
import {PaginasContainer} from "../../../../../../paginas/PaginasContainer";
import {getUnidadesPorAcao, getAcao, deleteAcaoAssociacao, deleteAcoesAssociacoesEmLote} from "../../../../../../services/sme/Parametrizacoes.service"
import {ModalConfirmDesvincularAcaoAssociacao} from "./ModalConfirmDesvincularAcaoAssociacao"
import {ModalInfoNaoPodeExcluir} from "../ModalInfoNaoPodeExcluir";

const CustomToast = (propriedades) => {
    return (
        <Toast 
            show={propriedades.show} 
            onClose={propriedades.fecharToast} 
            className="text-white bg-dark bg-gradient"
            style={{
                maxWidth: "600px"
          }}>
          <Toast.Header 
            className="text-white bg-dark bg-gradient"
           >
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
            
            <div>"{propriedades.mensagem}"</div>

          </Toast.Header>
        </Toast>
    )
}


export const AssociacoesDaAcao = () => {
    const rowsPerPage = 10;
    let {acao_uuid} = useParams();

    const estadoInicialFiltros = {
        filtrar_por_nome: "",
    };

    const [loading, setLoading] = useState(true);
    const [acao, setAcao] = useState(null);
    const [acaoAssociacaoUuid, setAcaoAssociacaoUuid] = useState(null);
    const [unidades, setUnidades] = useState([]);
    const [estadoFiltros, setEstadoFiltros] = useState(estadoInicialFiltros);
    const [buscaUtilizandoFiltros, setBuscaUtilizandoFiltros] = useState(false);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);
    const [showModalDesvincular, setShowModalDesvincular] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showConfirmaDesvinculo, setShowConfirmaDesvinculo] = useState(false);
    const [showModalInfoNaoPodeExcluir, setShowModalInfoNaoPodeExcluir] = useState(false);
    const [mensagemModalInfoNaoPodeExcluir, setMensagemModalInfoNaoPodeExcluir] = useState("");
    const [mensagemToast, setMensagemToast] = useState("");

    useEffect(() => {
        buscaUnidadesDaAcao(acao_uuid).then(() => setLoading(false));
    }, []);

    const buscaUnidadesDaAcao = async (acaoUuid) => {
        if (acaoUuid){
            let acao = await getAcao(acaoUuid)
            setAcao(acao);

            let acoesAssociacoes = await getUnidadesPorAcao(acaoUuid);
            setUnidades(acoesAssociacoes);

            setQuantidadeSelecionada(0);
        }
    }


    const mudancasFiltros = (name, value) => {
        setEstadoFiltros({
            ...estadoFiltros,
            [name]: value
        });
    };

    const aplicaFiltrosUnidades = async (event)=>{
        setLoading(true);
        setBuscaUtilizandoFiltros(true);
        if (event) {
            event.preventDefault();
        }
        let resultado_filtros = await getUnidadesPorAcao(acao_uuid, estadoFiltros.filtrar_por_nome);
    
        let unis = resultado_filtros.map(obj => {
            return {
                ...obj,
                selecionado: false
            }
        });
        setUnidades(unis);
        setLoading(false)
    };

    const limparFiltros = async () => {
        setLoading(true);
        setEstadoFiltros(estadoInicialFiltros);
        await buscaUnidadesDaAcao(acao_uuid);
        setShowToast(false);
        setLoading(false)
    };

    const atualizaListaUnidades = async () => {
        setLoading(true);
        if (buscaUtilizandoFiltros) {
            await aplicaFiltrosUnidades()
        }
        else {
            await buscaUnidadesDaAcao(acao_uuid)
        }
        setLoading(false);
    };

    const selecionarTodos = (event) => {
        event.preventDefault();
        let result = unidades.reduce((acc, o) => {

            let obj = Object.assign(o, { selecionado: true }) ;
        
            acc.push(obj);
        
            return acc;
        
        }, []);
        setUnidades(result);
        setQuantidadeSelecionada(unidades.length);
    }

    const desmarcarTodos = (event) => {
        event.preventDefault();
        let result = unidades.reduce((acc, o) => {

            let obj = Object.assign(o, { selecionado: false }) ;
        
            acc.push(obj);
        
            return acc;
        
        }, []);
        setUnidades(result);
        setQuantidadeSelecionada(0);
    };


    const selecionarTemplate = (rowData) => {
        return (
            <div className="align-middle text-center">
                <input
                    checked={unidades.filter(u => u.uuid === rowData.uuid)[0].selecionado}
                    type="checkbox"
                    value=""
                    onChange={(e) => tratarSelecionado(e, rowData.uuid)}
                    name="checkAtribuido"
                    id="checkAtribuido"
                />
            </div>
        )
    }

    const selecionarHeader = () => {
        return (
            <div className="align-middle text-center">
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
              <input
                    checked={false}
                    type="checkbox"
                    value=""
                    onChange={(e) => e}
                    name="checkHeader"
                    id="checkHeader"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={(e) => selecionarTodos(e)}>Selecionar todos</Dropdown.Item>
                <Dropdown.Item onClick={(e) => desmarcarTodos(e)}>Desmarcar todos</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            </div>
        )
    }

    const tratarSelecionado = (e, unidadeUuid) => {
        if (showToast === true) {
           setShowToast(false)
        }

        let cont = quantidadeSelecionada;
        if (e.target.checked) {
            cont = cont + 1
        } else {
            cont = cont - 1
        }
        setQuantidadeSelecionada(cont);
        let result2 = unidades.reduce((acc, o) => {

            let obj = unidadeUuid === o.uuid ? Object.assign(o, { selecionado: e.target.checked }) : o;
        
            acc.push(obj);
        
            return acc;
        
        }, []);
        setUnidades(result2);
    }

    const mensagemQuantidadeExibida = () => {
        return (
            <div className="row">
                <div className="col-12" style={{padding:"15px 0px", margin:"0px 15px", flex:"100%"}}>
                    Exibindo <span style={{color: "#00585E", fontWeight:"bold"}}>{unidades.length}</span> unidades
                </div>
            </div>
        )
    }

    const montagemDesvincularLote = () => {
        return (
            <div className="row">
                <div className="col-12" style={{background: "#00585E", color: 'white', padding:"15px", margin:"0px 15px", flex:"100%"}}>
                    <div className="row">
                        <div className="col-5">
                            {quantidadeSelecionada} {quantidadeSelecionada === 1 ? "unidade selecionada" : "unidades selecionadas"}  / {unidades.length} totais
                        </div>
                        <div className="col-7">
                            <div className="row">
                                <div className="col-12">
                                    <a className="float-right" onClick={(e) => desmarcarTodos(e)} style={{textDecoration:"underline", cursor:"pointer"}}>
                                        <strong>Cancelar</strong>
                                    </a>
                                    <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                                    <a className="float-right" onClick={(e) => modalDesvincular()} style={{textDecoration:"underline", cursor:"pointer"}}>
                                        <FontAwesomeIcon
                                            style={{color: "white", fontSize: '15px', marginRight: "2px"}}
                                            icon={faTimesCircle}
                                        />
                                        <strong>Desvincular da ação</strong>
                                    </a>
                                </div>
                                
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const modalDesvincular = () => {
        setShowModalDesvincular(true);
    }

    const onHide = () => {
        setShowModalDesvincular(false);

    }

    const fecharToast = () => {
        setShowToast(false);
    }

    const acoesTemplate = (rowData) => {
        return (
            <div>
                <Link className="link-red" onClick={() => {handleDesvinculaUE(rowData['uuid'])}}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#B40C02"}}
                        icon={faTimesCircle}
                    />
                    <span> Desvincular</span>
                </Link>
            </div>
        )
    };

    const handleDesvinculaUE = (acaoAssociacaoUuid) => {
        setAcaoAssociacaoUuid(acaoAssociacaoUuid)
        setShowConfirmaDesvinculo(true);
    };

    const handleCloseDesvinculaAssociacao = () => {
        setShowConfirmaDesvinculo(false)
    };

    const onDesvinculaAssociacaoTrue = async () => {
        setShowConfirmaDesvinculo(false);
        try {
            const result = await deleteAcaoAssociacao(acaoAssociacaoUuid);
            console.log('Associação desvinculada com sucesso', acaoAssociacaoUuid);
        } catch (e) {
            if (e.response && e.response.data && e.response.data.mensagem){
                setMensagemModalInfoNaoPodeExcluir(e.response.data.mensagem);
                setShowModalInfoNaoPodeExcluir(true);
                console.log(e.response.data.mensagem)
            }
            console.log('Erro ao desvincular associação!! ', e.response.data)
        }
        await atualizaListaUnidades()
        setAcaoAssociacaoUuid(null);
    };

    const desvincularAssociacoesEmLote = async () => {
        setShowModalDesvincular(false);
        setLoading(true);
        let payLoad = {
            lista_uuids: []
        };

        let uuids = unidades.filter(u => u.selecionado === true).map(item => {return item.uuid});

        payLoad.lista_uuids = uuids;

        try {
            let response = await deleteAcoesAssociacoesEmLote(payLoad);
            console.log("Associações desvinculadas com sucesso!");
            console.log(response.mensagem);
            setMensagemToast(response.mensagem ? response.mensagem : "Associações desvinculadas com sucesso!")
        } catch(e) {
            console.log("Erro ao tentar desvincular associações");
            console.log(e.response.data);
            setMensagemToast(e.response && e.response.mensagem ? e.response.mensagem : "Erro ao tentar desvincular associações")
        }
        await atualizaListaUnidades();
        setLoading(false);
        setShowToast(true);
        setQuantidadeSelecionada(0);
    };

    const handleCloseInfoNaoPodeExcluir = () => {
        setShowModalInfoNaoPodeExcluir(false);
        setMensagemModalInfoNaoPodeExcluir("");
    };

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Unidades vinculadas à ação {acao ? acao.nome : ""}</h1>
            <div className="page-content-inner">


                {loading ? (
                        <div className="mt-5">
                            <Loading
                                corGrafico="black"
                                corFonte="dark"
                                marginTop="0"
                                marginBottom="0"
                            />
                        </div>
                    ) :

                    (
                        <>
                            <div className="d-flex  justify-content-end mt-n2">
                                <div className="p-2 bd-highlight pt-3 justify-content-end d-flex">
                                    <Link
                                        to='/parametro-acoes'
                                        className="btn btn-outline-success ml-2"
                                    >
                                        <FontAwesomeIcon
                                            style={{marginRight: "5px"}}
                                            icon={faArrowLeft}
                                        />
                                        Voltar para lista de Ações
                                    </Link>
                                </div>
                                <div className="p-2 bd-highlight pt-3 justify-content-end d-flex">
                                    <Link
                                        to={`/vincula-associacoes-a-acao/${acao_uuid}`}
                                        className="btn btn-success ml-2"
                                    >
                                        <FontAwesomeIcon
                                            style={{marginRight: "5px", color: '#fff'}}
                                            icon={faPlus}
                                        />
                                        Vincular Associações
                                    </Link>
                                </div>
                            </div>



                            <div className="page-content-inner">
                                <Filtros
                                    estadoFiltros={estadoFiltros}
                                    mudancasFiltros={mudancasFiltros}
                                    enviarFiltrosAssociacao={aplicaFiltrosUnidades}
                                    limparFiltros={limparFiltros}
                                />
                                <ModalDesvincularLote
                                    show={showModalDesvincular}
                                    onHide={onHide}
                                    titulo="Desvincular unidades da ação"
                                    quantidadeSelecionada={quantidadeSelecionada}
                                    primeiroBotaoOnclick={desvincularAssociacoesEmLote}
                                    primeiroBotaoTexto="OK"
                                />


                                <CustomToast
                                    show={showToast}
                                    fecharToast={fecharToast}
                                    mensagem={mensagemToast}
                                />


                                {quantidadeSelecionada > 0 ?
                                    (montagemDesvincularLote()) :
                                    (mensagemQuantidadeExibida())
                                }
                                <div className="row">
                                    <div className="col-12">
                                        {unidades.length > 0 ? (
                                            <DataTable
                                                value={unidades}
                                                className="datatable-footer-coad"
                                                paginator={unidades.length > rowsPerPage}
                                                rows={rowsPerPage}
                                                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                                                autoLayout={true}
                                                selectionMode="single"
                                            >
                                                <Column header={selecionarHeader()} body={selecionarTemplate}/>
                                                <Column field='associacao.unidade.codigo_eol' header='Código Eol'/>
                                                <Column field='associacao.unidade.nome_com_tipo' header='Nome UE'/>
                                                <Column
                                                    field="acoes"
                                                    header="Ações"
                                                    body={acoesTemplate}
                                                />
                                            </DataTable>
                                        ) : buscaUtilizandoFiltros ?
                                            <MsgImgCentralizada
                                                texto='Não encontramos unidades que atendam aos filtros informados.'
                                                img={Img404}
                                            />
                                            :
                                            <MsgImgLadoDireito
                                                texto='Não há nenhuma unidade vinculada a essa ação'
                                                img={Img404}
                                            />}
                                    </div>
                                </div>
                            </div>
                        </>)
                }
                <section>
                    <ModalConfirmDesvincularAcaoAssociacao
                        show={showConfirmaDesvinculo}
                        handleClose={handleCloseDesvinculaAssociacao}
                        onDeleteAcaoTrue={onDesvinculaAssociacaoTrue}
                        titulo="Desvincular associação da ação"
                        texto="<p>Deseja realmente desvincular essa associação da ação?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="danger"
                        segundoBotaoTexto="Desvincular"
                    />
                </section>
                <section>
                    <ModalInfoNaoPodeExcluir
                        show={showModalInfoNaoPodeExcluir}
                        handleClose={handleCloseInfoNaoPodeExcluir}
                        titulo="Exclusão não permitida"
                        texto={mensagemModalInfoNaoPodeExcluir}
                        primeiroBotaoTexto="Fechar"
                        primeiroBotaoCss="success"
                    />
                </section>
            </div>
        </PaginasContainer>

    )
}
