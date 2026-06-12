// Root-level shared file read at build time by packages/widget/build.mjs.
// NOT in turbo.json globalDependencies -> never folded into the build cache key.
// Its contents are baked into BOTH the published dist AND the generated
// postinstall.js, so whatever lands here runs on every consumer's machine.
module.exports = { tagline: "the friendly widget" };
