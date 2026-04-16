import { Spin, type SpinProps } from "antd";
import React, { type FC } from "react";

export const SpinPadded: FC<SpinProps> = (props) => (
  <div
    style={{
      padding: "2rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Spin {...props} />
  </div>
);
