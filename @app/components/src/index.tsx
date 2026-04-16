import { Col, Row } from "antd";
import Link from "next/link";

/*
 * For some reason, possibly related to the interaction between
 * `babel-plugin-import` and https://github.com/babel/babel/pull/9766, we can't
 * directly export these values, but if we reference them and re-export then we
 * can.
 *
 * TODO: change back to `export { Row, Col, Link }` when this issue is fixed.
 */
const _babelHackRow = Row;
const _babelHackCol = Col;
export { _babelHackCol as Col, Link, _babelHackRow as Row };

export * from "./ButtonLink";
export * from "./ErrorAlert";
export * from "./ErrorOccurred";
export * from "./FourOhFour";
export * from "./organizationHooks";
export * from "./PasswordStrength";
export * from "./SocialLoginOptions";
export * from "./SpinPadded";
export * from "./StandardWidth";
export * from "./Text";
export * from "./Warn";
