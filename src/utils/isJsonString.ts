export const isJsonString = (str: string) => {
    try {
        JSON.parse(str)
        return true
    } catch (err) {
        return false
    }
}