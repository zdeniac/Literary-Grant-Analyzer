import { expect } from "vitest";
import { HttpStatusCode } from "../../../src/common/http/status-codes";

export const expectNotFound = async (
    requestPromise: Promise<{ status: number }>
): Promise<void> => {
    const response = await requestPromise;

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
};