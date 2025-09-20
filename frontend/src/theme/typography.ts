// src/theme/typography.ts
import { StyleSheet } from "react-native";

export const typography = StyleSheet.create({
  title: {
    fontFamily: "Mooli", // 🔹 Fuente personalizada
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  body: {
    fontFamily: "Outfit", // 🔹 Fuente personalizada
    fontSize: 16,
    color: "#DDD",
  },
});
