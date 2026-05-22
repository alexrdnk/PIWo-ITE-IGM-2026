"use client";

import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { PurchasesProvider } from "@/context/PurchasesContext";
import SiteHeader from "@/components/SiteHeader";

export default function ClientShell({ children }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <PurchasesProvider>
          <SiteHeader />
          {children}
        </PurchasesProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
