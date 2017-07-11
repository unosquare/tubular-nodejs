const AggregationFunction = {
    none: 'None',
    sum: 'Sum',
    average: 'Average',
    count: 'Count',
    distinctCount: 'DistinctCount',
    max: 'Max',
    min: 'Min'
}

const CompareOperators = {
    none: 'None',
    auto: 'Auto',
    equals: 'Equals',
    notEquals: 'NotEquals',
    contains: 'Contains',
    startsWith: 'StartsWith',
    endsWith: 'EndsWith',
    gte: 'Gte',
    gt: 'Gt',
    lte: 'Lte',
    lt: 'Lt',
    multiple: 'Multiple',
    between: 'Between',
    notContains: 'NotContains',
    notStartsWith: 'NotStartsWith',
    notEndsWith: 'NotEndsWith'
}

const SortDirection = {
    none: 'None',
    ascending: 'Ascending',
    descending: 'Descending'
}

module.exports = {
    CompareOperators: CompareOperators,
    AggregationFunction: AggregationFunction,
    SortDirection: SortDirection
};