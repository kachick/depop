import { bundle } from "https://deno.land/x/emit/mod.ts";
const result = await bundle(new URL("../main.ts", import.meta.url));

const { code } = result;
console.log(code);
