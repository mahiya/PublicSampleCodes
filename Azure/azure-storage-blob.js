// npm install @azure/storage-blob
const { BlobServiceClient } = require("@azure/storage-blob");

async function main() {

    // Create a service client to create a table
    const connectionString = '';
    const serviceClient = new BlobServiceClient.fromConnectionString(connectionString);

    // Create a container
    const containerName = `samplecontainer${Date.now()}`;
    const containerClient = await serviceClient.getContainerClient(containerName);
    await containerClient.create();

    // Upload a blob to the container
    const blobName = 'sample.txt';
    const blobClient = containerClient.getBlockBlobClient(blobName)
    const content = 'Hello Azure Storage Blob !';
    await blobClient.upload(content, content.length);

    // Download the blob
    const buffer = await blobClient.downloadToBuffer();
    const downloadedContent = buffer.toString();
    console.log(downloadedContent);

    // Generate a shared access signature
    const sas = await blobClient.generateSasUrl({
        permissions: "read",
        expiresOn: new Date(Date.now() + 1000 * 60 * 5),
    });
    console.log(sas);

    // Delete the container
    await containerClient.delete();

}

main();
