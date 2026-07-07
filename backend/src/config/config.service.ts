import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
	getJwtSecret(): string {
		return this.getRequired('JWT_SECRET');
	}

	getGoogleClientId(): string {
		return this.getRequired('GOOGLE_CLIENT_ID');
	}

	getGoogleClientSecret(): string {
		return this.getRequired('GOOGLE_CLIENT_SECRET');
	}

	getGoogleCallbackUrl(): string {
		return this.getRequired('GOOGLE_CALLBACK_URL');
	}

	getFacebookAppId(): string {
		return this.getRequired('FACEBOOK_APP_ID');
	}

	getFacebookAppSecret(): string {
		return this.getRequired('FACEBOOK_APP_SECRET');
	}

	getFacebookCallbackUrl(): string {
		return this.getRequired('FACEBOOK_CALLBACK_URL');
	}

	getDatabaseUrl(): string {
		return this.getRequired('DATABASE_URL');
	}

	getMailUser(): string {
		return this.getRequired('MAIL_USER');
	}

	getMailPassword(): string {
		return this.getRequired('MAIL_PASSWORD');
	}

	getMailFrom(): string {
		return process.env.MAIL_FROM ?? this.getMailUser();
	}

	getFrontendUrl(): string {
		return this.getRequired('FRONTEND_URL');
	}

	private getRequired(key: string): string {
		const value = process.env[key];

		if (!value) {
			throw new Error(`${key} is not set`);
		}

		return value;
	}
}
