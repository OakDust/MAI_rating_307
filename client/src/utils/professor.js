export const checkNumberOfRating = (scoreDiscipline) => {
    if (scoreDiscipline === 0) {
        return 'Нет оценок';
    }
    
    return scoreDiscipline;
}