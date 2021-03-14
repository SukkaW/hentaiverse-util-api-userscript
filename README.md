# HentaiVerse User-Land API (HVULAPI)

## Introduction

A user-land userscript API served as a dependency. HentaiVerse User-Land API allows HentaiVerse userscript author to get required information with simple APIs. Besides a synchronous API the package provides an asynchronous API, which allows you to build non-blocking tasks. The ultimate goal of this project is to make writing HentaiVerse userscript much simpler.

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

## Documentation

### `setMaxNetworkConnections(maxConnections: number): void`

According to the [Rules](https://forums.e-hentai.org/index.php?showtopic=243549) by Nezu:

> Out of battle, rate limits are unspecified, but may be enforced automatically by the server resulting in a lockout (which prevents any further actions or page loads). Regularly triggering this limiter risks bans. Script writers should avoid using multiple connection threads for requests, or limit them to the same 4 per second maximum for the safety of users.

HVULAPI set a default max connections limit as `4`. However, since your users might have other userscripts installed, it is possible for them to reach Rate Limit and get `stock limit ban`. HVULAPI provide a function for you to override the max connections.

```js
hv.setMaxNetworkConnections(2);
```
