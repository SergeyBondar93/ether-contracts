export const getHistory = (contract) => {
  async function getContractEvents() {
    try {
      // Fetch all past Incremented events
      const incrementedEvents = await contract.queryFilter("Incremented");
      const decrementedEvents = await contract.queryFilter("Decremented");
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

  contract.on("Incremented", (caller, newCount, event) => {
    console.log(`Incremented by ${caller}, new count: ${newCount}`);
  });
  contract.on("Decremented", (caller, newCount, event) => {
    console.log(`Incremented by ${caller}, new count: ${newCount}`);
  });
};
