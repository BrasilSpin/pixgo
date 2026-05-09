# Checkout PIX em 1 Clique 🚀

Versão mínima absoluta: **1 página HTML + 1 backend** rodando na Vercel grátis.

## ⚠️ Antes de tudo

**Revogue a API Key que vazou na imagem do chat anterior** e gere uma nova no dashboard da PixGo. Use a nova nas instruções abaixo.

---

## Passo 1 — Configure seu produto (1 minuto)

Abra `api/pix.js` e edite o bloco no topo:

```js
const PRODUTO = {
  nome: "Curso Completo de XYZ",       // 👈 seu produto
  valor: 47.00,                          // 👈 preço em reais
  cliente_nome: "Cliente Loja",
  cliente_cpf: "00000000000",            // 👈 CPF/CNPJ da SUA empresa (11 dígitos)
  cliente_email: "loja@suaempresa.com",  // 👈 email da SUA loja
};
```

E em `index.html`, opcionalmente edite (Ctrl+F):
- `Curso Completo de XYZ` → nome do produto
- `47,00` → preço
- `📚` → emoji/ícone do produto
- `Sua Loja` → nome da loja
- A descrição do produto, benefícios, etc.

---

## Passo 2 — Subir na Vercel (3 minutos)

### Opção A — Drag and drop (mais fácil)

1. Acesse https://vercel.com e faça login (use GitHub/Google, é grátis)
2. Clique em **"Add New..." → "Project"**
3. Procure por **"Deploy without Git"** ou clique em **"Browse"** e arraste a pasta `pixgo-checkout` inteira
4. Vai aparecer um campo de **Environment Variables** — adicione:
   - **Name:** `PIXGO_API_KEY`
   - **Value:** sua chave nova `pk_...`
5. Clique em **Deploy**
6. Em ~30s, sua loja tá no ar numa URL tipo `pixgo-checkout-xyz.vercel.app`

### Opção B — Via GitHub (recomendado se for atualizar depois)

1. Crie um repositório no GitHub e suba os arquivos
2. Em https://vercel.com → "Add New..." → "Project" → escolha o repo
3. Em **Environment Variables**, adicione `PIXGO_API_KEY` com sua chave
4. Deploy

---

## Passo 3 — Testar (30 segundos)

1. Abra a URL da Vercel
2. Clique em "Pagar com PIX agora"
3. O QR Code deve aparecer com o código copia-e-cola
4. Pague usando o app do seu banco
5. Em até 4 segundos a tela deve trocar pra "Pagamento confirmado!"

---

## Como funciona (sem segredos)

```
[Cliente clica botão]
       ↓
[index.html chama /api/pix?action=create]
       ↓
[api/pix.js (na Vercel) chama PixGo com sua API_KEY]
       ↓
[Devolve QR Code + código copia-e-cola pro frontend]
       ↓
[Cliente paga no app do banco]
       ↓
[Frontend pergunta a cada 4s: "já pagou?" via /api/pix?action=check]
       ↓
[api/pix.js consulta status na PixGo]
       ↓
[Quando volta "completed" → tela 🎉 de sucesso]
```

**Sem banco de dados, sem webhook, sem complicação.** O polling resolve tudo.

---

## Customizações fáceis

### Mudar cor de destaque

No `index.html`, procure por `--accent: #5eead4;` e troque pela cor que quiser.

### Mudar imagem do produto

Procure `📚` no HTML e troque por outro emoji ou cole uma `<img src="sua-imagem.png">`.

### Várias páginas pra produtos diferentes

Duplique o `index.html`, renomeie pra `produto2.html`, edite o conteúdo. Pra mudar o valor de cada produto, você vai precisar fazer o `api/pix.js` aceitar um `product_id` no body — me avisa se quiser que eu adapte.

### Liberar produto digital após pagamento

Como não tem webhook nessa versão, o jeito mais simples é: na tela 3 (sucesso), mostrar o link de download direto. Posso adicionar isso se quiser.

---

## Limitações dessa versão simples

- ❌ Sem webhook → se o cliente fechar a aba antes da confirmação, você não fica sabendo que pagou (mas o dinheiro entra na sua conta normal — você vê pelo dashboard PixGo)
- ❌ Sem registro de vendas no seu próprio sistema (só no painel da PixGo)
- ❌ Sem envio automático de e-mail

Pra adicionar qualquer um desses, é só me falar.

---

## Estrutura dos arquivos

```
pixgo-checkout/
├── index.html       ← a loja inteira (3 telas em 1 página)
└── api/
    └── pix.js       ← backend serverless da Vercel
```

É só isso. 2 arquivos. 🎯
