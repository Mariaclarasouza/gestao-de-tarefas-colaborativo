package tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.pages.PaginaLogin;
import org.pages.PaginaPrincipal;
import java.time.Duration;
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class LoginTests {

    private WebDriver driver;
    private PaginaLogin paginaLogin;

    private final String URL = "http://localhost:5173/login";

    @BeforeEach
    void setUp() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.manage().window().maximize();
        paginaLogin = new PaginaLogin(driver);
        driver.get(URL);
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    @Order(1)
    @DisplayName("Cenario 108: Login com credenciais válidas")
    void testeLoginComSucesso() {
        PaginaPrincipal paginaPrincipal = paginaLogin.fazerLogin("sol@teste.com", "123456");
        Assertions.assertTrue(paginaPrincipal.verificarLoginComSucesso(), "A saudação ao usuário não foi encontrada após o login.");
    }

    @Test
    @Order(2)
    @DisplayName("Cenario 2: Login com senha incorreta")
    void testeLoginComSenhaIncorreta() {
        paginaLogin.fazerLogin("sol@teste.com", "senhaErrada");
        String msg = paginaLogin.getMensagemDeErro();
        Assertions.assertEquals("Senha incorreta", msg, "A mensagem de erro para senha incorreta não é a esperada.");
    }

    @Test
    @Order(3)
    @DisplayName("Cenario 3: usuário inexistente")
    void testeLoginComUsuarioInexistente() {
        paginaLogin.fazerLogin("Ravane@teste.com", "ravane123456");
        String msg = paginaLogin.getMensagemDeErro();
        Assertions.assertEquals("Usuário não encontrado", msg, "A mensagem de erro para usuário inexistente não é a esperada.");
    }
}