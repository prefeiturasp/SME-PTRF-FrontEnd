import { redirect } from "../redirect";

describe("redirect", () => {
    it("deve alterar window.location.href para a URL fornecida", () => {
        delete window.location;
        window.location = { href: "" };

        const url = "https://exemplo.com";
        redirect(url);

        expect(window.location.href).toBe(url);
    });
});
