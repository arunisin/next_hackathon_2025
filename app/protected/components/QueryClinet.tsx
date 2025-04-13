"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { FC, ReactNode } from "react";
const queryClient = new QueryClient();
const QueryClientWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryClientWrapper;
