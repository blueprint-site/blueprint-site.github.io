import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import supabase from "@/components/utility/Supabase";
import logMessage from "@/components/utility/logs/sendLogs";

// 🛠 Configuration des schémas Zod
const createSchema = <T extends z.ZodTypeAny>(schema: T) => schema;

const entitySchema = createSchema(z.object({
    id: z.union([z.string(), z.number()]).optional(),
    created_at: z.string().optional(),
}));

type Entity = z.infer<typeof entitySchema>;

type EntityManagerConfig<T extends Entity> = {
    queryOptions?: Partial<UseQueryOptions<T[], Error>>;
    pageSize?: number;
    filters?: Record<string, unknown>; // Nouveau paramètre pour les filtres
};

// 🔄 Hook principal optimisé (sans realtime)
export const useEntityManager = <T extends Entity>(
    table: string,
    schema: z.ZodSchema<T>,
    config?: EntityManagerConfig<T>
) => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = config?.pageSize || 20; // Taille de page par défaut

    const defaultStaleTimes: Record<string, number> = {
        profiles: 1000 * 60 * 100,
        addons: 1000 * 60 * 100,
        users: 1000 * 60 * 100,
        blog_articles: 1000 * 60 * 100,
        mods: 1000 * 60 * 100,
    };

    const validateData = (data: unknown): T => {
        try {
            return schema.parse(data);
        } catch (error) {
            logMessage(`Invalid ${table} data: ${error}`, 2 , 'data');
            console.error("Validation error:", error);
            throw error;
        }
    };

    const fetchEntities = async (page: number): Promise<T[]> => {
        const from = page * pageSize;
        const to = from + pageSize - 1;
        logMessage('fetching entities from table :' + table, 0 , 'data');

        let query = supabase
            .from(table)
            .select("*")
            .order("created_at", { ascending: false })
            .range(from, to);

        // Application des filtres
        if (config?.filters) {
            Object.entries(config.filters).forEach(([key, value]) => {
                if (value && value !== "all") {
                    if (key === "query") {
                        query = query.ilike("name", `%${value}%`);
                    }
                    if (value === "forge") {
                        query = query.contains("categories", ["forge"]);
                    }
                    if (value === "fabric") {
                        query = query.contains("categories", ["fabric"]);
                    }
                    if (key === "isValid") {
                        query = query.eq("isValid", true);
                    }
                    if (value === "neoforge") {
                        query = query.contains("categories", ["neoforge"]);
                    }
                }
            });
        }

        const { data, error } = await query;
        if (error) throw error;

        if (data.length < pageSize) {
            setHasMore(false);
        }

        return data.map(validateData);
    };

    const loadMore = async () => {
        if (!hasMore) return;

        const nextPage = page + 1;
        const newData = await fetchEntities(nextPage);

        queryClient.setQueryData([table], (old: T[] | undefined) => [
            ...(old || []),
            ...newData,
        ]);
        logMessage('load more data from : ' + table, 0 , 'data');
        setPage(nextPage);
    };

    const createEntity = async (data: Omit<T, "id" | "created_at">): Promise<T> => {
        const { data: result, error } = await supabase
            .from(table)
            .insert(data)
            .select()
            .single();

        if (error) {
            logMessage('Error creating entity on  : ' + table, 2 , 'data');
        }
        logMessage('created entity on  : ' + table, 0 , 'data');
        return validateData(result);
    };

    const updateEntity = async (id: string, data: Partial<T>): Promise<T> => {
        const { data: result, error } = await supabase
            .from(table)
            .update(data)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            logMessage('Error updating entity on  : ' + table, 2 , 'data');
        }
        logMessage('updated entity on  : ' + table, 2 , 'data');
        return validateData(result);
    };

    const deleteEntity = async (id: string): Promise<void> => {
        const { error } = await supabase
            .from(table)
            .delete()
            .eq("id", id);

        if (error){
            logMessage('Error deleting entity on  : ' + table, 2 , 'data');
        }
        logMessage('deleted entity on  : ' + table, 2 , 'data');
    };

    const query = useQuery<T[], Error>({
        queryKey: [table],
        queryFn: () => fetchEntities(0),
        staleTime: config?.queryOptions?.staleTime
            || defaultStaleTimes[table]
            || 1000 * 60 * 30, // 30 minutes par défaut
        ...config?.queryOptions,
    });

    const mutations = {
        create: useMutation<T, Error, Omit<T, "id" | "created_at">>({
            mutationFn: createEntity,
        }),

        update: useMutation<T, Error, { id: string; data: Partial<T> }>({
            mutationFn: ({ id, data }) => updateEntity(id, data),
        }),

        delete: useMutation<void, Error, string>({
            mutationFn: deleteEntity,
        })
    };

    return {
        data: query.data || [],
        error: query.error,
        isLoading: query.isLoading,
        hasMore,
        loadMore,
        ...mutations
    };
};
