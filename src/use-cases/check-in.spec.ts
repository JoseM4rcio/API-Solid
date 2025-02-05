import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let checkInUseCase: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.items.push({
      id: "gym-01",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-23.3732114),
      longitude: new Decimal(-47.3077914),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.3732114,
      userLongitude: -47.3077914,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2025, 1, 4, 11, 0, 0));

    await checkInUseCase.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.3732114,
      userLongitude: -47.3077914,
    });

    await expect(() =>
      checkInUseCase.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -23.3732114,
        userLongitude: -47.3077914,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2025, 1, 4, 11, 0, 0));

    await checkInUseCase.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.3732114,
      userLongitude: -47.3077914,
    });

    vi.setSystemTime(new Date(2025, 1, 5, 11, 0, 0));

    const { checkIn } = await checkInUseCase.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.3732114,
      userLongitude: -47.3077914,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-23.3127445),
      longitude: new Decimal(-47.2867633),
    });

    await expect(() =>
      checkInUseCase.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -23.3732114,
        userLongitude: -47.3077914,
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
