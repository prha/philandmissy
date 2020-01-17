import React from "react";
import "./index.scss";

const locationUrl =
  "https://www.google.com/maps/place/700+Crescent+Ave,+Saratoga+Springs,+NY+12866/@43.0561266,-73.7299642,14z";

const Main = () => (
  <div className="card column main">
    <div className="intro">An internet website to announce</div>
    <div className="mainTitle">
      <div className="part">Missy</div>
      <div className="part">&</div>
      <div className="part">Phil's</div>
    </div>
    <div className="subtitle">Marital Union</div>
    <div className="rsvp">
      <div className="frame1" />
      <div className="frame2" />
      RSVP
    </div>
  </div>
);

const Location = () => (
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
        <a href={locationUrl} target="_blank" rel="noopener noreferrer">
          Get Directions &nbsp;&nbsp;&nbsp;&#8594;
        </a>
      </div>
    </div>
    <a
      href={locationUrl}
      className="subcard column map"
      target="_blank"
      rel="noopener noreferrer"
    >
      &nbsp;
    </a>
  </div>
);

const Schedule = () => {
  const schedule = [
    { name: "Ceremony", time: "12 pm" },
    { name: "Lunch", time: "1 pm" },
    { name: "Hangout", time: "3 pm" },
    { name: "Cocktails", time: "5 pm" },
    { name: "Reception", time: "7 pm" }
  ];
  return (
    <div className="card row schedule">
      <div className="subcard"></div>
      <div className="subcard">
        <div className="title">Begins at Noon</div>

        <div className="scheduleTable">
          {schedule.map((row, i) => (
            <div className="scheduleRow" key={i}>
              <div className="time">{row.time}</div>
              <div className="spacer" />
              <div className="eventName">{row.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Accomodations = () => {
  return (
    <div className="card accommodations">
      <div className="header">
        <div className="title">Accomodations</div>
        <div>Blocks reserved at two locations.</div>
        <div>Call to book and be sure to mention our weddings.</div>
      </div>
      <div className="row">
        <div className="hotel">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3295.76961789303!2d-73.72738656546608!3d43.06094684906703!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x67a8679d5bb3f0c3!2sLongfellows%20Restaurant!5e0!3m2!1sen!2sus!4v1579231348270!5m2!1sen!2sus"
            title="Longfellows"
          ></iframe>
          <div className="description">
            <div>500 Union Ave</div>
            <div>Saratoga Springs, NY</div>
            <div>12866</div>
            <div>0.5 miles</div>
          </div>
        </div>
        <div className="hotel">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2914.6822429170456!2d-73.79218058365814!3d43.069150179145645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89de39ca166c6c61%3A0x4d375a7f14db6c03!2sHilton%20Garden%20Inn%20Saratoga%20Springs!5e0!3m2!1sen!2sus!4v1579231884462!5m2!1sen!2sus"
            title="Hilton Garden Inn"
          ></iframe>
          <div className="description">
            <div>125 S Broadway</div>
            <div>Saratoga Springs, NY</div>
            <div>12866</div>
            <div>4 miles</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ({ data }) => {
  return (
    <div className="container">
      <Main />
      <Location />
      <Schedule />
      <Accomodations />
    </div>
  );
};
