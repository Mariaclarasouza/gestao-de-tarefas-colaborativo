ADR 013 - Configuração de Variáveis de Ambiente
Status: Aceito
Contexto:
 Configurações sensíveis e variáveis dependem do ambiente (desenvolvimento, produção).
Decisão:
 Utilizar a biblioteca dotenv para gerenciar variáveis de ambiente via arquivos .env.
Consequências:
Facilita a configuração sem expor dados sensíveis no código.


Necessidade de cuidado para não versionar arquivos .env com dados confidenciais.
