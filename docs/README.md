# API Document

## `setMaxNetworkConnections(maxConnections: number): void`

According to the [Rules description](https://forums.e-hentai.org/index.php?showtopic=243549) by Nezu:

> Out of battle, rate limits are unspecified, but may be enforced automatically by the server resulting in a lockout (which prevents any further actions or page loads). Regularly triggering this limiter risks bans. Script writers should avoid using multiple connection threads for requests, or limit them to the same 4 per second maximum for the safety of users.

HVULAPI set a default max connections limit as `4`. However, since your users might have other userscripts installed, it is possible for them to reach Rate Limit and get `stock limit ban`. HVULAPI provide a function for you to override the max connections.

```js
hv.setMaxNetworkConnections(2);
```

## `getStamina(): number | null`

Read and return current stamina. Return `null` when in-battle (`#stamina_readout` element just doesn't exist).

```js
hv.getStamina();

// 79
```
