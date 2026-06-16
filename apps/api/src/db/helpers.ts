import { NotFoundError } from "../common/error/http.error";

export async function findOrThrow<T>(promise: Promise<T | null>): Promise<T> {
    const result = await promise;

    if (!result) throw new NotFoundError();
    
    return result;
}
