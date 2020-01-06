import React from "react";
import { Checkbox } from "../components/checkbox";
import { LinkDisplay } from "../components/LinkDisplay";
import { copyValue } from "../util";


export const Curator = ({ data, urlType }) => {
  const [includedLinks, setIncludedLinks] = React.useState({});
  let linkMap = {};
  data.allDataJson.edges
    .map(x => x.node[urlType])
    .find(x => x && x.length)
    .forEach(link => {
      linkMap[link.message_id] = link;
    });
  const links = Object.values(linkMap).sort(
    (a, b) => a.timestamp - b.timestamp
  );
  const toggleLink = messageId => {
    let newIncludedLinks = { ...includedLinks };
    newIncludedLinks[messageId] = !includedLinks[messageId];
    setIncludedLinks(newIncludedLinks);
  };
  const displayLinks = links.filter(link => {
    return includedLinks[link.message_id];
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
          const messageId = link.message_id
          const included = includedLinks[messageId];
          return (
            <div
              key={messageId}
              style={{ display: "flex", flexDirection: "row", paddingTop: 10}}
            >
              <div>
                <Checkbox
                  checked={!!included}
                  onChange={() => toggleLink(messageId)}
                  style={{ margin: 20 }}
                />
              </div>
              <div>
                <LinkDisplay urlType={urlType} link={link} />
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