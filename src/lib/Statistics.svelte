<script>
	let { results, executionTime } = $props();

	function toFloat(value) {
		return parseFloat(value);
	}
</script>

<div class="statistics card bg-base-100 shadow-lg p-6 rounded-lg">
	<h3 class="text-2xl font-semibold text-primary mb-4">Statistics</h3>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="stat">
			<div class="stat-title">Average Waiting Time</div>
			<div class="stat-value">
				{isNaN(toFloat(results.avgWaitTime)) ? 'N/A' : toFloat(results.avgWaitTime).toFixed(2)}s
			</div>
		</div>
		<div class="stat">
			<div class="stat-title">Average Turnaround Time</div>
			<div class="stat-value">
				{isNaN(toFloat(results.avgTurnaroundTime))
					? 'N/A'
					: toFloat(results.avgTurnaroundTime).toFixed(2)}s
			</div>
		</div>
		<div class="stat">
			<div class="stat-title">Completed Jobs</div>
			<div class="stat-value">
				{isNaN(toFloat(results.completedJobs)) ? 'N/A' : toFloat(results.completedJobs)}
			</div>
		</div>

		<div class="stat">
			<div class="stat-title">Total Execution Time</div>
			<div class="stat-value">
				{isNaN(toFloat(executionTime)) ? 'N/A' : toFloat(executionTime).toFixed(2)}s
			</div>
		</div>
	</div>
	<!-- add a small italisised note showing that the simulation is measured in seconds -->
	<p class="text-sm text-red-500 mb-4">* there might be some slight time error due to rendering.</p>
</div>

<style>
	/* Add any additional styles here if needed */
</style>
