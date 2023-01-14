# AsyncAPI Portal

![GitHub](https://img.shields.io/github/license/timonback/asyncapi-portal)
[![Build](https://github.com/timonback/asyncapi-portal/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/timonback/asyncapi-portal/actions/workflows/build.yml)
![GitHub Repo stars](https://img.shields.io/github/stars/timonback/asyncapi-portal?style=social)

Display how multiple applications are linked together based on asyncApi documentation files.

*The website offers the best viewing experience and correct links:*

> Website: **[https://timonback.github.io/asyncapi-portal/](https://timonback.github.io/asyncapi-portal/)**

## Demo

The demo is build using the asyncApi yaml (json also supported) of multiple applications. Based on those, an internal
graph is build, which is passed to the renderer (D3.js).

Based on AsyncApi files in the repo assets folder an internal [graph.json](output/graph.json) is generated, which is
rendered by

- [Demo: D3 - Dynamic parsing](./output/visualizer.d3.dynamicFetch.html)
- [Demo: D3 - Static](./output/visualizer.d3.static.html)

### StackBlitz [![Open in StackBlitz](https://img.shields.io/static/v1?label=&message=Open%20in%20StackBlitz&color=blue&logo=stackblitz)](https://stackblitz.com/github/timonback/asyncapi-portal?file=README.md)

[StackBlitz](https://stackblitz.com) allows you to try out the project within a browser and edit the source code. When
changing code, remember to re-build via `npm run build` and reload the preview pane.

## Usage

The visualization can either be completely build at compile time (static)
or generated when the html page is opened (dynamic).

Use "dynamic parsing", when

- you want to get started

Use "static", when:

- the AsyncApi files are not changing
- the AsyncApi files are private
- you have a lot of applications
- you can run a "compile" step
