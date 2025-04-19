/**
 * Fetches the collection data for a given contract address.
 * 
 * @param contractAddress - The contract address to query.
 * @returns An object containing the `collection_content` and `owner_address`.
 */
async function getCollectionData(contractAddress: string): Promise<{ collectionContent: string, ownerAddress: string }> {
    const url = `https://testnet.tonapi.io/v2/blockchain/accounts/${contractAddress}/methods/get_collection_data`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            // Extract collection data from the 'decoded' field
            let collectionContent = data.decoded.collection_content;
            const ownerAddress = data.decoded.owner_address;
            collectionContent = getLink(hexToUtf8(collectionContent))
            return { collectionContent, ownerAddress };
        } else {
            throw new Error('Failed to fetch collection data: ' + JSON.stringify(data));
        }
    } catch (error) {
        console.error('Error fetching collection data:', error);
        throw error; // Re-throw error to be handled by the caller
    }
}

// Example usage
(async () => {
    const contractAddress = 'kQAOVJK45F5bccbgGwGy7adNI37ohg0vO0WFJIsCmA_7hKfP';
    try {
        const { collectionContent, ownerAddress } = await getCollectionData(contractAddress);
        console.log('Collection Content:', collectionContent);
        console.log('Owner Address:', ownerAddress);
    } catch (error) {
        console.error('Failed to get collection data:', error);
    }
})();





function hexToUtf8(hex: string): string {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }

    return str;
}

function getLink(utf8: string): string {
    const ipfsHash = utf8.split("//")[1];  // Remove the "ipfs://" prefix
    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

    return ipfsUrl;  // This will give the full URL
}