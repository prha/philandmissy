import React from "react";
import { graphql } from "gatsby";
import { Curator } from "../components/curator";

export default ({ data }) => {
  return (
    <Curator urlType="twitter" data={data}></Curator>
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
