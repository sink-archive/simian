import esbuild from "esbuild";
await esbuild
    .build({
        entryPoints: ["src/index.js"],
        bundle: true,
        outfile: "dist.js",
        minify: true,
    })
    .catch((e) => console.error("Build fail:", e));
console.log("Build success!");
