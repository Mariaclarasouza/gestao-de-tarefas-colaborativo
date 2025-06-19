package org.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class PaginaProjetos extends Pagina {

    @FindBy(css = ".create-btn")
    private WebElement botaoCriarProjeto;

    @FindBy(css = "input[placeholder='Nome do projeto']")
    private WebElement campoNomeProjeto;

    @FindBy(css = "textarea[placeholder='Descrição do projeto']")
    private WebElement campoDescricaoProjeto;

    @FindBy(css = "button[type='submit']")
    private WebElement botaoSalvarProjeto;

    private String seletorProjetoNaLista = "//div[contains(@class, 'project-card') and contains(.,'%s')]";

    public PaginaProjetos(WebDriver driver) {
        super(driver);
    }

    public void criarNovoProjeto(String nome, String descricao) {
        wait.until(ExpectedConditions.elementToBeClickable(botaoCriarProjeto)).click();
        wait.until(ExpectedConditions.visibilityOf(campoNomeProjeto));
        campoNomeProjeto.sendKeys(nome);
        campoDescricaoProjeto.sendKeys(descricao);
        botaoSalvarProjeto.click();
    }

    public boolean verificarSeProjetoExisteNaLista(String nomeDoProjeto) {
        By seletorDinamico = By.xpath(String.format(seletorProjetoNaLista, nomeDoProjeto));
        wait.until(ExpectedConditions.visibilityOfElementLocated(seletorDinamico));
        return !driver.findElements(seletorDinamico).isEmpty();
    }
}