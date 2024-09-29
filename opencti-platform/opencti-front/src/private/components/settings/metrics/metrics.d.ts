export type metricsGraphqlQueryUser = {
    readonly label: string
  } | null | undefined

export type metricsGrapqhlQueryData = {
    readonly data: readonly Array<readonly metricsGraphqlQueryUser> | null | undefined
} | null | undefined