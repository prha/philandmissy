import React from 'react';
import {graphql} from 'gatsby';

export default ({data}) => {
  return (
    <>
      <div>Hello</div>
      <div>
        {data.allLoadyJson.edges.map((edge, i) => (
          <div key={i}>
            {edge.node.sender}: {edge.node.link}
          </div>
        ))}
      </div>
      <div>Goodbye</div>
    </>
  );
};

export const query = graphql`
  query {
    allLoadyJson {
      edges {
        node {
          sender
          link
        }
      }
    }
  }
`;
