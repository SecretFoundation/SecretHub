import { types } from "secretjs";
import { Decimal } from "@iov/encoding";

// NARROW NO-BREAK SPACE (U+202F)
const thinSpace = "\u202F";

export function printableBalanceOf(denom: string, balance?: readonly types.Coin[]): string {
  if (!balance || balance.length === 0) return "–";
  const coin = balance.filter(coin => coin.denom === denom).map(printableCoin);
  return coin.length > 0 ? coin[0] : "";
}

export function printableBalance(balance?: readonly types.Coin[]): string {
  if (!balance || balance.length === 0) return "–";
  return balance.map(printableCoin).join(", ");
}

export function printableCoin(coin?: types.Coin): string {
  if (!coin) {
    return "0";
  }
  return printableAmount(coin.denom, coin.amount);
}

export function printableAmount(denom: string, amount: string): string {
  if (!amount) {
    return "0";
  }
  if (denom.startsWith("u")) {
    const ticker = denom.slice(1).toUpperCase();
    return Decimal.fromAtomics(amount, 6).toString() + thinSpace + ticker;
  } else {
    return amount + thinSpace + denom;
  }
}

export function toUscrt(amount: string): string {
  return Math.floor(parseFloat(amount) * 10**6).toString()
}
