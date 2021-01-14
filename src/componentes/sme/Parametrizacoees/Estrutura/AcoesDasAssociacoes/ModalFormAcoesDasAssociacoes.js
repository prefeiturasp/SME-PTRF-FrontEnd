import React, {useState} from "react";
import {ModalFormParametrizacoesAcoesDaAssociacao} from "../../../../Globais/ModalBootstrap";
import AutoCompleteAssociacoes from "./AutoCompleteAssociacoes";
export const ModalFormAcoesDaAssociacao = (props) => {


    const initialStateForm = {
        associacao: "",
        acao: "",
        status: "",
    };

    const [associacaoAutocomplete, setAssociacaoAutocomplete] = useState(null);
    const [stateFormModal, setStateFormModal] = useState(initialStateForm);
    const [readOnly, setReadOnly] = useState(true);

    const recebeAcaoAutoComplete = (selectAcao) =>{
        setAssociacaoAutocomplete(selectAcao);
        if (selectAcao){
            setStateFormModal({
                ...stateFormModal,
                associacao: selectAcao.associacao.uuid
            });
            setReadOnly(false)
        }
    };

    const handleChangeForm = (name, value) => {
        setStateFormModal({
            ...stateFormModal,
            [name]: value
        });
    };

    console.log('associacaoAutocomplete ', associacaoAutocomplete)

    const bodyTextarea = () => {
        return (
            <>
                <form onSubmit={props.handleSubmitModalFormAcoesDasAssociacoes}>
                    <AutoCompleteAssociacoes
                        todasAsAcoesAutoComplete={props.todasAsAcoesAutoComplete}
                        recebeAcaoAutoComplete={recebeAcaoAutoComplete}
                    />
                    <div className='row mt-3'>
                        <div className='col'>
                            <label htmlFor="cod_eol">Código EOL</label>
                            <input
                                value={associacaoAutocomplete && associacaoAutocomplete.associacao.unidade.codigo_eol ? associacaoAutocomplete.associacao.unidade.codigo_eol : ''}
                                //onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                                name='cod_eol'
                                id="cod_eol"
                                type="text"
                                className="form-control"
                                readOnly={true}
                            />
                        </div>

                        <div className='col'>
                            <label htmlFor="acao">Ação</label>
                            <select
                                value={stateFormModal.acao}
                                onChange={(e) => handleChangeForm(e.target.name, e.target.value)}
                                name='acao'
                                id="acao"
                                className="form-control"
                                disabled={readOnly}
                            >
                                <option value=''>Selecione ação</option>
                                {props.listaTiposDeAcao && props.listaTiposDeAcao.length > 0 && props.listaTiposDeAcao.map(item => (
                                    <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className='col'>
                            <label htmlFor="status">Status</label>
                            <select
                                value={stateFormModal.status}
                                onChange={(e) => handleChangeForm(e.target.name, e.target.value)}
                                name='status'
                                id="status"
                                className="form-control"
                                disabled={readOnly}
                            >
                                <option value=''>Selecione o status</option>
                                <option value='ATIVA'>Ativa</option>
                                <option value='INATIVA'>Inativa</option>
                            </select>
                        </div>
                    </div>

                    <div className='row mt-3'>
                        <div className='col'>
                            <p>Uuid</p>
                            <p>{associacaoAutocomplete && associacaoAutocomplete.uuid ? associacaoAutocomplete.uuid : ''}</p>
                        </div>
                        <div className='col'>
                            <p>ID</p>
                            <p>{associacaoAutocomplete && associacaoAutocomplete.id ? associacaoAutocomplete.id : ''}</p>
                        </div>
                    </div>

                    <div className="p-Y bd-highlight">
                        <button onClick={props.handleClose} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                        <button
                            disabled={readOnly || !stateFormModal.acao || !stateFormModal.status}
                            onClick={()=>props.handleSubmitModalFormAcoesDasAssociacoes(stateFormModal)}
                            type="button"
                            className="btn btn btn-success mt-2"
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            </>
        )
    };

    return (
        <ModalFormParametrizacoesAcoesDaAssociacao
            show={props.show}
            titulo='Adicionar ação de associação'
            onHide={props.handleClose}
            bodyText={bodyTextarea()}
            primeiroBotaoOnclick={props.handleClose}
        />
    )
};