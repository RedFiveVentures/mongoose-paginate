export const isValidDateString = (value: string): boolean => {
    return (
        !isNaN(Date.parse(value)) &&
        /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:\d{2})))?$/.test(value)
    )
}