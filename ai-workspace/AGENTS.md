# Instruções para o Codex

## Estrutura do projeto

* Este diretório (`ai-workspace/`) é o espaço de trabalho do Codex e do Spec Kit.
* A raiz do repositório Git e da aplicação está no diretório pai (`../`).
* O README principal está em `../readme.md`.

## Antes de trabalhar

1. Leia `../readme.md` para entender o projeto.
2. Analise o código existente antes de propor ou implementar alterações.
3. Respeite a arquitetura, as convenções e os padrões já utilizados na aplicação.

## Organização dos arquivos

* Mantenha as configurações do Spec Kit em `ai-workspace/.specify/`.
* Mantenha as skills do Codex em `ai-workspace/.agents/skills/`.
* Mantenha as especificações, os planos e as tarefas em `ai-workspace/specs/`.
* Crie e modifique os arquivos da aplicação na raiz do repositório (`../`) ou em seus subdiretórios apropriados.
* Não mova o código da aplicação para `ai-workspace/`.
* Não altere arquivos que não tenham relação com a tarefa solicitada.

## Resolução de caminhos

* Considere `ai-workspace/` como a raiz dos artefatos do Spec Kit.
* Considere `../` como a raiz do código-fonte e do repositório Git.
* Ao executar comandos ou scripts do Spec Kit, verifique o diretório de trabalho e os caminhos utilizados antes de criar ou modificar arquivos.
* Não presuma que a raiz do Spec Kit e a raiz do repositório Git sejam o mesmo diretório.
* Não mova nem duplique configurações do Spec Kit para a raiz da aplicação sem necessidade.
