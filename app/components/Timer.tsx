"use client";
import React, { useState, useEffect } from "react";
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
import { getSkyVerify } from "@/lib/getSkyVerify";
import { uploadImage } from "@/lib/uploadImage";
export default function BreakSessionTimer() {
  // ----- TIMER STATES -----

  const [seconds, setSeconds] = usePersistState<number>(60, "BRKsec");
  const [isRunning, setIsRunning] = usePersistState<boolean>(false, "BRKrunning");

  // ----- MODAL & BREAK STATES -----
  const [modalOpen, setModalOpen] = usePersistState<boolean>(false, "BRKmodalopen");
  const [secretCode, setSecretCode] = usePersistState<string>("", "BRKcode");
  const [showCode, setShowCode] = useState<boolean>(false);
  const [userCode, setUserCode] = useState<string>("");
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [allowClose, setAllowClose] = useState(false)
  const [loading, setLoading] = useState(false)
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
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setLoading(true);

      // Upload the image and get a public URL
      const imageUrl = await uploadImage(file);

      // For preview in UI
      setPhotoSrc(URL.createObjectURL(file));

      // Verify with OpenAI
      const skyVerify: { sky: boolean; codeMatch: boolean } = await getSkyVerify(imageUrl, secretCode);

      console.log("SkyVerify:", skyVerify);

      if (skyVerify?.sky && skyVerify?.codeMatch) {
        setMessage("🌤 Sky detected and code matched!");
        setAllowClose(true);
      } else {
        setMessage("❌ Either no sky or code mismatch. Try again outside!");
      }
    } catch (err) {
      console.error("Upload/Verify failed:", err);
      setMessage("⚠️ Something went wrong during verification.");
    } finally {
      setLoading(false); // ✅ Always stop spinner
    }
  };



  // // ----- CODE CHECK -----
  // const checkCode = (): void => {
  //   if (userCode.toUpperCase() === secretCode) {
  //     setMessage("✅ Break verified! Enjoy your day outside!");
  //     setModalOpen(false);
  //     setPhotoSrc(null);
  //     setUserCode("");
  //     setIsRunning(false);
  //   } else {
  //     setMessage("❌ Code doesn't match, try again!");
  //   }
  // };

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
          onChange={(e) => setSeconds(parseInt(e.target.value) * 60)}
          className="border p-1 rounded w-20 tejxt-center"
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
                Write this code: <b>{secretCode}</b> on a paper and go take a pic of it outside. Sky must be visible. Take some breathes & rest your eyes there too.
              </p>
            )}

            {!photoSrc && (
              <>
                <input type="file" className="border-2 bg-gray-600 text-white " accept="image/*" onChange={handleImageUpload} />
              </>
            )}

            {photoSrc && <img src={photoSrc} alt="Uploaded" className="rounded-lg shadow-lg max-h-[300px]" />}


            {/* {
            photoSrc && (
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
            )} */}

            {message !== "" ?
              <>
                <p className="mt-2 text-center">{message}</p>
                {photoSrc && <Button onClick={() => { setPhotoSrc(null); setMessage("") }}>Resubmit image</Button>}
              </>

              : null}
            {loading && (
              <div className="flex items-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Analysing image...</span>
              </div>
            )}



            {allowClose && <Button onClick={() => { setPhotoSrc(null); setModalOpen(false); setMessage(""); setAllowClose(false) }}> Close </Button>}


          </div>
          {/* <AlertDialogFooter>
            <Button onClick={() => setModalOpen(false)}>Force Close (Debug)</Button>
          </AlertDialogFooter> */}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
