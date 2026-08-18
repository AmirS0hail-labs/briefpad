import { describe, expect, it } from "vitest";
import {
  canAccessDocument,
  canManageSharing,
  canShareWith,
} from "@/lib/access";

const alex = "user-alex";
const jordan = "user-jordan";
const sam = "user-sam";

describe("canAccessDocument", () => {
  it("allows the owner", () => {
    expect(
      canAccessDocument({
        userId: alex,
        ownerId: alex,
        sharedUserIds: [],
      }),
    ).toBe(true);
  });

  it("allows a teammate who was granted access", () => {
    expect(
      canAccessDocument({
        userId: jordan,
        ownerId: alex,
        sharedUserIds: [jordan],
      }),
    ).toBe(true);
  });

  it("denies a teammate with no share row", () => {
    expect(
      canAccessDocument({
        userId: sam,
        ownerId: alex,
        sharedUserIds: [jordan],
      }),
    ).toBe(false);
  });
});

describe("sharing rights", () => {
  it("only the owner can change who has access", () => {
    expect(canManageSharing({ userId: alex, ownerId: alex })).toBe(true);
    expect(canManageSharing({ userId: jordan, ownerId: alex })).toBe(false);
  });

  it("cannot share a brief with its owner", () => {
    expect(canShareWith({ ownerId: alex, targetUserId: alex })).toBe(false);
    expect(canShareWith({ ownerId: alex, targetUserId: jordan })).toBe(true);
  });
});
