interface BaseTemplateOptions {
  previewText?: string; // texte d'aperçu affiché dans la liste de la boîte mail
  bodyHtml: string;
  frontendUrl: string;
}

// Wrapper commun : header avec logo, contenu variable, footer avec lien de désinscription/site.
// Basé sur des <table> imbriquées (pas de flex/grid) pour une compatibilité maximale
// avec Outlook, Gmail, Apple Mail — tous ne supportent pas le CSS moderne dans les emails.
export function baseTemplate({ previewText = '', bodyHtml, frontendUrl }: BaseTemplateOptions): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Parapharmacie</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f1ec; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Texte d'aperçu invisible, affiché par les clients mail dans la liste des messages -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    ${previewText}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1ec; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color:#ffffff; border-radius: 16px; overflow:hidden; border: 1px solid #e5e0d8;">

          <!-- Header -->
          <tr>
            <td style="background-color:#7c9885; padding: 28px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <span style="font-size: 20px; font-weight: 600; color:#ffffff; letter-spacing: -0.02em;">
                      Parapharmacie
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenu -->
          <tr>
            <td style="padding: 32px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #eee6d8; background-color:#faf8f3;">
              <p style="margin:0 0 6px 0; font-size: 12px; color:#8a8578;">
                Cet email vous a été envoyé par Parapharmacie.
              </p>
              <p style="margin:0; font-size: 12px; color:#8a8578;">
                <a href="${frontendUrl}" style="color:#4a6353; text-decoration: none;">Visiter le site</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Bouton d'action réutilisable, cohérent sur tous les emails
export function emailButton(label: string, url: string, color = '#7c9885'): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
      <tr>
        <td style="border-radius: 10px; background-color: ${color};">
          <a href="${url}" target="_blank" style="display:inline-block; padding: 12px 28px; font-size: 14px; font-weight: 600; color:#ffffff; text-decoration:none; border-radius: 10px;">
            ${label}
          </a>
        </td>
      </tr>
    </table>
  `.trim();
}