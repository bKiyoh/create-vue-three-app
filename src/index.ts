// src/index.ts
import { defineCommand, runMain } from "citty";
import { consola } from "consola";

const main = defineCommand({
  meta: {
    name: "my-cli",
    version: "1.0.0",
    description: "My Awesome CLI App",
  },
  run: async () => {
    // ユーザーに名前を尋ねる
    const name = await consola.prompt("What is your name?", {
      type: "text",
    });

    // 挨拶を表示
    const message = `Hi, ${name}!!!!`;
    consola.success(message);
  },
});

runMain(main);
