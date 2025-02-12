import React, {useState, memo} from 'react';
import {AutoComplete} from 'primereact/autocomplete';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import { Tag } from '../../../../../Globais/Tag';
import { useContext } from "react";
import { RepassesContext } from "../context/Repasse";


const AutoCompleteAssociacoes = ({todasAsAssociacoesAutoComplete, setFieldValue, disabled = false, loadingAssociacoes = false}) => {
    const [selectedAssociacao, setSelectedAssociacao] = useState(null);
    const [filteredAssociacoes, setFilteredAssociacoes] = useState(null);
    const {stateFormModal, setStateFormModal} = useContext(RepassesContext)

    
    const searchAssociacao = (event) => {
        setTimeout(() => {
            let filteredAssociacoes;
            if (!event.query.trim().length) {
                filteredAssociacoes = [...todasAsAssociacoesAutoComplete];
            } else {
                filteredAssociacoes = todasAsAssociacoesAutoComplete.filter((associacao) => {
                    return associacao.unidade.nome_com_tipo.toLowerCase().includes(event.query.toLowerCase()) || associacao.unidade.codigo_eol.includes(event.query.toLowerCase())
                })
            }
            setFilteredAssociacoes(filteredAssociacoes);
        }, 250);
    }

    const itemTemplate = (item) => {
        if(item.encerrada) {
            return (
                <div className='d-flex' style={{opacity: 0.6}}>
                    <span className='mr-3'>{item.unidade.nome_com_tipo}</span>
                    <Tag label='Associação encerrada'/>
                </div>
            )
        } else {
            return item.unidade.nome_com_tipo;
        }
    };
    
    const handleChange = (e) => {
        if(e.value.encerrada){
            setSelectedAssociacao(null)
        } else {
            setSelectedAssociacao(e.value)
        }
    };

    const handleSelect = (e) => {
        if(e.value.encerrada){
            setFieldValue("associacao", "")

            setStateFormModal({
                ...stateFormModal,
                associacao: ""
            })
        } else {
            setFieldValue("associacao", e.value.uuid)

            setStateFormModal({
                ...stateFormModal,
                associacao: e.value.uuid
            })
        }        
    };

    return (
        <div className="d-flex bd-highlight">
            <div className="flex-grow-1 bd-highlight">
                <AutoComplete
                    value={selectedAssociacao}
                    name='associacao'
                    inputId='associacao'
                    suggestions={filteredAssociacoes}
                    completeMethod={searchAssociacao}
                    field="unidade.nome_com_tipo"
                    onChange={handleChange}
                    inputClassName="form-control"
                    onSelect={handleSelect}
                    style={{width: "100%", borderLeft:'none'}}
                    itemTemplate={itemTemplate}
                    disabled={disabled || loadingAssociacoes}
                    placeholder={`${loadingAssociacoes ? "Carregando unidades" : ""}`}
                />
            </div>
            <div className="bd-highlight ml-0 py-1 px-3 ml-n3 border-top border-right border-bottom">
                
                <FontAwesomeIcon
                    style={{fontSize: '18px', marginRight: "0", color: "#42474A"}}
                    icon={faSearch}
                />
                
            </div>
        </div>
    )
};

export default memo(AutoCompleteAssociacoes)