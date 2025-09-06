"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import usePersistState from "../hooks/usePersistState"

 function IntroDialog() {
    const [open,setOpen]=usePersistState(true,"TCintro")
  return (
    <Dialog open={open} onOpenChange={()=>setOpen(prev=>!prev)}>
      
        <DialogTrigger asChild>
          <Button variant="outline"> ?</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
        <h1 className="font-bold">Timer</h1>
        <p>Set a timer for your session. When the timer ends, a dialog will pop up & the only way to close it is to write the given code on paper, go outside and take a picture of it with sky visible. </p>
        <h1 className="font-bold">Adventure Walks</h1>
        <p>Gives purpose to your walks. </p>
        <h1 className="font-bold">Moon</h1>
        <p>Just a push to make you go watch the moon, especially when it's bright </p>
        </DialogContent>
      
    </Dialog>
  )
}
export default IntroDialog