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

2) getBackgroundColor(slateContent) takes slate content adn returns the background color of the content (if any)


### Utility methods

**Parameter Types**
- slateContent: SlateNode[]
  - Slate-rte generated content (renders rich text when passed as a value for slate-rte)
-  onFileLoad: (opts: { id: string }) => Promise<{ url: string }> 
  - Function to load images / video files from a server based on a UUID
- variables: { [variableName: string]: string }
  - Mapping of variables in rich text to their expected values


**Available Utility Methods**
 - parseAsHTML(SlateNode[], variables: { [variableName: string]: string }, onFileLoad:  (opts: { id: string }) => Promise<{ url: string }>): string
   - parseAsHTML returns an HTML stringified version of the slate content w/ variables filled in
- deserializeHTMLString(htmlString: string): SlateNode[]
  - converts html string (generated from parseAsHTML) into the slate-rte compatible format
