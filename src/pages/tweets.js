import React from "react";
import { graphql } from "gatsby";
import { TwitterTweetEmbed } from "react-twitter-embed";

export default ({ data }) => {
  return (
    <div>
      <form>
        <div>
          {data.allLinksJson.edges.map(({ node }) => {
            const parts = node.url.split("/");
            const tweetId = parts[parts.length - 1].split("?")[0];
            return (
              <div key={tweetId} className="centerContent">
                <div className="selfCenter">
                  <TwitterTweetEmbed tweetId={tweetId} />
                </div>
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
};

export const query = graphql`
  query {
    allLinksJson {
      edges {
        node {
          url
        }
      }
    }
  }
`;
