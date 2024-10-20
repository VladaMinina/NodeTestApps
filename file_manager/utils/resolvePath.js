import path from 'path';

export const resolvePath = (currentDir, newDir) => {
    return path.isAbsolute(newDir) ? newDir : path.join(currentDir, newDir);
};