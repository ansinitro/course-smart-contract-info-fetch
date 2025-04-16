/**
 * Fetches the NFT address for a given contract address and index.
 * 
 * @param contractAddress - The contract address to query.
 * @param index - The index to query for.
 * @returns The NFT address as a string or throws an error if something goes wrong.
 */
async function getNftAddressByIndex(contractAddress: string, index: number): Promise<string> {
    const url = `https://testnet.tonapi.io/v2/blockchain/accounts/${contractAddress}/methods/get_nft_address_by_index?args=${index}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            // Extract the NFT address from the 'decoded' field in the response
            const nftAddress = data.decoded.address;
            return nftAddress;
        } else {
            throw new Error('Failed to fetch NFT address: ' + data);
        }
    } catch (error) {
        console.error('Error fetching NFT address by index:', error);
        throw error; // Re-throw error to be handled by the caller
    }
}

// Example usage
(async () => {
    const contractAddress = 'kQAOVJK45F5bccbgGwGy7adNI37ohg0vO0WFJIsCmA_7hKfP';
    const index = 1;  // Example index
    try {
        const nftAddress = await getNftAddressByIndex(contractAddress, index);
        console.log('NFT Address:', nftAddress);
    } catch (error) {
        console.error('Failed to get NFT address:', error);
    }
})();
