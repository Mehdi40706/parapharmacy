import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
	getJwtSecret(): string {
		return this.getRequired('JWT_SECRET');
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
