import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface GcpServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

@Injectable()
export class GcpService {
  readonly gcpCredentials: GcpServiceAccount;

  constructor(private configService: ConfigService) {
    this.gcpCredentials = JSON.parse(
      this.configService.getOrThrow('GCP_SA'),
    ) as GcpServiceAccount;
  }
}
