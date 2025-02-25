export const getFromStorage = (keyName) => {
    try {
        const dataList = localStorage.getItem(keyName);
        return dataList ? JSON.parse(dataList) : [];
    } catch (error) {
        console.log(`Ett problem uppstod vid hämtning av ${keyName} från din sparade data. Felmeddelande: ${error}`)
    }
}

export const saveToStorage = (keyName, data) => localStorage.setItem(keyName, JSON.stringify(data));