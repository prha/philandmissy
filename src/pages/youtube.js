import React from "react";
import { graphql } from "gatsby";
import { Curator } from "../components/curator";

export default ({ data }) => {
  return (
    <Curator urlType="youtube" data={data}></Curator>
  );
};

export const query = graphql`
  query {
    allDataJson {
      edges {
        node {
          youtube {
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
