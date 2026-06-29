import { NotFoundError } from "../common/errors/http.error";

export async function findOrThrow<T>(promise: Promise<T | null>): Promise<T> {
    const result = await promise;

    if (!result) throw new NotFoundError();
    
    return result;
}
