# Jasmine to Chai Codemod

Codemod for [jscodeshift] to migrate your tests from Jasmine to Chai syntax.

## Use case

This transform may be useful if you have relatively many tests on Jasmine
framework and want to change to some other framework with Chai support or maybe
just add Chai syntax.

## Install

* `npm i -g jscodeshift` to install jscodeshift globally
* Install/clone/download this repository

## Usage

`jscodeshift <your-tests-path> -t <codemod-script>`

For more info see [jscodeshift] documentation.

## Try it

* [Import 'expect' sandbox]
* [Assertions sandbox]

[jscodeshift]: https://github.com/facebook/jscodeshift
[Import 'expect' sandbox]: https://astexplorer.net/#/gist/3f2de7f7a4e3b6c16fd3e21256332bbc/fa4054baca48de14f0ba8e49dd8b8fdeb17dc3a5
[Assertions sandbox]: https://astexplorer.net/#/gist/bb80fb0d9fca0241d91daccd83ea9b84/f249827b96989b208f233a50b752171fd5e4078a
