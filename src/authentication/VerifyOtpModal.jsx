// components/VerifyOtpModal.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router";

const VerifyOtpModal = ({ email, show, setShow }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const res = await fetch(
        "https://40fe56c82e49.ngrok-free.app/auth/verify-registration",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setFeedback(" Registrierung erfolgreich bestätigt.");
        setTimeout(() => {
          setShow(false);
          navigate("/signin");
        }, 2000);
      } else {
        setFeedback(data.message || " OTP ungültig.");
      }
    } catch (err) {
      console.error(err);
      setFeedback(" Netzwerkfehler beim Verifizieren.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="w-full">
      <div className=" w-full space-y-4">
        <h2 className="text-lg font-bold text-center dark:text-white">
          OTP bestätigen
        </h2>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className=" dark:text-gray-500 text-black">
              Bestätigungscode{" "}
            </label>

            <div className="flex items-center gap-2 bg-transparent dark:bg-black border-1 border-gray-300 dark:border-gray-700  w-full px-3 py-4 rounded-[10px]  dark:text-white  text-gray-700">
              <input
                type="text"
                className="  outline-none dark:text-white  text-black flex-1 placeholder:text-gray-500 "
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Gib den Code aus deiner E-Mail ein"
              />
            </div>
          </div>

          {feedback && (
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              {feedback}
            </p>
          )}

          <button
            type="submit"
            className="bg-[#412666] text-white w-full py-[10px] text-[12px] font-bold rounded-[10px] transition cursor-pointer mb-4 "
            disabled={loading}>
            {loading ? "Wird überprüft..." : "Verifizieren"}
          </button>

          <button
            type="button"
            onClick={() => setShow(false)}
            className="text-sm text-center border border-[#412666] text-[#412666] w-full  py-[10px] text-[12px] font-bold rounded-[10px] cursor-pointer">
            Abbrechen
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpModal;
