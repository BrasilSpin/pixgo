// api/pix.js — backend único que cuida de tudo
//
// Esse arquivo roda como serverless function na Vercel.
// Ele faz 2 coisas:
//   1. POST /api/pix?action=create  → cria o pagamento (gera QR Code)
//   2. POST /api/pix?action=check   → verifica se o pagamento foi pago
//
// Sua API_KEY fica em variável de ambiente (segura, escondida do navegador).

// ========================================
// 👇 CONFIGURE SEU PRODUTO AQUI 👇
// ========================================
const PRODUTO = {
  nome: "Validação", // 👈 nome do seu produto
  valor: 19.90,                    // 👈 preço em reais
  
  // Dados genéricos do "comprador" (a PixGo exige esses campos).
  // Use o CPF/CNPJ da sua empresa.
  cliente_nome: "Cliente Loja",
  cliente_cpf: "50916658031",     // 👈 11 dígitos sem pontuação
  cliente_email: "pobocag811@anawebs.com",
};
// ========================================

export default async function handler(req, res) {
  // CORS — permite que o frontend chame essa função
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const action = req.query.action;
  const apiKey = process.env.PIXGO_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "PIXGO_API_KEY não configurada" });
  }

  try {
    // ===== AÇÃO 1: CRIAR PAGAMENTO =====
    if (action === "create") {
      const external_id = `pedido_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

      const response = await fetch("https://pixgo.org/api/v1/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({
          amount: PRODUTO.valor,
          description: PRODUTO.nome,
          customer_name: PRODUTO.cliente_nome,
          customer_cpf: PRODUTO.cliente_cpf,
          customer_email: PRODUTO.cliente_email,
          external_id,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("Erro PixGo:", data);
        return res.status(500).json({
          error: "Erro ao gerar PIX",
          details: data,
        });
      }

      return res.status(200).json({
        payment_id: data.data.payment_id,
        qr_code: data.data.qr_code,
        qr_image_url: data.data.qr_image_url,
        expires_at: data.data.expires_at,
        amount: PRODUTO.valor,
        product_name: PRODUTO.nome,
      });
    }

    // ===== AÇÃO 2: VERIFICAR STATUS =====
    if (action === "check") {
      const { payment_id } = req.body;

      if (!payment_id) {
        return res.status(400).json({ error: "payment_id obrigatório" });
      }

      // Consulta direto na PixGo (sem precisar de banco de dados!)
      const response = await fetch(
        `https://pixgo.org/api/v1/payment/${payment_id}`,
        {
          method: "GET",
          headers: { "X-API-Key": apiKey },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return res.status(404).json({ status: "not_found" });
      }

      return res.status(200).json({
        status: data.data.status, // pending | completed | expired | failed
        amount: data.data.amount,
      });
    }

    return res.status(400).json({ error: "action inválida (use create ou check)" });
  } catch (err) {
    console.error("Erro:", err);
    return res.status(500).json({
      error: "Erro interno",
      message: String(err),
    });
  }
}
