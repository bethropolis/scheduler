import { simulator } from "./simulator.svelte.js";

export function importProcesses(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const content = event.target.result;
        try {
            const parsedContent = JSON.parse(content);
            simulator.replaceProcesses(parsedContent);
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    };
    reader.readAsText(file);
}