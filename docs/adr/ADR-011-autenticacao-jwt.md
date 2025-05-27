ADR 011 - Uso de JWT para Autenticação
Status: Aceito
Contexto:
 A autenticação é essencial para controlar o acesso às funcionalidades do sistema.
Decisão:
 Implementar autenticação usando JSON Web Tokens (JWT) via biblioteca jsonwebtoken.
Consequências:
Autenticação stateless e escalável.


Necessidade de gerenciar segurança dos tokens.


Pode exigir renovação de tokens para sessões longas.


