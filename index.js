const core = require('@actions/core');
const { ClientSecretCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");


(async () => {
    try {
        let buffer = Buffer.from(core.getInput('secret-store-credentials'), 'base64');
        const credentials = JSON.parse(buffer.toString());
        const keyvaultClient = new SecretClient(credentials.secretStoreAddress, new ClientSecretCredential(credentials.tenantId, credentials.clientId, credentials.clientSecret));
        console.log("Starting to look for secrets in secret-store", credentials.secretStoreAddress);
        for await (let secretProperties of keyvaultClient.listPropertiesOfSecrets()) {
            const secretName = secretProperties.name;
            console.log("Found secret", secretName);
            const { value: latestSecret } = await keyvaultClient.getSecret(secretName);
            core.setSecret(latestSecret)
            const secretEnvName = secretName.split(" ").join("_").split("-").join("_").toUpperCase()
            console.log("Setting environment variable", secretEnvName)
            core.exportVariable(secretEnvName, latestSecret);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
})()