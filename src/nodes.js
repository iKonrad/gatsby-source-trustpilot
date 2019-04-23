import createNodeHelpers from 'gatsby-node-helpers';

const {
    createNodeFactory,
} = createNodeHelpers({
    typePrefix: `TrustPilot`,
});

const ReviewNode = createNodeFactory('Review', node => {
    return node;
});

const SummaryNode = createNodeFactory('Summary', node => {
    delete node.links;

    node.total = node.numberOfReviews.total;
    node.oneStar = node.numberOfReviews.oneStar;
    node.twoStars = node.numberOfReviews.twoStars;
    node.threeStars = node.numberOfReviews.threeStars;
    node.fourStars = node.numberOfReviews.fourStars;
    node.fiveStars = node.numberOfReviews.fiveStars;

    delete node.country;
    delete node.numberOfReviews;

    return node;
});

export {
    ReviewNode,
    SummaryNode,
};
