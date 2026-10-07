# Lista de Material Solar Green

Aplicativo estático para gerar, revisar, salvar e imprimir listas de material de instalação fotovoltaica. Usa o mesmo Firebase Auth e Firestore do ERP Solar Green. Arquivos da raiz são publicados no GitHub Pages; não há etapa de build.

## Uso

1. Entre com a conta já ativa no ERP.
2. Escolha um cliente ou abra o link da lista no detalhe de uma OS.
3. Confira as medidas importadas da vistoria, complete as que faltarem e gere a lista base.
4. Edite quantidades, descrições e observações, marque itens e adicione ou remova linhas.
5. Salve no cliente/OS. A lista reabre pelo mesmo vínculo.
6. Exporte pelo botão PDF, usando o destino “Salvar como PDF” do navegador.

O cálculo produz **sugestões de compra**, não projeto elétrico. Estrutura sem desenho dos blocos fica “conforme layout”. Corrente, tensão, proteção, cabo, string e fixação devem ser conferidos com manuais, projeto e vistoria.

## Integração

- Firebase: projeto `solargreen-21313`.
- Leituras restritas ao cliente e OS selecionados, mais respostas e templates do serviço da OS.
- Escrita na coleção `listas_material`, ID `<clienteId>__<idAgendamento>` ou `<clienteId>__avulsa`.
- As regras de `listas_material` ficam em `firestore.rules` do repositório SolarGreen-ERP.
- O painel de detalhe da OS abre este app com `?agendamentoId=<id>`.
- Fotos ficam em memória no navegador apenas durante a análise; só texto/itens revisados são salvos no Firestore.

## Análise de fotos por IA

O servidor em `backend/server.py` usa Gemini, depois GPT, depois Claude. Ele exige ID token Firebase válido e cadastro ativo em `vendedores`; chaves ficam só nas variáveis de ambiente do Render. O app está com a URL da API vazia até haver um serviço real verificado. **Não trocar pela URL de um serviço não conferido:** as fotos seriam enviadas a esse destino.

Para habilitar:

1. Entrar na conta Render proprietária do serviço, ou criar conta.
2. Implantar este repositório como Web Service usando `render.yaml`.
3. Configurar `GEMINI_API_KEY`, `OPENAI_API_KEY` e `ANTHROPIC_API_KEY` no painel do Render. São chaves de API dos provedores, distintas da assinatura do Codex.
4. Conferir `/health` no domínio do serviço: `status: ok` e os três nomes em `providers`.
5. Colocar a URL exata e verificada em `API_URL` de `app.js`, habilitar o botão e publicar outra versão `?v=`/cache do PWA.
6. Testar uma foto real com consentimento do responsável e conferir os itens sugeridos.

O plano gratuito do Render pode hibernar após inatividade; a primeira requisição pode demorar. Não guardar fotos nem logs com dados de cliente no servidor.

## Verificação local

Abra por HTTP, por exemplo `python -m http.server 8765`. Testes:

- `node scripts/check-rules.mjs`
- `node scripts/check-app.cjs` (usa Edge instalado, Playwright disponível no `NODE_PATH` e Firebase simulado; exige servidor na porta 8765)
- `node scripts/check-pwa.cjs https://pampfelp.github.io/lista-material/` (perfil persistente do Edge, PWA no endereço público)
- `python -m unittest backend.test_server`

O teste simulado não confirma login real, regras em produção nem resposta dos provedores. Para esse fechamento, entrar com usuário real no endereço publicado e salvar/reabrir uma lista descartável de teste.
