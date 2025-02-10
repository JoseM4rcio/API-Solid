import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/http/controllers/**"], // Define quais testes serão rodados
    environment: "prisma", // Define o ambiente de teste Prisma
  },
});
