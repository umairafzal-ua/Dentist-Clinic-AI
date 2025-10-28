import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateAvatar(name: string, gender: "MALE" | "FEMALE") {
  const username = name.replace(/\s+/g, "").toLowerCase();
  const base = "https://avatar.iran.liara.run/public";
  if (gender === "FEMALE") return `${base}/girl?username=${username}`;
  // default to boy
  return `${base}/boy?username=${username}`;
}


// Format Phone Number 
export const formatPhoneNumber = (value: string) => {
  if (!value) return value;

  // Remove all non-digit characters except the plus sign at the start
  const cleaned = value.replace(/[^\d+]/g, "");

  // Handle numbers starting with +92
  if (cleaned.startsWith("+92")) {
    const number = cleaned.slice(3); // remove +92
    if (number.length <= 3) return `+92 ${number}`;
    if (number.length <= 6) return `+92 ${number.slice(0, 3)} ${number.slice(3)}`;
    return `+92 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6, 10)}`;
  }

  // Handle numbers starting with 0 (local format like 03001234567)
  if (cleaned.startsWith("0")) {
    const number = cleaned.slice(1);
    if (number.length <= 3) return `0${number}`;
    if (number.length <= 6) return `0${number.slice(0, 3)} ${number.slice(3)}`;
    return `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6, 10)}`;
  }

  // Fallback (if user enters incomplete or weird data)
  return cleaned;
};

