import React, {Component} from 'react';
import {render} from 'react-dom';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import {PaginasContainer} from "../../../paginas/PaginasContainer";

// const SortableItem = SortableElement(({value}) => <li>{value}</li>);
//
// const SortableList = SortableContainer(({items}) => {
//     return (
//         <ul>
//             {items.map((value, index) => (
//                 <SortableItem key={`item-${value}`} index={index} value={value} />
//             ))}
//         </ul>
//     );
// });
//
// class BasicFunction2 extends Component {
//     state = {
//         items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
//     };
//     onSortEnd = ({oldIndex, newIndex}) => {
//         this.setState(({items}) => ({
//             items: arrayMove(items, oldIndex, newIndex),
//         }));
//     };
//     render() {
//         return (
//             <PaginasContainer>
//                <h1 className="titulo-itens-painel mt-5">Resumo dos Recursos</h1>
//                 <div className="page-content-inner">
//                     <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />
//                 </div>
//             </PaginasContainer>
//             );
//     }
// }
//
// export default BasicFunction2


const SortableItem = SortableElement(({value}) => <li>{value}</li>);

const SortableList = SortableContainer(({items}) => {

    return (
        <ul>
            {items.map((value, index) => (
                <SortableItem key={`item-${value}`} index={index} value={value} />
            ))}
        </ul>
    );
});




export const BasicFunction2 = () =>{
    const [items, setItems] = React.useState(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6']);

    const onSortEnd = ({oldIndex, newIndex}) => {
        setItems(arrayMove(items, oldIndex, newIndex));
    };

    return(
        <PaginasContainer>
        <h1 className="titulo-itens-painel mt-5">Resumo dos Recursos</h1>
        <div className="page-content-inner">
            <SortableList items={items} onSortEnd={onSortEnd} />
        </div>
        </PaginasContainer>
    )
}










// export const BasicFunction2 = () =>{
//     const [items, setItems] = React.useState(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6']);
//
//     const onSortEnd = ({oldIndex, newIndex}) => {
//
//         console.log("oldIndex ", oldIndex)
//         console.log("newIndex ", newIndex)
//
//         setItems({
//             ...items,
//             items: arrayMove(items, oldIndex, newIndex),
//         });
//
//
//     };
//
//
//     return(
//         <PaginasContainer>
//             <h1 className="titulo-itens-painel mt-5">Resumo dos Recursos</h1>
//             <div className="page-content-inner">
//                 <SortableList items={items} onSortEnd={onSortEnd} />
//             </div>
//         </PaginasContainer>
//     )
// }