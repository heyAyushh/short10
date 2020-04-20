import * as React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { Stylesheet, InjectionMode, resetIds } from 'office-ui-fabric-react';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const stylesheet = Stylesheet.getInstance();
    stylesheet.setConfig({
        injectionMode: InjectionMode.none,
        namespace: 'server'      
    });
    stylesheet.reset();
    resetIds();

    const page = renderPage((App) => (props) => <App {...props} />);
    
    return { ...page, styleTags: stylesheet.getRules(true) };
  }

  render() {
    return (
      <html>
        <Head>       
          <style type="text/css" dangerouslySetInnerHTML={{__html: this.props.styleTags}} />          
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}