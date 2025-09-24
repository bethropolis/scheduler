<script>
	let { processes, algorithm } = $props();

	let order = $state([]);

    function updateOrder() {
        switch (algorithm) {
            case 'FCFS':
                return [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
            case 'SJF':
                return [...processes].sort((a, b) => a.burstTime - b.burstTime);
            default:
                return [...processes];
        }
    }

    $effect(() => {
        order = updateOrder();
    });
</script>

<div class="card bg-base-100 shadow-lg p-1 md:p-4 rounded-lg">
	<h3 class="text-2xl font-semibold text-primary mb-4">Execution Order</h3>

	<div class="overflow-x-auto card-body p-0 md:p-4 lg:p-8">
		<table class="table table-zebra">
			<!-- head -->
			<thead>
				<tr>
					<th>id</th>
					<th>arrival time</th>
					<th>burst time</th>
				</tr>
			</thead>
			<tbody>
				{#await order then orderedProcesses}
					{#each orderedProcesses as process}
						<tr class="bg-base-200" style={`border-left: 4px solid ${process.color}`}>
							<td>P{process.id}</td>
							<td>{process.arrivalTime}s</td>
							<td>{process.burstTime}s</td>
						</tr>
					{/each}
				{:catch error}
					<tr>
						<td colspan="4">Error loading processes: {error.message}</td>
					</tr>
				{/await}
			</tbody>
		</table>
	</div>
</div>

<style>
	/* your styles go here */
</style>
