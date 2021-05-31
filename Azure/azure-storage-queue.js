// npm install @azure/storage-queue
const { QueueServiceClient } = require("@azure/storage-queue");

async function main() {

    // Create client to create a queue
    const connectionString = '';
    const queueServiceClient = QueueServiceClient.fromConnectionString(connectionString);

    // Create a queue
    const queueName = `samplequeue-${Date.now()}`;
    const queueClient = queueServiceClient.getQueueClient(queueName);
    await queueClient.create();

    // Send a message to the queue
    const message = "Hello Azure Storage Queue !";
    await queueClient.sendMessage(message);

    // Receive messages from the queue
    const resp = await queueClient.receiveMessages();
    for (const receivedMessageItem of resp.receivedMessageItems) {
        console.log(receivedMessageItem.messageText);
    }

    // Delete the queue
    await queueClient.delete();
}

main();