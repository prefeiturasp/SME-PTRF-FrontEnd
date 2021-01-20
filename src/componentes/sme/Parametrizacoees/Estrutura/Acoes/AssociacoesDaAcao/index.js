import React, {useEffect, useState} from "react";
import Toast from 'react-bootstrap/Toast'
import Dropdown from 'react-bootstrap/Dropdown';
import "../../../../../Globais/ModalBootstrap/modal-bootstrap.scss"

import {atribuirTecnicos, filtrosUnidadesParaAtribuir, retirarAtribuicoes} from "../../../../../../services/dres/Atribuicoes.service";

import Img404 from "../../../../../../assets/img/img-404.svg";
import Loading from "../../../../../../utils/Loading";
import {Filtros} from "./FormFiltros";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {MsgImgCentralizada} from  "../../../../../Globais/Mensagens/MsgImgCentralizada";
import {MsgImgLadoDireito} from "../../../../../Globais/Mensagens/MsgImgLadoDireito";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClipboardList, faSignInAlt, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {
    ModalAtribuir, 
    ModalConfirmarRetiradaAtribuicoes,
    ModalInformativoCopiaPeriodo} from "./Modais";
import "./associacoes.scss";
import {Link, useParams} from 'react-router-dom';
import {PaginasContainer} from "../../../../../../paginas/PaginasContainer";
import {getUnidadesPorAcao, getAcao} from "../../../../../../services/sme/Parametrizacoes.service"

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
            
            <div>Associações participantes da ação "{propriedades.tecnico}".</div>
            <a onClick={e => propriedades.desfazer()} style={{marginLeft: "30px", marginRight: "30px", textDecoration: "underline", color: "#17a2b8", cursor:"pointer"}}><strong>Desfazer</strong></a>
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
    const [periodoAtual, setPeriodoAtual] = useState(null);
    const [dreUuid, setDreUuid] = useState(null);
    const [unidades, setUnidades] = useState([]);
    const [tecnicosList, setTecnicosList] = useState([]);
    const [estadoFiltros, setEstadoFiltros] = useState(estadoInicialFiltros);
    const [buscaUtilizandoFiltros, setBuscaUtilizandoFiltros] = useState(false);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);
    const [show, setShow] = useState(false);
    const [showConfirma, setShowConfirma] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showInformativoCopia, setShowInformativoCopia] = useState(false);
    const [tecnico, setTecnico] = useState("");
    const [copiaUnidades, setCopiaUnidades] = useState([]);
    const [escolhaTags, setEscolhaTags] = useState(false);
    const [periodoACopiar, setPeriodoACopiar] = useState(null);

    useEffect(() => {
        buscaUnidadesDaAcao(acao_uuid).then(() => setLoading(false));
    }, []);

    const buscaUnidadesDaAcao = async (acaoUuid) => {
        if (acaoUuid){
            let acao = await getAcao(acaoUuid)
            console.log("Ação", acao)
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
        console.log("Aplicar filtro", estadoFiltros)
        setLoading(true);
        setBuscaUtilizandoFiltros(true);
        event.preventDefault();
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
        setTecnico("");
        setLoading(false)
    };

    const fechaModalInformativo = () => {
        setShowInformativoCopia(false);
    }

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
    }

    const selecionarApenasUesNaoSemAtribuicao = (event) => {
        event.preventDefault();
        let cont = quantidadeSelecionada;
        let result = unidades.reduce((acc, o) => {    
            let obj = o.atribuicao.id === "" ? Object.assign(o, { selecionado: true }) : o;
            if (obj.selecionado) {
                cont = cont + 1;
            }
            acc.push(obj);
        
            return acc;
        
        }, []);
        setUnidades(result);
        setQuantidadeSelecionada(cont);
    }

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
                <Dropdown.Item onClick={(e) => modalConfirmarRetirada(e)}>Retirar Atribuições</Dropdown.Item>
                <Dropdown.Item onClick={(e) => selecionarApenasUesNaoSemAtribuicao(e)}>Selecionar apenas UEs sem atribuição</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            </div>
        )
    }

    const tratarSelecionado = (e, unidadeUuid) => {
        if (showToast === true) {
            alert("A mensagem para Desfazer atribuições está aberta, feche a mensagem  no 'x' ou clique  em 'Desfazer' para liberar a seleção das unidades.");
            return 
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

    const montagemAtribuir = () => {
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
                                    <a className="float-right" onClick={(e) => modalAtribuir()} style={{textDecoration:"underline", cursor:"pointer"}}>
                                        <FontAwesomeIcon
                                            style={{color: "white", fontSize: '15px', marginRight: "2px"}}
                                            icon={faSignInAlt}
                                        />
                                        <strong>Atribuir a um técnico</strong>
                                    </a>
                                </div>
                                
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const modalAtribuir = () => {
        setShow(true);
    }

    const onHide = () => {
        setShow(false);
        setTecnico("");
    }

    const selecionarTecnico = (value) => {
        setTecnico(value);
    }

    const atribuir = async () => {
        setShow(false);
        setLoading(true);
        let atribuirData = {
            periodo: periodoAtual.uuid,
            tecnico: tecnico,
            unidades: []
        }

        let unis = unidades.filter(u => u.selecionado === true).map(item => {return {uuid: item.uuid}});
        setCopiaUnidades(unidades.filter(u => u.selecionado === true));
        atribuirData.unidades = unis;
        try {
            let response = await atribuirTecnicos(atribuirData);
            // buscarUnidadesParaAtribuicao(dreUuid, periodoAtual.uuid);
            console.log("Tecnico atribuido com sucesso!");
        } catch(e) {
            console.log("erro ao atribuir");
            console.log(e);
        }
        setLoading(false);
        setShowToast(true);
    }

    const modalConfirmarRetirada = () => {
        if (quantidadeSelecionada) {
            setShowConfirma(true);
        } else {
            alert("Nenhuma unidade selecionada!");
        }
    }

    const onHideConfirma = () => {
        setShowConfirma(false);
    }

    const fecharToast = () => {
        setShowToast(false);
        setTecnico("");
        setCopiaUnidades([]);
    }

    const retiraAtribuicoes = async () => {
        setLoading(true);
        let unidadesData = {
            periodo: periodoAtual.uuid,
            unidades: []
        }

        let unis = unidades.filter(u => u.selecionado === true).map(item => {return {uuid: item.uuid}});
        unidadesData.unidades = unis;
        try {
            let response = await retirarAtribuicoes(unidadesData);
            // buscarUnidadesParaAtribuicao(dreUuid, periodoAtual.uuid);
            console.log("Atribuições retiradas com sucesso!");
        } catch(e) {
            console.log("erro ao retirar atribuições");
            console.log(e);
        }
        setShowConfirma(false);
        setLoading(false);
    };

    const montaNome = (nomeTecnico) => {
        let nome = nomeTecnico.split(" ");
        return nome.length > 1 ? `${nome[0]} ${nome[1]}`: nome[0] 
    };

    const handleDesvinculaUE = (rowData) => {

    };

    const acoesTemplate = (rowData) => {
        return (
            <div>
                <Link className="link-red" onClick={handleDesvinculaUE(rowData['uuid'])}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#B40C02"}}
                        icon={faTimesCircle}
                    />
                    <span> Desvincular</span>
                </Link>
            </div>
        )
    };

    return (
            <PaginasContainer>
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
                    <div className="d-flex bd-highlight">
                        <div className="p-2 flex-grow-1 bd-highlight">
                            <h1 className="titulo-itens-painel mt-5">Unidades vinculadas à ação {acao ? acao.nome : ""}</h1>
                        </div>
                    </div>
                    <div className="page-content-inner">
                        <Filtros
                            estadoFiltros={estadoFiltros}
                            mudancasFiltros={mudancasFiltros}
                            enviarFiltrosAssociacao={aplicaFiltrosUnidades}
                            limparFiltros={limparFiltros}
                        />
                        <ModalAtribuir
                            show={show}
                            onHide={onHide}
                            titulo="Atribuir a um técnico"
                            tecnico={tecnico}
                            tecnicosList={tecnicosList}
                            selecionarTecnico={selecionarTecnico}
                            quantidadeSelecionada={quantidadeSelecionada}
                            primeiroBotaoOnclick={atribuir}
                            primeiroBotaoTexto="OK"/>

                        <ModalConfirmarRetiradaAtribuicoes
                            show={showConfirma}
                            onHide={onHideConfirma}
                            titulo="Retirada de Atribuições"
                            primeiroBotaoOnclick={retiraAtribuicoes}
                            primeiroBotaoTexto="OK"
                        />

                        <CustomToast
                            show={showToast}
                            fecharToast={fecharToast}
                            tecnico={tecnico !== "" ? montaNome(tecnicosList.filter(t => t.uuid === tecnico)[0].nome) : ""}
                            // desfazer={desfazer}
                        />

                        <ModalInformativoCopiaPeriodo
                            show={showInformativoCopia}
                            onHide={fechaModalInformativo}
                            titulo="Cópia de períodos"
                            periodo={periodoACopiar}
                        />

                        {quantidadeSelecionada > 0 ?
                            (montagemAtribuir()):
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
            </PaginasContainer>

    )
}
