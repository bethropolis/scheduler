<script>
	const {
		process,
		onRemove,
		onUpdate,
		isRunning,
		isReset = $bindable(),
		currentTime,
		currentProcess
	} = $props();

	let progress = $state(0);
	let isCurrentProcess = $state(false);

	function handleArrivalChange(e) {
		onUpdate('arrivalTime', e.target.value);
	}

	function handleBurstChange(e) {
		onUpdate('burstTime', e.target.value);
	}

	$effect(() => {
		if (!isRunning) return;

		isCurrentProcess = checkIfCurrentProcess();
		if (isCurrentProcess && !isReset) {
			progress = getProgress();
		}

		function getProgress() {
			if (currentTime >= process.startTime + process.burstTime) return 100;
			return (Math.max(currentTime - process.startTime, 0) / process.burstTime) * 100;
		}

		function checkIfCurrentProcess() {
			return currentProcess && currentProcess.id === process.id;
		}
	});

	$effect(() => {
		if (isReset) {
			progress = 0;
		}
	});
</script>

<div
	class="process-input items-center gap-4 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
	style={`border-left: 4px solid ${process.color}`}
>
	<span class="font-bold w-8">P{process.id}</span>
	<div>
		<label class="mr-2" for="arrivalTime-{process.id}">Arrival:</label>
		<input
			id="arrivalTime-{process.id}"
			class="w-16 p-1 border border-gray-200 rounded"
			type="number"
			min="0"
			value={process.arrivalTime}
			oninput={handleArrivalChange}
			disabled={isRunning}
		/>
	</div>
	<div>
		<label className="mr-2">Burst:</label>
		<input
			id="burstTime-{process.id}"
			class="w-16 p-1 border border-gray-200 rounded"
			type="number"
			min="1"
			value={process.burstTime}
			oninput={handleBurstChange}
			disabled={isRunning}
		/>
	</div>
	<div class="proc flex-1 h-4 bg-gray-200 rounded overflow-hidden hidden-sm">
		<div
			class={`h-full rounded transition-all duration-100 ease-in-out`}
			style="width: {progress}%; background-color: {process.color};"
			class:is-current={isCurrentProcess && isRunning}
		></div>
	</div>
	<button onclick={onRemove} disabled={isRunning}>🗑️</button>
</div>

<style>
	.process-input {
		display: flex;
		align-items: center;
	}
	.is-current {
		animation: pulse 1s infinite;
	}
	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1);
		}
	}
	@media (max-width: 400px) {
		.hidden-sm {
			display: none;
		}
	}
</style>
