import { useNavigate } from "react-router-dom";
import { useDeleteBemProduzido } from "./useDeleteBemProduzido";

export const useExcluirBemProduzido = () => {
    const navigate = useNavigate();
    
    const { mutationDelete } = useDeleteBemProduzido();

    const handleExcluirBem = async ({ uuid, onSuccess }) => {
        try {
            await mutationDelete.mutateAsync(uuid);
            onSuccess?.();
            navigate("/lista-situacao-patrimonial");
        } catch (error) {
            console.error(error);
        }
    };

    return { handleExcluirBem, isLoading: mutationDelete.isPending, };
};