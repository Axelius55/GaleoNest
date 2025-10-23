import { Injectable } from '@nestjs/common';

@Injectable()
export class BlacklistService {
  private blacklistedTokens: Set<string> = new Set();

  addToBlacklist(token: string): void {
    this.blacklistedTokens.add(token);
  }

  isBlacklisted(token: string): boolean {
    const isBlacklisted = this.blacklistedTokens.has(token);
    return isBlacklisted;
  }

  // Opcional: Para debug
//   getBlacklistSize(): number {
//     return this.blacklistedTokens.size;
//   }
}