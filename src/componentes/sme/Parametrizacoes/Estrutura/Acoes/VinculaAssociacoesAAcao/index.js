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
import {faArrowLeft, faPlusCircle, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {ModalVincularLote} from "./Modais";
import "./associacoes.scss";
import {Link, useParams} from 'react-router-dom';
import {PaginasContainer} from "../../../../../../paginas/PaginasContainer";
import {getAssociacoesNaoVinculadasAAcao, getAcao, postAddAcaoAssociacao, addAcoesAssociacoesEmLote} from "../../../../../../services/sme/Parametrizacoes.service"
import {ModalConfirmVincularAcaoAssociacao} from "./ModalConfirmVincularAcaoAssociacao"
import {ModalInfoNaoPodeVincular} from "./ModalInfoNaoPodeVincular";

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


export const VinculaAssociacoesAAcao = () => {
    const rowsPerPage = 10;
    let {acao_uuid} = useParams();

    const estadoInicialFiltros = {
        filtrar_por_nome: "",
    };

    const [loading, setLoading] = useState(true);
    const [acao, setAcao] = useState(null);
    const [associacaoUuid, setAssociacaoUuid] = useState(null);
    const [unidades, setUnidades] = useState([]);
    const [estadoFiltros, setEstadoFiltros] = useState(estadoInicialFiltros);
    const [buscaUtilizandoFiltros, setBuscaUtilizandoFiltros] = useState(false);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);
    const [showModalVincular, setShowModalVincular] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showConfirmaVinculo, setShowConfirmaVinculo] = useState(false);
    const [showModalInfoNaoPodeVincular, setShowModalInfoNaoPodeVincular] = useState(false);
    const [mensagemModalInfoNaoPodeVincular, setMensagemModalInfoNaoPodeVincular] = useState("");
    const [mensagemToast, setMensagemToast] = useState("");

    useEffect(() => {
        buscaUnidadesNaoVinculadasAAcao(acao_uuid).then(() => setLoading(false));
    }, []);

    const buscaUnidadesNaoVinculadasAAcao = async (acaoUuid) => {
        if (acaoUuid){
            let acao = await getAcao(acaoUuid)
            setAcao(acao);

            let associacoes = await getAssociacoesNaoVinculadasAAcao(acaoUuid);
            setUnidades(associacoes);

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
        console.log("Aplicar filtro", estadoFiltros)
        setLoading(true);
        setBuscaUtilizandoFiltros(true);
        if (event) {
            event.preventDefault();
        }

        let resultado_filtros = await getAssociacoesNaoVinculadasAAcao(acao_uuid, estadoFiltros.filtrar_por_nome);

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
        await buscaUnidadesNaoVinculadasAAcao(acao_uuid);
        setShowToast(false);
        setLoading(false)
    };

    const atualizaListaUnidades = async () => {
        setLoading(true);
        if (buscaUtilizandoFiltros) {
            await aplicaFiltrosUnidades()
        }
        else {
            await buscaUnidadesNaoVinculadasAAcao(acao_uuid)
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

    const montagemVincularLote = () => {
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
                                    <a className="float-right" onClick={(e) => modalVincular()} style={{textDecoration:"underline", cursor:"pointer"}}>
                                        <FontAwesomeIcon
                                            style={{color: "white", fontSize: '15px', marginRight: "2px"}}
                                            icon={faPlusCircle}
                                        />
                                        <strong>Vincular à ação</strong>
                                    </a>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const modalVincular = () => {
        setShowModalVincular(true);
    }

    const onHide = () => {
        setShowModalVincular(false);

    }

    const fecharToast = () => {
        setShowToast(false);
    }

    const acoesTemplate = (rowData) => {
        return (
            <div>
                <Link className="link-green" onClick={() => {handleVinculaUE(rowData['uuid'])}}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0"}}
                        icon={faPlusCircle}
                    />
                    <span> Vincular</span>
                </Link>
            </div>
        )
    };

    const handleVinculaUE = (acaoAssociacaoUuid) => {
        setAssociacaoUuid(acaoAssociacaoUuid)
        setShowConfirmaVinculo(true);
    };

    const handleCloseVinculaAssociacao = () => {
        setShowConfirmaVinculo(false)
    };

    const onVinculaAssociacaoTrue = async () => {
        const payload = {
            associacao: associacaoUuid,
            acao: acao_uuid,
            status: 'ATIVA',
        };
        setShowConfirmaVinculo(false);
        try {
            const result = await postAddAcaoAssociacao(payload)
            console.log('Associação vinculada com sucesso', associacaoUuid);
        } catch (e) {
            console.log('Erro ao vincular associação!! ', e)
        }
        await atualizaListaUnidades()
        setAssociacaoUuid(null);
    };

    const vincularAssociacoesEmLote = async () => {
        setShowModalVincular(false);
        setLoading(true);
        let payLoad = {
            acao_uuid: acao_uuid,
            associacoes_uuids: []
        };

        let uuids = unidades.filter(u => u.selecionado === true).map(item => {return item.uuid});

        console.log("Lista de uuids", uuids)

        payLoad.associacoes_uuids = uuids;

        try {
            let response = await addAcoesAssociacoesEmLote(payLoad);
            console.log("Associações vinculadas com sucesso!");
            console.log(response.mensagem);
            setMensagemToast(response.mensagem ? response.mensagem : "Associações vinculadas com sucesso!")
        } catch(e) {
            console.log("Erro ao tentar vincular associações");
            console.log(e.response.data);
            setMensagemToast(e.response && e.response.mensagem ? e.response.mensagem : "Erro ao tentar vincular associações")
        }
        await atualizaListaUnidades();
        setLoading(false);
        setShowToast(true);
        setQuantidadeSelecionada(0);
    };

    const handleCloseInfoNaoPodeVincular = () => {
        setShowModalInfoNaoPodeVincular(false);
        setMensagemModalInfoNaoPodeVincular("");
    };

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Vincula associações à ação {acao ? acao.nome : ""}</h1>
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
                            <div className="p-2 bd-highlight pt-3 justify-content-end d-flex">
                                <Link
                                    to={`/associacoes-da-acao/${acao_uuid}`}
                                    className="btn btn-success ml-2"
                                >
                                    <FontAwesomeIcon
                                        style={{marginRight: "5px", color: '#fff'}}
                                        icon={faArrowLeft}
                                    />
                                    Voltar para lista de UE's vinculadas
                                </Link>
                            </div>
                            <div className="page-content-inner">
                                <Filtros
                                    estadoFiltros={estadoFiltros}
                                    mudancasFiltros={mudancasFiltros}
                                    enviarFiltrosAssociacao={aplicaFiltrosUnidades}
                                    limparFiltros={limparFiltros}
                                />
                                <ModalVincularLote
                                    show={showModalVincular}
                                    onHide={onHide}
                                    titulo="Vincular unidades à ação"
                                    quantidadeSelecionada={quantidadeSelecionada}
                                    primeiroBotaoOnclick={vincularAssociacoesEmLote}
                                    primeiroBotaoTexto="OK"
                                />


                                <CustomToast
                                    show={showToast}
                                    fecharToast={fecharToast}
                                    mensagem={mensagemToast}
                                />


                                {quantidadeSelecionada > 0 ?
                                    (montagemVincularLote()) :
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
                                                <Column field='unidade.codigo_eol' header='Código Eol'/>
                                                <Column field='unidade.nome_com_tipo' header='Nome UE'/>
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
                    <ModalConfirmVincularAcaoAssociacao
                        show={showConfirmaVinculo}
                        handleClose={handleCloseVinculaAssociacao}
                        onDeleteAcaoTrue={onVinculaAssociacaoTrue}
                        titulo="Vincular unidade à ação"
                        texto="<p>Deseja realmente vincular essa unidade à ação?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="danger"
                        segundoBotaoTexto="Vincular"
                    />
                </section>
                <section>
                    <ModalInfoNaoPodeVincular
                        show={showModalInfoNaoPodeVincular}
                        handleClose={handleCloseInfoNaoPodeVincular}
                        titulo="Exclusão não permitida"
                        texto={mensagemModalInfoNaoPodeVincular}
                        primeiroBotaoTexto="Fechar"
                        primeiroBotaoCss="success"
                    />
                </section>
            </div>
        </PaginasContainer>

    )
}
