import React from "react";

export const Checkbox = ({ checked, style, onChange, ...props }) => (
  <label
    style={{
      display: "inline-block",
      verticalAlign: "middle",
      ...style,
      cursor: "pointer"
    }}
  >
    <input
      type="checkbox"
      style={{
        border: 0,
        clip: "rect(0 0 0 0)",
        clippath: "inset(50%)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        whiteSpace: "nowrap",
        width: 1
      }}
      checked={checked}
      onChange={onChange}
      {...props}
    />
    <div
      style={{
        display: "inline-block",
        width: 16,
        height: 16,
        background: checked ? "#00BC9D" : "#E2F7F4",
        border: checked ? "1px solid transparent" : "1px solid #A2DDD3",
        borderRadius: 3,
        transition: "all 150ms"
      }}
    >
      <svg
        style={{
          fill: "none",
          stroke: "white",
          strokeWidth: 2,
          visibility: checked ? "visible" : "hidden"
        }}
        viewBox="0 0 24 24"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  </label>
);
