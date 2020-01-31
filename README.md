# LeanIX Secrets Action

This repository helps you to programmatically provide a list of predefined secrets as environment variables to your current Github Action workflow.
For now it assumes that your Github repository was provisioned with credentials that allow to access the Azure Key vault in a Github Action secret called INJECTED_SECRET_STORE_CREDENTIALS.
  
## Use Action

To populate the environment of your current Github Actions Workflow job with the secrets defined in the Azure Key Vault, just use the following action in any of your workflow:

```yaml
- uses: leanix/secrets-action
  with:
    secret-store-credentials: ${{ secrets.INJECTED_SECRET_STORE_CREDENTIALS }}
```

The action will log the names of all environment variables it created, so that you know which secrets you can use.
