"use client"
import React, { useEffect, useState } from 'react'
import usePersistState from '../hooks/usePersistState'
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import useGrass from '../store/useGrass';

const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

function ToDo() {
  const [goals, setGoals] = usePersistState([
    { goal: "Finished the adventure, went for a walk", completed: false },
    { goal: "Went outside during work/study breaks", completed: false },
    { goal: "Watched the moon", completed: false },
  ], "TCgoals");

  const [lastCall, setLastCall] = usePersistState("", "TClastGoalCall");
  const [ans, setAns] = useState("");
  const question  = useGrass(state=>state.question)



  // Reset once per day
useEffect(() => {
  if (!lastCall) return; // wait until loaded from localStorage

  console.log(lastCall, today, " l t");
  if (lastCall !== today) {
    const resetGoals = goals.map(g => ({ ...g, completed: false }));
    setGoals(resetGoals);
    setLastCall(today);
  }
}, [goals, lastCall, today, setGoals, setLastCall]);

  // For adventure, ask
  

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 mb-2"> Daily Goals</h2>

      {/* First goal with dialog */}
      <Dialog>
        <li className="flex  font-mono items-center border-2 mb-2 w-full p-2 rounded-md border-blue-300 gap-2">
          <DialogTrigger asChild>
            <input
              type="checkbox"
              checked={goals[0].completed}
              onChange={(e) => {
                if (!goals[0].completed) {
                  // Opening dialog → only when marking complete
                  e.preventDefault();
                } else {
                  // Allow unchecking directly
                  const updated = [...goals];
                  updated[0].completed = false;
                  setGoals(updated);
                }
              }}
            />
          </DialogTrigger>
          <span className={goals[0].completed ? "line-through text-gray-500" : ""}>
            {goals[0].goal}
          </span>

          <DialogContent>
            {question ?
           
            <>
            <p className="text-black">
              { question }
            </p>
            <p>Ans:</p>
            <Input value={ans} onChange={e => setAns(e.target.value)} />
              <div className="flex gap-2 mt-4">
              <DialogClose
                className="px-3 py-1 bg-blue-500 text-white rounded-md"
                onClick={() => {
                  if (ans.trim() !== "") {
                    const updated = [...goals];
                    updated[0].completed = true;
                    setGoals(updated);
                  }
                }}
              >
                Done
              </DialogClose>
            </div>
            </>
:"First, generate a Question"}
          
              <DialogClose className="px-3 py-1 bg-gray-300 rounded-md">Close</DialogClose>
          </DialogContent>
        </li>
      </Dialog>

      {/* Other goals */}
      <ul className="space-y-2 font-mono">
        {goals.slice(1, 3).map((g, i) => (
          <li key={i + 1} className="flex items-center border-2 p-2 rounded-md border-blue-300 gap-2">
            <input
              type="checkbox"
              checked={g.completed}
              onChange={() => {
                const updated = [...goals];
                updated[i + 1].completed = !updated[i + 1].completed;
                setGoals(updated);
              }}
            />
            <span className={g.completed ? "line-through text-gray-500" : ""}>
              {g.goal}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ToDo
