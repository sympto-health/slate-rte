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