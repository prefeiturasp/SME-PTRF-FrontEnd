import React, {useEffect, useState} from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit} from '@fortawesome/free-solid-svg-icons'

export const BasicFunction2 = () =>{

    const SortableItem = SortableElement(({value}) =>
        <li className="d-flex bd-highlight border mt-2">
            <div className="p-2 flex-grow-1 bd-highlight">{value}</div>
            <div className="p-2 bd-highlight">
                <button type='button' className="btn-editar-comentario ml-2">
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: '#A4A4A4'}}
                        icon={faEdit}
                    />
                </button>
            </div>
        </li>
    );
    const SortableList = SortableContainer(({items}) => {

        return (
            <>
                <ul>
                    {items.map(({ordem, name}, index) => (
                        <SortableItem key={`item-${ordem}`} index={index} value={name} />
                    ))}
                </ul>
            </>
        );
    });

    const [items, setItems] = useState([
        { ordem: 1, name: 'Priscilla Cormier', depth: 0 },
        { ordem: 2, name: 'Miss Erich Bartoletti', depth: 0 },
        { ordem: 3, name: 'Alison Friesen', depth: 0 },
        { ordem: 4, name: 'Bernita Mayert', depth: 0 },
        { ordem: 5, name: 'Garfield Berge', depth: 0 },
    ]);

    const [itensReordenados, setItensReordenados] = useState([])

    useEffect(()=>{
        setItensReordenados(items)
        reordenarArray()
    }, [items])

    const onSortEnd = ({oldIndex, newIndex}) => {
        setItems(arrayMove(items, oldIndex, newIndex));
    };

    const reordenarArray = () =>{
        if (items && items.length > 0 ){
            let arrayAnalises = [];
            items.map((item, index)=>{
                arrayAnalises.push({
                    ordem: index+1,
                    name:item.name,
                    depth:item.depth
                })
            });
            setItensReordenados(arrayAnalises)
        }
    };


    console.log("Itens Reordenados ", itensReordenados)

    return(
        <PaginasContainer>
        <h1 className="titulo-itens-painel mt-5">Resumo dos Recursos</h1>
        <div className="page-content-inner">
            <SortableList items={items} onSortEnd={onSortEnd} />
        </div>
        </PaginasContainer>
    )
};
