# How to deploy

```bash
./deploy-infra.sh sample-resource-group
./deploy-app.sh sample-resource-group
```

# Delete deployed resources

```bash
az group delete --resource-group sample-resource-group -y
```