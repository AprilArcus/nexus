import "antd/dist/reset.css";
import "nprogress/nprogress.css";
import "../styles.css";

import { type ApolloClient, ApolloProvider } from "@apollo/client";
import { setGraphileApp, withApollo } from "@app/lib";
import { ConfigProvider, notification } from "antd";
import App from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import * as React from "react";

NProgress.configure({
  showSpinner: false,
});

if (typeof window !== "undefined") {
  const nextDataEl = document.getElementById("__NEXT_DATA__");
  if (!nextDataEl || !nextDataEl.textContent) {
    throw new Error("Cannot read from __NEXT_DATA__ element");
  }
  const data = JSON.parse(nextDataEl.textContent);
  if (!data.props?.graphileApp) {
    throw new Error(
      "Cannot find property props.graphileApp in __NEXT_DATA__. Was it returned correctly from MyApp.getInitialProps()?"
    );
  }
  setGraphileApp(data.props.graphileApp);

  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });

  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });
  Router.events.on("routeChangeError", (err: Error | string) => {
    NProgress.done();
    if ((err as any)["cancelled"]) {
      // No worries; you deliberately cancelled it
    } else {
      notification.open({
        message: "Page load failed",
        description: `This is very embarrassing! Please reload the page. Further error details: ${
          typeof err === "string" ? err : err.message
        }`,
        duration: 0,
      });
    }
  });
}

class MyApp extends App<{ apollo: ApolloClient<any> }> {
  static async getInitialProps({ Component, ctx }: any) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const graphileApp = ctx.req?.graphileApp;

    return { pageProps, graphileApp };
  }

  render() {
    const { Component, pageProps, apollo } = this.props;

    return (
      <ConfigProvider
        theme={{
          // Customize your theme via the theme editor: https://ant.design/theme-editor
          token: {
            colorBgBase: "#ffffff",
            colorTextBase: "#0a0a0a",
            colorPrimary: "#3055ee",
            colorBgLayout: "#fff",
          },
          components: {
            Layout: {
              colorBgHeader: "#fff",
            },
          },
        }}
      >
        <ApolloProvider client={apollo}>
          <Component {...pageProps} />
        </ApolloProvider>
      </ConfigProvider>
    );
  }
}

export default withApollo(MyApp);
