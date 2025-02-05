import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";
import { Decimal } from "@prisma/client/runtime/library";

let gymsRepository: InMemoryGymsRepository;
let gymUseCase: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    gymUseCase = new CreateGymUseCase(gymsRepository);
  });

  it("should be able to create gym", async () => {
    const { gym } = await gymUseCase.execute({
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: -23.3732114,
      longitude: -47.3077914,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
