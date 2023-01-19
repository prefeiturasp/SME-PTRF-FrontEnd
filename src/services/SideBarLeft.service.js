const setItemActive = (id_novo_item) => {
    let novo_item = document.getElementById(id_novo_item)

    // Força o click no item do menu para alterar o item ativo no momento
    novo_item.click() 
}


export const SidebarLeftService = {
    setItemActive,
}