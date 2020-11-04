/* Next.js / MUI integration here: https://github.com/mui-org/material-ui/tree/master/examples/nextjs */
import Document, { Head, Main, NextScript } from "next/document";
// styled-jsx included in Next.js by default
import flush from "styled-jsx/server";

import { getSessionFromServer, getUserScript } from "../lib/auth";

class MyDocument extends Document {
  static getInitialProps = (ctx) => {
    const user = getSessionFromServer(ctx.req);

    // Render app and page and get the context of the page with collected side effects.
    let pageContext;
    const page = ctx.renderPage((Component) => {
      const WrappedComponent = (props) => {
        pageContext = props.pageContext;
        return <Component {...props} />;
      };
      return WrappedComponent;
    });

    return {
      ...user,
      ...page,
      pageContext,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: (
        <React.Fragment>
          <style
            id="jss-server-side"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: pageContext.sheetsRegistry.toString(),
            }}
          />
          {flush() || null}
        </React.Fragment>
      ),
    };
  };

  render() {
    const { pageContext, user = {} } = this.props;

    return (
      <html lang="en" dir="ltr">
        <Head>
          {/* You can use the head tag, just not for setting <title> as it leads to unexpected behavior */}
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <meta charSet="utf-8" />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          {/* PWA primary color */}
          <meta
            name="theme-color"
            content={pageContext.theme.palette.primary.main}
          />
          <meta
            name="description"
            content="A social media site built with Next.js"
          />
          <meta name="application-name" content="Social Connect" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Social Connect" />
          <meta name="description" content="Best Social Connect in the world" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#000000" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicon-32x32.png"
          />
          <link rel="manifest" href="/static/manifest.json" />
          <link rel="mask-icon" href="/favicon-32x32.png" color="#5bbad5" />
          <link rel="shortcut icon" href="/favicon-32x32.png" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="https://yourdomain.com" />
          <meta name="twitter:title" content="Social Connect" />
          <meta
            name="twitter:description"
            content="Best Social Connect in the world"
          />
          <meta name="twitter:image" content="/favicon-32x32.png" />
          <meta name="twitter:creator" content="@guptamohit004" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Social Connect" />
          <meta
            property="og:description"
            content="Best Social Connect in the world"
          />
          <meta property="og:site_name" content="Social Connect" />
          <meta property="og:url" content="https://yourdomain.com" />
          <meta property="og:image" content="/favicon-32x32.png" />
        </Head>
        <body>
          <Main />
          <script dangerouslySetInnerHTML={{ __html: getUserScript(user) }} />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
