function dialogOpen(dialogId) {
    const dialog = document.getElementById(dialogId);
    dialog.showModal();
}

function dialogClose(dialogId, event) {
    const dialog = document.getElementById(dialogId);
    const cancelButton = dialog.querySelector('.cancel');  

    if (event.target === cancelButton) {
        dialog.close();
    }
}













// function firstLetterToUppercase(aaaa) {
//     return aaaa.charAt(0).toUpperCase() + aaaa.slice(1);
// }
// function updateTime(){
//     const now = new Date();
//     const currentDate = {
//         weekday: 'long',
//         day: 'numeric',
//         month: 'short', 
//         // year: 'numeric' 
//     };

//     const currentTime = { 
//         hour: '2-digit', 
//         minute: '2-digit', 
//         // second: '2-digit'
//     };

//     let date = now.toLocaleDateString('sv-SE', currentDate);
//     let time = now.toLocaleTimeString('sv-SE', currentTime);

//     date = firstLetterToUppercase(date);

//     document.getElementById('datum').innerHTML = `${date}
//     Kl: ${time}`;
// }

// updateTime();
// setInterval(updateTime, 1000);