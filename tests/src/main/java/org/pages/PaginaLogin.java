package org.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class PaginaLogin extends Pagina {

    @FindBy(name = "email")
    private WebElement campoEmail;

    @FindBy(name = "password")
    private WebElement campoSenha;

    @FindBy(css ="button.btn.btn-primary")
    private WebElement botaoEntrar;

    @FindBy(css = ".alert.alert-danger")
    private WebElement mensagemDeErro;

    @FindBy(css = "a[href='/register']")
    private WebElement linkParaRegistro;

    public PaginaLogin(WebDriver driver) {
        super(driver);
    }


    public void preencherEmail(String email) {
        campoEmail.sendKeys(email);
    }

    public void preencherSenha(String senha) {
        campoSenha.sendKeys(senha);
    }

    public void clicarBotaoEntrar() {
        botaoEntrar.click();
    }

    public String getMensagemDeErro() {
        wait.until(d -> mensagemDeErro.isDisplayed());
        return mensagemDeErro.getText();
    }

    public PaginaRegistro navegarParaRegistro() {
        linkParaRegistro.click();
        return new PaginaRegistro(driver);
    }

    public PaginaPrincipal fazerLogin(String email, String senha) {
        this.preencherEmail(email);
        this.preencherSenha(senha);
        this.clicarBotaoEntrar();
        return new PaginaPrincipal(driver);
    }
}