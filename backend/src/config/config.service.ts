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
	return process.env.MAIL_FROM ?? 'onboarding@resend.dev'; 
	}

	getFrontendUrl(): string {
		return process.env.FRONTEND_URL ?? this.getRequired('FRONTEND_URL');
	}
	
	getVoyageApiKey(): string {
		return this.getRequired('VOYAGE_API_KEY');
	}

	getGroqApiKey(): string {
    return this.getRequired('GROQ_API_KEY');
}

	getResendApiKey(): string {
	return this.getRequired('RESEND_API_KEY');
	}

	getAdminEmail(): string {
  	return this.getRequired('ADMIN_EMAIL');
	}

	getLowStockThreshold(): number {
	const value = process.env.LOW_STOCK_THRESHOLD;
	return value ? parseInt(value, 10) : 5; 
	}

	

	private getRequired(key: string): string {
		const value = process.env[key];

		if (!value) {
			throw new Error(`${key} is not set`);
		}

		return value;
	}



}