---
title: OpenGL To WebAssembly With React!
subtitle: Part II
category:
  - WebAssembly
author: Nikhil Gupta
date: 2021-04-07T19:59:59.000Z
featureImage: /uploads/marc-olivier-jodoin-nqoinj-ttqm-unsplash.jpg
---
Hey everyone,

I had talked about an end-to-end React App with WebAssembly in my previous [article](https://neoquest.xyz/C++-to-Webassembly-with-React-from-scratch). This one intends to take it a step further by bringing in GPU rendering via OpenGL. So, let’s get started!

# Basic WebGL Setup

This section takes you through the basic webgl setup within our react app. It builds upon the code base from the previous article available [here](https://github.com/gupnik/WebAssemblyReact/tree/master/Part%20I).

We first need to add a canvas to our DOM.

```
<canvas id=”glCanvas” width=”100px” height=”100px” />
```

Now, we can create a draw function that extracts the WebGL context from this canvas and clears the canvas to red color.

With these changes, our index.js looks like below:

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

    requestAnimationFrame(draw);
});

const draw = () => {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    gl.clearColor(1, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    requestAnimationFrame(draw);
}

ReactDOM.render(
    <div>
        <h1>Using WebAssembly with React From Scratch!</h1>
        <canvas id="glCanvas" width="100px" height="100px" />
    </div>,
    document.getElementById('root')
);
```

`requestAnimationFrame` requests the browser to call the draw function at appropriate times.

On `npm run start`, you should now see a red square that has been rendered via WebGL.

# OpenGL via WebAssembly

Next, let’s try to achieve the same using OpenGL. To accomplish this, we will add a function in our Sample Class that accepts a string (which will be the id of canvas in our DOM).

```
#include <string>

class Sample
{
public:
    static int add(int a, int b);
    static void render(const std::string &id);
};
```

In our implementation, we will create a webgl context and then, call OpenGL APIs to clear the canvas like so:

```
#include "Sample.h"
#include <emscripten/html5.h>
#include <GLES3/gl3.h>

int Sample::add(int a, int b)
{
    return a + b;
}

void Sample::render(const std::string &id)
{
    EmscriptenWebGLContextAttributes attrs;
    attrs.explicitSwapControl = 0;
    attrs.depth = 1;
    attrs.stencil = 1;
    attrs.antialias = 1;
    attrs.majorVersion = 2;
    attrs.minorVersion = 0;

    EMSCRIPTEN_WEBGL_CONTEXT_HANDLE context = emscripten_webgl_create_context(id.c_str(), &attrs);
    if (context < 0)
    {
        printf("failed to create webgl context %d\n", context);
        return;
    }

    EMSCRIPTEN_RESULT r = emscripten_webgl_make_context_current(context);
    if (r < 0)
    {
        printf("failed to make webgl current %d\n", r);
        return;
    }

    glClearColor(1, 0, 0, 1);
    glClear(GL_COLOR_BUFFER_BIT);
}
```

With these out of the way, we can simply expose our render API as below:

```
#include <emscripten.h>
#include <emscripten/bind.h>
#include "Sample.h"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(Sample)
{
    function("add", optional_override([](int a, int b) -> int {
                 return Sample::add(a, b);
             }));

    function("render", optional_override([](const std::string &id) {
                 Sample::render(id);
             }));
}
```

Now, let’s update our core module with our latest changes:

```
emcc --bind bindings/SampleBindings.cpp -Icpp/ cpp/*.cpp -s WASM=1 -s MODULARIZE=1 -o Sample.js
```

Finally, we just need to go back to our draw function and update it to use this API via our core module:

```
import React from 'react';
import ReactDOM from 'react-dom';

import Sample from './Sample.js';
import SampleWASM from './Sample.wasm';

let coreModule;

const sample = Sample({
    locateFile: () => {
        return SampleWASM;
    },
});

sample.then((core) => {
    console.log(core.add(1, 2));
    coreModule = core;

    requestAnimationFrame(draw);
});

const draw = () => {
    coreModule.render('#glCanvas');

    requestAnimationFrame(draw);
}

ReactDOM.render(
    <div>
        <h1>Using WebAssembly with React From Scratch!</h1>
        <canvas id="glCanvas" width="100px" height="100px" />
    </div>,
    document.getElementById('root')
);
```

On `npm run start`, you should again see the red square, but it has been rendered using WebAssembly. 

Now, you can start to bring-in your OpenGL code and see it running right in your browser :)

The complete git repo for this sample is available [here](https://github.com/gupnik/WebAssemblyReact/tree/master/Part%20II).