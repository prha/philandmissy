import React from "react";
import "./index.scss";

const locationUrl =
  "https://www.google.com/maps/place/700+Crescent+Ave,+Saratoga+Springs,+NY+12866/@43.0561266,-73.7299642,14z";

export default ({ data }) => {
  return (
    <div className="container">
      <div className="card column main">
        <div className="intro">An internet website to announce</div>
        <div className="title">
          <div className="part">Missy</div>
          <div className="part">&</div>
          <div className="part">Phil's</div>
        </div>
        <div className="subtitle">Marital Union</div>
        <Rsvp />
      </div>
      <div className="card row location">
        <div
          className="subcard column text"
          style={{ justifyContent: "space-between", alignItems: "flex-start" }}
        >
          <div className="address">
            <div className="title">Saratoga Springs</div>
            <div>700 Crescent Ave</div>
            <div>Saratoga Springs, NY</div>
            <div>12866</div>
          </div>
          <div className="directions">
            <a href={locationUrl} target="_blank">
              Get Directions &nbsp;&nbsp;&nbsp;&#8594;
            </a>
          </div>
        </div>
        <a
          href={locationUrl}
          className="subcard column map"
          target="_blank"
        ></a>
      </div>
      <div className="card"></div>
    </div>
  );
};

const Rsvp = () => (
  <div className="rsvp">
    <div className="frame1" />
    <div className="frame2" />
    RSVP
  </div>
);
