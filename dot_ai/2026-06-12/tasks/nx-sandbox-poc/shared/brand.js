// Root-level shared module read at build time by packages/lib/build.mjs.
// It is OUTSIDE packages/lib and is NOT covered by the project's declared inputs
// (Nx default inputs = {projectRoot}/**/* + sharedGlobals; this file is neither),
// so it does not enter the cache key - exactly the Turbo gap, reproduced in Nx.
console.log("[brand] hello from the legit brand banner");
