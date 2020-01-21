import React from "react";
export const RockBag = () => <div className="card"></div>;
export const Canvas = () => {
  const [rocks, setRocks] = React.useState([]);
  const ref = React.useRef(null);
  const click = event => {
    const canvasRect = ref.current.getBoundingClientRect();
    const canvas = {
      x: canvasRect.x + window.scrollX,
      y: canvasRect.y + window.scrollY
    };
    setRocks([
      ...rocks,
      { x: event.pageX - canvas.x, y: event.pageY - canvas.y }
    ]);
    return true;
  };

  React.useEffect(() => {
    window.addEventListener("mouseup", click);
    return () => window.removeEventListener("mouseup", click);
  });

  return (
    <div ref={ref} className="canvas">
      {rocks.map((rock, i) => (
        <Rock key={i} rock={rock} />
      ))}
    </div>
  );
};

const Rock = ({ rock }) => (
  <div
    style={{
      top: rock.y,
      left: rock.x,
      width: 1,
      height: 1,
      backgroundColor: "#fff7b9",
      position: "absolute"
    }}
  />
);
