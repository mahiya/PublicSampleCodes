var location = resourceGroup().location
var resourceGroupId = uniqueString(resourceGroup().id)

// Azure Storage
var storageName = 'storage${resourceGroupId}'
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: storageName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

// Define a name of Azure Function App
var functionAppName = 'function-${resourceGroupId}'

// Azure Application Insights
var appInsightsName = 'appinsight-${resourceGroupId}'
resource appInsights 'Microsoft.Insights/components@2020-02-02-preview' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
  tags: {
    'hidden-link:/subscriptions/${subscription().id}/resourceGroups/${resourceGroup().name}/providers/Microsoft.Web/sites/${functionAppName}': 'Resource'
  }
}

// Azure App Service Plan
var hostingPlanName = 'appserviceplan-${resourceGroupId}'
resource hostingPlan 'Microsoft.Web/serverfarms@2020-10-01' = {
  name: hostingPlanName
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
}

// Azure Function App
var functionExtentionVersion = '~3'
var functionsWorkerRuntime = 'node'
var nodeDefaultVersion = '~14'
var storageConnectionString = 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${listKeys(storageAccount.id, storageAccount.apiVersion).keys[0].value}'
resource functionApp 'Microsoft.Web/sites@2020-06-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  properties: {
    httpsOnly: true
    serverFarmId: hostingPlan.id
    clientAffinityEnabled: true
    siteConfig: {
      appSettings: [
        {
          'name': 'APPINSIGHTS_INSTRUMENTATIONKEY'
          'value': appInsights.properties.InstrumentationKey
        }
        {
          name: 'AzureWebJobsStorage'
          value: storageConnectionString
        }
        {
          'name': 'FUNCTIONS_EXTENSION_VERSION'
          'value': functionExtentionVersion
        }
        {
          'name': 'FUNCTIONS_WORKER_RUNTIME'
          'value': functionsWorkerRuntime
        }
        {
          'name': 'WEBSITE_NODE_DEFAULT_VERSION'
          'value': nodeDefaultVersion
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: storageConnectionString
        }
      ]
    }
  }

  dependsOn: [
    storageAccount
    hostingPlan
    appInsights
  ]
}

// Define output variables
output functionAppHostName string = functionApp.properties.defaultHostName
