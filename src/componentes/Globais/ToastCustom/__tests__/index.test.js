import { toastCustom } from "../index";
import { toast } from "react-toastify";

jest.mock("react-toastify");

describe("ToastCustom", () => {
    let setPropertyMock;

    beforeEach(() => {
        toast.success = jest.fn();
        toast.error = jest.fn();
        toast.info = jest.fn();
        toast.warning = jest.fn();
        
        document.querySelector = jest.fn().mockReturnValue({
            offsetWidth: 500
        });
        
        setPropertyMock = jest.fn();
        Object.defineProperty(document.documentElement.style, 'setProperty', {
            value: setPropertyMock,
            writable: true
        });
    });

    it("ToastCustomSuccess chama toast.success", () => {
        toastCustom.ToastCustomSuccess("Título", "Texto");
        expect(toast.success).toHaveBeenCalled();
    });

    it("ToastCustomError chama toast.error", () => {
        toastCustom.ToastCustomError("Título", "Texto");
        expect(toast.error).toHaveBeenCalled();
    });

    it("ToastCustomInfo chama toast.info", () => {
        toastCustom.ToastCustomInfo("Título", "Texto");
        expect(toast.info).toHaveBeenCalled();
    });

    it("ToastCustomWarning chama toast.warning", () => {
        toastCustom.ToastCustomWarning("Título", "Texto");
        expect(toast.warning).toHaveBeenCalled();
    });

    it("ToastCustomGrandeSuccess configura largura personalizada", () => {
        toastCustom.ToastCustomGrandeSuccess("Título", "Texto");
        
        expect(document.querySelector).toHaveBeenCalledWith('.page-content-inner');
        expect(setPropertyMock).toHaveBeenCalledWith('--toastify-toast-width', '500px');
        expect(toast.success).toHaveBeenCalled();
    });

    it("ToastCustomColorInfo configura cores personalizadas", () => {
        toastCustom.ToastCustomColorInfo("Título", "Texto", "#ff0000", "#00ff00");
        
        expect(setPropertyMock).toHaveBeenCalledWith('--toastify-icon-color-info', '#ff0000');
        expect(setPropertyMock).toHaveBeenCalledWith('--toastify-color-progress-info', '#00ff00');
        expect(toast.info).toHaveBeenCalled();
    });

    it("ToastCustomSuccess aceita callback onClose", () => {
        const onCloseMock = jest.fn();
        toastCustom.ToastCustomSuccess("Título", "Texto", 'success', 'top-right', true, onCloseMock);
        expect(toast.success).toHaveBeenCalled();
    });

    it("ToastCustomWarning aceita callback onClose", () => {
        const onCloseMock = jest.fn();
        toastCustom.ToastCustomWarning("Título", "Texto", 'warning', 'top-right', true, onCloseMock);
        expect(toast.warning).toHaveBeenCalled();
    });

    it("ToastCustomColorInfo aceita callback onClose", () => {
        const onCloseMock = jest.fn();
        toastCustom.ToastCustomColorInfo("Título", "Texto", '#000', '#fff', 'info', 'top-right', true, onCloseMock);
        expect(toast.info).toHaveBeenCalled();
    });
});

