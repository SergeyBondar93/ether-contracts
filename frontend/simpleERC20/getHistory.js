export const getHistory = (contract) => {
  async function getContractEvents() {
    try {
      // Fetch all past Transfer events
      const incrementedEvents = await contract.queryFilter("Transfer");
      const decrementedEvents = await contract.queryFilter("Approval");
      console.log("!Start getting ");

      // Process events
      const allEvents = [...incrementedEvents, ...decrementedEvents].map(
        (event) => ({
          event: event.event,
          caller: event.args.caller,
          newCount: event.args.newCount.toString(),
          transactionHash: event.transactionHash,
        })
      );
      console.log("All events", allEvents);

      return allEvents;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }
  getContractEvents();

  contract.on("Transfer", (caller, newCount, event) => {
    console.log(`Transfer by ${caller}, new count: ${newCount}`);
  });
  contract.on("Approval", (caller, newCount, event) => {
    console.log(`Transfer by ${caller}, new count: ${newCount}`);
  });
};
