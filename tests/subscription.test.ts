import { ethers} from 'ethers';
import { createSubscription, withdrawFromRecipient } from '../src';
import { subscriptionData } from './api/listSubscription.test';
describe('createSubscription', () => {
    let provider:any;

    beforeAll(() => {
        const sepoliaKey = process.env.SEPOLIA_KEY;
        const infuraUrl = `https://sepolia.infura.io/v3/${sepoliaKey}`;
        provider = new ethers.JsonRpcProvider(infuraUrl);
    });

    test('Ethereum provider is defined', () => {
        expect(provider).toBeDefined();
    });

    test('createSubscription can work', async () => {
        // Arrange
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        const interval = 3600 * 24; // One day in seconds
        const input = {
            recipient: '0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099',
            deposit: BigInt(1),
            tokenAddress: '0x949bEd886c739f1A3273629b3320db0C5024c719',
            startTime: BigInt(currentTimestamp + 3600), // One hour from now
            stopTime: BigInt(currentTimestamp + 3600 * 24 * 7), // One week from startTime
            interval: BigInt(interval),
            fixedRate: BigInt(1),
        };
    
        // Act and Assert
        try {
            // Validation Checks
            if (!input.recipient) {
                throw new Error('Recipient is undefined. Please provide a valid recipient address.');
            }
    
            if (input.stopTime < input.startTime) {
                throw new Error('Stop time cannot be earlier than start time.');
            }
    
            if (input.deposit <= BigInt(0)) {
                throw new Error('Deposit amount must be greater than zero.');
            }
    
            const userBalance = await provider.getBalance(input.recipient);
            const depositAmount = ethers.parseEther(input.deposit.toString());
    
            if (userBalance && depositAmount && userBalance.lt(depositAmount + input.fixedRate)) {
                throw new Error('User balance is insufficient to create the subscription.');
            }

            await createSubscription(input);
    
            // Additional assertions for success if needed
            expect(true).toBeTruthy();
        } catch (error) {
            // Assert for failure
            expect(error).toBeNull(); // Assert that no error was thrown
        }
    });
    
});


test('withdrawFromRecipient can work', async () => {
    const amount: BigInt = BigInt(1); 
  
    // Act and Assert
    try {
      if (subscriptionData && subscriptionData.subscriptionLists.length > 0) {
        for (const subscription of subscriptionData.subscriptionLists) {
          const subscriptionId = BigInt(subscription.id);
          console.log("subscriptionIds", subscriptionId)
  
          // Validation Checks
          // Check if subscriptionId is a positive integer
          if (!subscriptionId || subscriptionId.toString() <= BigInt(0).toString()) {
            throw new Error('Invalid subscription ID. Please provide a valid positive integer.');
          }
  
          // Check if the withdrawal amount is a positive number
          if (!amount || amount.toString() <= BigInt(0).toString()) {
            throw new Error('Invalid withdrawal amount. Please provide a valid positive number.');
          }
  
          // Call the withdrawFromRecipient function
          const result = await withdrawFromRecipient({ subscriptionId, amount });
  
          // Additional assertions for success if needed
          expect(result).toBeTruthy();
        }
      } else {
        // No subscriptions found, fail the test
        console.error('No subscription data found.');
        throw new Error('No subscription data found.');
      }
    } catch (error) {
      // Assert for failure
      expect(error).toBeNull(); // Assert that no error was thrown
    }
  });
  