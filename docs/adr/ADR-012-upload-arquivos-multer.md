ADR 012 - Upload de Arquivos com Multer
Status: Aceito
Contexto:
 O sistema necessita permitir uploads de arquivos, como anexos ou imagens.
Decisão:
 Utilizar a biblioteca multer para tratamento de uploads multipart/form-data no backend Express.
Consequências:
Simplifica processamento de arquivos enviados pelo frontend.


Necessidade de garantir segurança e validação dos arquivos.
