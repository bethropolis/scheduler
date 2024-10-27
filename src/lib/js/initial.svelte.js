import { getRandomColor } from "./utils.js";

// Define the initial state for processes using $state
export let processes = $state([
  {
    id: 1,
    arrivalTime: 0,
    burstTime: 4,
    completed: 0,
    color: "#3B82F6",
    startTime: null,
  },
  {
    id: 2,
    arrivalTime: 1,
    burstTime: 2,
    completed: 0,
    color: "#10B981",
    startTime: null,
  },
  {
    id: 3,
    arrivalTime: 3,
    burstTime: 6,
    completed: 0,
    color: "#F59E0B",
    startTime: null,
  },
  {
    id: 4,
    arrivalTime: 0,
    burstTime: 5,
    completed: 0,
    color: "#34D399",
    startTime: null,
  },
]);

let algorithm = $state('FCFS');

// **Scheduling Functions**

// FCFS Algorithm: First-Come, First-Served
function fcfsScheduling(availableProcesses) {
  return availableProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
}

// SJF Algorithm: Shortest Job First
function sjfScheduling(availableProcesses) {
  return availableProcesses.sort(
    (a, b) => a.burstTime - a.completed - (b.burstTime - b.completed)
  )[0];
}


// Function to get the current process based on the selected algorithm
export function getCurrentProcess(time) {
  const availableProcesses = processes.filter(
    p => p.arrivalTime <= time && p.completed < p.burstTime
  );

  if (availableProcesses.length === 0) {
    return null; // No available process at this time
  }

  switch (algorithm) {
    case "FCFS":
      return fcfsScheduling(availableProcesses);
    case "SJF":
      return sjfScheduling(availableProcesses);
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
}

// Function to get the next process based on the selected algorithm
export function getNextProcess(time) {
  const availableProcesses = processes.filter(
    p => p.arrivalTime <= time && p.completed < p.burstTime
  );

  if (availableProcesses.length === 0) {
    return null; // No available process at this time
  }

  switch (algorithm) {
    case "FCFS":
      return fcfsScheduling(availableProcesses);
    case "SJF":
      return sjfScheduling(availableProcesses);
    // You can add more algorithms here in the future
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
}

// **Other Utility Functions**

function getTotalTime() {
  return processes.reduce((acc, p) => acc + p.burstTime, 0);
}


// Add a new process
export function addProcess() {
  const newId = Math.max(...processes.map(p => p.id), 0) + 1;
  processes.push({
    id: newId,
    arrivalTime: Math.floor((Math.random() * getTotalTime())/processes.length),
    burstTime: Math.floor(Math.random() * 10) + 1,
    completed: 0,
    color: getRandomColor(),
    startTime: null,
  });
}

// Remove a process by ID
export function removeProcess(id) {
  const index = processes.findIndex(p => p.id === id);
  if (index !== -1) {
    processes.splice(index, 1);
  }
}

// get all process
export function getProcesses() {
  // should return order based on algorithm
  switch (algorithm) {
    case "FCFS":
      return fcfsScheduling(processes);
    case "SJF":
      return sjfScheduling(processes);
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
}

// Update a process field
export function updateProcess(index, field, value) {
  processes[index][field] = parseFloat(value);
}

export function replaceProcesses(newProcesses) {
  processes.splice(0, processes.length, ...newProcesses);
}

// Get the value of the current algorithm
export function getAlgorithm() {
  return algorithm;
}

// Update the scheduling algorithm
export function updateAlgorithm(newAlgorithm) {
  algorithm = newAlgorithm;
}
