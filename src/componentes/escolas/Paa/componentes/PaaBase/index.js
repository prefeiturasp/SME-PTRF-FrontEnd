import { ASSOCIACAO_UUID } from "../../../../../services/auth.service";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import ConteudoBase from "./ConteudoBase";
import { usePaaContext } from "../PaaContext";

const PaaBase = ({ ...rest }) => {
  const { paa } = usePaaContext();

  const associacaoUuid = () => localStorage.getItem(ASSOCIACAO_UUID);

  return (
      <PaginasContainer>
          {paa
            ? paa?.associacao === associacaoUuid() && (
                <ConteudoBase {...rest} />
              )
            : null}
      </PaginasContainer>
  );
};

export default PaaBase;
