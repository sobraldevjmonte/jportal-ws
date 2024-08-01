function formatDateForDB(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses são indexados a partir de 0
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}