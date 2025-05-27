ADR 005 - Bibliotecas e Ferramentas no Backend
Status: Aceito
Contexto:
 O backend precisou de funcionalidades específicas para autenticação, segurança, manipulação de arquivos, agendamento de tarefas e envio de e-mails.
Decisão:
 Foram escolhidas as seguintes bibliotecas npm:
bcrypt para hashing de senhas.


cors para controle de acesso entre origens.


dotenv para configuração de variáveis de ambiente.


express-validator para validação das entradas de dados.


jsonwebtoken para autenticação via tokens JWT.


multer para upload de arquivos.


mysql2 para conexão com banco de dados MySQL.


node-cron para agendamento de tarefas.


nodemailer para envio de e-mails.


Consequências:
Backend robusto com suporte a funcionalidades essenciais.


Necessidade de manutenção e atualização periódica dessas dependências.


Requer atenção para segurança e tratamento de erros.


