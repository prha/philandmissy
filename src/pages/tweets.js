import React from "react";
import { graphql } from "gatsby";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Checkbox } from "../components/checkbox";
import { copyValue } from "../util";

const TWEET_ID_REGEX = /\d+/g;

const getTweetId = link => {
  const parts = link.url.split("/");
  const tweetPath = parts[parts.length - 1].split("?")[0];
  const matches = tweetPath.match(TWEET_ID_REGEX);
  return matches && matches.length && matches[0];
};

export default ({ data }) => {
  const [includedLinks, setIncludedLinks] = React.useState({});
  let linkMap = {};
  data.allDataJson.edges
    .map(x => x.node.twitter)
    .find(x => x.length)
    .forEach(link => {
      linkMap[getTweetId(link)] = link;
    });
  const links = Object.values(linkMap).sort(
    (a, b) => a.timestamp - b.timestamp
  );
  const toggleLink = tweetId => {
    let newIncludedLinks = { ...includedLinks };
    newIncludedLinks[tweetId] = !includedLinks[tweetId];
    setIncludedLinks(newIncludedLinks);
  };
  const displayLinks = links.filter(link => {
    const tweetId = getTweetId(link);
    return includedLinks[tweetId];
  });

  const jsonValue = JSON.stringify(displayLinks, null, 2);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: "50%",
          borderRight: "1px solid #ececec",
          overflow: "auto"
        }}
      >
        {links.map(link => {
          const tweetId = getTweetId(link);
          const included = includedLinks[tweetId];
          return (
            <div
              key={tweetId}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <div>
                <Checkbox
                  checked={!!included}
                  onChange={() => toggleLink(tweetId)}
                  style={{ margin: 20 }}
                />
              </div>
              <div>
                <TwitterTweetEmbed tweetId={tweetId} />
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          right: 0,
          overflow: "auto"
        }}
      >
        <div
          style={{
            backgroundColor: "#00BC9D",
            border: "1px solid #00BC9D",
            borderRadius: 3,
            color: "white",
            display: "block",
            margin: 10,
            padding: 10,
            textAlign: "center",
            fontFamily: "Open Sans, sans-serif",
            cursor: "pointer"
          }}
          onClick={e => copyValue(e, jsonValue)}
        >
          Copy JSON
        </div>
        <textarea
          style={{
            width: "90%",
            height: "90%",
            border: "none",
            margin: 10,
            outline: "none"
          }}
          value={jsonValue}
          readOnly
        />
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
            message_id
          }
        }
      }
    }
  }
`;
