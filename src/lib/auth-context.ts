import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  nome: string;
  tipo: "aluno" | "professor";
}
interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string;
  recovery: boolean;
  retry: () => void;
}
export const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  error: "",
  recovery: false,
  retry: () => {},
});
export const useAuth = () => useContext(AuthContext);
