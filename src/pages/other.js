import React from "react";
import { graphql } from "gatsby";
import { Curator } from "../components/curator";

export default ({ data }) => {
  return (
    <Curator urlType="other" data={data}></Curator>
  );
};

export const query = graphql`
  query {
    allDataJson {
      edges {
        node {
          other {
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
