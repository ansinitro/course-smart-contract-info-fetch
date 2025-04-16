
/**
 * Fetches the cost of the course from the provided API.
 * 
 * @param contractAddress - The contract address to query.
 * @returns The course cost as a number or throws an error if something goes wrong.
 */
async function getCourseCost(contractAddress: string): Promise<number> {
    const url = `https://testnet.tonapi.io/v2/blockchain/accounts/${contractAddress}/methods/get_cost`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            // Assuming the 'stack' contains a single item and the value is a hex number.
            const hexValue = data.stack[0].num;
            const cost = parseInt(hexValue, 16); // Convert from hex to decimal
            return cost;
        } else {
            throw new Error('Failed to fetch course cost: ' + data);
        }
    } catch (error) {
        console.error('Error fetching course cost:', error);
        throw error; // Re-throw error to be handled by the caller
    }
}

// Example usage
(async () => {
    const contractAddress = 'kQAOVJK45F5bccbgGwGy7adNI37ohg0vO0WFJIsCmA_7hKfP';
    try {
        const cost = await getCourseCost(contractAddress);
        console.log('Course cost:', cost);
    } catch (error) {
        console.error('Failed to get course cost:', error);
    }
})();
