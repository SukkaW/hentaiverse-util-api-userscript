# HentaiVerse User-Land API (HVULAPI)

## Introduction

A user-land userscript API served as a dependency. HentaiVerse User-Land API allows HentaiVerse userscript author to get required information with simple APIs. Besides a callback-style API the package also provides an asynchronous API, which allows you to build non-blocking userscript. The ultimate goal of this project is to make writing HentaiVerse userscript much simpler.

## Installation

**Common HentaiVerse Player**

You can either download the userscript from [UNPKG](https://unpkg.com/browse/hentaiverse-userland-api/dist/userscript/) (Always up to date) or from forum.

Best used with tampermonkey in **latest Chrome or Firefox**.

**HentaiVerse Userscript Author**

If you are using a bundler of some kind:

```bash
$ npm i hentaiverse-userland-api
# yarn add hentaiverse-userland-api # If you prefer yarn
# pnpm add hentaiverse-userland-api # If you prefer pnpm
```

## Usage

**Common HentaiVerse Player**

If you are a common HentaiVerse player, you don't have to install the script, unless another userscript explicit you to do so.

After installation, you might also make the `HentaiVerse User-Land API` loaded before other userscripts. Takes `tampermonkey` as an example:

1. Enable `Advanced Mode` for tampermonkey.

![](https://pic.skk.moe/file/sukkaw/gh/hv-userland-api/1.png)

1. Drag `HentaiVerse User-Land API` to the first.

![](https://pic.skk.moe/file/sukkaw/gh/hv-userland-api/2.png)

**HentaiVerse UserScript Author**

It is recommended to use a bundler or some kind, as your users won't have to install extra userscripts as a dependency. A quick example:

```js
// CommonJS
const hv = require('hentaiverse-userland-api');
const stamina = hv.getStamina(); // 99

// ES6 Module
import * as hv from 'hentaiverse-userland-api'
const stamina = hv.getStamina(); // 99
```

You can also ask your user to install dependency userscript, and you can access APIs through `window.HentaiVerseUserLandApi` object:

```js
const stamina = window.HentaiVerseUserLandApi.getStamina(); // 99
```

## License

The project is open-sourced under MIT license.
