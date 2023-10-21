import { ethers } from "ethers";
import SubscriptionABI from '../../lib/contractABIs/subsrciptionABI.json';

const ethereumSubscription = async () => {
    try {
        const infuraUrl = 'https://sepolia.infura.io/v3/577e58eea0d74c13b627c1e3808cd711';
        const provider = new ethers.JsonRpcProvider(infuraUrl);

        // Use a secure method to load your private key, e.g., from an environment variable
        const privateKey = "753e10bc305827ad956b98c178ed80b0c98900d40a6ecec3e05fe373ad9f85a3"; // Load your private key securely
        const wallet = new ethers.Wallet(privateKey, provider);

        const contractAddress = '0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099';

        // Calculate the interval in seconds
        const interval = 3600 * 24; // One day in seconds

        // Contract instance using the Subscription ABI
        const contract = new ethers.Contract(contractAddress, SubscriptionABI, wallet);
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds

        const createSubscriptionTx = await contract.createSubscription(
            '0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099',
            ethers.parseEther('100'), // Convert deposit to wei
            '0x949bEd886c739f1A3273629b3320db0C5024c719',
            currentTimestamp + 3600, // One hour from now
            currentTimestamp + 3600 * 24 * 7, // One week from startTime
            interval,
            ethers.parseEther('1'), // Convert rate to wei
        );

        const receipt = await createSubscriptionTx.wait();
        console.log("Subscription created successfully:", receipt);
    } catch (error) {
        console.error("Error creating subscription:", error);
    }
}

// Call the function to create the subscription
ethereumSubscription();
