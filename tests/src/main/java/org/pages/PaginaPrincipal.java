package org.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class PaginaPrincipal extends Pagina {

    @FindBy(id = "user-dropdown")
    private WebElement saudacaoUsuario;

    @FindBy(css = "a[href='/projetos']")
    private WebElement linkProjetos;

    public PaginaPrincipal(WebDriver driver) {
        super(driver);
    }

    public boolean verificarLoginComSucesso() {
        wait.until(ExpectedConditions.visibilityOf(saudacaoUsuario));
        return saudacaoUsuario.isDisplayed();
    }
    public PaginaProjetos navegarParaProjetos() {
        wait.until(ExpectedConditions.elementToBeClickable(linkProjetos)).click();
        return new PaginaProjetos(driver); // Retorna o objeto da próxima página
    }


}