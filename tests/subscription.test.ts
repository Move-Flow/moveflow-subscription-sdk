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
            const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
            const interval = 3600 * 24; // One day in seconds
            const input = {
                recipient: '0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099',
                deposit: BigInt(100),
                tokenAddress: '0x949bEd886c739f1A3273629b3320db0C5024c719',
                startTime: BigInt(currentTimestamp + 3600), // One hour from now
                stopTime: BigInt(currentTimestamp + 3600 * 24 * 7,), // One week from startTime
                interval: BigInt(interval),
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
