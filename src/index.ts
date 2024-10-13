// src/index.ts
import { defineCommand, runMain } from "citty";
import { consola } from "consola";
import { constructTemplateNameAsync } from "./templateSelector";
import { templates } from "./projectTemplates";

const main = defineCommand({
  meta: {
    name: "my-cli",
    version: "1.0.0",
    description: "My Awesome CLI App",
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

        // 最新バージョンのconsolaでは、promptは値のみを返します。
        // return val <-- これはランタイム型エラーを引き起こします
        const valStr = val as unknown as string;
        const selected = selections.find((s) => s.value === valStr)!;

        return selected;
      }
    );

    settings.doInstall ??= await consola.prompt("Install Dependencies?", {
      type: "confirm",
      initial: false,
    });

    consola.log("\n");
    consola.success("Done!✨");
    consola.info(settings);
  },
});

runMain(main);
