import { processes } from "./initial.svelte.js";




export function exportProcesses() {
    const data = JSON.stringify(processes);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "processes.json";
    a.click();
    URL.revokeObjectURL(url);
}


