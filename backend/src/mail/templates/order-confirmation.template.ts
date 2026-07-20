import { baseTemplate } from './base.template';

interface OrderConfirmationItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationTemplateParams {
  orderId: string;
  totalPrice: number;
  paymentMethod: 'ONLINE' | 'COD';
  items: OrderConfirmationItem[];
  shippingAddress: string;
  shippingCity: string;
  frontendUrl: string;
}

export function orderConfirmationTemplate({
  orderId,
  totalPrice,
  paymentMethod,
  items,
  shippingAddress,
  shippingCity,
  frontendUrl,
}: OrderConfirmationTemplateParams): string {
  const shortId = orderId.slice(0, 8);

  const itemsRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0ede4; font-size: 14px; color:#2b2a26;">
          ${item.name}
          <span style="color:#8a8578;">&times; ${item.quantity}</span>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0ede4; font-size: 14px; color:#2b2a26; text-align:right; white-space:nowrap;">
          ${(item.price * item.quantity).toFixed(2)} TND
        </td>
      </tr>
    `,
    )
    .join('');

  const paymentNote =
    paymentMethod === 'COD'
      ? 'Vous réglerez en espèces directement à la livraison.'
      : 'Votre paiement en ligne a bien été confirmé.';

  const bodyHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
      <tr>
        <td>
          <span style="display:inline-block; background-color:#e8f0ea; color:#4a6353; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 999px;">
            Commande #${shortId}
          </span>
        </td>
      </tr>
    </table>

    <h1 style="margin:0 0 8px 0; font-size: 20px; font-weight: 600; color:#2b2a26;">
      Merci pour votre commande !
    </h1>
    <p style="margin:0 0 20px 0; font-size: 14px; line-height: 1.6; color:#4a4842;">
      ${paymentNote}
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
      ${itemsRows}
      <tr>
        <td style="padding: 14px 0 0 0; font-size: 15px; font-weight: 700; color:#2b2a26;">Total</td>
        <td style="padding: 14px 0 0 0; font-size: 15px; font-weight: 700; color:#2b2a26; text-align:right;">
          ${totalPrice.toFixed(2)} TND
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px; background-color:#faf8f3; border-radius: 12px;">
      <tr>
        <td style="padding: 16px 18px;">
          <p style="margin:0 0 4px 0; font-size: 12px; font-weight: 600; color:#8a8578; text-transform: uppercase; letter-spacing: 0.03em;">
            Adresse de livraison
          </p>
          <p style="margin:0; font-size: 14px; color:#2b2a26;">
            ${shippingAddress}, ${shippingCity}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:24px 0 0 0; font-size: 13px; line-height: 1.6; color:#8a8578;">
      Vous pouvez suivre l'état de votre commande à tout moment depuis votre espace client.
    </p>
  `;

  return baseTemplate({
    previewText: `Votre commande #${shortId} est confirmée`,
    bodyHtml,
    frontendUrl,
  });
}