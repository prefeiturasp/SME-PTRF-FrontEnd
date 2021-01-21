import React, {useCallback, useEffect, useMemo, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {UrlsMenuInterno} from "./UrlsMenuInterno";
import {MenuInterno} from "../../../../Globais/MenuInterno";
import {getAssociacoes, getTabelaAssociacoes, getFiltrosAssociacoes} from "../../../../../services/sme/Parametrizacoes.service";
import {TabelaAssociacoes} from "./TabelaAssociacoes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {Filtros} from "./Filtros";
import ModalFormAssociacoes from "./ModalFormAssociacoes";

export const Associacoes = () => {

    const [count, setCount] = useState(0);
    const [listaDeAssociacoes, setListaDeAssociacoes] = useState([]);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState([]);

    const carregaTodasAsAssociacoes = useCallback(async () => {
        let todas_associacoes = await getAssociacoes();
        console.log("Associacoes ", todas_associacoes);
        setListaDeAssociacoes(todas_associacoes);
    }, []);

    useEffect(() => {
        carregaTodasAsAssociacoes();
    }, [carregaTodasAsAssociacoes]);

    const carregaTabelasAssociacoes = useCallback(async () => {
        let tabela = await getTabelaAssociacoes();
        console.log("TABELA ", tabela);
        setTabelaAssociacoes(tabela);
    }, []);

    useEffect(() => {
        carregaTabelasAssociacoes();
    }, [carregaTabelasAssociacoes]);

    // Quando a state de listaDeAssociacoes sofrer alteração
    const totalDeAssociacoes = useMemo(() => listaDeAssociacoes.length, [listaDeAssociacoes]);

    // Filtros
    const initialStateFiltros = {
        filtrar_por_associacao: "",
        filtrar_por_dre: "",
        filtrar_por_tipo_ue: "",
    };
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);

    const handleChangeFiltros = useCallback((name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    }, [stateFiltros]);

    const handleSubmitFiltros = async () => {
        let associacoes_filtradas = await getFiltrosAssociacoes(stateFiltros.filtrar_por_tipo_ue, stateFiltros.filtrar_por_dre, stateFiltros.filtrar_por_associacao);
        console.log("handleSubmitFiltros ", associacoes_filtradas);
        setListaDeAssociacoes(associacoes_filtradas);
    };

    const limpaFiltros = async () => {
        setStateFiltros(initialStateFiltros);
        await carregaTodasAsAssociacoes();
    };

    // Modais
    const initialStateFormModal = {
        referencia: "",
        data_prevista_repasse: "",
        data_inicio_realizacao_despesas: "",
        data_fim_realizacao_despesas: "",
        data_inicio_prestacao_contas: "",
        data_fim_prestacao_contas: "",
        editavel:true,
        uuid:"",
        id:"",
        operacao: 'create',
    };

    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);

    const handleCloseFormModal = useCallback(()=>{
        setStateFormModal(initialStateFormModal);
        setShowModalForm(false)
    }, [initialStateFormModal]);
    
    // Tabela Associacoes
    const rowsPerPage = 20;

    const handleEditFormModalAssociacoes = useCallback( async (rowData) =>{
        console.log("handleEditFormModalAssociacoes handleEditFormModalAssociacoes", rowData);
        setShowModalForm(true)

    }, []);

    const handleSubmitModalFormAssociacoes = useCallback(async ()=>{

    }, []);

    const acoesTemplate = useCallback((rowData) =>{
        return (
            <div>
                <button className="btn-editar-membro" onClick={()=>handleEditFormModalAssociacoes(rowData)}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faEdit}
                    />
                </button>
            </div>
        )
    }, [handleEditFormModalAssociacoes]);
    

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Associações</h1>
            <div className="page-content-inner">
                <MenuInterno
                    caminhos_menu_interno={UrlsMenuInterno}
                />
                <Filtros
                    stateFiltros={stateFiltros}
                    handleChangeFiltros={handleChangeFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                    limpaFiltros={limpaFiltros}
                    tabelaAssociacoes={tabelaAssociacoes}
                />
                <button onClick={()=>setCount(prevState => prevState+1)}>Botão Sem Use Calback - {count}</button>
                <p>Exibindo <span className='total-acoes'>{totalDeAssociacoes}</span> associações</p>
                <TabelaAssociacoes
                    rowsPerPage={rowsPerPage}
                    listaDeAssociacoes={listaDeAssociacoes}
                    acoesTemplate={acoesTemplate}
                />
                <section>
                    <ModalFormAssociacoes
                        show={showModalForm}
                        stateFormModal={stateFormModal}
                        handleClose={handleCloseFormModal}
                        handleSubmitModalFormAssociacoes={handleSubmitModalFormAssociacoes}
                    />
                </section>
            </div>
        </PaginasContainer>
    )
};