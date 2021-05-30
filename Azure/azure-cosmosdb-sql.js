const CosmosClient = require("@azure/cosmos").CosmosClient;
const endpoint = '';
const key = '';
const client = new CosmosClient({ endpoint, key });

async function main() {

    // Create a database
    const databaseId = 'sampledb';
    await client.databases.createIfNotExists({ id: databaseId });

    // Delete a container
    const containerId = 'samplecontainer';
    const partitionKey = '/pk';
    const offerThroughput = 400;
    await client.database(databaseId).containers.createIfNotExists(
        { id: containerId, partitionKey },
        { offerThroughput }
    );

    // Refer the database and the container
    const database = client.database(databaseId);
    const container = database.container(containerId);

    // Create an item
    await container.items.create({
        pk: 'samplepk',
        prop1: 'abc',
        prop2: 123,
        prop3: true
    });

    // Query items
    const query = 'SELECT * FROM c';
    const querySpec = { query };
    const { resources: items } = await container.items.query(querySpec).fetchAll();
    console.log(items);

    // Delete the database
    database.delete();

}

main();
