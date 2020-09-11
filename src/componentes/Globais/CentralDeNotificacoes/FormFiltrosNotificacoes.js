import React from "react";

export const FormFiltrosNotificacoes = () => {
    return (
        <>

              <div className="container-form-filtros mt-4">
                 <h5>Filtros</h5>
                 <form>
                    <div className="form-row">
                       <div className="col">
                          <label htmlFor="tipo_notificacao">Por tipo de notificação</label>
                          <input type="text" className="form-control" placeholder="First name"/>
                       </div>
                       <div className="col">
                          <label htmlFor="inputEmail4">Email</label>
                          <input type="text" className="form-control" placeholder="Last name"/>
                       </div>
                    </div>
                 </form>
              </div>


        </>
    );
};