<script>
	import ProcessInput from './ProcessInput.svelte';
	import Statistics from './Statistics.svelte';
	import VisualizationBar from './VisualizationBar.svelte';
	import {
		processes,
		addProcess,
		getCurrentProcess,
		removeProcess,
		updateProcess,
		getAlgorithm,
		updateAlgorithm,
		getNextProcess
	} from './js/initial.svelte.js';

	import LucidePlay from '~icons/lucide/play';
	import LucidePause from '~icons/lucide/pause';
	import LucidePlusCircle from '~icons/lucide/plus-circle';
	import LucideUndo from '~icons/lucide/undo';
	import Header from './header.svelte';
	import Table from './table.svelte';

	// Reactive state variables using $state
	let isRunning = $state(false);
	let currentTime = $state(0);
	let isReset = $state(false);
	let results = $state({
		avgWaitTime: 0,
		avgTurnaroundTime: 0,
		completedJobs: 0
	});

	let algorithm = $derived(getAlgorithm());

	let animationFrameRef;
	let lastUpdateRef = Date.now();
	let currentProcess = $state(null);

	let executionTime = $derived(() => {
		return processes.reduce((max, p) => {
			return max + p.burstTime;
		}, 0);
	});

	// Reactive statement to update maxTime based on processes
	let maxTime = $derived(() => {
		return Math.max(20, Math.ceil(executionTime() / 5) * 5);
	});

	async function calculateMetrics() {
		let totalWaitTime = 0;
		let totalTurnaroundTime = 0;
		let totalResponseTime = 0;
		let completed = 0;

		await processes.forEach((process) => {
			if (process.completed === process.burstTime) {
				completed++;

				// Calculate accurate times
				const waitTime = parseFloat((process.startTime - process.arrivalTime).toFixed(4));
				const completionTime = parseFloat((process.startTime + process.burstTime).toFixed(4));
				const turnaroundTime = parseFloat((completionTime - process.arrivalTime).toFixed(4));
				const responseTime = parseFloat((process.startTime - process.arrivalTime).toFixed(4));
	

				// Accumulate totals
				totalWaitTime += waitTime;
				totalTurnaroundTime += turnaroundTime;
				totalResponseTime += responseTime;
			}
		});

		// Calculate average metrics
		const avgWaitTime = completed ? totalWaitTime / completed : 0;
		const avgTurnaroundTime = completed ? totalTurnaroundTime / completed : 0;
		const avgResponseTime = completed ? totalResponseTime / completed : 0;

		// Round to two decimal places
		results = {
			avgWaitTime: avgWaitTime.toFixed(2),
			avgTurnaroundTime: avgTurnaroundTime.toFixed(2),
			avgResponseTime: avgResponseTime.toFixed(2),
			completedJobs: completed
		};
	}

	// Animation loop for the simulation
	async function animate() {
		const now = Date.now();
		const deltaTime = Math.floor(now - lastUpdateRef) / 1000; 
		lastUpdateRef = now;


		currentTime = Math.min(currentTime + deltaTime, maxTime());
		// Update only the currently running process
		if (currentProcess) {
			const processIndex = processes.findIndex((p) => p.id === currentProcess.id);

			if (processIndex !== -1) {
				const process = processes[processIndex];

				// Set start time if this is the first time process is running
				if (process.startTime === null) {
					process.startTime = currentTime;
				}

				// Update only the running process's completion
				process.completed = Math.min(process.completed + deltaTime, process.burstTime);

				// Check if the process has completed
				if (process.completed === process.burstTime) {
					currentProcess = null;
				}
			}
		}

		// If no current process, get the next process
		if (!currentProcess) {
			currentProcess = await getNextProcess(currentTime);
		}

		await calculateMetrics();

		if (currentTime <= maxTime() && isRunning) {
			animationFrameRef = requestAnimationFrame(animate);
		} else {
			isRunning = false;
		}
	}

	// Start or pause the simulation
	function startSimulation() {
		if (!isRunning) {
			lastUpdateRef = Date.now();
			animationFrameRef = requestAnimationFrame(animate);
		} else {
			cancelAnimationFrame(animationFrameRef);
		}
		isRunning = !isRunning;
	}

	// Reset the simulation
	async function resetSimulation() {
		await updateReset(true);
		isRunning = false;
		currentTime = 0;
		currentProcess = null;
		await processes.forEach((p) => {
			p.completed = 0;
			p.startTime = null;
		});

		results = { avgWaitTime: 0, avgTurnaroundTime: 0, completedJobs: 0 };
		await updateReset(false);
	}

	function updateReset(type = false) {
		isReset = type;
	}

	// Get execution blocks for visualization
	function getExecutionBlocks() {
		const blocks = [];
		let currentBlock = null;
		const timeSlice = 0.1;

		for (let time = 0; time <= currentTime; time += timeSlice) {
			const activeProcess = getCurrentProcess(time);

			if (activeProcess) {
				if (!currentBlock || currentBlock.processId !== activeProcess.id) {
					if (currentBlock) {
						blocks.push(currentBlock);
					}
					currentBlock = {
						processId: activeProcess.id,
						start: time,
						end: time + timeSlice,
						color: processes.find((p) => p.id === activeProcess.id).color
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
					class={`px-4 py-2 rounded transition-colors ${algorithm === 'FCFS' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
					onclick={() => updateAlgorithm('FCFS')}
				>
					First Come First Served
				</button>
				<button
					class={`px-4 py-2 rounded transition-colors ${algorithm === 'SJF' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
					onclick={() => updateAlgorithm('SJF')}
				>
					Shortest Job First
				</button>
				<!-- <button
                    class={`px-4 py-2 disabled rounded transition-colors ${algorithm === 'RR' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    onclick={() => updateAlgorithm('RR')}
                    disabled
                >
                    Round Robin
                </button>
                <button
                    class={`px-4 disabled py-2 rounded transition-colors ${algorithm === 'Priority' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    onclick={() => updateAlgorithm('Priority')}
                    disabled
                >
                    Priority Scheduling
                </button> -->
			</div>
			{#each processes as process, index (process.id)}
				<ProcessInput
					process={processes[index]}
					onRemove={() => removeProcess(process.id)}
					onUpdate={(field, value) => updateProcess(index, field, value)}
					{isRunning}
					{currentTime}
					bind:isReset
				/>
			{/each}

			<div class="flex gap-2">
				<button
					onclick={addProcess}
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

			<VisualizationBar {currentTime} maxTime={maxTime()} {getExecutionBlocks} />

			<Statistics {results} executionTime={executionTime()} />

			<Table {processes} />
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
