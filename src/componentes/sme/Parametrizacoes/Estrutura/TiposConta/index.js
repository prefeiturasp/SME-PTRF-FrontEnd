import React, {useCallback, useEffect, useMemo, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {
    deleteTipoConta,
    getFiltroTiposContas,
    getTiposContas,
    patchTipoConta,
    postTipoConta,
} from "../../../../../services/sme/Parametrizacoes.service";
import Loading from "../../../../../utils/Loading";
import TabelaTiposConta from "./TabelaTiposConta";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {BtnAddTipoConta} from "./BtnAddTipoConta";
import {Filtros} from "./Filtros";
import ModalAddEditTipoConta from "./ModalAddEditTipoConta";
import { ModalConfirmDeleteTipoConta } from "./ModalConfirmDeleteTipoConta";
import {toastCustom} from "../../../../Globais/ToastCustom";
import { EditIconButton } from "../../../../Globais/UI/Button";

export const TiposConta = () => {

    const rowsPerPage = 20;
    const [listaDeTiposContas, setListaDeTiposContas] = useState([]);
    const [loading, setLoading] = useState(true);

    const carregaTiposConta = useCallback(async ()=>{
        setLoading(true);
        let tiposContas = await getTiposContas();
        setListaDeTiposContas(tiposContas);
        setLoading(false);
    }, []);
    
    useEffect(() => {
        carregaTiposConta();
    }, [carregaTiposConta])
    
    const totalTiposDeConta = useMemo(() => listaDeTiposContas.length, [listaDeTiposContas]);

    // Filtros
    const initialStateFiltros = {
        filtrar_por_referencia: "",
    };
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    
    const handleChangeFiltros = useCallback((name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    }, [stateFiltros]);

    const handleSubmitFiltros = async () => {
        setLoading(true);
        let tipos_contas_filtradas = await getFiltroTiposContas(stateFiltros.nome);
        setListaDeTiposContas(tipos_contas_filtradas);
        setLoading(false);
    };

    // Modal
    const initialStateFormModal = {
        nome: "",
        banco_nome: "",
        agencia: "",
        numero_conta: "",
        numero_cartao: "",
        apenas_leitura: false,
        permite_inativacao: false, 
        uuid: "",
        id: "",
        operacao: 'create',
    };

    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [showModalConfirmDeleteTipoConta, setShowModalConfirmDeleteTipoConta] = useState(false);

    const handleEditFormModalTiposConta = useCallback( async (rowData) =>{
        setStateFormModal({
            ...stateFormModal,
            nome: rowData.nome,
            banco_nome: rowData.banco_nome,
            agencia: rowData.agencia,
            numero_conta: rowData.numero_conta,
            numero_cartao: rowData.numero_cartao,
            apenas_leitura: rowData.apenas_leitura,
            permite_inativacao: rowData.permite_inativacao, 
            uuid: rowData.uuid,
            id: rowData.id,
            operacao: 'edit',
        });
        setShowModalForm(true)
    }, [stateFormModal]);
    
    const acoesTemplate = useCallback((rowData) =>{
        return (
            <EditIconButton
                onClick={() => handleEditFormModalTiposConta(rowData)}
            />            
        )
    }, [handleEditFormModalTiposConta]);

    const handleSubmitModalFormTiposConta = useCallback(async (values)=>{
        let payload = {
            nome: values.nome,
            banco_nome: values.banco_nome,
            agencia: values.agencia,
            numero_conta: values.numero_conta,
            numero_cartao: values.numero_cartao,
            apenas_leitura: values.apenas_leitura,
            permite_inativacao: values.permite_inativacao 
        };

        if (values.operacao === 'create'){
            try{
                await postTipoConta(payload);
                toastCustom.ToastCustomSuccess('Inclusão do tipo de conta realizada com sucesso.', 'O tipo de conta foi adicionado ao sistema com sucesso.')
                setShowModalForm(false);
                await carregaTiposConta();
            }catch (e) {
                if (e.response.data && e.response.data.non_field_errors) {
                    toastCustom.ToastCustomError('Erro ao criar tipo de conta.', 'Já existe um tipo de conta com esse nome.')
                } else {
                    toastCustom.ToastCustomError('Erro ao criar tipo de conta.', 'Houve um erro ao tentar criar o tipo de conta.')
                }
            }

        }else {
            try {
                await patchTipoConta(values.uuid, payload);
                toastCustom.ToastCustomSuccess('Edição do tipo de conta realizada com sucesso.', 'O tipo de conta foi editado no sistema com sucesso.')
                setShowModalForm(false);
                await carregaTiposConta();
            }catch (e) {
                if (e.response.data && e.response.data.non_field_errors) {
                    toastCustom.ToastCustomError('Erro ao editar tipo de conta.', 'Já existe um tipo de conta com esse nome.')
                } else {
                    toastCustom.ToastCustomError('Erro ao editar tipo de conta.', 'Houve um erro ao tentar editar o tipo de conta.')
                }
            }
            setLoading(false);
        }
    }, [carregaTiposConta]);

    const onDeleteTipoContaTrue = useCallback(async ()=>{
        setLoading(true);
        try {
            await deleteTipoConta(stateFormModal.uuid);
            toastCustom.ToastCustomSuccess('Remoção do tipo de conta efetuada com sucesso.', 'O tipo de conta foi removido do sistema com sucesso.')
            setShowModalConfirmDeleteTipoConta(false);
            setShowModalForm(false);
            await carregaTiposConta();
        }catch (err) {
            setShowModalConfirmDeleteTipoConta(false);
            toastCustom.ToastCustomError('Erro na remoção do tipo de conta.', err.response.data.erro ? err.response.data.erro : 'O tipo de conta não foi removido do sistema.')
        }
        setLoading(false);
    }, [stateFormModal]);

    const handleCloseFormModal = useCallback(()=>{
        setStateFormModal(initialStateFormModal);
        setShowModalForm(false)
    }, [initialStateFormModal]);

    const handleCloseConfirmDeleteTipoConta = useCallback(()=>{
        setShowModalConfirmDeleteTipoConta(false)
    }, []);

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Tipos de conta</h1>
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
                <>
                    <div className="page-content-inner">
                        <BtnAddTipoConta
                            FontAwesomeIcon={FontAwesomeIcon}
                            faPlus={faPlus}
                            setShowModalForm={setShowModalForm}
                            initialStateFormModal={initialStateFormModal}
                            setStateFormModal={setStateFormModal}
                        />
                        <Filtros
                            stateFiltros={stateFiltros}
                            handleChangeFiltros={handleChangeFiltros}
                            handleSubmitFiltros={handleSubmitFiltros}
                        />
                        <p>Exibindo <span className='total-acoes'>{totalTiposDeConta}</span> tipos de conta</p>
                        <TabelaTiposConta
                            rowsPerPage={rowsPerPage}
                            listaDeTiposContas={listaDeTiposContas}
                            acoesTemplate={acoesTemplate}
                        />
                    </div>
                    <section>
                        <ModalAddEditTipoConta
                            show={showModalForm}
                            stateFormModal={stateFormModal}
                            handleClose={handleCloseFormModal}
                            handleSubmitModalFormTiposConta={handleSubmitModalFormTiposConta}
                            setShowModalConfirmDeleteTipoConta={setShowModalConfirmDeleteTipoConta}
                        />
                    </section>
                    <section>
                        <ModalConfirmDeleteTipoConta
                            show={showModalConfirmDeleteTipoConta}
                            handleClose={handleCloseConfirmDeleteTipoConta}
                            onDeleteTipoContaTrue={onDeleteTipoContaTrue}
                            titulo="Excluir Tipo de Conta"
                            texto="<p>Deseja realmente excluir este Tipo de Conta?</p>"
                            primeiroBotaoTexto="Cancelar"
                            primeiroBotaoCss="base-verde-outline"
                            segundoBotaoCss="base-vermelho"
                            segundoBotaoTexto="Excluir"
                        />
                    </section>
                </>
            }
        </PaginasContainer>
    )
};