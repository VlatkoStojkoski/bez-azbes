import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const defaultLocation = { lat: 42.01, lng: 21.35 };

export const contactMethodBasedPlaceholder = {
  PHONE: "070 123 456",
  EMAIL: "marko-markovski@gmail.com",
  FACEBOOK: "https://www.facebook.com/marko.markovski.42",
};

export const contactMethodBasedHelpText = {
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