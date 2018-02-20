import { TableNode, createTableItemFactory, getNodeTypeNameForTable } from './process';
import ConfigException from './ConfigException';
import Colors from 'colors';
import Trustpilot from 'trustpilot';

exports.sourceNodes = async ({ boundActionCreators }, {
    apiKey,
    secretKey,
    username,
    password,
}) => {
    const { createNode } = boundActionCreators;

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

    const client = new Trustpilot({
        apiKey,
        secretKey,
        username,
        password,
    });

    const res = await client.apiRequest(`/v1/business-units/find?apikey=${apiKey}&name=qualitycompanyformations.co.uk`);

    return;
};