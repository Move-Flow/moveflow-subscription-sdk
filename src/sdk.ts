import { ethers } from 'ethers';
import SubscriptionABI from './lib/contractABIs/subsrciptionABI.json';
import intervals from './utils/intervalsConversion'

const ethereumSubscription = async () => {
    try {
        const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/577e58eea0d74c13b627c1e3808cd711');
        console.log('Provider:', provider);

        // Replace with your actual contract address
        const contractAddress = '0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099';
        const recipient = '0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099';
        const subscriptionAmount = 100; // Replace with the desired deposit amount
        const tokenAddress = '0x949bEd886c739f1A3273629b3320db0C5024c719';
        const startTime = 1634414400; // Replace with the desired start time (UNIX timestamp)
        const stopTime = 1637006400; // Replace with the desired stop time (UNIX timestamp)
        const interval = 86400; // Replace with the desired interval (in seconds)
        const fixedRate = 1; // Replace with the desired fixed rate

        // Create a contract instance using the Subscription ABI
        const contract = new ethers.Contract(contractAddress, SubscriptionABI, provider);
        console.log('Contract:', contract);

        // Call the createSubscription function
        const createSubscriptionTx = await contract.createSubscription(
            recipient,
            subscriptionAmount,
            tokenAddress,
            startTime,
            stopTime,
            interval,
            fixedRate
        );

        console.log('createSubscription transaction hash:', createSubscriptionTx.hash);
        const createSubscriptionReceipt = await createSubscriptionTx.wait();
        console.log('createSubscription receipt:', createSubscriptionReceipt);

    } catch (error) {
        console.error('Error:', error);
    }
};

// Call the function
ethereumSubscription();
