# Plano e revisão — 2026-10-06

## Objetivo

Entregar a tela aprovada em computador e celular, lista base editável, importação pontual da vistoria do ERP, salvamento e reabertura, PDF, PWA e análise de fotos com fallback entre três provedores.

## Ordem de execução

1. Conferir maquetes, relatórios recentes, crenças, pendências e fonte técnica. Feito.
2. Montar controles reais mantendo a linguagem visual aprovada. Feito.
3. Implementar regras, teste do caso de referência e edição dos seis grupos. Feito.
4. Ligar Firebase Auth, cliente/OS, respostas da vistoria e `listas_material`. Código feito; regra publicada.
5. Gerar PDF a partir da lista editada. Feito; duas páginas inspecionadas.
6. Preparar PWA e integração de IA com fallback. Código feito; resposta real depende de chaves e Render.
7. Revisar em 1440/390 px, corrigir diferenças e testar save/reload. Feito com Firebase simulado.
8. Publicar GitHub Pages e verificar HTTP 200, build e PWA no navegador real. Em execução.
9. Testar login, salvar/reabrir e leitura de foto com conta e chaves reais. Pendente de acesso do proprietário.

## Revisão e correções

- A primeira captura móvel tinha título em duas linhas, descrições cortadas e marca de item invisível. Corrigidos título, textarea expansível, etiqueta e contraste.
- O motor devolveu 32 m de cabo CA no caso de referência, frente a 30 m na lista aprovada. Ajustado e testado junto com eletroduto, curvas, abraçadeiras, cabo CC, estrutura e módulos.
- O botão fixo de PDF cobria “Gerar lista base” no fim do formulário móvel. Adicionado espaço inferior e teste de clique real.
- A impressão inicial deixou uma página vazia e cortou itens. Foi substituída por folha própria baseada nos dados editados; os seis grupos aparecem em duas páginas.
- O domínio Render presumido poderia pertencer a terceiros. A URL da API está vazia e o botão de IA desabilitado até confirmar o serviço.

## Limites de verificação

Os testes locais usam usuário e Firestore simulados para não gravar dados de produção. A regra Firestore compila e foi publicada; o ciclo autenticado real ainda precisa de uma conta ativa usada pelo proprietário. O fallback testado é simulado; não prova cota ou resposta real de Gemini, OpenAI e Claude.
