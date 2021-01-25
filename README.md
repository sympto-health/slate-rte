# SlateJS Rich Text Editor
Pre-built rich text editor for [Slate](https://www.slatejs.org/examples/richtext) in React. On it's own, Slate.JS has a longer set up time and requires manual configuration of different options, etc. There are not many open source libraries that implement a rich text editor in Slate, so this library is designed to do exactly that.

> Note: This module has been tested with Create React App

### Installation
Run `npm install slate-rte` or `yarn add slate-rte` to add the SlateJS Rich Text Editor into your project.

Additionally, this project requires the installation of react-bootstrap.

### Usage
Here's an example of basic usage:

     
    import React, { Component } from "react";
    import SlateRTE from "slate-rte";
    
    class App extends Component {
      render() {
        return (
          <SlateRTE />
        );
      }
    }
    
    export default App;    


### Development
Run `npm run build` to build a local version of the package. Test using the demo CRA.

### Available methods
Pass in the value (generated from SlateRTE) into the following helpers

1) extractText(slateContent) returns a string representing all the text within your current slate editor

2) deserializeHTMLString(slateContent) converts slate content into HTML that can be rendered without the slate editor

3) parseAsHTML(htmlCode) takes html and converts it into slate content, returning an object that can be  passed into the slate editor

4) getBackgroundColor(slateContent) takes slate content adn returns the background color of the content (if any)

