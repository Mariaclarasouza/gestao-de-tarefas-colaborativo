package tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.pages.PaginaLogin;
import org.pages.PaginaPrincipal;
import org.pages.PaginaProjetos;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

public class ProjetoTests {

    private WebDriver driver;
    private PaginaPrincipal paginaPrincipal;

    @BeforeEach
    void setUp() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        Map<String, Object> prefs = new HashMap<>();
        prefs.put("credentials_enable_service", false);
        prefs.put("profile.password_manager_enabled", false);
        options.setExperimentalOption("prefs", prefs);

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.manage().window().maximize();

        driver.get("http://localhost:5173/login");
        PaginaLogin paginaLogin = new PaginaLogin(driver);
        paginaPrincipal = paginaLogin.fazerLogin("sol@teste.com", "123456");
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    @DisplayName("Cenario 111: Cria um novo Projeto")
    void testeCriarProjetoComSucesso() {
        PaginaProjetos paginaProjetos = paginaPrincipal.navegarParaProjetos();


        String nomeProjeto = "Projeto A - " + System.currentTimeMillis();
        String descricaoProjeto = "Reunião as 10:00.";
        paginaProjetos.criarNovoProjeto(nomeProjeto, descricaoProjeto);

        Assertions.assertTrue(paginaProjetos.verificarSeProjetoExisteNaLista(nomeProjeto),
                "O projeto criado não foi encontrado na lista.");
    }
}