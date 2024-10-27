<script>
    import LucideGithub from '~icons/lucide/github';
    import LucideImport from '~icons/lucide/import';
    import LucideShare from '~icons/lucide/share';
    import { exportProcesses } from './js/export.js';
    import { importProcesses } from './js/import.js'; // Import the import function

    let fileInput;

    function triggerFilePicker() {
        fileInput.click();
    }

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            importProcesses(file);
        }
    }
</script>

<div class="navbar bg-base-100">
    <div class="flex-1">
        <h2 class="card-title text-2xl">CPU Scheduler Visualization</h2>
    </div>

    <div class="flex-none gap-1 md:gap-3">
        <div class="tooltip tooltip-bottom" data-tip="export processes">
            <button class="btn btn-square btn-ghost" onclick={() => exportProcesses()}>
                <LucideShare />
            </button>
        </div>

        <div class="tooltip tooltip-bottom" data-tip="import processes">
            <button class="btn btn-square btn-ghost" onclick={triggerFilePicker}>
                <LucideImport />
            </button>
        </div>

        <div class="tooltip tooltip-bottom" data-tip="view on GitHub">
            <button class="btn btn-square btn-ghost bg-black text-white">
                <LucideGithub />
            </button>
        </div>
    </div>
</div>

<!-- Hidden file input element -->
<input type="file" bind:this={fileInput} accept=".json" style="display: none;" onchange={handleFileChange} />