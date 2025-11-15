/**
 * 求左差集
 * @param {*} arrayOne 
 * @param {*} arrayTwo 
 */
export const leftDiff = (arrayOne,arrayTwo) =>{
    let a = new Set(arrayOne);
    let b = new Set(arrayTwo);
    let difference = [...new Set([...a].filter(n => !b.has(n)))] // [1]
    return difference;
}