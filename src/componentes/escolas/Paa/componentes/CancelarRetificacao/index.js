import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { visoesService } from "../../../../../services/visoes.service";
import { usePostCancelarRetificacaoPaa } from "./hooks/usePostCancelarRetificacao";

const CancelarRetificacao = ({ paa }) => {
  const flagRetificacao = visoesService.featureFlagAtiva("paa-retificacao");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { mutationPost } = usePostCancelarRetificacaoPaa();

  const onClose = () => {
    if (mutationPost.isPending) return;
    setOpen(false);
  };

  const handleCancelarRetificacaoPaa = () => {
    setOpen(true);
  };

  const submitCancelarRetificacao = async () => {
    try {
      await mutationPost.mutateAsync({
        paaUuid: paa.uuid,
      });

      navigate("/paa-vigente-e-anteriores");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return flagRetificacao && paa?.status === "EM_RETIFICACAO" ? (
    <>
      <button
        className="btn btn-success d-flex align-items-center"
        onClick={handleCancelarRetificacaoPaa}
        style={{ minWidth: "180px", justifyContent: "center" }}
      >
        Cancelar Retificação
      </button>

      <Modal
        centered
        show={open}
        onHide={onClose}
        size="md"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Cancelar retificação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            As alterações da retificação serão apagadas e não poderão ser <br />
            recuperadas. Deseja continuar?
          </p>
        </Modal.Body>
        <Modal.Footer id="main">
          <button
            type="button"
            className="btn btn-outline-success"
            disabled={mutationPost.isPending}
            onClick={onClose}
          >
            Voltar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={mutationPost.isPending}
            onClick={() => submitCancelarRetificacao()}
          >
            {mutationPost.isPending ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" /> &nbsp;
                Cancelando...
              </>
            ) : (
              "Cancelar retificação"
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  ) : null;
};

export default CancelarRetificacao;
