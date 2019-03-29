# gatsby-source-trustpilot

Source plugin for pulling Trustpilot data into [Gatsby](https://github.com/gatsbyjs)

## Features

## Installation Guide

- [Install Gatsby](https://www.gatsbyjs.org/docs/)
- Install plugin by running npm `npm i gatsby-source-trustpilot -S`
- Configure the plugin in `gatsby-config.js` file:

```javascript
module.exports = {
  siteMetadata: {
      title: `A sample site using TrustPilot API`,
      subtitle: `My sample site using TrustPilot`,
  },
  plugins: [
      {
          resolve: 'gatsby-source-trustpilot',
          options: {
              apiKey: 'YOUR_TRUSTPILOT_API_KEY',
              secretKey: 'YOUR_TRUSTPILOT_SECRET_KEY',
              username: 'YOUR_TRUSTPILOT_USERNAME',
              password: 'YOUR_TRUSTPILOT_PASSWORD',
              domains: [
                  'trustpilot.co.uk', // An array of website URLs to pull the reviews for
              ],
          },
      },
  ],
};
```

## Usage

For every website specified in the `domains` property in config file, the plugin will fetch service review summary and service reviews.

With the example above, the plugin would generate the following queries:

```graphql
query trustPilotSummary {
    trustPilotSummary(domain:{eq: "trustpilot.co.uk"}) {
        total
        fiveStars    
        domain
        trustScore
        unitId
    }
}
```

```graphql
query allTrustPilotSummary {
    allTrustPilotSummary(filter:{domain:{eq:"trustpilot.co.uk"}}) {
        edges {
            node {
                total
                fiveStars
                domain
                trustScore
                unitId
            }
        }
    }
}
```

```graphql
query trustPilotReview {
    trustPilotReview(domain:{eq: "trustpilot.co.uk"}) {
        id
        title
        text
        createdAt
        domain
    }
}
```

```graphql
query allTrustPilotSummary {
    allTrustPilotSummary(filter:{domain:{eq:"trustpilot.co.uk"}}) {
        edges {
            node {
                total
                fiveStars
                domain
                trustScore
                unitId
            }
        }
    }
}
```

## Need more features?

Feel free to contribute if you need more API endpoints covered.
