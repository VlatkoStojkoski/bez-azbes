import { type ClassValue, clsx } from "clsx";
import { Mail, Phone } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import FacebookIcon from "@/components/icons/facebook";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const defaultLocation = { lat: 42.01, lng: 21.35 };

export const contactMethods = {
  PHONE: {
    label: "Тел.",
    icon: Phone,
    inputPlaceholder: '070 123 456',
    inputHelpText: 'Вашиот телефонски број',
  },
  EMAIL: {
    label: "Е-пошта",
    icon: Mail,
    inputPlaceholder: 'marko-markovski@gmail.com',
    inputHelpText: 'Вашата е-пошта',
  },
  FACEBOOK: {
    label: "Facebook",
    icon: FacebookIcon,
    inputPlaceholder: 'https://www.facebook.com/marko.markovski.42',
    inputHelpText: 'Линк до вашиот профил на Facebook',
  },
};

export const contactMethodPlaceholder = {
  PHONE: "070 123 456",
  EMAIL: "marko-markovski@gmail.com",
  FACEBOOK: "https://www.facebook.com/marko.markovski.42",
};

export const contactMethodHelpText = {
  PHONE: "Вашиот телефонски број",
  EMAIL: "Вашата е-пошта",
  FACEBOOK: "Линк до вашиот профил на Facebook",
};

export const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

export const generateImageInputSchema = (MAX_IMAGE_SIZE: number) => z
  .custom<FileList>()
  .refine((files) => {
    return Array.from(files ?? []).length !== 0;
  }, "Сликата е задолжителна")
  .refine((files) => {
    return Array.from(files ?? []).every(
      (file) => sizeInMB(file.size) <= MAX_IMAGE_SIZE
    );
  }, `Максималната големина на сликата е ${MAX_IMAGE_SIZE}MB`)
  .refine((files) => {
    return Array.from(files ?? []).every((file) =>
      file.type.startsWith("image/")
    );
  }, "Тој тип на слика не е поддржан");

export function getBase64(file: File) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    console.log(reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}
