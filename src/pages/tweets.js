import React from "react";
import { graphql } from "gatsby";
import { TwitterTweetEmbed } from "react-twitter-embed";

const TWEET_ID_REGEX = /\d+/g

const getTweetId = (link) => {
  const parts = link.url.split("/");
  const tweetPath = parts[parts.length - 1].split("?")[0];
  const matches = tweetPath.match(TWEET_ID_REGEX)
  return matches && matches.length && matches[0];
}

export default ({ data }) => {
  const [includedLinks, setincludedLinks] = React.useState({});
  const links = data.allDataJson.edges.map(x => x.node.twitter).find(x => x.length);
  const toggleLink = (tweetId) => {
    let newincludedLinks = {...includedLinks};
    newincludedLinks[tweetId] = !includedLinks[tweetId];
    setincludedLinks(newincludedLinks)
  }
  const displayLinks = links.filter(link => {
    const tweetId = getTweetId(link);
    return includedLinks[tweetId];
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'row'}}>
      <div style={{flex: 1, borderRight: "1px solid #ececec"}}>
        {links.map((link) => {
          const tweetId = getTweetId(link);
          const included = includedLinks[tweetId];
          return (
            <div key={tweetId} style={{ display: 'flex', flexDirection: 'row'}}>
              <div>
                <input type="checkbox" checked={included} onChange={() => toggleLink(tweetId)} style={{ margin: 20}} />
              </div>
              <div>
              <TwitterTweetEmbed tweetId={tweetId} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{flex: 1, padding: 10}}>
        <textarea style={{width: '100%', height: '100%', border: 'none'}} value={JSON.stringify(displayLinks, null, 2)} readOnly/>
      </div>
    </div>
  );
};

export const query = graphql`
  query {
    allDataJson {
      edges {
        node {
          twitter {
            url
            from
            timestamp
          }
        }
      }
    }
  }
`;
