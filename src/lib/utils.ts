import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const defaultLocation = { lat: 42.01, lng: 21.35 };

export const contactMethodBasedPlaceholder = {
  phone: "070 123 456",
  email: "marko-markovski@gmail.com",
  facebook: "https://www.facebook.com/marko.markovski.42",
};

export const contactMethodBasedHelpText = {
  phone: "Вашиот телефонски број",
  email: "Вашата е-пошта",
  facebook: "Линк до вашиот профил на Facebook",
};
