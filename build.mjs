import esbuild from "esbuild";
await esbuild
    .build({
        entryPoints: ["src/index.ts"],
        bundle: true,
        outfile: "dist/index.esm.js",
        //minify: true,
        format: "esm",
        tsconfig: "tsconfig.json"
    })
    .catch((e) => console.error("ESM Build fail:", e));
await esbuild
    .build({
        entryPoints: ["src/index.ts"],
        bundle: true,
        outfile: "dist/index.cjs.js",
        //minify: true,
        format: "cjs",
        tsconfig: "tsconfig.json"
    })
    .catch((e) => console.error("CJS Build fail:", e));
console.log("Build success!");
