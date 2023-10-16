export function generateRandomSubscriptionId() {
    try {
      const randomId = Math.floor(Math.random() * 1000) + 1;
      const subscriptionId = BigInt(randomId);
  
      // Retrieve existing IDs from local storage or initialize an empty array
      const storedIds = JSON.parse(localStorage.getItem('subscriptionIds')) || [];
  
      // Check if the generated ID is unique
      if (!storedIds.includes(subscriptionId.toString())) {
        storedIds.push(subscriptionId.toString());
        localStorage.setItem('subscriptionIds', JSON.stringify(storedIds));
  
        return subscriptionId;
      } else {
        // If the ID is not unique, recursively call the function again
        return generateRandomSubscriptionId();
      }
    } catch (error) {
      console.error("Error generating subscription ID:", error);
      // Handle error appropriately
      return null;
    }
  }
  