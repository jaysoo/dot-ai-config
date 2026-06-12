// Root-level shared module, read at build time by packages/lib/build.mjs.
// It lives OUTSIDE packages/lib and is NOT listed in turbo.json globalDependencies,
// so Turbo never folds its contents into the build's cache key.
// (Real-world analog: payloadcms/payload declares ZERO globalDependencies;
//  dub/novel only cover .env files. Any other shared root file read at build
//  is invisible to the hash.)
console.log("[brand] hello from the legit brand banner");
