import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useApiRequest } from "./apiRequest";
import { Jam } from "../common/models/jam.ts";

export function useJam(jamId?: string): UseQueryResult<Jam, Error> {
    const apiRequest = useApiRequest()
    return useQuery<Jam, Error>({
        queryKey: ["jam", jamId],
        queryFn: async () => {
            if (!jamId) throw new Error("No jamId provided")
            return await apiRequest<Jam>(`/jams/${jamId}`)
        },
        enabled: !!jamId
    })
}
