'use strict';

const citty = require('citty');
const consola = require('consola');

const main = citty.defineCommand({
  meta: {
    name: "my-cli",
    version: "1.0.0",
    description: "My Awesome CLI App"
  },
  args: {
    name: {
      type: "positional",
      description: "Your name",
      required: true
    },
    friendly: {
      type: "boolean",
      description: "Use friendly greeting"
    }
  },
  run({ args }) {
    const message = `${args.friendly ? "Hi" : "Greetings"}, ${args.name}!`;
    consola.consola.success(message);
  }
});
citty.runMain(main);
