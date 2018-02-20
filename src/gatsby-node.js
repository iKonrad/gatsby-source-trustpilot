import Colors from 'colors';
import Fetcher from './fetch';
import { ReviewNode, SummaryNode } from "./nodes";

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

    // Get Business Unit IDs for given domains
    await client.fetchUnitIdsForDomains();

    const reviewsSummary = await client.getSummary();
    const recentReviews = await client.getRecentReviews();

    // Create node for summaries
    for (let summary of reviewsSummary) {
        const summaryNode = SummaryNode(summary);
        createNode(summaryNode);
    }

    for (let unitData of recentReviews) {
        for (let review of unitData.reviews) {
            review.unitId = unitData.unitId;
            const reviewNodeObject = ReviewNode(review);
            createNode(reviewNodeObject);
        }
    }
};