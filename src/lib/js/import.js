import { replaceProcesses } from "./initial.svelte.js";

export function importProcesses(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const content = event.target.result;
        try {
            const parsedContent = JSON.parse(content);

            replaceProcesses(parsedContent);
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    };
    reader.readAsText(file);
}
