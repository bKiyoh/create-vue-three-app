import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineCommand, runMain } from "citty";
import { consola } from "consola";
import { downloadTemplate } from "giget";
import { readPackageJSON, writePackageJSON } from "pkg-types";
import { templates } from "./projectTemplates";
import { constructTemplateNameAsync } from "./templateSelector";

const main = defineCommand({
  meta: async () => {
    const execDir = path.resolve(fileURLToPath(import.meta.url), "../..");
    const packageJson = await readPackageJSON(execDir);
    return {
      name: "my-cli",
      version: packageJson.version,
      description:
        "A CLI for scaffolding Babylon.js web application project from templates!",
    };
  },
  args: {
    name: {
      type: "string",
      alias: ["n"],
      description: "project name.",
      valueHint: "project name",
      required: false,
    },
    template: {
      type: "string",
      alias: ["t"],
      description: "project template name (e.g. simple-ts, library)",
      valueHint: "template name",
      required: false,
    },
    dir: {
      type: "string",
      alias: ["d"],
      description: "directory where project will be created.",
      valueHint: "directory path",
      required: false,
    },
    install: {
      type: "boolean",
      alias: ["i"],
      description: "install dependencies after copying template.",
      required: false,
      valueHint: "true or false",
    },
  },
  run: async ({ args }) => {
    const settings = {
      projectName: args.name,
      templateDirName: args.template,
      doInstall: args.install,
      outputDir: args.dir,
    };

    settings.projectName ??= await consola.prompt("Project Name?", {
      type: "text",
      default: "vue-three-app",
      placeholder: "vue-three-app",
    });

    settings.templateDirName ??= await constructTemplateNameAsync(
      templates,
      async ({ message, selections }) => {
        const val = await consola.prompt(message, {
          type: "select",
          options: selections.map((s) => ({ label: s.label, value: s.value })),
        });

        const valStr = val as unknown as string;
        const selected = selections.find((s) => s.value === valStr)!;

        return selected;
      }
    );

    settings.outputDir ??= await consola.prompt("Project Directory?", {
      type: "text",
      // NOTE: 現在のディレクトリを取得 https://nodejs.org/api/process.html#processcwd
      default: process.cwd(),
      placeholder: "directory path",
    });

    settings.doInstall ??= await consola.prompt("Install Dependencies?", {
      type: "confirm",
      initial: false,
    });

    const { projectName, templateDirName, doInstall, outputDir } = settings;
    const githubRepoUrlBase = "gh:bKiyoh/my-cli-project/templates";

    const projectPath = path.resolve(outputDir, projectName);
    const { dir: appDir } = await downloadTemplate(
      `${githubRepoUrlBase}/${templateDirName}`,
      {
        dir: projectPath,
        install: doInstall,
      }
    );

    const packageJson = await readPackageJSON(appDir);
    if (packageJson.name) {
      packageJson.name = projectName;
      const jsonPath = path.resolve(appDir, "package.json");
      await writePackageJSON(jsonPath, packageJson);
    }

    consola.log(
      "============================================================================"
    );
    consola.success("Done!✨");
    consola.log("\n");
    consola.info(`🚀 Project created in: ${projectPath}`);
    consola.log("\n");
  },
});

runMain(main);
