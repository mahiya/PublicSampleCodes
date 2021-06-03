# Define the region and resource group name to deploy
ResourceGroupName=$1
Region=japaneast

# Create a resource group
az group create --location $Region --resource-group $ResourceGroupName

# Deploy the Bicep template
az deployment group create --name bicep-deploy --resource-group $ResourceGroupName --template-file deploy.bicep