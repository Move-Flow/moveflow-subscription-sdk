import { convertRateTypeToSeconds } from './utils/intervalsConversion';
import { ethers } from 'ethers';
import SubscriptionABI from './lib/contractABIs/subsrciptionABI.json';

const ethereumSubscription = async () => {
    try {
        const infuraUrl = 'https://sepolia.infura.io/v3/577e58eea0d74c13b627c1e3808cd711';
        const provider = new ethers.JsonRpcProvider(infuraUrl);

        // dump wallet private key that contains sepolia 
        const privateKey = '753e10bc305827ad956b98c178ed80b0c98900d40a6ecec3e05fe373ad9f85a3';
        const wallet = new ethers.Wallet(privateKey, provider);

     
        const contractAddress = '0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099';
        const recipient = '0xbDf6Fb9AF46712ebf58B9CB0c23B4a881BF58099';
        const subscriptionAmount = 2;
        const tokenAddress = '0x949bEd886c739f1A3273629b3320db0C5024c719';
        const startTime = 1634414400;
        const stopTime = 1637006400;
        const fixedRate = 1;

        // Call the convertRateTypeToSeconds function to calculate the interval
        const rateType = 'day';
        const interval = convertRateTypeToSeconds(rateType);

        // contract instance using the Subscription ABI
        const contract = new ethers.Contract(contractAddress, SubscriptionABI, wallet);

        const createSubscriptionTx = await contract.createSubscription(
            recipient,
            subscriptionAmount,
            tokenAddress,
            startTime,
            stopTime,
            interval,
            fixedRate
        );

  
            const receipt = await createSubscriptionTx.wait();
            console.log("subscription created successful:",  receipt )

            const nextId = await contract.nextSubscriptionId();

                if (nextId !== undefined) {
                    try {
                        const subscriptionDetails = await contract.getSubscription(BigInt(nextId));
                        console.log("Subscription Details:", subscriptionDetails);
                    } catch (error) {
                        console.error("Error fetching subscription details:", error);
                    }
                } else {
                    console.error("Next subscription ID is undefined");
                }
        try {
            // Now you can use the obtained nextId to get subscription details
            const subscriptionDetails = await contract.getSubscription(BigInt(nextId));
            console.log("Subscription Details:", subscriptionDetails);
        } catch (error) {
            console.error("Error fetching subscription details:", error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Call the function
 ethereumSubscription();
