import '@babel/polyfill';
import Colors from 'colors';
import Fetcher from './fetch';
import { ReviewNode, SummaryNode } from './nodes';

exports.sourceNodes = async ({ boundActionCreators }, {
    apiKey,
    secretKey,
    username,
    password,
    domains,
}) => {
    const { createNode } = boundActionCreators;
    const client = new Fetcher({
        apiKey,
        secretKey,
        username,
        password,
        domains,
    });
    
    logInfo('Connecting to the Trustpilot API...');

    // Get Business Unit IDs for given domains
    await client.fetchUnitIdsForDomains();

    if (client.unitIds.length > 0) {
        logSuccess(`Fetched Business Unit IDs for `, `${client.unitIds.length}`.magenta, ` domains`);
    } else {
        logWarning('No Business Unit IDs found. Have you passed correct domains in config file?');
    }

    const reviewsSummary = await client.getSummary();

    logSuccess(`Fetched `, `${reviewsSummary.length}`.magenta, ` summary items`);

    const recentReviews = await client.getRecentReviews({perPage: 100});

    // Create node for summaries
    for (let summary of reviewsSummary) {
        const currentUnit = client.unitIds.filter(({ unitId }) => unitId === summary.unitId);
        const summaryNode = SummaryNode(summary);

        summary.domain = currentUnit[0].domain;
        createNode(summaryNode);
    }

    for (let unitData of recentReviews) {
        let reviewsCount = 0;

        // Get current unit so we can attach the domain to the review
        const currentUnit = client.unitIds.filter(({ unitId }) => unitId === unitData.unitId);

        // Create nodes for individual reviews
        for (let review of unitData.reviews) {
            reviewsCount++;
            review.unitId = unitData.unitId;
            review.domain = currentUnit[0].domain;
            const reviewNodeObject = ReviewNode(review);
            createNode(reviewNodeObject);
        }

        logSuccess('Fetched ', `${reviewsCount}`.magenta, ' reviews for ', `${currentUnit[0].domain}`.magenta, ' Business Unit ID');
    }
};

const logWarning = (...text) => {
    console.log('\ngatsby-source-trustpilot '.cyan, 'warning '.yellow, ...text);
};

const logError = (...text) => {
    console.log('\ngatsby-source-trustpilot '.cyan, 'success '.red, ...text);
};

const logSuccess = (...text) => {
    console.log('\ngatsby-source-trustpilot '.cyan, 'success '.green, ...text);
};

const logInfo = (...text) => {
    console.log('\ngatsby-source-trustpilot '.cyan, 'info '.blue, ...text);
};
