import { baseTemplate, emailButton } from './base.template';

interface PasswordResetTemplateParams {
  resetUrl: string;
  frontendUrl: string;
}

export function passwordResetTemplate({ resetUrl, frontendUrl }: PasswordResetTemplateParams): string {
  const bodyHtml = `
    <h1 style="margin:0 0 12px 0; font-size: 20px; font-weight: 600; color:#2b2a26;">
      Réinitialisation de votre mot de passe
    </h1>
    <p style="margin:0 0 8px 0; font-size: 14px; line-height: 1.6; color:#4a4842;">
      Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.
    </p>

    ${emailButton('Réinitialiser mon mot de passe', resetUrl)}

    <p style="margin:16px 0 0 0; font-size: 13px; line-height: 1.6; color:#8a8578;">
      Ce lien expire dans <strong>1 heure</strong>. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email sans risque — votre mot de passe restera inchangé.
    </p>

    <p style="margin:20px 0 0 0; font-size: 12px; line-height: 1.6; color:#b0aca0; word-break: break-all;">
      Le bouton ne fonctionne pas ? Copiez ce lien dans votre navigateur :<br />
      <a href="${resetUrl}" style="color:#4a6353;">${resetUrl}</a>
    </p>
  `;

  return baseTemplate({
    previewText: 'Réinitialisez votre mot de passe en un clic',
    bodyHtml,
    frontendUrl,
  });
}