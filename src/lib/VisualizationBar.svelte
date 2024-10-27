<script>
	let { currentTime, maxTime = $bindable(), getExecutionBlocks } = $props();

	// Generate the scale based on intervals of 5
	let  scaleIntervals = $derived(() => {
    let intervals = [];
    for (let i = 0; i <= maxTime; i += 5) {
      intervals.push(i);
    }
    return intervals;
  });
</script>

<div class="flex flex-col">
	<div class="visualization">
		{#each getExecutionBlocks() as block}
			<div
				class="process-bar flex items-center justify-center"
				style="left: {(block.start / maxTime) * 100}%; width: {((block.end - block.start) /
					maxTime) *
					100}%; background-color: {block.color};"
			>
				P{block.processId}
			</div>
		{/each}
		<div class="current-time-marker" style="left: {(currentTime / maxTime) * 100}%;"></div>
	</div>

	<!-- Time Scale -->
	<div class="time-scale">
		{#each scaleIntervals() as interval}
			<div class="scale-marker" style="left: {(interval / maxTime) * 100}%;">
				{interval}
			</div>
		{/each}
	</div>
</div>

<style>
	.visualization {
		position: relative;
		height: 40px;
		background-color: #f0f0f0;
		border-radius: 4px;
		overflow: hidden;
		margin-top: 20px;
	}

	.process-bar {
		position: absolute;
		height: 100%;
		text-align: center;
		color: white;
		font-size: 12px;
		line-height: 20px;
	}

	.current-time-marker {
		position: absolute;
		top: 0;
		height: 100%;
		width: 2px;
		background-color: red;
	}

	.time-scale {
		position: relative;
		height: 20px;
		margin-top: 5px;
		display: flex;
		justify-content: space-between;
	}

	.scale-marker {
		position: absolute;
		font-size: 10px;
		top: 0;
		transform: translateX(-50%);
		white-space: nowrap;
	}
</style>
