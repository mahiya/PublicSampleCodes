// Install-Package Microsoft.Azure.Management.Fluent
// Install-Package Microsoft.Azure.Management.ResourceManager.Fluent
using Microsoft.Azure.Management.Fluent;
using Microsoft.Azure.Management.ResourceManager.Fluent;
using Microsoft.Azure.Management.ResourceManager.Fluent.Core;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AzureResourceManagerSample
{
    class Program
    {
        static async Task Main()
        {
            // Create "auth.json" by the following Azure CLI command
            // > az ad sp create-for-rbac --sdk-auth
            var authFilePath = "auth.json";
            var credentials = SdkContext.AzureCredentialsFactory.FromFile(authFilePath);

            // Authentication at Azure
            var azure = Azure
                .Configure()
                .WithLogLevel(HttpLoggingDelegatingHandler.Level.Basic)
                .Authenticate(credentials)
                .WithDefaultSubscription();

            // Define tags
            var tags = new Dictionary<string, string> { { "env", "sample" } };

            // Create a resource group
            var region = Region.JapanEast;
            var resourceGroupName = "sample-resource-group";
            await azure.ResourceGroups
                .Define(resourceGroupName)                
                .WithRegion(region)
                .WithTags(tags)
                .CreateAsync();

            // Create a storage account
            var storageAccountName = $"samplestorage{System.DateTime.Now.Millisecond}";
            await azure.StorageAccounts
                .Define(storageAccountName)
                .WithRegion(region)
                .WithExistingResourceGroup(resourceGroupName)
                .WithTags(tags)
                .CreateAsync();

            // Delete the resource group
            await azure.ResourceGroups.DeleteByNameAsync(resourceGroupName);
        }
    }
}
