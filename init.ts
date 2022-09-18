import * as path from 'https://deno.land/std@0.155.0/path/mod.ts';
import * as argopts from "https://deno.land/std@0.155.0/flags/mod.ts";


const HelpMessage = `Initialize a new Wren project. 

USAGE:
    deno run -A -r https://wren.deno.dev <DIRECTORY>

OPTIONS:
    --vscode  setup this Wren project for VSCode
`;

const template = (name: string) => (element: string) => `https://raw.githubusercontent.com/zaiste/wren/main/examples/${name}/${element}`

const templates = {
  // FIXME automate with GitHub API
  bare: ['README.md', 'deno.json', 'import_map.json', 'main.ts', 'justfile']
}

const download = async (url: string, path: string) => {
  const response = await fetch(url)
  const text = await response.text();

  Deno.writeTextFile(path, text);
}

const error = (message: string) => {
  console.error(`%cerror%c: ${message}`, "color: red; font-weight: bold", "");
  Deno.exit(1);
}

const flags = argopts.parse(Deno.args, {
  boolean: ["vscode"],
  default: { "vscode": null },
});

if (flags._.length !== 1) {
  error(HelpMessage)
}

console.log(
  `\n%c 🪶  Wren  %c`,
  "background-color: #d8cbc4; color: black; font-weight: bold",
  ""
);
console.log('A small, but powerful HTTP library built for convenience and simplicity')

const projectName = Deno.args[0];
const projectPath = path.resolve(projectName);

try {
  const dir = [...Deno.readDirSync(projectPath)];
  const isEmpty = dir.length === 0 ||
    dir.length === 1 && dir[0].name === ".git";
  if (!isEmpty) {
    error("Directory is not empty.");
  }
} catch (err) {
  if (!(err instanceof Deno.errors.NotFound)) {
    throw err;
  }
}

await Deno.mkdir(projectName, { recursive: true });

const input = 'bare'
for (const el of templates[input]) {
  await download(template(input)(el), path.join(projectName, el));
}

if (flags.vscode) {
  await Deno.mkdir(path.join(projectPath, ".vscode"), { recursive: true });

  const VSCodeSettings = {
    "deno.enable": true,
    "deno.lint": true,
    "editor.defaultFormatter": "denoland.vscode-deno",
  };

  await Deno.writeTextFile(
    path.join(projectPath, ".vscode", "settings.json"),
    JSON.stringify(VSCodeSettings, null, 2) + "\n"
  );

  const VSCodeExtensions = {
    recommendations: ["denoland.vscode-deno"],
  };

  await Deno.writeTextFile(
    path.join(projectPath, ".vscode", "extensions.json"),
    JSON.stringify(VSCodeExtensions, null, 2) + "\n"
  );
}

console.log("\n%cProject initialized.\n", "color: green; font-weight: bold");
console.log(
  `Enter the project directory using %ccd ${projectName}%c.`,
  "color: cyan",
  "",
);
console.log(
  "Run %cdeno task start%c to start the project. %cCTRL-C%c to stop.",
  "color: cyan",
  "",
  "color: cyan",
  "",
);