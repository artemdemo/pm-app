/**
 * Callback function for `sort()` array method.
 * Sorting tasks by `id_position_scrum`
 * @param boardA
 * @param boardB
 * @returns {number}
 */
export function sortByIdPosition(boardA, boardB) {
    if (boardA.id_position < boardB.id_position) {
        return -1;
    }
    if (boardA.id_position > boardB.id_position) {
        return 1;
    }
    return 0;
}
