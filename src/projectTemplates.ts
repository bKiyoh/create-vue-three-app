import { colorize } from "consola/utils";
import type { TemplateConfig } from "./templateSelector";

/**
 * define template structure recursively
 */
export const templates: TemplateConfig = {
  message: "Template Type?",
  selections: [
    {
      label: "🍰 Playground",
      value: "playground",
      subSelection: {
        message: "Language?",
        selections: [
          // { label: `${colorize("blue", "TypeScript")}`, value: "ts" },
          { label: `${colorize("yellow", "JavaScript")}`, value: "js" },
        ],
      },
    },
  ],
};
