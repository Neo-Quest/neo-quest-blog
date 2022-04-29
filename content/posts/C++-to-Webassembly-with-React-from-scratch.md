---
title: C++ To WebAssembly With React From Scratch!
subtitle: Part I
category:
  - WebAssembly
author: Nikhil Gupta
date: 2020-03-24T19:59:59.000Z
featureImage: /uploads/marc-olivier-jodoin-nqoinj-ttqm-unsplash.jpg
---
Hey everyone,

Over the past year, I have seen several projects that required the integration of shared libraries written in C++ with React based web apps. However, it’s difficult to find some simple tutorials that explain the integration process end-to-end. So, this is a humble step in that direction. Without further ado, let’s get started!

# Basic React App Setup

This section takes you through the steps to setup a basic react app. If you already know how to do that, please feel free to jump to the next section.

As expected, we need to first create a basic npm project like so.

```
mkdir sample
cd sample
npm init -y
```

Next, let’s install react and its dependencies.

```
npm install react react-dom
```

Next, let’s setup some basic html and js files.

### index.html

```
<html>
    <head>
        <title>Using WebAssembly with React From Scratch!</title>
    </head>
    <body>
        <div id="root"></div>
        <script src="bundle.js"></script>
    </body>
</html>
```

### index.js

```
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
    <div>
        <h1>Using WebAssembly with React From Scratch!</h1>
    </div>,
    document.getElementById('root')
);
```

Ok, let’s install webpack, babel and associated dependencies.

```
npm install -D webpack webpack-dev-server webpack-cli @babel/core babel-loader @babel/preset-react html-webpack-plugin
```

### webpack.config.js

```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'index.js'),
    mode: 'development',
    module: {
        rules: [
            {
                include: [path.join(__dirname)],
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react'],
                },
            }
        ],
    },
    plugins: [new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'index.html') })],
};
```

Finally, let’s add these commands to our scripts section in package.json

```
"start": "webpack serve"
"build": "webpack"
```

Now, you should be able to start a web app via

```
npm run start
```

Visit http://localhost:8080 to see your web app in action.


# WebAssembly Setup

Ok, now let’s create a sample C++ file in that would expose just a function to add two numbers and return the result.

### cpp/Sample.h

```
class Sample {
public:
    static int add(int a, int b);  
};
```

### cpp/Sample.cpp

```
#include "Sample.h"

int Sample::add(int a, int b) {
    return a+b;
}
```

Next, we will create a binding that specifies how a function can be invoked from JS and its return semantics.

### bindings/SampleBindings.cpp

```
#include <emscripten.h>
#include <emscripten/bind.h>
#include "Sample.h"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(Sample) {
    function("add", optional_override([](int a, int b) -> int {
        return Sample::add(a, b);
    }));
}
```

Finally, we will use emscripten to compile this to WebAssembly. To do this, let’s first install emscripten and add it to our search path using the steps here.

Now, we can simply use em++ to compile our C++ file to a WASM module.

```
emcc --bind bindings/SampleBindings.cpp -Icpp/ cpp/*.cpp -s WASM=1 -s MODULARIZE=1 -o Sample.js
```

# Integration of WASM with React

Ok, it’s time to put everything together. To load a wasm file into our react app, we need to install file-loader and update our webpack configuration to treat it as a resource file.

```
npm install -D file-loader
```

### webpack.config.js

```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'index.js'),
    externals: {
        fs: 'empty',
    },
    mode: 'development',
    module: {
        rules: [
            {
                include: [path.join(__dirname)],
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react'],
                },
            },
            {
                test: /\.(wasm)$/,
                loader: 'file-loader',
                type: 'javascript/auto',
            },
        ],
    },
    plugins: [new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'index.html') })],
};
```

Next, we can load the JS file and point it to the wasm file’s URI.

```
import React from 'react';
import ReactDOM from 'react-dom';

import Sample from './Sample.js';
import SampleWASM from './Sample.wasm';

const sample = Sample({
    locateFile: () => {
        return SampleWASM;
    },
});

ReactDOM.render(
    <div>
        <h1>Using WebAssembly with React From Scratch!</h1>
    </div>,
    document.getElementById('root')
);
```

# Calling C++ Function from JS

Now, we are all set to add our two numbers in JS via our WASM module.

```
import React from 'react';
import ReactDOM from 'react-dom';

import Sample from './Sample.js';
import SampleWASM from './Sample.wasm';

const sample = Sample({
    locateFile: () => {
        return SampleWASM;
    },
});

sample.then((core) => {
    console.log(core.add(1, 2));
});

ReactDOM.render(
    <div>
        <h1>Using WebAssembly with React From Scratch!</h1>
    </div>,
    document.getElementById('root')
);
```

You should see “3” printed on the console. :)

The complete git repo for this sample is available at [Give it a try for yourself!](https://github.com/gupnik/WebAssemblyReact/tree/master/Part%20I).

If you are interested in using OpenGL via WebAssembly, check out [Part II](https://guptanikhil.medium.com/part-ii-opengl-to-webassembly-with-react-8f15430ab6c6).