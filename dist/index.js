module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 138:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

const core = __webpack_require__(466);
const { ClientSecretCredential } = __webpack_require__(890);
const { SecretClient } = __webpack_require__(307);


(async () => {
    try {
        console.log("For testing reasons")
        console.log("-----------------------------------")
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

/***/ }),

/***/ 466:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 890:
/***/ ((module) => {

module.exports = eval("require")("@azure/identity");


/***/ }),

/***/ 307:
/***/ ((module) => {

module.exports = eval("require")("@azure/keyvault-secrets");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(138);
/******/ })()
;