ADR 017 - Envio de E-mails com nodemailer
Status: Aceito
Contexto:
 O sistema precisa enviar e-mails para notificações, recuperação de senha, ou confirmações.
Decisão:
 Utilizar a biblioteca nodemailer para o envio de e-mails.
Consequências:
Integração simples e direta para envio de mensagens.


Necessidade de configurar servidores SMTP e garantir segurança.


Pode exigir monitoramento e logs de e-mails enviados.

