import React from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import YouTube from "react-youtube";

const TWEET_ID_REGEX = /\d+/g;

const getTweetId = link => {
  const parts = link.url.split("/");
  const tweetPath = parts[parts.length - 1].split("?")[0];
  const matches = tweetPath.match(TWEET_ID_REGEX);
  return matches && matches.length && matches[0];
};

const getYoutubeId = url => {
  if (url.indexOf('youtu.be') !== -1) {
    const parts = url.split('youtu.be/');
    var videoId = parts[parts.length - 1];
  } else {
    var videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if(ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }
  }
  return videoId;
}

export const LinkDisplay = ({ urlType, link }) => {
  if (urlType === "twitter") {
    return (
      <TwitterTweetEmbed tweetId={getTweetId(link)} />
    );
  }  else if (urlType === "youtube") {
    const opts = {
      height: 180,
      width: 320
    }
    return (
      <YouTube videoId={getYoutubeId(link.url)} opts={opts}/>
    );
  }

  return link.url
}
