"use client";
import React, { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


import usePersistState from "../hooks/usePersistState";
export default function BreakSessionTimer() {
  // ----- TIMER STATES -----
  
  const [seconds, setSeconds] = usePersistState<number>(60,"BRKsec");
  const [isRunning, setIsRunning] = usePersistState<boolean>(false,"BRKrunning");

  // ----- MODAL & BREAK STATES -----
  const [modalOpen, setModalOpen] = usePersistState<boolean>(false,"BRKmodalopen");
  const [secretCode, setSecretCode] = usePersistState<string>("","BRKcode");
  const [showCode, setShowCode] = useState<boolean>(false);
  const [userCode, setUserCode] = useState<string>("");
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  // ----- TIMER LOGIC -----
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && seconds > 0) {
      timer = setInterval(() => {
        
        setSeconds((prev: number) => {
          if (prev - 1 === 0) {
            clearInterval(timer);
            openBreakModal();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, seconds]);

  const resetTimer = (): void => {
    setIsRunning(false);
    setSeconds(0);
  };

  // ----- MODAL & CODE LOGIC -----
  const openBreakModal = (): void => {
    setModalOpen(true);
    generateCode();
  };

  const generateCode = (): void => {
    const code: string = Math.random().toString(36).substring(2, 6).toUpperCase();
    setSecretCode(code);
    setShowCode(true);
    setTimeout(() => setShowCode(false), 30000); // hide after 30s
  };

  // ----- IMAGE UPLOAD -----
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPhotoSrc(dataUrl);

      if (detectSky(dataUrl)) {
        setMessage("🌤 Sky detected! Enter the code you wrote.");
      } else {
        setMessage("❌ Sky not detected, try again outside!");
      }
    };
    reader.readAsDataURL(file);
  };

  // ----- SKY DETECTION -----
  const detectSky = (imageSrc: string): boolean => {
    const img = new Image();
    img.src = imageSrc;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;
    canvas.width = 320;
    canvas.height = 240;
    ctx.drawImage(img, 0, 0, 320, 240);
    const imageData = ctx.getImageData(0, 0, 320, 240);
    const data = imageData.data;
    let blueCount = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      if (b > 100 && b > r * 1.2 && b > g * 1.2) blueCount++;
    }
    const blueRatio = (blueCount / (canvas.width * canvas.height)) * 100;
    return blueRatio > 20;
  };

  // ----- CODE CHECK -----
  const checkCode = (): void => {
    if (userCode.toUpperCase() === secretCode) {
      setMessage("✅ Break verified! Enjoy your day outside!");
      setModalOpen(false);
      setPhotoSrc(null);
      setUserCode("");
      setIsRunning(false);
    } else {
      setMessage("❌ Code doesn't match, try again!");
    }
  };

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  return (
    <div className="flex flex-col items-center justify-center w-fit h-fit  p-4 space-y-4">
      {/* TIMER UI */}
      <div className="text-4xl font-bold">
        {minutes.toString().padStart(2, "0")}:{displaySeconds.toString().padStart(2, "0")}
      </div>
      <div className="flex space-x-2">
        <Button onClick={() => setIsRunning(!isRunning)}>{isRunning ? "Pause" : "Start"}</Button>
        <Button onClick={resetTimer}>Reset</Button>
      </div>
      <div className="flex space-x-2 items-center">
        <input
          type="number"
          min={1}
          value={Math.ceil(seconds / 60)}
          onChange={(e) => setSeconds(parseInt(e.target.value) *60)}
          className="border p-1 rounded w-20 text-center"
        />
        <span>Minutes</span>
      </div>

      {/* BREAK MODAL */}
      <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
        <AlertDialogContent className=" p-6 rounded-xl">
          <AlertDialogHeader>
            <h2 className="text-xl font-bold">Break Time! 🌿</h2>
          </AlertDialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {showCode && (
              <p className="text-lg font-mono">
                Write this code: <b>{secretCode}</b>
              </p>
            )}

            {!photoSrc && (
              <>
                <input type="file" className="border-2 bg-gray-600 text-white " accept="image/*" onChange={handleImageUpload} />
              </>
            )}

            {photoSrc && <img src={photoSrc} alt="Uploaded" className="rounded-lg shadow-lg max-h-[300px]" />}

            {/* {photoSrc && (
              <>
                <input
                  type="text"
                  placeholder="Enter the code you wrote"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="border p-2 rounded w-full text-center"
                />
                <Button onClick={checkCode}>Submit Code</Button>
              </>
            )}

            {message ? 
            <>
            <p className="mt-2 text-center">{message}</p>
            <Button onClick={()=>setPhotoSrc(null)}>Resubmit image</Button>
            </>
            
            :null} */}

            {
                photoSrc ?
                <>
                <p>Yayyy, you went outside. You're Awesome.</p>
                            <Button onClick={() => setModalOpen(false)}> Close </Button>

                </>: null
            }
          </div>
          <AlertDialogFooter>
            {/* <Button onClick={() => setModalOpen(false)}>Force Close (Debug)</Button> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
