import { Injectable } from "@nestjs/common";
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { TfaRepository } from "./2FA.repository";


@Injectable()
export class TwoFactorauthenticationService {
	constructor(private readonly tfaRepository: TfaRepository) { }

    generateTwoFactorAuthenticationSecret(userId: string) {
        const secret = speakeasy.generateSecret({ length: 20});
		this.tfaRepository.setSecret(secret.base32, userId);
        return {
            otpauth_url: secret.otpauth_url,
            base32: secret.base32,
        };
    }

    async generateQRCode(userId: string): Promise<string> {
        const { otpauth_url } = this.generateTwoFactorAuthenticationSecret(userId);
        return await QRCode.toDataURL(otpauth_url);
    }

    async verifyTwoFactorAuthenticationToken(token: string, userId: string): Promise<boolean> {
		try {
			let response = speakeasy.totp.verify({
				secret: await this.tfaRepository.getSecret(userId),
				encoding: 'base32',
				token,
			});
			if (response === true) {
				return true;
			}
			else {
				return false;
			}
		}
		catch (error) {
			return false;
		}
    }

	clearTwoFactorAuthenticationSecret(userId: string): void {
		this.tfaRepository.setSecret(null, userId);
	}

	async verifyStatus(userId: string): Promise<boolean> {
		let response = await this.tfaRepository.getSecret(userId);
		if (response === null) {
			return false;
		}
		else {
			return true;
		}
	}
}
