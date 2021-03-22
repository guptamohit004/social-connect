/* Next.js / MUI integration here: https://github.com/mui-org/material-ui/tree/master/examples/nextjs */
import App from "next/app";
import Head from "next/head";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import CssBaseline from "@material-ui/core/CssBaseline";
import JssProvider from "react-jss/lib/JssProvider";
import CheckDevice from '../components/layout/checkDevice';
import getPageContext from "../lib/getPageContext";
import { firebaseCloudMessaging } from "../lib/webpush.js";
import { token } from "morgan";
import"firebase/messaging";
import firebase from "firebase/app";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

class MyApp extends App {
  constructor(props) {
    super(props);
    this.pageContext = getPageContext();
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
    this.setToken();
  }
    setToken = async()=> {
      try {
        const token = await firebaseCloudMessaging.init();
          if(token){
          }
      }catch (error) {
        console.log(error);
      }
    }

  render() {
    const { Component, pageProps } = this.props;

    function noop() {}
    if (process.env.NODE_ENV !== 'development') {
      console.log = noop;
      console.warn = noop;
      console.error = noop;
    }
    else{
      console.warn = noop;
      console.error = noop;
    }
    return (
      <div>
        <Head>
          <title>Social Connect</title>
        </Head>
        {/* Wrap every page in Jss and Theme providers */}
        <JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <CheckDevice {...this.props}/>
            {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server side. */}
            <Component pageContext={this.pageContext} {...pageProps} />
          </MuiThemeProvider>
        </JssProvider>
      </div>
    );
  }
}


export default MyApp