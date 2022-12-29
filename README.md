# AsyncAPI Portal

![GitHub](https://img.shields.io/github/license/timonback/asyncapi-portal)
[![Build](https://github.com/timonback/asyncapi-portal/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/timonback/asyncapi-portal/actions/workflows/build.yml)

Display how multiple applications are linked together based on asyncApi documentation files.

*The website offers the best viewing experience and correct links:*

> Website: **[https://timonback.github.io/asyncapi-portal/](https://timonback.github.io/asyncapi-portal/)**

## Demo

The demo is build using the asyncApi yaml (json also supported) of multiple applications. Based on those, an internal
graph is build, which is passed to the renderer (D3.js).

AsyncApi files:

- [output/asyncapifiles/application-consumer.yaml](output/asyncapifiles/application-consumer.yaml)
- [output/asyncapifiles/application-producer.yaml](output/asyncapifiles/application-producer.yaml)

(Internal graph): [output/graph.json](output/graph.json)

Renderer:

- [D3 - Dynamic parsing](./output/visualizer.d3.dynamicFetch.html)
- [D3 - Static](./output/visualizer.d3.static.html)

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

