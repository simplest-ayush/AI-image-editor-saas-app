"use client"

import { authClient } from "~/lib/auth-client"
import { Button } from "../ui/button";
import { Crown, Sparkles } from "lucide-react";

function upgrade() {
    const upgrade=async ()=>{
        await authClient.checkout({
            products: [
                "c545ae84-627c-4b45-a094-bf6adf918d7d",
                "558adbdf-2c33-4b31-a1fd-372ba5d46885",
                "74b48df5-5a46-4289-a036-69794f8ac4c0"
            ]
        })
    }
    
    return (
    <Button
      variant="outline"
      size="sm"
      className="group relative ml-2 cursor-pointer overflow-hidden border-orange-400/50 bg-gradient-to-r from-orange-400/10 to-pink-500/10 text-orange-400 transition-all duration-300 hover:border-orange-500/70 hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-600 hover:text-white hover:shadow-lg hover:shadow-orange-500/25"
      onClick={upgrade}
    >
      <div className="flex items-center gap-2">
        <Crown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
        <span className="font-medium">Upgrade</span>
        <Sparkles className="h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-orange-400/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Button>
  );
}

export default upgrade
