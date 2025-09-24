import { processes as initialProcesses } from './initial.svelte.js';
import { getRandomColor } from './utils.js';

// Scheduling algorithms
function fcfsScheduling(availableProcesses) {
    return availableProcesses.sort((a, b) => {
        if (a.arrivalTime !== b.arrivalTime) {
            return a.arrivalTime - b.arrivalTime;
        }
        return a.id - b.id; // Tie-breaker
    })[0];
}

function sjfScheduling(availableProcesses) {
    return availableProcesses.sort((a, b) => a.burstTime - b.burstTime)[0];
}


class Simulator {
    processes = $state([...initialProcesses.map(p => ({...p}))]);
    algorithm = $state('FCFS');
    currentTime = $state(0);
    currentProcess = $state(null);
    results = $state({
        avgWaitTime: 0,
        avgTurnaroundTime: 0,
        completedJobs: 0
    });

    TIME_STEP = 0.01;

    constructor() {
        this.reset();
    }

    setAlgorithm(algo) {
        this.algorithm = algo;
        this.reset();
    }

    getNextProcess(time) {
        const availableProcesses = this.processes.filter(
            p => p.arrivalTime <= time && p.completed < p.burstTime
        );

        if (availableProcesses.length === 0) {
            return null;
        }

        switch (this.algorithm) {
            case "FCFS":
                return fcfsScheduling(availableProcesses);
            case "SJF":
                return sjfScheduling(availableProcesses);
            default:
                throw new Error(`Unknown algorithm: ${this.algorithm}`);
        }
    }

    tick() {
        // 1. Handle events at the current time
        if (this.currentProcess && this.processes.find(p => p.id === this.currentProcess.id).completed >= this.currentProcess.burstTime) {
            const pIndex = this.processes.findIndex(p => p.id === this.currentProcess.id);
            this.processes[pIndex].completionTime = this.currentTime;
            this.currentProcess = null;
        }

        if (!this.currentProcess) {
            this.currentProcess = this.getNextProcess(this.currentTime);
            if (this.currentProcess) {
                const pIndex = this.processes.findIndex(p => p.id === this.currentProcess.id);
                if (this.processes[pIndex].startTime === null) {
                    this.processes[pIndex].startTime = this.currentTime;
                }
            }
        }

        // 2. Update progress for the next time step
        if (this.currentProcess) {
            const processIndex = this.processes.findIndex((p) => p.id === this.currentProcess.id);
            if (processIndex !== -1) {
                this.processes[processIndex].completed = Math.min(
                    this.processes[processIndex].completed + this.TIME_STEP,
                    this.processes[processIndex].burstTime
                );
            }
        }

        // 3. Advance time
        this.currentTime += this.TIME_STEP;

        this.calculateMetrics();
    }

    calculateMetrics() {
        let totalWaitTime = 0;
        let totalTurnaroundTime = 0;
        let completed = 0;

        this.processes.forEach((process) => {
            if (process.completionTime !== null) {
                completed++;
                const waitTime = process.startTime - process.arrivalTime;
                const turnaroundTime = process.completionTime - process.arrivalTime;
                totalWaitTime += waitTime;
                totalTurnaroundTime += turnaroundTime;
            }
        });

        const avgWaitTime = completed ? totalWaitTime / completed : 0;
        const avgTurnaroundTime = completed ? totalTurnaroundTime / completed : 0;

        this.results = {
            avgWaitTime: avgWaitTime.toFixed(2),
            avgTurnaroundTime: avgTurnaroundTime.toFixed(2),
            completedJobs: completed
        };
    }
    
    addProcess() {
        const newId = Math.max(...this.processes.map(p => p.id), 0) + 1;
        this.processes.push({
            id: newId,
            arrivalTime: Math.floor((Math.random() * 10)),
            burstTime: Math.floor(Math.random() * 10) + 1,
            completed: 0,
            color: getRandomColor(),
            startTime: null,
            completionTime: null,
        });
    }

    removeProcess(id) {
        const index = this.processes.findIndex(p => p.id === id);
        if (index !== -1) {
            this.processes.splice(index, 1);
        }
    }
    
    updateProcess(index, field, value) {
        this.processes[index][field] = parseFloat(value);
    }

    replaceProcesses(newProcesses) {
        this.processes = [...newProcesses.map(p => ({
            ...p,
            completed: 0,
            startTime: null,
            completionTime: null,
        }))];
        this.currentTime = 0;
        this.currentProcess = null;
        this.calculateMetrics();
    }

    reset() {
        this.replaceProcesses(initialProcesses);
    }
}

export const simulator = new Simulator();
