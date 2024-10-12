// src/index.ts
import { defineCommand, runMain } from "citty";
import { consola } from "consola";

const main = defineCommand({
  meta: {
    name: "my-cli",
    version: "1.0.0",
    description: "My Awesome CLI App",
  },
  args: {
    name: {
      type: "positional",
      description: "Your name",
      required: true,
    },
    friendly: {
      type: "boolean",
      description: "Use friendly greeting",
    },
  },
  run({ args }) {
    const message = `${args.friendly ? "Hi" : "Greetings"}, ${args.name}!`;
    consola.success(message);
  },
});

runMain(main);
