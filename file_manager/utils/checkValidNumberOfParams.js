export const checkValidParams = (args, numOfParams) => {
    if (!args || args.length < numOfParams) {
        return false;
    } else {
        return true;
    }
}