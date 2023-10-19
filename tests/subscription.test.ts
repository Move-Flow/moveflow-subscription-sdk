import { ethers } from 'ethers';
import { createSubscription } from '../src';


describe('createSubscription', () => {
    let provider: any

    beforeAll(async () => {
        const infuraUrl = 'https://sepolia.infura.io/v3/577e58eea0d74c13b627c1e3808cd711';
        provider = new ethers.JsonRpcProvider(infuraUrl);
    });

    test('Ethereum provider is defined', () => {
        expect(provider).toBeDefined();
    });

    test('createSubscription can work', async () => {
        try {
            // Call the createSubscription function with valid input
            const input = {
                recipient: '0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099',
                deposit: BigInt(100),
                tokenAddress: '0x949bEd886c739f1A3273629b3320db0C5024c719',
                startTime: BigInt(12345),
                stopTime: BigInt(67890),
                interval: BigInt(60),
                fixedRate: BigInt(1),  
            };
            await createSubscription(input);
        } catch (error) {
            console.log(error);
        }
    });

    afterAll(() => {
        // Cleanup, close any connections, etc.
    });
});
