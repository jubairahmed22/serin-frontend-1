"use client";

import { Suspense } from "react";
import AllBooksPage from "./AllBooksPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllBooksPage />
    </Suspense>
  );
}
