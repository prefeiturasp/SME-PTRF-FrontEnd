import React, {Fragment, useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {ModalBootstrap} from "../../../Globais/ModalBootstrap";
import "../../../Globais/ModalBootstrap/modal-bootstrap.scss"
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import {MenuInterno} from "../../../Globais/MenuInterno";
import {getUnidade} from "../../../../services/dres/Unidades.service";
import {atribuirTecnicos, getUnidadesParaAtribuir, filtrosUnidadesParaAtribuir} from "../../../../services/dres/Atribuicoes.service";
import {getPeriodosNaoFuturos} from "../../../../services/escolas/PrestacaoDeContas.service";
import {getTabelaAssociacoes} from "../../../../services/dres/Associacoes.service";
import {getTecnicosDre} from "../../../../services/dres/TecnicosDre.service";
import {exibeDataPT_BR} from '../../../../utils/ValidacoesAdicionaisFormularios';
import Img404 from "../../../../assets/img/img-404.svg";
import Loading from "../../../../utils/Loading";
import {Filtros} from "./FormFiltros";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {MsgImgCentralizada} from  "../../../Globais/Mensagens/MsgImgCentralizada";
import {MsgImgLadoDireito} from "../../../Globais/Mensagens/MsgImgLadoDireito";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignInAlt} from "@fortawesome/free-solid-svg-icons";


export const ModalAtribuir = (propriedades) => {
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                         <div className="col-12" style={{paddingBottom:"20px"}}>
                            <strong>Você possui <span style={{color: "#00585E", fontWeight:"bold"}}>{propriedades.quantidadeSelecionada} {propriedades.quantidadeSelecionada === 1 ? "unidade" : "unidades"}</span> {propriedades.quantidadeSelecionada === 1 ? "selecionada" : "selecionadas"}</strong>
                         </div>
                    </div>
                    <div className="row">
                    <div className="form-group col-12">
                            <label htmlFor="tecnico">Novo técnico responsável</label>
                            <select 
                                    onChange={(e) => propriedades.selecionarTecnico(e.target.value)} 
                                    name="tecnico"
                                    id="tecnico" 
                                    className="form-control"
                                    //value={estadoFiltros.filtrar_por_tecnico}
                                    >
                                <option key={0} value="">Selecione uma opção</option>
                                {propriedades.tecnicosList && propriedades.tecnicosList.map(item => (
                                    <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <button
                    onClick={(e) => propriedades.onHide()}
                    className="btn btn-outline-success mt-2"
                    type="button"
                >
                Cancelar
                </button>
                <button disabled={propriedades.tecnico !== "" ? false: true}
                    onClick={(e) => propriedades.primeiroBotaoOnclick()}
                    type="submit"
                    className="btn btn-success mt-2"
                >
                Atribuir
                </button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export const Atribuicoes = () => {
    const rowsPerPage = 10;

    const estadoInicialFiltros = {
        filtrar_por_termo: "",
        filtrar_por_rf: "",
        filtrar_por_tecnico: "",
        filtar_por_tipo_unidade: "",
    };

    const [loading, setLoading] = useState(true);
    const [dadosDiretoria, setDadosDiretoria] = useState(null);
    const [periodos, setPeriodos] = useState(false);
    const [periodoAtual, setPeriodoAtual] = useState(null)
    const [dreUuid, setDreUuid] = useState(null);
    const [unidades, setUnidades] = useState([])
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [tecnicosList, setTecnicosList] = useState([]);
    const [estadoFiltros, setEstadoFiltros] = useState(estadoInicialFiltros);
    const [buscaUtilizandoFiltros, setBuscaUtilizandoFiltros] = useState(false);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);
    const [show, setShow] = useState(false);
    const [tecnico, setTecnico] = useState("");

    useEffect(() => {
        buscaDadosDiretoriaEPeriodos()
        .then(response => {
                buscarUnidadesParaAtribuicao(response.dre, response.periodo);
                carregaTecnicos(response.dre);
            }
        );
        buscaTabelaAssociacoes();
        setLoading(false);
    }, []);
        
    // useEffect(() =>{
        
    // }, []);

    const buscaDadosDiretoriaEPeriodos = async () => {
        let diretoria = await getUnidade();
        setDadosDiretoria(diretoria);
        setDreUuid(diretoria.uuid);

        let periodos = await getPeriodosNaoFuturos();
        setPeriodos(periodos);
        if (periodoAtual !== null){
            setPeriodoAtual(periodoAtual);
        } else {
            setPeriodoAtual(periodos[0]);
        }

        return {dre: diretoria.uuid, periodo: periodoAtual !== null ? periodoAtual.uuid : periodos[0].uuid}
    }

    const buscarUnidadesParaAtribuicao = async (dreUuid, periodo) => {
        if (dreUuid, periodo){
            let unidades = await getUnidadesParaAtribuir(dreUuid, periodo);
            let unis = unidades.map(obj => {
                return {
                    ...obj,
                    selecionado: false
                }
            });
            setUnidades(unis);
            setQuantidadeSelecionada(0);
        }
    }

    const buscaTabelaAssociacoes = async ()=>{
        let tabela_associacoes = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela_associacoes);
    };

    const carregaTecnicos = async (dre) => {
        let tecnicos = await getTecnicosDre(dre);
        setTecnicosList(tecnicos);
    };

    const mudancasPeriodo = async (value) => {
        if (value){
            await buscarUnidadesParaAtribuicao(dreUuid, value);
            let periodo = periodos.filter((item) => (item.uuid === value));
            setPeriodoAtual(periodo[0])
        }
    };

    const mudancasFiltros = (name, value) => {
        setEstadoFiltros({
            ...estadoFiltros,
            [name]: value
        });
    };

    const enviarFiltrosAssociacao = async (event)=>{
        setLoading(true);
        setBuscaUtilizandoFiltros(true);
        event.preventDefault();
        let resultado_filtros = await filtrosUnidadesParaAtribuir(dreUuid, periodoAtual.uuid, 
                                                                  estadoFiltros.filtar_por_tipo_unidade, estadoFiltros.filtrar_por_termo, 
                                                                  estadoFiltros.filtrar_por_rf, estadoFiltros.filtrar_por_tecnico);
    
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
        await buscarUnidadesParaAtribuicao(dreUuid, periodoAtual.uuid);
        setLoading(false)
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

    const tratarSelecionado = (e, unidadeUuid) => {
        console.log("Selecionado");
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
                                    <a className="float-right" onClick={(e) => e} style={{textDecoration:"underline", cursor:"pointer"}}>
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
        atribuirData.unidades = unis;
        try {
            let response = await atribuirTecnicos(atribuirData);
            buscarUnidadesParaAtribuicao(dreUuid, periodoAtual.uuid);
            console.log("Tecnico atribuido com sucesso!");
        } catch(e) {
            console.log("erro ao atribuir");
            console.log(e);
        }
        setTecnico("");
        setLoading(false);
    }
    
    return (
        <>  
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
            dadosDiretoria ?
            (
                <>
                <div className="d-flex bd-highlight">
                    <div className="p-2 flex-grow-1 bd-highlight">
                        <h1 className="titulo-itens-painel mt-5">Atribuições por unidade escolar da Diretoria {dadosDiretoria.nome}</h1>
                    </div>
                </div>
                <div className="page-content-inner">
                    <div className="row">
                        <div className="col-12">
                            <MenuInterno    
                                caminhos_menu_interno={UrlsMenuInterno}
                            />
                        </div>
                    </div>
                    {/* Seleção Período */}
                    <div className="row align-items-center mb-3">
                        <div className="col-5">
                            <h2 className="subtitulo-itens-painel-out mb-0">Selecione o período para as atribuições:</h2>
                        </div>
                        <div className="col-7">
                            <select
                                value={periodoAtual !== null ? periodoAtual.uuid : ""}
                                //defaultValue=""
                                onChange={(e) => mudancasPeriodo(e.target.value)}
                                name="periodo"
                                id="periodo"
                                className="form-control"
                            >
                                {periodos && periodos.map((periodo)=>
                                    <option key={periodo.uuid} value={periodo.uuid}>{`${periodo.referencia} - ${periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo.data_inicio_realizacao_despesas) : "-"} até ${periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo.data_fim_realizacao_despesas) : "-"}`}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <hr />
                    <Filtros
                        estadoFiltros={estadoFiltros}
                        mudancasFiltros={mudancasFiltros}
                        enviarFiltrosAssociacao={enviarFiltrosAssociacao}
                        limparFiltros={limparFiltros}
                        tabelaAssociacoes={tabelaAssociacoes}
                        tecnicosList={tecnicosList}
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
                                <Column header="checks" body={selecionarTemplate}/>
                                <Column field='codigo_eol' header='Código Eol'/>
                                <Column field='nome' header='Nome completo'/>
                                <Column field='atribuicao.tecnico.nome' header='Nome completo'/>

                                {/* <Column body={conferirAtribuicoesTemplate} header='Unidades escolares atribuidas'
                                        style={{textAlign: 'center'}}/>

                                <Column body={tableActionsTemplate} header='Ações'
                                        style={{textAlign: 'center', width: '8em'}}/> */}
                            </DataTable>
                            ) : buscaUtilizandoFiltros ?
                                <MsgImgCentralizada
                                    texto='Não encontramos resultados, verifique os filtros e tente novamente.'
                                    img={Img404}
                                />
                              :
                                <MsgImgLadoDireito
                                    texto='Não encontramos nenhuma Unidade com este perfil, tente novamente'
                                    img={Img404}
                                />}
                        </div>
                    </div>
                </div>
                </>)
            : null}
        </>
    )
} 