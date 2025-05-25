import React from "react";

export function InvisibleLastRow({ colSpan = 1 }) {
  return (
    <>
      <tr style={{ height: "1px", border: "none" }}>
        <td
          colSpan={colSpan}
          style={{
            padding: 0,
            border: "none",
            visibility: "hidden",
          }}
        >
          &nbsp;
        </td>
      </tr>
      <tr style={{ height: "1px", border: "none" }}>
        <td
          colSpan={colSpan}
          style={{
            padding: 0,
            border: "none",
            visibility: "hidden",
          }}
        >
          &nbsp;
        </td>
      </tr>
    </>
  );
}
