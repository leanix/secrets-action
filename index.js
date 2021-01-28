const core = require('@actions/core');
const { ClientSecretCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");


(async () => {
    try {
        let buffer = Buffer.from(core.getInput('secret-store-credentials'), 'base64');
        const credentials = JSON.parse(buffer.toString());
        const keyvaultClient = new SecretClient(credentials.secretStoreAddress, new ClientSecretCredential(credentials.tenantId, credentials.clientId, credentials.clientSecret));
        console.log("Starting to look for secrets in secret-store", credentials.secretStoreAddress);
        var secretNames = [];
        for await (let secretProperties of keyvaultClient.listPropertiesOfSecrets()) {
            const secretName = secretProperties.name;
            console.log("Found secret", secretName);
            secretNames.push(secretName);
        }
        const secrets = await Promise.all(secretNames.map(async (secretName) => {
            const { value: latestSecret } = await keyvaultClient.getSecret(secretName);
            return { name: secretName, secretValue: latestSecret };
        }));
        secrets.forEach((secret) => {
            core.setSecret(secret.secretValue)
            const secretEnvName = secret.name.split(" ").join("_").split("-").join("_").toUpperCase()
            console.log("Setting environment variable", secretEnvName)
            core.exportVariable(secretEnvName, secret.secretValue);
        });
    } catch (error) {
        core.setFailed(error.message);
    }
})()