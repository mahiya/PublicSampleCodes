// npm install @azure/data-tables
const { TableServiceClient, TablesSharedKeyCredential, TableClient } = require("@azure/data-tables");

async function main() {

    // Create a service client to create a table
    const account = '';
    const accountKey = '';
    const credential = new TablesSharedKeyCredential(account, accountKey);
    const serviceClient = new TableServiceClient(
        `https://${account}.table.core.windows.net`,
        credential
    );

    // Create a table
    const tableName = `sampletable${Date.now()}`;
    await serviceClient.createTable(tableName);

    // Create an intance to access the table
    const tableClient = new TableClient(`https://${account}.table.core.windows.net`, tableName, credential);

    // Create new entity
    let entity = {
        partitionKey: 'pk1',
        rowKey: 'rk1',
        prop1: 'abc',
        prop2: 123,
        prop3: true
    };
    await tableClient.createEntity(entity)

    // Get the entity
    const createdEntity = await tableClient.getEntity(entity.partitionKey, entity.rowKey);
    console.log(createdEntity);

    // Update the entity
    entity.prop3 = false;
    await tableClient.updateEntity(entity);

    // Delete the entity
    await tableClient.deleteEntity(entity.partitionKey, entity.rowKey);

    // Delete the table
    await serviceClient.deleteTable(tableName);

}

main();
