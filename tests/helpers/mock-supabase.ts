type SupabaseError = {
  message: string;
};

type QueryResult = {
  data?: unknown;
  error?: SupabaseError | null;
  count?: number | null;
};

type QueryKey = "count" | "delete" | "insert" | "maybeSingle" | "single" | "select" | "update";

type ResponseMap = Record<string, Partial<Record<QueryKey, QueryResult>>>;

export type SupabaseOperation = {
  table: string;
  op: QueryKey;
  payload: unknown;
  filters: Array<{ column: string; value: unknown }>;
  terminal: "await" | "maybeSingle" | "single";
};

function fallbackResult(key: QueryKey): QueryResult {
  if (key === "count") {
    return { count: 0, error: null };
  }

  if (key === "insert") {
    return { error: null };
  }

  if (key === "update" || key === "delete") {
    return { data: { id: "row-id" }, error: null };
  }

  return { data: null, error: null };
}

export function createSupabaseMock(responses: ResponseMap = {}) {
  const operations: SupabaseOperation[] = [];

  function resolve(table: string, key: QueryKey) {
    return responses[table]?.[key] ?? fallbackResult(key);
  }

  function from(table: string) {
    let op: QueryKey = "select";
    let payload: unknown;
    const filters: Array<{ column: string; value: unknown }> = [];

    const builder = {
      select(_columns?: string, options?: { count?: string; head?: boolean }) {
        op = options?.count ? "count" : op;
        return builder;
      },
      insert(value: unknown) {
        op = "insert";
        payload = value;
        return builder;
      },
      update(value: unknown) {
        op = "update";
        payload = value;
        return builder;
      },
      delete() {
        op = "delete";
        return builder;
      },
      eq(column: string, value: unknown) {
        filters.push({ column, value });
        return builder;
      },
      order() {
        return builder;
      },
      limit() {
        return builder;
      },
      maybeSingle() {
        const key = op === "select" ? "maybeSingle" : op;
        operations.push({ table, op: key, payload, filters: [...filters], terminal: "maybeSingle" });
        return Promise.resolve(resolve(table, key));
      },
      single() {
        const key = op === "select" ? "single" : op;
        operations.push({ table, op: key, payload, filters: [...filters], terminal: "single" });
        return Promise.resolve(resolve(table, key));
      },
      then<TResult1 = QueryResult, TResult2 = never>(
        onfulfilled?: ((value: QueryResult) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
      ) {
        operations.push({ table, op, payload, filters: [...filters], terminal: "await" });
        return Promise.resolve(resolve(table, op)).then(onfulfilled, onrejected);
      },
    };

    return builder;
  }

  return {
    client: { from },
    operations,
  };
}

export function hasFilter(
  operation: SupabaseOperation | undefined,
  column: string,
  value: unknown,
) {
  return operation?.filters.some((filter) => filter.column === column && filter.value === value) ?? false;
}
