import React from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";

import { links } from '../data/philrha_links.js';

class Tweet extends React.Component {
  getTweets() {
    let tweets = []
    let twitterLinks = links.twitter
    for (var msgId in twitterLinks) {
      let url = twitterLinks[msgId]['url'];
      let urlSegments = url.split('/');
      let tweetId = urlSegments[urlSegments.length - 1];
      tweetId = tweetId.split('?')[0];

      tweets.push(
        <div key={msgId} className="centerContent">
          <div className="selfCenter">
            <TwitterTweetEmbed tweetId={tweetId} />
          </div>
        </div>
      )
    }
    return tweets
  }

  render() {
    return (
      <div>
        <form onSubmit={this.saveChanges}>
          <button type="submit">Save</button>
          <div>{this.getTweets()}</div>
        </form>
      </div>
    );
  }
}

export default () => (
  <Tweet/>
);
