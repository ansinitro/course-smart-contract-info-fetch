export function getEventsUrl(contractAddress: string, limit: number = 100): string {
    return `https://testnet.tonapi.io/v2/accounts/${contractAddress}/events?limit=${limit}`;
}

export function getTransaction(txHash: string): string {
    return `https://testnet.tonapi.io/v2/blockchain/transactions/${txHash}`
}