import { Button, type ButtonProps } from "antd";
import Link from "next/link";
import React from "react";

export function ButtonLink(props: ButtonProps & { href: string; as?: string }) {
  const { href, as, ...rest } = props;
  return (
    <Link href={href} as={as}>
      <Button {...rest} />
    </Link>
  );
}
