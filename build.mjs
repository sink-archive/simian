import esbuild from "esbuild";
await esbuild
    .build({
        entryPoints: ["src/index.js"],
        bundle: true,
        outfile: "dist/esm.js",
        //minify: true,
        format: "esm",
    })
    .catch((e) => console.error("ESM Build fail:", e));
await esbuild
    .build({
        entryPoints: ["src/index.js"],
        bundle: true,
        outfile: "dist/cjs.js",
        //minify: true,
        format: "cjs",
    })
    .catch((e) => console.error("CJS Build fail:", e));
console.log("Build success!");
