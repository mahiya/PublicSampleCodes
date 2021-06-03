# Define the resource group name to deploy
resourceGroupName=$1

# Get deployed function app name
functionAppHostName=`az deployment group show \
  -g $resourceGroupName \
  -n bicep-deploy \
  --query properties.outputs.functionAppHostName.value | sed s/\"//g`
splited=(${functionAppHostName//./ })
functionAppName=${splited[0]}

# Install node modules
npm ic --prefix ./sample-function

# Add App Settings
az functionapp config appsettings set \
  --name $functionAppName \
  --resource-group $resourceGroupName \
  --settings \
  "SAMPLE_ENV_VARIABLE1=123" \
  "SAMPLE_ENV_VARIABLE2=abc"

# Deploy functions
func azure functionapp publish $functionAppName
