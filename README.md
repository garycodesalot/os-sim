# Dirns OS Scheduler Simulation App

## Simulations:

FIFO: First in, first out. The first process in the generated list is executed in its entirety before the next one.

SJF: Shortest job first. This is a non preemtive scheduler that acts exactly the same as FIFO assuming all processes arrive at the same time. 

STCF: Shortest time to completion first: Process with the shortest length   instruction set is moved to the head of the process list initially, and after each process executes.

RR: Each process is stepped through once (pc incremented one time) and then moved to the back of the queue.

MLFQ: If a process completes before the allottment it is shifted off the process list. If the process runs the full length of the allottment it is deranked to the second priority queue. After a length of time determined by the boost setting, all lower priority processes are moved back up to the highest queue.

        NOTE: Boost does not depend on the length of time a proccess has been in a lower priorty.
    
        NOTE: In this MLFQ implementation, the highest priority processes do not run in RR, they run in FIFO fashion due to each process taking the same amount of time per instruction and "always requiring the CPU".

## Running the Sim and Settings:
Create Processes: Enter a number to create the process list that each simulation will utilize and modify clones of independently. After entering a number, that many processes will be created with each having a random instruction set ranging in size from 1 to 20. These are actual array elements for each process. A context object, created for each class keeps track of the program counter for each process.

Choose Simulation to Display: Straight forward; select how you would like to view the simulations. (All are proccessed in the background regardless of choice)

MLFQ Time Allottment: Number of time steps a process must be complete in before it is deranked (only applicable to MLFQ sim)

MLFQ Boost Time: After the amount of time steps entered here, all proccess in the lower queue will be added to the end of the higher priority queue.

Start/Stop: Easy as it gets! Click to start or stop the 1hz clock and begin processing programs. 


