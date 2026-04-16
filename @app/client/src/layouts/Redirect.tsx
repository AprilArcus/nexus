import { NetworkStatus, useApolloClient } from "@apollo/client";
import { H3, StandardWidth } from "@app/components";
import { Skeleton } from "antd";
import Router from "next/router";
import React, { useEffect } from "react";

import { SharedLayout } from "./SharedLayout";

export interface RedirectProps {
  href: string;
  as?: string;
  layout?: boolean;
}

export function Redirect({ href, as, layout }: RedirectProps) {
  const client = useApolloClient();
  useEffect(() => {
    Router.push(href, as);
  }, [as, href]);
  if (layout) {
    return (
      <SharedLayout
        title="Redirecting..."
        query={{
          loading: true,
          data: undefined,
          error: undefined,
          networkStatus: NetworkStatus.loading,
          client,
          refetch: (async () => {
            throw new Error("Redirecting...");
          }) as any,
        }}
      >
        <Skeleton />
      </SharedLayout>
    );
  } else {
    return (
      <StandardWidth>
        <H3>Redirecting...</H3>
        <Skeleton />
      </StandardWidth>
    );
  }
}
