import { baseTemplate, emailButton } from './base.template';

interface LowStockAlertTemplateParams {
  productName: string;
  productId: string;
  stock: number;
  threshold: number;
  frontendUrl: string;
}

export function lowStockAlertTemplate({
  productName,
  productId,
  stock,
  threshold,
  frontendUrl,
}: LowStockAlertTemplateParams): string {
  const manageUrl = `${frontendUrl}/admin/produits/${productId}`;

  const bodyHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
      <tr>
        <td style="display:inline-block; background-color:#fdf1e2; color:#b45309; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 999px;">
          ⚠ Stock faible
        </td>
      </tr>
    </table>

    <h1 style="margin:0 0 12px 0; font-size: 20px; font-weight: 600; color:#2b2a26;">
      ${productName}
    </h1>
    <p style="margin:0 0 8px 0; font-size: 14px; line-height: 1.6; color:#4a4842;">
      Ce produit vient de passer sous le seuil d'alerte de <strong>${threshold}</strong> unités.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 16px 0; background-color:#faf8f3; border-radius: 12px;">
      <tr>
        <td style="padding: 16px 18px;">
          <p style="margin:0; font-size: 13px; color:#8a8578;">Stock actuel</p>
          <p style="margin:2px 0 0 0; font-size: 22px; font-weight: 700; color:#b45309;">${stock} unité${stock > 1 ? 's' : ''}</p>
        </td>
      </tr>
    </table>

    ${emailButton('Gérer ce produit', manageUrl, '#b45309')}
  `;

  return baseTemplate({
    previewText: `${productName} : stock faible (${stock} restant${stock > 1 ? 's' : ''})`,
    bodyHtml,
    frontendUrl,
  });
}