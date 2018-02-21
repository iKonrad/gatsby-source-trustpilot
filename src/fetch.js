import Trustpilot from 'trustpilot';
import ConfigException from './ConfigException';

class TrustPilotFetcher {
    constructor({apiKey, secretKey, username, password, domains}) {
        if (!apiKey || apiKey === '') {
            throw new ConfigException('Trustpilot API Key missing. Make sure to provide an API key in the config');
        }

        if (!secretKey || secretKey === '') {
            throw new ConfigException('Trustpilot Secret Key missing. Make sure to provide a Secret Key in the config');
        }

        if (!username || username === '') {
            throw new ConfigException('Trustpilot Username missing. Make sure to provide a username in the config');
        }

        if (!password || password === '') {
            throw new ConfigException('Trustpilot Password missing. Make sure to provide a password in the config');
        }

        if (!domains || !Array.isArray(domains) || domains.length === 0) {
            throw new ConfigException('You need to provide at least one domain in your gatsby config. Please refer to gatsby-source-trustpilot documentation');
        }

        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.username = username;
        this.password = password;
        this.domains = domains;
        this.unitIds = [];
        this.client = new Trustpilot({
            apiKey,
            secretKey
        })
    }

    async fetchUnitIdsForDomains() {
        // Map domain names with Unit IDs
        const unitPromises = await this.domains.map(async domain => {
            const res = await this.client.apiRequest(`/v1/business-units/find?apikey=${this.apiKey}&name=${domain}`);
            if (!res || !res.id) { throw new ConfigException(`Business Unit ID not found for domain: ${domain}`); };
            this.unitIds.push({
                domain,
                unitId: res.id,
            });
            return res;
        });
        await Promise.all(unitPromises);
    }

    async getSummary() {
        let results = [];
        for (let unit of this.unitIds) {
            let result = await this.client.apiRequest(`/v1/business-units/${unit.unitId}/`);
            result.unitId = unit.unitId;
            results.push(result);
        }
        return results;
    }

    createQueryString(params) {
        return Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
    }

    async getRecentReviews(params) {
        let results = [];

        const queryString = this.createQueryString(params);
        for (let unit of this.unitIds) {
            let result = await this.client.apiRequest(`/v1/business-units/${unit.unitId}/reviews?${queryString}`);
            result.unitId = unit.unitId;
            results.push(result);
        }
        return results;
    }
}

export default TrustPilotFetcher;