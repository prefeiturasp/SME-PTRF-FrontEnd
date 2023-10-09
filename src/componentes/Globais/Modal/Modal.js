import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {Modal} from "react-bootstrap";
import { closeModal as close } from "../../../store/reducers/componentes/Globais/Modal/actions";


function ModalDialog() {
  const dispatch = useDispatch();
  const {open, options} = useSelector(state => state.Modal)

  function handleClose() {
    dispatch(close());
  }
  return (
    <Modal
        centered
        show={open}
        onHide={handleClose}
    >
      {options.children}
    </Modal>
  );
}

export default ModalDialog;