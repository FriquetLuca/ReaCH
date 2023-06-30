const env = process.argv[2];
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';
import esbuild from 'esbuild';
import { getFilesRecursive } from './src/utils/fs/getFilesRecursive';
import { testPerformanceAsync } from './src/utils/diagnostics/testPerformance';
import { tempDirAsync } from './src/utils/fs/tempDir';
import { tempFileAsync } from './src/utils/fs/tempFile';
import { fileSize } from './src/utils/text/fileSize';
import { duplicateString } from './src/utils/text/duplicateString';
import { createDirectory } from './src/utils/fs/createDirectory';
import { createFile } from './src/utils/fs/createFile';

void Compile();

async function Compile() {
  await ClientBuilder();
}

async function ClientBuilder() {
  const generateOutputFilename = (entry: string) => {
    const baseFileOutput = path.join(__dirname, env === 'development' ? 'dist' : 'build', "/generated/", path.relative("src", entry));
    return {
      fullPath: `${baseFileOutput.substring(0, baseFileOutput.length - path.extname(baseFileOutput).length)}.js`,
      path: baseFileOutput.substring(0, baseFileOutput.length - path.extname(baseFileOutput).length)
    };
  };

  const cleanupRouteName = (source: string) => {
    if(source.endsWith("index")) {
      if(source === "index") {
        return "/";
      }
      if(source.endsWith("/index")) {
        return source.substring(0, source.length - 6);
      }
    }
    return `/${source}`;
  };

  console.log("⚡ Client\n");

  const pages = getFilesRecursive('src/pages')
    .filter((file) => (file.endsWith('.tsx') || file.endsWith('.jsx')));
  const generationLabel = `.generated-${new Date().getTime()}`;
  const collectDatas: {
    path: string;
    size: number;
    route: string;
  }[] = [];
  let maxLength = 0;
  let hasError = false;


  const buildTime = await testPerformanceAsync(async () => {
    await tempDirAsync(generationLabel, async () => {
      for(const entry of pages) {
        const tempFile = path.join(__dirname, generationLabel, "/index.tsx");
        const outputFile = generateOutputFilename(entry);
        const pageTemplate = `
import React from "react";
import { createRoot } from "react-dom/client";
import * as _app from "../src/_app";
import Component from "../${entry}";

type AppPage = {
  default: typeof _app.default
};

function Page() {
  const CurrentApp = _app as unknown as AppPage;
  const App = CurrentApp.default;
  return (
    <App>
      <Component />
    </App>
  );
}
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Page />);
`;
        await tempFileAsync(tempFile, pageTemplate, async () => {
          const buildResult = await esbuild.build({
            entryPoints: [tempFile],
            bundle: true,
            minify: env === 'development' ? false : true,
            platform: 'browser',
            sourcemap: false,
            outfile: outputFile.fullPath
          });
          if(buildResult.errors && buildResult.errors.length > 0) {
            console.error("σ", buildResult.errors);
            hasError = true;
          } else {
            const relativePathFilename = path.relative(path.join(__dirname, env === 'development' ? 'dist/' : 'build/', "/generated/pages/"), outputFile.path);
            collectDatas.push({
              path: outputFile.fullPath,
              route: relativePathFilename,
              size: fs.statSync(outputFile.fullPath).size
            });
            maxLength = Math.max(maxLength, relativePathFilename.length);
          }
        });
      }
    });
  });

  const compiledMsg = `⏳ Compiled in ${Math.floor(buildTime * 10) / 10} ms.`;
  const failedCompiledMsg = `∄ Client failed to compile with errors.`;
  if(!hasError) {
    let maxDisplayLength = 0;
    let totalSize = 0;
    console.log(hasError ? failedCompiledMsg : compiledMsg);
    console.log("\nGenerated routes:\n");
    for(const data of collectDatas) {
      const currentMsg = `𝒇 ${data.route}${duplicateString("\t", Math.ceil(maxLength / 5))}${fileSize(data.size)}`;
      console.log(currentMsg);
      maxDisplayLength = Math.max(maxDisplayLength, currentMsg.replace("\t", "     ").length);
      totalSize += data.size;
    }
    console.log(duplicateString("_", maxDisplayLength));
    console.log(`Total: ${fileSize(totalSize)}\n`);
  }
  await ServerBuilder(collectDatas.map(i => { return { filepath: i.route, route: cleanupRouteName(i.route) } }));
}

async function ServerBuilder(routes: { filepath: string, route: string }[]) {
  const routeOutput = path.join(__dirname, "/generated/router/routes.ts");
  createDirectory(path.dirname(routeOutput));

  createFile(routeOutput, `
import { type Server } from "../../src";

export default function routerRoutes(fastify: Server) {
  ${routes.map(current => { return `
    fastify.get("${current.route}", function (request, reply) {
      console.log(request.query)
      console.log(request.params)
      console.log(request.body)
      console.log(request.url)
      reply.type("text/html").send(\`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>React Example</title>
        <script type="text/javascript" src="/bundle/${current.filepath}.js" defer></script>
      </head>
      <body>
        <h1>React</h1>
        <div id="root"></div>
      </body>
    </html>
      \`);
    });
  `}).reduce((prev, current) => `${prev}\n${current}`, "")}
}
  `);
  const src = getFilesRecursive('src')
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.mts'));
  await esbuild.build({
    entryPoints: [ routeOutput, ...src ],
    logLevel: 'info',
    outdir: env === 'development' ? 'dist' : 'build',
    bundle: env === 'development' ? false : true,
    minify: env === 'development' ? false : true,
    platform: 'node',
    format: 'cjs'
  });
  // if(build.errors.length === 0) {
  //   const buildJSOutput = path.join(__dirname, `/${env === 'development' ? 'dist' : 'build'}/generated/router/routes.js`);
  //   const routeJSOutput = path.join(__dirname, "/generated/router/routes.js");
  //   fs.writeFileSync(routeJSOutput, fs.readFileSync(buildJSOutput));
  //   fs.rmSync(buildJSOutput);
  //   const buildsubDir = path.dirname(buildJSOutput);
  //   fs.rmdirSync(buildsubDir);
  //   fs.rmdirSync(path.dirname(buildsubDir));
  // }
}