<script>
	let { results, executionTime } = $props();
</script>

<div class="statistics card bg-base-100 shadow-lg p-6 rounded-lg">
	<h3 class="text-2xl font-semibold text-primary mb-4">Statistics</h3>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="stat">
			<div class="stat-title">Average Waiting Time</div>
			<div class="stat-value">
				{results.avgWaitTime}s
			</div>
		</div>
		<div class="stat">
			<div class="stat-title">Average Turnaround Time</div>
			<div class="stat-value">
				{results.avgTurnaroundTime}s
			</div>
		</div>
		<div class="stat">
			<div class="stat-title">Completed Jobs</div>
			<div class="stat-value">
				{results.completedJobs}
			</div>
		</div>

		<div class="stat">
			<div class="stat-title">Total Execution Time</div>
			<div class="stat-value">
				{executionTime().toFixed(2)}s
			</div>
		</div>
	</div>
	<p class="text-sm text-gray-500 mb-4">* Simulation is deterministic. Final results may have minor floating point inaccuracies.</p>
</div>

<style>
	/* Add any additional styles here if needed */
</style>
