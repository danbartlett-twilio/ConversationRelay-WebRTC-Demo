import { FSDB } from "file-system-db"; 
const useCases = new FSDB(`../use-cases.json`, false);

const args = process.argv;
console.log(args);

console.log(`Building use case for ${process.argv[2]}`);

const { properties } = await import(`./${process.argv[2]}/properties.mjs`);
const { conversationrelay } = await import(`./${process.argv[2]}/conversationrelay.mjs`);
const { prompt } = await import(`./${process.argv[2]}/prompt.mjs`);
const { tools } = await import(`./${process.argv[2]}/tools.mjs`);
const { dtmf } = await import(`./${process.argv[2]}/dtmf.mjs`);

const useCase = {
    ...properties,
    conversationRelayParams: conversationrelay,
    prompt: JSON.stringify(prompt),
    tools: JSON.stringify(tools),
    dtmf: JSON.stringify(dtmf)
};

useCases.set(useCase.name, useCase);

console.log(useCase);

console.log(`${process.argv[2]} use case build and updated!`);
