<script>
	import ProcessInput from './ProcessInput.svelte';
	import Statistics from './Statistics.svelte';
	import VisualizationBar from './VisualizationBar.svelte';
	import { simulator } from './js/simulator.svelte.js';

	import LucidePlay from '~icons/lucide/play';
	import LucidePause from '~icons/lucide/pause';
	import LucidePlusCircle from '~icons/lucide/plus-circle';
	import LucideUndo from '~icons/lucide/undo';
	import Header from './header.svelte';
	import Table from './table.svelte';

	let isRunning = $state(false);
	let animationFrameRef;

	const executionTime = $derived(() => {
		return simulator.processes.reduce((max, p) => {
			return max + p.burstTime;
		}, 0);
	});

	const maxTime = $derived(() => {
		return Math.max(20, Math.ceil(executionTime / 5) * 5);
	});

	function animate() {
		simulator.tick();

		if (simulator.currentTime >= maxTime) {
			isRunning = false;
		}

		if (isRunning) {
			animationFrameRef = requestAnimationFrame(animate);
		}
	}

	function startSimulation() {
		isRunning = !isRunning;
		if (isRunning) {
			animationFrameRef = requestAnimationFrame(animate);
		} else {
			cancelAnimationFrame(animationFrameRef);
		}
	}

	function resetSimulation() {
		isRunning = false;
		cancelAnimationFrame(animationFrameRef);
		simulator.reset();
	}

    function getExecutionBlocks() {
		const blocks = [];
		let currentBlock = null;
		const timeSlice = 0.1;

		for (let time = 0; time <= simulator.currentTime; time += timeSlice) {
			const activeProcess = simulator.getNextProcess(time);

			if (activeProcess) {
				if (!currentBlock || currentBlock.processId !== activeProcess.id) {
					if (currentBlock) {
						blocks.push(currentBlock);
					}
					currentBlock = {
						processId: activeProcess.id,
						start: time,
						end: time + timeSlice,
						color: simulator.processes.find((p) => p.id === activeProcess.id)?.color
					};
				} else {
					currentBlock.end = time + timeSlice;
				}
			} else if (currentBlock) {
				blocks.push(currentBlock);
				currentBlock = null;
			}
		}

		if (currentBlock) {
			blocks.push(currentBlock);
		}

		return blocks;
    }

</script>

<div class="w-full flex justify-center space-y-4">
	<div class="card bg-base-100 w-full md:w-11/12 lg:w-9/12 shadow-xl">
		<Header />
		<div class="card-body p-0 md:p-8">
			<div class="flex gap-4 mb-4">
				<button
					class={`px-4 py-2 rounded transition-colors ${simulator.algorithm === 'FCFS' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
					onclick={() => simulator.setAlgorithm('FCFS')}
				>
					First Come First Served
				</button>
				<button
					class={`px-4 py-2 rounded transition-colors ${simulator.algorithm === 'SJF' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
					onclick={() => simulator.setAlgorithm('SJF')}
				>
					Shortest Job First
				</button>
			</div>
			{#each simulator.processes as process, index (process.id)}
				<ProcessInput
					process={simulator.processes[index]}
					onRemove={() => simulator.removeProcess(process.id)}
					onUpdate={(field, value) => simulator.updateProcess(index, field, value)}
					isRunning={isRunning}
					currentTime={simulator.currentTime}
					currentProcess={simulator.currentProcess}
				/>
			{/each}

			<div class="flex gap-2">
				<button
					onclick={() => simulator.addProcess()}
					class="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
					disabled={isRunning}
				>
					<LucidePlusCircle class="w-4 h-4" />
					Add Process
				</button>
				<button
					onclick={startSimulation}
					class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
				>
					{#if isRunning}
						<LucidePause class="w-4 h-4" />
						Pause
					{:else}
						<LucidePlay class="w-4 h-4" />
						Start
					{/if}
				</button>
				<button
					onclick={resetSimulation}
					class="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
				>
					<LucideUndo class="w-4 h-4" />
					Reset
				</button>
			</div>

			<VisualizationBar currentTime={simulator.currentTime} maxTime={maxTime} {getExecutionBlocks} />

			<Statistics results={simulator.results} executionTime={executionTime} />

			<Table processes={simulator.processes} algorithm={simulator.algorithm} />
		</div>
	</div>
</div>

<style>
	.card {
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 16px;
	}
	.card-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 16px;
	}
	.card-body {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
</style>